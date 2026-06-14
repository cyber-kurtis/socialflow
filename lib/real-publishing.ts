"use client";

import { createClient } from "@supabase/supabase-js";
import type { AppSettings } from "@/lib/app-settings";
import type { PostType, UploadedMedia } from "@/lib/types";

export type RealPublishForm = {
  title: string;
  postType: PostType;
  caption: string;
  hashtags: string;
  firstComment: string;
  publishDate: string;
  publishTime: string;
  timezone: string;
};

export type UploadedRealMedia = {
  publicUrl: string;
  storagePath: string;
  mediaType: "image" | "video";
  sortOrder: number;
  fileName: string;
  fileSize: number;
};

function assertSupabaseSettings(settings: AppSettings) {
  if (!settings.supabaseUrl || !settings.supabaseAnonKey) {
    throw new Error("Önce Ayarlar ekranına Supabase URL ve anon public key girin.");
  }
}

function createStoragePath(file: File, index: number) {
  const safeName = file.name
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, "-")
    .replace(/^-|-$/g, "");

  return `uploads/${new Date().toISOString().slice(0, 10)}/${Date.now()}-${index}-${safeName}`;
}

export async function uploadMediaToSupabase(
  settings: AppSettings,
  mediaItems: UploadedMedia[],
): Promise<UploadedRealMedia[]> {
  assertSupabaseSettings(settings);

  const supabase = createClient(settings.supabaseUrl, settings.supabaseAnonKey);
  const orderedMedia = [...mediaItems].sort((a, b) => a.sortOrder - b.sortOrder);

  const uploaded = await Promise.all(
    orderedMedia.map(async (item, index) => {
      const storagePath = createStoragePath(item.file, index);
      const { error } = await supabase.storage.from("post-media").upload(storagePath, item.file, {
        cacheControl: "3600",
        upsert: false,
        contentType: item.file.type,
      });

      if (error) {
        throw new Error(error.message);
      }

      const { data } = supabase.storage.from("post-media").getPublicUrl(storagePath);

      return {
        publicUrl: data.publicUrl,
        storagePath,
        mediaType: item.mediaType,
        sortOrder: index,
        fileName: item.file.name,
        fileSize: item.file.size,
      };
    }),
  );

  return uploaded;
}

async function postJson<T>(url: string, payload: unknown): Promise<T> {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const data = (await response.json()) as { ok?: boolean; error?: string } & T;

  if (!response.ok || data.ok === false) {
    throw new Error(data.error || "İşlem tamamlanamadı.");
  }

  return data;
}

export async function publishNowReal(settings: AppSettings, form: RealPublishForm, media: UploadedMedia[]) {
  const uploadedMedia = await uploadMediaToSupabase(settings, media);

  return postJson<{
    result: {
      status: "published";
      externalPostId: string;
      externalPostUrl: string;
      activityLogMessage: string;
    };
  }>("/api/publish-now", {
    title: form.title,
    caption: form.caption,
    hashtags: form.hashtags,
    media: uploadedMedia,
  });
}

export async function schedulePostReal(
  settings: AppSettings,
  form: RealPublishForm,
  media: UploadedMedia[],
) {
  const uploadedMedia = await uploadMediaToSupabase(settings, media);

  if (!form.publishDate || !form.publishTime) {
    throw new Error("Gerçek programlama için yayın tarihi ve saati seçin.");
  }

  const scheduledAt = new Date(`${form.publishDate}T${form.publishTime}:00`).toISOString();

  return postJson<{ postId: string }>("/api/schedule-post", {
    title: form.title || "Başlıksız gönderi",
    caption: form.caption,
    hashtags: form.hashtags,
    firstComment: form.firstComment,
    postType: form.postType,
    scheduledAt,
    timezone: form.timezone,
    media: uploadedMedia,
  });
}
