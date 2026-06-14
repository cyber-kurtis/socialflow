"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Camera, Settings } from "lucide-react";
import { defaultAppSettings, readAppSettings, type AppSettings } from "@/lib/app-settings";

export function AccountsSummary() {
  const [settings, setSettings] = useState<AppSettings>(defaultAppSettings);

  useEffect(() => {
    function refreshSettings() {
      setSettings(readAppSettings());
    }

    refreshSettings();
    window.addEventListener("socialflow:settings-updated", refreshSettings);
    window.addEventListener("storage", refreshSettings);

    return () => {
      window.removeEventListener("socialflow:settings-updated", refreshSettings);
      window.removeEventListener("storage", refreshSettings);
    };
  }, []);

  if (settings.socialAccounts.length === 0) {
    return (
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-panel">
        <div className="flex max-w-2xl gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-brand-50 text-brand-700">
            <Camera className="h-6 w-6" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-950">Henüz hesap eklenmedi</h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Gerçek Instagram hesap adlarını Ayarlar bölümünden ekleyin. API bağlantısı henüz
              kapalıdır; bu liste içerik hazırlama ekranında seçim olarak kullanılır.
            </p>
            <Link
              href="/settings"
              className="focus-ring mt-4 inline-flex items-center gap-2 rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
            >
              <Settings className="h-4 w-4" aria-hidden="true" />
              Gerçek bilgileri gir
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {settings.socialAccounts.map((account) => (
        <article
          key={account.id}
          className="rounded-lg border border-slate-200 bg-white p-5 shadow-panel"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
              {account.avatarFallback}
            </div>
            <div className="min-w-0">
              <h2 className="truncate text-base font-semibold text-slate-950">{account.brand}</h2>
              <p className="truncate text-sm text-slate-500">{account.handle}</p>
            </div>
          </div>
          <div className="mt-4 rounded-md bg-slate-50 px-3 py-2 text-sm text-slate-600">
            Hesap adı: <span className="font-medium text-slate-900">{account.name}</span>
          </div>
        </article>
      ))}
    </section>
  );
}
