import type { LucideIcon } from "lucide-react";

type PlaceholderPageProps = {
  icon: LucideIcon;
  title: string;
  eyebrow: string;
  description: string;
  items?: string[];
};

export function PlaceholderPage({
  icon: Icon,
  title,
  eyebrow,
  description,
  items = [],
}: PlaceholderPageProps) {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-brand-600">{eyebrow}</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">{title}</h1>
        <p className="mt-1 max-w-2xl text-sm text-slate-600">{description}</p>
      </div>

      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-panel">
        <div className="flex max-w-2xl gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-brand-50 text-brand-700">
            <Icon className="h-6 w-6" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-950">Demo modülü</h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Bu ekran ilk faz kapsamı için navigasyona bağlandı. Veri bağlantısı ve detay
              işlemler sonraki geliştirme adımlarında Supabase ile tamamlanacak.
            </p>
            {items.length > 0 && (
              <ul className="mt-4 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
                {items.map((item) => (
                  <li key={item} className="rounded-md bg-slate-50 px-3 py-2">
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
