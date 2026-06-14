import type { StatusDistributionItem } from "@/lib/types";

export function StatusDistribution({ items }: { items: StatusDistributionItem[] }) {
  const total = items.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-panel">
      <h2 className="text-base font-semibold text-slate-950">Durum dağılımı</h2>
      <p className="mt-1 text-sm text-slate-500">Tüm demo içerikler.</p>

      <div className="mt-5 space-y-4">
        {items.map((item) => {
          const percentage = total === 0 ? 0 : Math.round((item.count / total) * 100);

          return (
            <div key={item.status}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="font-medium text-slate-700">{item.label}</span>
                <span className="text-slate-500">{item.count}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`${item.colorClass} h-full rounded-full`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
