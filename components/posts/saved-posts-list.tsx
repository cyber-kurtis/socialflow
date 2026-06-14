"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  CalendarClock,
  CheckCircle2,
  ExternalLink,
  FileText,
  Loader2,
  Send,
  Sparkles,
  Trash2,
  XCircle,
} from "lucide-react";
import { deleteDraft, readDrafts, simulateDraftPublishing, updateDraftStatus } from "@/lib/drafts";
import type { PostStatus, SavedDraftPost } from "@/lib/types";
import { cn } from "@/lib/ui";

const statusLabels: Record<PostStatus, string> = {
  draft: "Taslak",
  pending_approval: "Onay bekliyor",
  revision_requested: "Revizyon istendi",
  approved: "Onaylandı",
  scheduled: "Programlandı",
  publishing: "Yayında",
  published: "Yayımlandı",
  failed: "Başarısız",
  rejected: "Reddedildi",
  cancelled: "İptal edildi",
};

const statusClasses: Record<PostStatus, string> = {
  draft: "bg-slate-100 text-slate-700",
  pending_approval: "bg-amber-50 text-amber-700",
  revision_requested: "bg-orange-50 text-orange-700",
  approved: "bg-emerald-50 text-emerald-700",
  scheduled: "bg-brand-50 text-brand-700",
  publishing: "bg-indigo-50 text-indigo-700",
  published: "bg-emerald-50 text-emerald-700",
  failed: "bg-rose-50 text-rose-700",
  rejected: "bg-rose-50 text-rose-700",
  cancelled: "bg-slate-100 text-slate-500",
};

type SavedPostsListProps = {
  emptyDescription: string;
  emptyTitle: string;
  statuses?: PostStatus[];
};

