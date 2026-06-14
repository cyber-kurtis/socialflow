import type { Config } from "@netlify/functions";
import { createSupabaseAdmin } from "./_shared/supabase-admin";
import { getEnv, requireEnv } from "./_shared/env";
import { errorResponse, jsonResponse } from "./_shared/responses";
import type { PublishMediaInput } from "./_shared/instagram";

type SchedulePayload = {
  title: string;
  caption: string;
  hashtags?: string;
  firstComment?: string;
  postType: "single_image" | "carousel" | "video" | "reels";
  scheduledAt: string;
  timezone: string;
  media: (PublishMediaInput & {
    storagePath?: string;
    fileName?: string;
    fileSize?: number;
  })[];
};

const schedulePost = async (req: Request) => {
  if (req.method !== "POST") {
    return errorResponse("Bu endpoint yalnızca POST kabul eder.", 405);
  }

  try {
    const payload = (await req.json()) as SchedulePayload;
    const organizationId = requireEnv("SOCIALFLOW_ORGANIZATION_ID");
    const socialAccountId = requireEnv("SOCIALFLOW_SOCIAL_ACCOUNT_ID");
    const createdBy = getEnv("SOCIALFLOW_DEFAULT_PROFILE_ID") || null;

    if (!payload.scheduledAt) {
      return errorResponse("Programlama için tarih ve saat gerekiyor.");
    }

    if (!payload.media.length) {
      return errorResponse("Programlama için en az bir medya gerekiyor.");
    }

    const supabase = createSupabaseAdmin();
    const { data: post, error: postError } = await supabase
      .from("posts")
      .insert({
        organization_id: organizationId,
        social_account_id: socialAccountId,
        created_by: createdBy,
        title: payload.title || "Başlıksız gönderi",
        post_type: payload.postType,
        caption: payload.caption,
        hashtags: payload.hashtags || "",
        first_comment: payload.firstComment || "",
        status: "scheduled",
        scheduled_at: payload.scheduledAt,
        timezone: payload.timezone || "Europe/Istanbul",
      })
      .select("id")
      .single();

    if (postError || !post) {
      throw new Error(postError?.message || "Gönderi Supabase'e kaydedilemedi.");
    }

    const { error: mediaError } = await supabase.from("post_media").insert(
      payload.media.map((item, index) => ({
        post_id: post.id,
        storage_path: item.storagePath || item.publicUrl,
        public_url: item.publicUrl,
        media_type: item.mediaType,
        sort_order: index,
        file_size: item.fileSize || null,
        processing_status: "ready",
      })),
    );

    if (mediaError) {
      throw new Error(mediaError.message);
    }

    const { error: jobError } = await supabase.from("publishing_jobs").insert({
      post_id: post.id,
      run_at: payload.scheduledAt,
      status: "queued",
    });

    if (jobError) {
      throw new Error(jobError.message);
    }

    return jsonResponse({ ok: true, postId: post.id });
  } catch (error) {
    return errorResponse(
      error instanceof Error ? error.message : "Gerçek programlama başarısız oldu.",
      500,
    );
  }
};

export default schedulePost;

export const config: Config = {
  path: "/api/schedule-post",
};
