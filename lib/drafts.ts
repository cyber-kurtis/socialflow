"use client";

import type {
  PostType,
  SavedDraftMedia,
  SavedDraftPost,
  SocialAccount,
  UploadedMedia,
} from "@/lib/types";

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
