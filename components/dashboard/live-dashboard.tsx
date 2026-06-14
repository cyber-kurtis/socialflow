"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  CalendarClock,
  CheckCircle2,
  Clock3,
} from "lucide-react";
import { MetricCard } from "@/components/dashboard/metric-card";
import { StatusDistribution } from "@/components/dashboard/status-distribution";
import { readDrafts } from "@/lib/drafts";
import type { SavedDraftPost, StatusDistributionItem } from "@/lib/types";

const distributionTemplate: StatusDistributionItem[] = [
  { status: "draft", label: "Taslak", count: 0, colorClass: "bg-slate-500" },
  { status: "pending_approval", label: "Onay bekleyen", count: 0, colorClass: "bg-amber-500" },
  { status: "scheduled", label: "Programlı", count: 0, colorClass: "bg-brand-500" },
  { status: "publishing", label: "Yayında", count: 0, colorClass: "bg-indigo-500" },
  { status: "published", label: "Yayımlandı", count: 0, colorClass: "bg-emerald-500" },
  { status: "failed", label: "Başarısız", count: 0, colorClass: "bg-rose-500" },
];

export function LiveDashboard() {
  const [posts, setPosts] = useState<SavedDraftPost[]>([]);

  useEffect(() => {
    function refreshPosts() {
      setPosts(readDrafts());
    }

    refreshPosts();
    window.addEventListener("socialflow:drafts-updated", refreshPosts);
    window.addEventListener("storage", refreshPosts);

    return () => {
      window.removeEventListener("socialflow:drafts-updated", refreshPosts);
      window.removeEventListener("storage", refreshPosts);
    };
  }, []);

  const stats = useMemo(() => {
    const scheduled = posts.filter((post) => post.status === "scheduled").length;
    const pending = posts.filter((post) => post.status === "pending_approval").length;
    const published = posts.filter((post) => post.status === "published").length;
    const failed = posts.filter((post) => post.status === "failed").length;

    return { scheduled, pending, published, failed };
  }, [posts]);

  const distribution = useMemo<StatusDistributionItem[]>(() => {
    return distributionTemplate.map((item) => ({
      ...item,
      count: posts.filter((post) => post.status === item.status).length,
    }));
  }, [posts]);

  const upcoming = posts
    .filter((post) => post.status === "scheduled")
    .sort((a, b) => `${a.publishDate} ${a.publishTime}`.localeCompare(`${b.publishDate} ${b.publishTime}`))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-brand-600">Çalışma paneli</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Hazırladığınız gönderi kayıtlarının güncel özeti.
          </p>
        </div>
        <div className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 shadow-panel">
          Saat dilimi: <span className="font-medium text-slate-900">Europe/Istanbul</span>
        </div>
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          icon={CalendarClock}
          label="Programlanan"
          value={stats.scheduled}
          helper="Yayın planındaki içerikler"
        />
        <MetricCard
          icon={Clock3}
          label="Onay bekleyen"
          value={stats.pending}
          helper="İnceleme bekleyen içerikler"
        />
        <MetricCard
          icon={CheckCircle2}
          label="Bu ay yayımlanan"
          value={stats.published}
          helper="Simülasyonla başarılı olanlar"
          tone="success"
        />
        <MetricCard
          icon={AlertTriangle}
          label="Başarısız"
          value={stats.failed}
          helper="Tekrar denenmesi gerekenler"
          tone="danger"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-panel">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-slate-950">
                Yaklaşan paylaşımlar
              </h2>
              <p className="text-sm text-slate-500">Programlanmış ilk beş içerik.</p>
            </div>
            <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">
              Canlı kayıtlar
            </span>
          </div>

          {upcoming.length === 0 ? (
            <div className="mt-4 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-600">
              Henüz programlanmış içerik yok.
            </div>
          ) : (
            <div className="mt-4 divide-y divide-slate-100">
              {upcoming.map((post) => (
                <div key={post.id} className="py-3 first:pt-0 last:pb-0">
                  <p className="text-sm font-semibold text-slate-950">{post.title}</p>
                  <p className="mt-1 text-sm text-slate-500">
                    {post.account.handle} · {post.publishDate || "Tarih yok"} ·{" "}
                    {post.publishTime || "Saat yok"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <StatusDistribution items={distribution} />
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-panel">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-brand-600" aria-hidden="true" />
          <h2 className="text-base font-semibold text-slate-950">Son kayıtlar</h2>
        </div>
        <div className="mt-4 divide-y divide-slate-100">
          {posts.slice(0, 5).map((post) => (
            <div key={post.id} className="py-3 first:pt-0 last:pb-0">
              <p className="text-sm font-medium text-slate-900">{post.title}</p>
              <p className="mt-1 text-sm text-slate-500">
                {post.account.handle} · {post.status}
              </p>
            </div>
          ))}
          {posts.length === 0 && (
            <p className="text-sm text-slate-500">Henüz kayıtlı gönderi yok.</p>
          )}
        </div>
      </section>
    </div>
  );
}
