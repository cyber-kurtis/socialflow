import type { Config } from "@netlify/functions";
import { publishToInstagram } from "./_shared/instagram";
import { createSupabaseAdmin } from "./_shared/supabase-admin";

type ScheduledPostRow = {
  id: string;
  organization_id: string;
  title: string;
  caption: string | null;
  hashtags: string | null;
  post_media: {
    public_url: string;
    media_type: "image" | "video";
    sort_order: number;
  }[];
};

const publishScheduled = async () => {
  const supabase = createSupabaseAdmin();
  const now = new Date().toISOString();

  const { data: posts, error } = await supabase
    .from("posts")
    .select("id, organization_id, title, caption, hashtags, post_media(public_url, media_type, sort_order)")
    .eq("status", "scheduled")
    .lte("scheduled_at", now)
    .order("scheduled_at", { ascending: true })
    .limit(5);

  if (error) {
    console.error(error.message);
    return new Response("Scheduled publisher failed", { status: 500 });
  }

  for (const post of (posts || []) as ScheduledPostRow[]) {
    await supabase.from("posts").update({ status: "publishing", updated_at: now }).eq("id", post.id);
    await supabase.from("publishing_jobs").update({ status: "running", updated_at: now }).eq("post_id", post.id);

    try {
      const result = await publishToInstagram({
        caption: [post.caption, post.hashtags].filter(Boolean).join("\n\n"),
        media: post.post_media.map((media) => ({
          publicUrl: media.public_url,
          mediaType: media.media_type,
          sortOrder: media.sort_order,
        })),
      });

      await supabase
        .from("posts")
        .update({
          status: "published",
          published_at: new Date().toISOString(),
          external_post_id: result.externalPostId,
          external_post_url: result.externalPostUrl,
          failure_reason: null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", post.id);

      await supabase.from("publishing_attempts").insert({
        post_id: post.id,
        status: "published",
        external_post_id: result.externalPostId,
        external_post_url: result.externalPostUrl,
      });

      await supabase.from("publishing_jobs").update({ status: "done" }).eq("post_id", post.id);
      await supabase.from("activity_logs").insert({
        organization_id: post.organization_id,
        post_id: post.id,
        action: "instagram_published",
        metadata: { externalPostId: result.externalPostId },
      });
    } catch (publishError) {
      const message =
        publishError instanceof Error ? publishError.message : "Instagram yayını başarısız oldu.";

      await supabase
        .from("posts")
        .update({
          status: "failed",
          failure_reason: message,
          updated_at: new Date().toISOString(),
        })
        .eq("id", post.id);

      await supabase.from("publishing_attempts").insert({
        post_id: post.id,
        status: "failed",
        failure_reason: message,
      });

      await supabase.from("publishing_jobs").update({ status: "failed" }).eq("post_id", post.id);
    }
  }

  return new Response(`Processed ${posts?.length || 0} scheduled posts`);
};

export default publishScheduled;

export const config: Config = {
  schedule: "*/5 * * * *",
};
