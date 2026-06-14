"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CalendarDays, Clock3, FileText } from "lucide-react";
import { readDrafts } from "@/lib/drafts";
import type { PostStatus, SavedDraftPost } from "@/lib/types";
import { cn } from "@/lib/ui";

type CalendarView = "month" | "week" | "day";

const viewLabels: Record<CalendarView, string> = {
  month: "Aylık",
  week: "Haftalık",
  day: "Günlük",
};

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
  draft: "bg-slate-100 text-slate-600",
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

function toDateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function getMonthDays(anchor: Date) {
  const year = anchor.getFullYear();
  const month = anchor.getMonth();
  const first = new Date(year, month, 1);
  const firstDay = (first.getDay() + 6) % 7;
  const start = new Date(year, month, 1 - firstDay);

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    return date;
  });
}

function getWeekDays(anchor: Date) {
  const day = (anchor.getDay() + 6) % 7;
  const start = new Date(anchor);
  start.setDate(anchor.getDate() - day);

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    return date;
  });
}

export function ContentCalendar() {
  const [posts, setPosts] = useState<SavedDraftPost[]>([]);
  const [view, setView] = useState<CalendarView>("month");
  const [anchorDate] = useState(() => new Date());
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

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

  const calendarPosts = useMemo(() => {
    return posts
      .filter((post) => post.publishDate)
      .sort((a, b) => `${a.publishDate} ${a.publishTime}`.localeCompare(`${b.publishDate} ${b.publishTime}`));
  }, [posts]);

  const selectedPost =
    calendarPosts.find((post) => post.id === selectedPostId) ?? calendarPosts[0] ?? null;

  const days = useMemo(() => {
    if (view === "day") {
      return [anchorDate];
    }

    return view === "week" ? getWeekDays(anchorDate) : getMonthDays(anchorDate);
  }, [anchorDate, view]);

  const monthTitle = anchorDate.toLocaleDateString("tr-TR", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-brand-600">İçerik planlama</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
            İçerik takvimi
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-slate-600">
            Tarihi olan gönderiler burada takvim üstünde görünür. Gönderiye tıklayınca sağdaki
            detay paneli güncellenir.
          </p>
        </div>

        <div className="inline-flex rounded-md border border-slate-200 bg-white p-1 shadow-panel">
          {(["month", "week", "day"] as CalendarView[]).map((item) => (
            <button
              key={item}
              type="button"
              className={cn(
                "focus-ring rounded px-3 py-1.5 text-sm font-medium",
                view === item ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-50",
              )}
              onClick={() => setView(item)}
            >
              {viewLabels[item]}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-panel">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-brand-600" aria-hidden="true" />
              <h2 className="text-base font-semibold capitalize text-slate-950">{monthTitle}</h2>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
              {calendarPosts.length} tarihli kayıt
            </span>
          </div>

          <div className="mt-4 grid grid-cols-7 gap-px overflow-hidden rounded-lg border border-slate-200 bg-slate-200">
            {["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"].map((day) => (
              <div key={day} className="bg-slate-50 px-2 py-2 text-xs font-semibold text-slate-500">
                {day}
              </div>
            ))}
            {days.map((day) => {
              const key = toDateKey(day);
              const dayPosts = calendarPosts.filter((post) => post.publishDate === key);
              const isCurrentMonth = day.getMonth() === anchorDate.getMonth();

              return (
                <div
                  key={key}
                  className={cn(
                    "min-h-28 bg-white p-2",
                    view !== "month" && "min-h-44",
                    !isCurrentMonth && view === "month" && "bg-slate-50 text-slate-400",
                  )}
                >
                  <div className="text-xs font-semibold">{day.getDate()}</div>
                  <div className="mt-2 space-y-1">
                    {dayPosts.slice(0, 3).map((post) => (
                      <button
                        key={post.id}
                        type="button"
                        className="focus-ring block w-full rounded-md border border-slate-200 bg-white px-2 py-1 text-left text-xs hover:border-brand-200 hover:bg-brand-50"
                        onClick={() => setSelectedPostId(post.id)}
                      >
                        <span className="block truncate font-medium text-slate-800">
                          {post.publishTime || "--:--"} · {post.title}
                        </span>
                        <span
                          className={cn(
                            "mt-1 inline-block rounded-full px-2 py-0.5 text-[11px] font-medium",
                            statusClasses[post.status],
                          )}
                        >
                          {statusLabels[post.status]}
                        </span>
                      </button>
                    ))}
                    {dayPosts.length > 3 && (
                      <p className="text-xs text-slate-500">+{dayPosts.length - 3} kayıt</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <aside className="rounded-lg border border-slate-200 bg-white p-5 shadow-panel">
          {selectedPost ? (
            <div>
              <span
                className={cn(
                  "rounded-full px-2.5 py-1 text-xs font-medium",
                  statusClasses[selectedPost.status],
                )}
              >
                {statusLabels[selectedPost.status]}
              </span>
              <h2 className="mt-3 text-lg font-semibold text-slate-950">{selectedPost.title}</h2>
              <p className="mt-1 text-sm text-slate-500">
                {selectedPost.account.brand} · {selectedPost.account.handle}
              </p>
              <div className="mt-4 flex items-center gap-2 text-sm text-slate-600">
                <Clock3 className="h-4 w-4 text-slate-400" aria-hidden="true" />
                {selectedPost.publishDate || "Tarih yok"} · {selectedPost.publishTime || "Saat yok"}
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-700">
                {selectedPost.caption || "Caption eklenmedi."}
              </p>
              <p className="mt-3 text-sm text-brand-700">{selectedPost.hashtags || "#hashtag"}</p>
              <div className="mt-4 rounded-md bg-slate-50 p-3 text-sm text-slate-600">
                {selectedPost.media.length} medya · {selectedPost.postType}
              </div>
            </div>
          ) : (
            <div className="text-sm text-slate-600">
              <FileText className="mb-3 h-8 w-8 text-slate-400" aria-hidden="true" />
              Henüz takvime düşen gönderi yok.
              <Link href="/posts/new" className="mt-4 block font-medium text-brand-700">
                Yeni gönderi oluştur
              </Link>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
