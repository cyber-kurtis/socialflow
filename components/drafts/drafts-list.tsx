"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarClock, FileText, Trash2 } from "lucide-react";
import { deleteDraft, readDrafts } from "@/lib/drafts";
import type { SavedDraftPost } from "@/lib/types";

const statusLabels: Record<SavedDraftPost["status"], string> = {
  draft: "Taslak",
  pending_approval: "Onay bekliyor",
  scheduled: "Programlandı",
};

export function DraftsList() {
  const [drafts, setDrafts] = useState<SavedDraftPost[]>([]);

  useEffect(() => {
    function refreshDrafts() {
      setDrafts(readDrafts());
    }

    refreshDrafts();
    window.addEventListener("socialflow:drafts-updated", refreshDrafts);
    window.addEventListener("storage", refreshDrafts);

    return () => {
      window.removeEventListener("socialflow:drafts-updated", refreshDrafts);
      window.removeEventListener("storage", refreshDrafts);
    };
  }, []);

  function handleDelete(id: string) {
    deleteDraft(id);
    setDrafts(readDrafts());
  }

  if (drafts.length === 0) {
    return (
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-panel">
        <div className="flex max-w-2xl gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-brand-50 text-brand-700">
            <FileText className="h-6 w-6" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-950">Henüz kayıtlı gönderi yok</h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Yeni gönderi ekranında gerçek bilgileri girip Taslak kaydet, Onaya gönder veya
              Programla dediğinizde içerikler burada listelenir.
            </p>
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
        {drafts.map((draft) => (
          <article key={draft.id} className="grid gap-4 p-5 lg:grid-cols-[1fr_auto]">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-base font-semibold text-slate-950">{draft.title}</h2>
                <span className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700">
                  {statusLabels[draft.status]}
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-500">
                {draft.account.brand} · {draft.account.handle}
              </p>
              <p className="mt-3 line-clamp-2 text-sm text-slate-700">
                {draft.caption || "Caption eklenmedi."}
              </p>
              <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-500">
                <span>{draft.media.length} medya</span>
                <span>{draft.hashtags || "Hashtag yok"}</span>
                <span className="inline-flex items-center gap-1">
                  <CalendarClock className="h-3.5 w-3.5" aria-hidden="true" />
                  {draft.publishDate || "Tarih yok"} · {draft.publishTime || "Saat yok"}
                </span>
              </div>
            </div>
            <button
              type="button"
              className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded-md text-slate-400 hover:bg-rose-50 hover:text-rose-600 lg:self-center"
              onClick={() => handleDelete(draft.id)}
              aria-label="Taslağı sil"
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
