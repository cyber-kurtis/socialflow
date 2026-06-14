import {
  Activity,
  AlertTriangle,
  CalendarClock,
  CheckCircle2,
  Clock3,
} from "lucide-react";
import { MetricCard } from "@/components/dashboard/metric-card";
import { StatusDistribution } from "@/components/dashboard/status-distribution";
import { UpcomingPostCard } from "@/components/dashboard/upcoming-post-card";
import {
  dashboardStats,
  recentActivities,
  statusDistribution,
  upcomingPosts,
} from "@/lib/mock-data";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-brand-600">Çalışma paneli</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Gerçek firma ve hesap bilgilerinizi girdikten sonra içerik hazırlama akışını buradan
            takip edebilirsiniz.
          </p>
        </div>
        <div className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 shadow-panel">
          Saat dilimi: <span className="font-medium text-slate-900">Europe/Istanbul</span>
        </div>
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          icon={CalendarClock}
          label="Bu hafta planlanan"
          value={dashboardStats.scheduledThisWeek}
          helper="Hesaplarınızı Ayarlar'dan güncelleyin"
        />
        <MetricCard
          icon={Clock3}
          label="Onay bekleyen"
          value={dashboardStats.pendingApproval}
          helper="Onay akışı sonraki fazda bağlanacak"
        />
        <MetricCard
          icon={AlertTriangle}
          label="Başarısız gönderiler"
          value={dashboardStats.failedPosts}
          helper="Yayın bağlantısı henüz kapalı"
          tone="danger"
        />
        <MetricCard
          icon={CheckCircle2}
          label="Bu ay yayımlanan"
          value={dashboardStats.publishedThisMonth}
          helper="Canlı veri bağlantısı bekleniyor"
          tone="success"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-panel">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-slate-950">
                Yaklaşan paylaşımlar
              </h2>
              <p className="text-sm text-slate-500">
                Gerçek veri bağlantısından önce örnek akış görünümü.
              </p>
            </div>
            <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">
              Hazırlık verisi
            </span>
          </div>
          <div className="mt-4 grid gap-3">
            {upcomingPosts.map((post) => (
              <UpcomingPostCard key={post.id} post={post} />
            ))}
          </div>
        </div>

        <StatusDistribution items={statusDistribution} />
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-panel">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-brand-600" aria-hidden="true" />
          <h2 className="text-base font-semibold text-slate-950">Son işlemler</h2>
        </div>
        <div className="mt-4 divide-y divide-slate-100">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="flex gap-3 py-3 first:pt-0 last:pb-0">
              <div className="mt-1 h-2 w-2 rounded-full bg-brand-500" />
              <div>
                <p className="text-sm font-medium text-slate-900">{activity.title}</p>
                <p className="mt-1 text-sm text-slate-500">{activity.description}</p>
              </div>
              <time className="ml-auto whitespace-nowrap text-xs text-slate-400">
                {activity.time}
              </time>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
