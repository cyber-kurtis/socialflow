"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ExternalLink, History, RotateCcw } from "lucide-react";
import { readDrafts, simulateDraftPublishing } from "@/lib/drafts";
import type { SavedDraftPost } from "@/lib/types";
import { cn } from "@/lib/ui";

const historyStatuses = ["published", "failed", "cancelled", "rejected"] as const;

type HistoryStatus = (typeof historyStatuses)[number];

const labels: Record<HistoryStatus, string> = {
  published: "Yayımlandı",
  failed: "Başarısız",
  cancelled: "İptal edildi",
  rejected: "Reddedildi",
};

const classes: Record<HistoryStatus, string> = {
  published: "bg-emerald-50 text-emerald-700",
  failed: "bg-rose-50 text-rose-700",
  cancelled: "bg-slate-100 text-slate-500",
  rejected: "bg-rose-50 text-rose-700",
};

function isHistoryStatus(status: SavedDraftPost["status"]): status is HistoryStatus {
  return historyStatuses.includes(status as HistoryStatus);
}

function formatDate(value?: string) {
  if (!value) {
    return "Kayıt yok";
  }

  return new Intl.DateTimeFormat("tr-TR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function PublishingHistory() {
  const [posts, setPosts] = useState<SavedDraftPost[]>([]);
  const [retryingIds, setRetryingIds] = useState<string[]>([]);

  useEffect(() => {
    function refresh() {
      setPosts(readDrafts());
    }

    refresh();
    window.addEventListener("socialflow:drafts-updated", refresh);
    window.addEventListener("storage", refresh);

    return () => {
      window.removeEventListener("socialflow:drafts-updated", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  const historyPosts = useMemo(() => {
    return posts
      .filter((post) => isHistoryStatus(post.status))
      .sort((a, b) => (b.updatedAt || "").localeCompare(a.updatedAt || ""));
  }, [posts]);

  async function retryPublish(id: string) {
    setRetryingIds((current) => [...current, id]);
    await simulateDraftPublishing(id);
    setRetryingIds((current) => current.filter((item) => item !== id));
    setPosts(readDrafts());
  }

  if (historyPosts.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <p className="text-sm font-medium text-brand-600">Raporlama</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
            Yayın geçmişi
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-slate-600">
            Yayın simülasyonu çalıştırıldığında başarılı ve başarısız sonuçlar burada listelenir.
          </p>
        </div>
        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-panel">
          <div className="flex max-w-2xl gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-brand-50 text-brand-700">
              <History className="h-6 w-6" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-950">Henüz geçmiş kaydı yok</h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                Programlanmış içeriklerden “Yayını simüle et” dediğinizde sonuçlar burada görünür.
              </p>
              <Link
                href="/scheduled"
                className="focus-ring mt-4 inline-flex rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
              >
                Programlanmış içeriklere git
              </Link>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-brand-600">Raporlama</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
          Yayın geçmişi
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-slate-600">
          Simülasyon sonuçları, mock Instagram linkleri ve başarısız deneme açıklamaları.
        </p>
      </div>

      <section className="rounded-lg border border-slate-200 bg-white shadow-panel">
        <div className="divide-y divide-slate-100">
          {historyPosts.map((post) => {
            const status = post.status as HistoryStatus;

            return (
              <article key={post.id} className="grid gap-4 p-5 xl:grid-cols-[1fr_auto]">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-base font-semibold text-slate-950">{post.title}</h2>
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-1 text-xs font-medium",
                        classes[status],
                      )}
                    >
                      {labels[status]}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-slate-500">
                    {post.account.brand} · {post.account.handle}
                  </p>
                  <div className="mt-3 grid gap-2 text-sm text-slate-600 md:grid-cols-2">
                    <p>Plan: {post.publishDate || "Tarih yok"} · {post.publishTime || "Saat yok"}</p>
                    <p>Son deneme: {formatDate(post.lastPublishingAttemptAt || post.updatedAt)}</p>
                    {post.externalPostId && <p>Mock ID: {post.externalPostId}</p>}
                    {post.publishedAt && <p>Yayın zamanı: {formatDate(post.publishedAt)}</p>}
                  </div>
                  {post.failureReason && (
                    <p className="mt-3 rounded-md bg-rose-50 p-3 text-sm text-rose-700">
                      {post.failureReason}
                    </p>
                  )}
                  {post.activityLogMessage && (
                    <p className="mt-2 text-xs text-slate-500">{post.activityLogMessage}</p>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2 xl:justify-end">
                  {post.externalPostUrl && (
                    <a
                      href={post.externalPostUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="focus-ring inline-flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                      <ExternalLink className="h-4 w-4" aria-hidden="true" />
                      Mock link
                    </a>
                  )}
                  {post.status === "failed" && (
                    <button
                      type="button"
                      className="focus-ring inline-flex items-center gap-2 rounded-md bg-brand-600 px-3 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-70"
                      onClick={() => retryPublish(post.id)}
                      disabled={retryingIds.includes(post.id)}
                    >
                      <RotateCcw
                        className={cn("h-4 w-4", retryingIds.includes(post.id) && "animate-spin")}
                        aria-hidden="true"
                      />
                      Tekrar dene
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
