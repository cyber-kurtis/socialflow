import type { SocialAccount } from "@/lib/types";

export type AppSettings = {
  organizationName: string;
  userName: string;
  userInitials: string;
  timezone: string;
  socialAccounts: SocialAccount[];
};

export const appSettingsStorageKey = "socialflow.app-settings.v1";

export const defaultAppSettings: AppSettings = {
  organizationName: "",
  userName: "",
  userInitials: "",
  timezone: "Europe/Istanbul",
  socialAccounts: [],
};

export const fallbackSocialAccount: SocialAccount = {
  id: "account-placeholder",
  name: "Instagram hesabınızı ekleyin",
  handle: "@hesap_adiniz",
  brand: "Marka adınız",
  avatarFallback: "IG",
};

export function normalizeHandle(handle: string) {
  const trimmed = handle.trim();

  if (!trimmed) {
    return "";
  }

  return trimmed.startsWith("@") ? trimmed : `@${trimmed}`;
}

export function makeInitials(value: string) {
  const initials = value
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return initials || "AK";
}

export function readAppSettings(): AppSettings {
  if (typeof window === "undefined") {
    return defaultAppSettings;
  }

  try {
    const raw = window.localStorage.getItem(appSettingsStorageKey);
    if (!raw) {
      return defaultAppSettings;
    }

    const parsed = JSON.parse(raw) as Partial<AppSettings>;

    return {
      ...defaultAppSettings,
      ...parsed,
      socialAccounts: Array.isArray(parsed.socialAccounts) ? parsed.socialAccounts : [],
    };
  } catch {
    return defaultAppSettings;
  }
}

export function writeAppSettings(settings: AppSettings) {
  window.localStorage.setItem(appSettingsStorageKey, JSON.stringify(settings));
  window.dispatchEvent(new CustomEvent("socialflow:settings-updated"));
}

export function getUsableAccounts(settings: AppSettings, fallback: SocialAccount[] = []) {
  if (settings.socialAccounts.length > 0) {
    return settings.socialAccounts;
  }

  if (fallback.length > 0) {
    return fallback;
  }

  return [fallbackSocialAccount];
}
