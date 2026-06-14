import type { Config } from "@netlify/functions";
import { createSupabaseAdmin } from "./_shared/supabase-admin";

type PublishedPostForCleanup = {
  id: string;
  organization_id: string;
  title: string;
  published_at: string;
  post_media: {
    id: string;
    storage_path: string;
    processing_status: string;
  }[];
};

const cleanupPublishedMedia = async () => {
  const supabase = createSupabaseAdmin();
  const cutoff = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString();

  const { data: posts, error } = await supabase
    .from("posts")
    .select("id, organization_id, title, published_at, post_media(id, storage_path, processing_status)")
    .eq("status", "published")
    .lte("published_at", cutoff)
    .limit(25);

  if (error) {
    console.error(error.message);
    return new Response("Media cleanup failed", { status: 500 });
  }

  let deletedCount = 0;

  for (const post of (posts || []) as PublishedPostForCleanup[]) {
    const mediaToDelete = post.post_media.filter(
      (media) => media.processing_status !== "storage_deleted" && media.storage_path,
    );

    if (mediaToDelete.length === 0) {
      continue;
    }

    const paths = mediaToDelete.map((media) => media.storage_path);
    const { error: removeError } = await supabase.storage.from("post-media").remove(paths);

    if (removeError) {
      console.error(`Media cleanup failed for post ${post.id}: ${removeError.message}`);
      continue;
    }

    const { error: updateError } = await supabase
      .from("post_media")
      .update({ processing_status: "storage_deleted" })
      .in(
        "id",
        mediaToDelete.map((media) => media.id),
      );

    if (updateError) {
      console.error(`Media status update failed for post ${post.id}: ${updateError.message}`);
      continue;
    }

    await supabase.from("activity_logs").insert({
      organization_id: post.organization_id,
      post_id: post.id,
      action: "published_media_cleaned",
      metadata: {
        deletedCount: mediaToDelete.length,
        cutoff,
      },
    });

    deletedCount += mediaToDelete.length;
  }

  return new Response(`Deleted ${deletedCount} published media files`);
};

export default cleanupPublishedMedia;

export const config: Config = {
  schedule: "0 0 * * *",
};
