import type { ReactNode } from "react";
import { Bell, Building2 } from "lucide-react";

export function Topbar({
  children,
}: Readonly<{
  children?: ReactNode;
}>) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-slate-50/95 backdrop-blur">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
        {children}
        <div className="ml-auto flex min-w-0 items-center gap-3">
          <label className="hidden items-center gap-2 text-sm text-slate-600 md:flex">
            <Building2 className="h-4 w-4 text-slate-400" aria-hidden="true" />
            <span className="sr-only">Organizasyon</span>
            <select className="focus-ring rounded-md border-slate-200 bg-white py-2 pl-3 pr-8 text-sm text-slate-700 shadow-panel">
              <option>SocialFlow Demo</option>
              <option>Studio Nova</option>
            </select>
          </label>
          <label className="hidden text-sm text-slate-600 sm:block">
            <span className="sr-only">Instagram hesabı</span>
            <select className="focus-ring rounded-md border-slate-200 bg-white py-2 pl-3 pr-8 text-sm text-slate-700 shadow-panel">
              <option>@socialflow_tr</option>
              <option>@studionova</option>
              <option>@mavikutu</option>
            </select>
          </label>
          <button
            type="button"
            className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 shadow-panel"
            aria-label="Bildirimler"
          >
            <Bell className="h-5 w-5" aria-hidden="true" />
          </button>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
            AK
          </div>
        </div>
      </div>
    </header>
  );
}
