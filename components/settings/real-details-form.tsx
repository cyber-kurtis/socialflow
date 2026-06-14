"use client";

import { useState } from "react";
import { Plus, Save, Trash2 } from "lucide-react";
import {
  makeInitials,
  normalizeHandle,
  readAppSettings,
  writeAppSettings,
  type AppSettings,
} from "@/lib/app-settings";
import type { SocialAccount } from "@/lib/types";

function createAccount(): SocialAccount {
  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `account-${Date.now()}`;

  return {
    id,
    name: "",
    handle: "",
    brand: "",
    avatarFallback: "IG",
  };
}

function getInitialSettings(): AppSettings {
  const loaded = readAppSettings();

  return {
    ...loaded,
    socialAccounts: loaded.socialAccounts.length > 0 ? loaded.socialAccounts : [createAccount()],
  };
}

export function RealDetailsForm() {
  const [settings, setSettings] = useState<AppSettings>(getInitialSettings);
  const [saved, setSaved] = useState(false);

  function updateSetting<K extends keyof AppSettings>(key: K, value: AppSettings[K]) {
    setSettings((current) => ({ ...current, [key]: value }));
    setSaved(false);
  }

  function updateAccount(id: string, key: keyof SocialAccount, value: string) {
    setSettings((current) => ({
      ...current,
      socialAccounts: current.socialAccounts.map((account) =>
        account.id === id
          ? {
              ...account,
              [key]: key === "handle" ? normalizeHandle(value) : value,
              avatarFallback:
                key === "brand" || key === "name" ? makeInitials(value) : account.avatarFallback,
            }
          : account,
      ),
    }));
    setSaved(false);
  }

  function addAccount() {
    setSettings((current) => ({
      ...current,
      socialAccounts: [...current.socialAccounts, createAccount()],
    }));
    setSaved(false);
  }

  function removeAccount(id: string) {
    setSettings((current) => ({
      ...current,
      socialAccounts:
        current.socialAccounts.length > 1
          ? current.socialAccounts.filter((account) => account.id !== id)
          : [createAccount()],
    }));
    setSaved(false);
  }

  function saveSettings() {
    const cleanedAccounts = settings.socialAccounts
      .map((account) => ({
        ...account,
        name: account.name.trim(),
        brand: account.brand.trim(),
        handle: normalizeHandle(account.handle),
        avatarFallback: account.avatarFallback || makeInitials(account.brand || account.name),
      }))
      .filter((account) => account.name || account.brand || account.handle);

    const nextSettings: AppSettings = {
      organizationName: settings.organizationName.trim(),
      userName: settings.userName.trim(),
      userInitials: settings.userInitials.trim() || makeInitials(settings.userName),
      timezone: settings.timezone,
      supabaseUrl: settings.supabaseUrl.trim(),
      supabaseAnonKey: settings.supabaseAnonKey.trim(),
      socialAccounts: cleanedAccounts,
    };

    writeAppSettings(nextSettings);
    setSettings({
      ...nextSettings,
      socialAccounts: nextSettings.socialAccounts.length > 0 ? nextSettings.socialAccounts : [createAccount()],
    });
    setSaved(true);
  }

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-panel">
        <div>
          <h2 className="text-base font-semibold text-slate-950">Firma ve kullanıcı bilgileri</h2>
          <p className="mt-1 text-sm text-slate-500">
            Bu bilgiler üst menüde, gönderi hazırlama ekranında ve hesap seçimlerinde kullanılır.
          </p>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Organizasyon / firma adı</span>
            <input
              className="focus-ring mt-1 w-full rounded-md border-slate-200"
              value={settings.organizationName}
              onChange={(event) => updateSetting("organizationName", event.target.value)}
              placeholder="Örn. Ajansınız veya markanız"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Kullanıcı adı</span>
            <input
              className="focus-ring mt-1 w-full rounded-md border-slate-200"
              value={settings.userName}
              onChange={(event) => {
                updateSetting("userName", event.target.value);
                updateSetting("userInitials", makeInitials(event.target.value));
              }}
              placeholder="Örn. Ahmet Kurtis"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Kullanıcı baş harfleri</span>
            <input
              className="focus-ring mt-1 w-full rounded-md border-slate-200"
              value={settings.userInitials}
              onChange={(event) => updateSetting("userInitials", event.target.value.toUpperCase())}
              placeholder="AK"
              maxLength={4}
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Varsayılan saat dilimi</span>
            <select
              className="focus-ring mt-1 w-full rounded-md border-slate-200"
              value={settings.timezone}
              onChange={(event) => updateSetting("timezone", event.target.value)}
            >
              <option>Europe/Istanbul</option>
              <option>UTC</option>
              <option>Europe/London</option>
              <option>Europe/Berlin</option>
              <option>America/New_York</option>
            </select>
          </label>
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-panel">
        <div>
          <h2 className="text-base font-semibold text-slate-950">Supabase bağlantı hazırlığı</h2>
          <p className="mt-1 text-sm text-slate-500">
            Supabase Project URL ve anon public key değerlerini buraya ekleyin. Service role key
            burada kullanılmaz ve tarayıcıya konmaz.
          </p>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Supabase Project URL</span>
            <input
              className="focus-ring mt-1 w-full rounded-md border-slate-200"
              value={settings.supabaseUrl}
              onChange={(event) => updateSetting("supabaseUrl", event.target.value)}
              placeholder="https://xxxxx.supabase.co"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Supabase anon public key</span>
            <input
              className="focus-ring mt-1 w-full rounded-md border-slate-200"
              value={settings.supabaseAnonKey}
              onChange={(event) => updateSetting("supabaseAnonKey", event.target.value)}
              placeholder="eyJhbGciOi..."
            />
          </label>
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-panel">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-950">Instagram hesapları</h2>
            <p className="mt-1 text-sm text-slate-500">
              Gerçek marka ve hesap adlarını buraya girin. API bağlantısı daha sonra eklenecek.
            </p>
          </div>
          <button
            type="button"
            className="focus-ring inline-flex items-center justify-center gap-2 rounded-md border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            onClick={addAccount}
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Hesap ekle
          </button>
        </div>

        <div className="mt-5 grid gap-4">
          {settings.socialAccounts.map((account, index) => (
            <div
              key={account.id}
              className="grid gap-3 rounded-lg border border-slate-200 p-4 md:grid-cols-[1fr_1fr_1fr_auto]"
            >
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Marka adı</span>
                <input
                  className="focus-ring mt-1 w-full rounded-md border-slate-200"
                  value={account.brand}
                  onChange={(event) => updateAccount(account.id, "brand", event.target.value)}
                  placeholder={`Marka ${index + 1}`}
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Hesap adı</span>
                <input
                  className="focus-ring mt-1 w-full rounded-md border-slate-200"
                  value={account.name}
                  onChange={(event) => updateAccount(account.id, "name", event.target.value)}
                  placeholder="Örn. Resmi hesap"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Instagram kullanıcı adı</span>
                <input
                  className="focus-ring mt-1 w-full rounded-md border-slate-200"
                  value={account.handle}
                  onChange={(event) => updateAccount(account.id, "handle", event.target.value)}
                  placeholder="@instagram_hesabi"
                />
              </label>
              <button
                type="button"
                className="focus-ring mt-6 inline-flex h-10 w-10 items-center justify-center rounded-md text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                onClick={() => removeAccount(account.id)}
                aria-label="Hesabı sil"
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          ))}
        </div>
      </section>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          className="focus-ring inline-flex items-center justify-center gap-2 rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
          onClick={saveSettings}
        >
          <Save className="h-4 w-4" aria-hidden="true" />
          Gerçek bilgileri kaydet
        </button>
        {saved && (
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
            Bilgiler kaydedildi ve ekranlara uygulandı.
          </span>
        )}
      </div>
    </div>
  );
}
