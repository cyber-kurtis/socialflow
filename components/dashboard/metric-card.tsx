import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/ui";

type MetricCardProps = {
  icon: LucideIcon;
  label: string;
  value: number;
  helper: string;
  tone?: "default" | "success" | "danger";
};

const toneClasses = {
  default: "bg-brand-50 text-brand-700",
  success: "bg-emerald-50 text-emerald-700",
  danger: "bg-rose-50 text-rose-700",
};

export function MetricCard({
  icon: Icon,
  label,
  value,
  helper,
  tone = "default",
}: MetricCardProps) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-panel">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">{value}</p>
        </div>
        <div className={cn("rounded-md p-2", toneClasses[tone])}>
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
      </div>
      <p className="mt-3 text-sm text-slate-500">{helper}</p>
    </article>
  );
}
