"use client";

import type {
  PostStatus,
  PostType,
  SavedDraftMedia,
  SavedDraftPost,
  SocialAccount,
  UploadedMedia,
} from "@/lib/types";
import { simulatePublishing } from "@/lib/mock-publishing";

export const draftsStorageKey = "socialflow.saved-drafts.v1";

export type DraftInput = {
  id?: string;
  title: string;
  account: SocialAccount;
  postType: PostType;
  caption: string;
  hashtags: string;
  firstComment: string;
  publishDate: string;
  publishTime: string;
  timezone: string;
  status: SavedDraftPost["status"];
  mediaItems: UploadedMedia[];
};

function createId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `draft-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function readDrafts(): SavedDraftPost[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(draftsStorageKey);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function writeDrafts(drafts: SavedDraftPost[]) {
  window.localStorage.setItem(draftsStorageKey, JSON.stringify(drafts));
  window.dispatchEvent(new CustomEvent("socialflow:drafts-updated"));
}

export function saveDraft(input: DraftInput) {
  const now = new Date().toISOString();
  const media: SavedDraftMedia[] = [...input.mediaItems]
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((item, index) => ({
      id: item.id,
      fileName: item.file.name,
      fileSize: item.file.size,
      mediaType: item.mediaType,
      sortOrder: index,
    }));

  const draft: SavedDraftPost = {
    id: input.id ?? createId(),
    title: input.title.trim() || "Başlıksız gönderi",
    account: input.account,
    postType: input.postType,
    caption: input.caption,
    hashtags: input.hashtags,
    firstComment: input.firstComment,
    publishDate: input.publishDate,
    publishTime: input.publishTime,
    timezone: input.timezone,
    status: input.status,
    media,
    createdAt: input.id ? readDrafts().find((item) => item.id === input.id)?.createdAt ?? now : now,
    updatedAt: now,
  };

  const existing = readDrafts();
  const next = [draft, ...existing.filter((item) => item.id !== draft.id)];
  writeDrafts(next);

  return draft;
}

export function deleteDraft(id: string) {
  writeDrafts(readDrafts().filter((draft) => draft.id !== id));
}

export function updateDraftStatus(id: string, status: SavedDraftPost["status"]) {
  const now = new Date().toISOString();
  const next = readDrafts().map((draft) =>
    draft.id === id
      ? {
          ...draft,
          status,
          updatedAt: now,
        }
      : draft,
  );

  writeDrafts(next);
}

export function updateDraft(id: string, updates: Partial<SavedDraftPost>) {
  const now = new Date().toISOString();
  const next = readDrafts().map((draft) =>
    draft.id === id
      ? {
          ...draft,
          ...updates,
          updatedAt: now,
        }
      : draft,
  );

  writeDrafts(next);
}

export async function simulateDraftPublishing(id: string) {
  const draft = readDrafts().find((item) => item.id === id);

  if (!draft) {
    return null;
  }

  const attemptAt = new Date().toISOString();
  updateDraft(id, {
    status: "publishing",
    lastPublishingAttemptAt: attemptAt,
    failureReason: undefined,
    activityLogMessage: "Simulasyon yayina alma islemi baslatildi.",
  });

  const result = await simulatePublishing(draft.title);
  const nextStatus: PostStatus = result.status;

  updateDraft(id, {
    status: nextStatus,
    publishedAt: result.status === "published" ? new Date().toISOString() : undefined,
    externalPostId: result.externalPostId,
    externalPostUrl: result.externalPostUrl,
    failureReason: result.failureReason,
    activityLogMessage: result.activityLogMessage,
  });

  return result;
}