export function SavedPostsList({ emptyDescription, emptyTitle, statuses }: SavedPostsListProps) {
  const [posts, setPosts] = useState<SavedDraftPost[]>([]);
  const [publishingIds, setPublishingIds] = useState<string[]>([]);

  useEffect(() => {
    function refreshDrafts() {
      setPosts(readDrafts());
    }

    refreshDrafts();
    window.addEventListener("socialflow:drafts-updated", refreshDrafts);
    window.addEventListener("storage", refreshDrafts);

    return () => {
      window.removeEventListener("socialflow:drafts-updated", refreshDrafts);
      window.removeEventListener("storage", refreshDrafts);
    };
  }, []);

  const visiblePosts = useMemo(() => {
    if (!statuses || statuses.length === 0) {
      return posts;
    }

    return posts.filter((post) => statuses.includes(post.status));
  }, [posts, statuses]);

  function refresh() {
    setPosts(readDrafts());
  }

  function handleDelete(id: string) {
    deleteDraft(id);
    refresh();
  }

  function handleStatus(id: string, status: PostStatus) {
    updateDraftStatus(id, status);
    refresh();
  }

  async function handleSimulate(id: string) {
    setPublishingIds((current) => [...current, id]);
    await simulateDraftPublishing(id);
    setPublishingIds((current) => current.filter((item) => item !== id));
    refresh();
  }

  if (visiblePosts.length === 0) {
    return (
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-panel">
        <div className="flex max-w-2xl gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-brand-50 text-brand-700">
            <FileText className="h-6 w-6" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-950">{emptyTitle}</h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">{emptyDescription}</p>
            <Link
              href="/posts/new"
              className="focus-ring mt-4 inline-flex rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
            >
              Yeni gönderi oluştur
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-lg border border-slate-200 bg-white shadow-panel">
      <div className="divide-y divide-slate-100">
        {visiblePosts.map((post) => (
          <article key={post.id} className="grid gap-4 p-5 xl:grid-cols-[1fr_auto]">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-base font-semibold text-slate-950">{post.title}</h2>
                <span
                  className={cn(
                    "rounded-full px-2.5 py-1 text-xs font-medium",
                    statusClasses[post.status],
                  )}
                >
                  {statusLabels[post.status]}
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-500">
                {post.account.brand} · {post.account.handle}
              </p>
              <p className="mt-3 line-clamp-2 text-sm text-slate-700">
                {post.caption || "Caption eklenmedi."}
              </p>
              <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-500">
                <span>{post.media.length} medya</span>
                <span>{post.hashtags || "Hashtag yok"}</span>
                <span className="inline-flex items-center gap-1">
                  <CalendarClock className="h-3.5 w-3.5" aria-hidden="true" />
                  {post.publishDate || "Tarih yok"} · {post.publishTime || "Saat yok"}
                </span>
              </div>

              {(post.externalPostUrl || post.failureReason || post.activityLogMessage) && (
                <div className="mt-3 rounded-md bg-slate-50 p-3 text-xs text-slate-600">
                  {post.externalPostUrl && (
                    <a
                      href={post.externalPostUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 font-medium text-brand-700 hover:text-brand-800"
                    >
                      Mock Instagram linki
                      <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                    </a>
                  )}
                  {post.failureReason && <p className="text-rose-700">{post.failureReason}</p>}
                  {post.activityLogMessage && <p className="mt-1">{post.activityLogMessage}</p>}
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2 xl:justify-end">
              {post.status === "draft" && (
                <>
                  <button
                    type="button"
                    className="focus-ring inline-flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    onClick={() => handleStatus(post.id, "pending_approval")}
                  >
                    <Send className="h-4 w-4" aria-hidden="true" />
                    Onaya gönder
                  </button>
                  <button
                    type="button"
                    className="focus-ring inline-flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    onClick={() => handleStatus(post.id, "scheduled")}
                  >
                    <CalendarClock className="h-4 w-4" aria-hidden="true" />
                    Programla
                  </button>
                </>
              )}

              {post.status === "pending_approval" && (
                <>
                  <button
                    type="button"
                    className="focus-ring inline-flex items-center gap-2 rounded-md bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700"
                    onClick={() => handleStatus(post.id, "approved")}
                  >
                    <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                    Onayla
                  </button>
                  <button
                    type="button"
                    className="focus-ring inline-flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    onClick={() => handleStatus(post.id, "scheduled")}
                  >
                    Programla
                  </button>
                  <button
                    type="button"
                    className="focus-ring inline-flex items-center gap-2 rounded-md border border-amber-200 px-3 py-2 text-sm font-medium text-amber-700 hover:bg-amber-50"
                    onClick={() => handleStatus(post.id, "revision_requested")}
                  >
                    Revizyon iste
                  </button>
                  <button
                    type="button"
                    className="focus-ring inline-flex items-center gap-2 rounded-md border border-rose-200 px-3 py-2 text-sm font-medium text-rose-700 hover:bg-rose-50"
                    onClick={() => handleStatus(post.id, "rejected")}
                  >
                    <XCircle className="h-4 w-4" aria-hidden="true" />
                    Reddet
                  </button>
                </>
              )}

              {post.status === "approved" && (
                <button
                  type="button"
                  className="focus-ring inline-flex items-center gap-2 rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800"
                  onClick={() => handleStatus(post.id, "scheduled")}
                >
                  <CalendarClock className="h-4 w-4" aria-hidden="true" />
                  Programla
                </button>
              )}

              {(post.status === "approved" || post.status === "scheduled" || post.status === "failed") && (
                <button
                  type="button"
                  className="focus-ring inline-flex items-center gap-2 rounded-md bg-brand-600 px-3 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-70"
                  onClick={() => handleSimulate(post.id)}
                  disabled={publishingIds.includes(post.id)}
                >
                  {publishingIds.includes(post.id) ? (
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  ) : (
                    <Sparkles className="h-4 w-4" aria-hidden="true" />
                  )}
                  Yayını simüle et
                </button>
              )}

              {post.status === "scheduled" && (
                <button
                  type="button"
                  className="focus-ring inline-flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  onClick={() => handleStatus(post.id, "cancelled")}
                >
                  İptal et
                </button>
              )}

              {post.status === "revision_requested" && (
                <button
                  type="button"
                  className="focus-ring inline-flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  onClick={() => handleStatus(post.id, "draft")}
                >
                  Taslağa al
                </button>
              )}

              <button
                type="button"
                className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded-md text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                onClick={() => handleDelete(post.id)}
                aria-label="Kaydı sil"
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
