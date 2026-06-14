"use client";

import { ChangeEvent, DragEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  CalendarClock,
  GripVertical,
  ImagePlus,
  Loader2,
  MessageSquareText,
  Send,
  Sparkles,
  Trash2,
} from "lucide-react";
import { getUsableAccounts, readAppSettings } from "@/lib/app-settings";
import { saveDraft, simulateDraftPublishing } from "@/lib/drafts";
import type { MockPublishResult, PostType, SocialAccount, UploadedMedia } from "@/lib/types";
import { cn } from "@/lib/ui";

type NewPostFormProps = {
  accounts: SocialAccount[];
};

type FormState = {
  title: string;
  accountId: string;
  postType: PostType;
  caption: string;
  hashtags: string;
  firstComment: string;
  publishDate: string;
  publishTime: string;
  timezone: string;
};

const initialFormState = (accountId: string): FormState => ({
  title: "",
  accountId,
  postType: "carousel",
  caption: "",
  hashtags: "",
  firstComment: "",
  publishDate: "",
  publishTime: "",
  timezone: "Europe/Istanbul",
});

function createMediaId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `media-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function NewPostForm({ accounts }: NewPostFormProps) {
  const [availableAccounts, setAvailableAccounts] = useState<SocialAccount[]>(accounts);
  const [form, setForm] = useState<FormState>(() => initialFormState(accounts[0]?.id ?? ""));
  const [mediaItems, setMediaItems] = useState<UploadedMedia[]>([]);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [submitState, setSubmitState] = useState<string | null>(null);
  const [publishResult, setPublishResult] = useState<MockPublishResult | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaItemsRef = useRef<UploadedMedia[]>([]);

  useEffect(() => {
    function refreshSettings() {
      const settings = readAppSettings();
      const nextAccounts = getUsableAccounts(settings, accounts);

      setAvailableAccounts(nextAccounts);
      setForm((current) => ({
        ...current,
        accountId: nextAccounts.some((account) => account.id === current.accountId)
          ? current.accountId
          : nextAccounts[0]?.id ?? "",
        timezone: settings.timezone || current.timezone,
      }));
    }

    refreshSettings();
    window.addEventListener("socialflow:settings-updated", refreshSettings);
    window.addEventListener("storage", refreshSettings);

    return () => {
      window.removeEventListener("socialflow:settings-updated", refreshSettings);
      window.removeEventListener("storage", refreshSettings);
    };
  }, [accounts]);

  useEffect(() => {
    mediaItemsRef.current = mediaItems;
  }, [mediaItems]);

  useEffect(() => {
    return () => {
      mediaItemsRef.current.forEach((item) => URL.revokeObjectURL(item.previewUrl));
    };
  }, []);

  const selectedAccount = useMemo(
    () =>
      availableAccounts.find((account) => account.id === form.accountId) ?? availableAccounts[0],
    [availableAccounts, form.accountId],
  );

  const orderedMedia = useMemo(
    () => [...mediaItems].sort((a, b) => a.sortOrder - b.sortOrder),
    [mediaItems],
  );

  function updateForm<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function handleFilesSelected(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);

    if (files.length === 0) {
      return;
    }

    const newItems: UploadedMedia[] = files.map((file, index) => ({
      id: createMediaId(),
      file,
      previewUrl: URL.createObjectURL(file),
      sortOrder: mediaItems.length + index,
      mediaType: file.type.startsWith("video/") ? "video" : "image",
    }));

    setMediaItems((current) => [...current, ...newItems]);
    event.target.value = "";
  }

  function removeMedia(id: string) {
    setMediaItems((current) => {
      const removed = current.find((item) => item.id === id);
      if (removed) {
        URL.revokeObjectURL(removed.previewUrl);
      }

      return current
        .filter((item) => item.id !== id)
        .map((item, index) => ({ ...item, sortOrder: index }));
    });
  }

  function moveMedia(sourceId: string, targetId: string) {
    setMediaItems((current) => {
      const sorted = [...current].sort((a, b) => a.sortOrder - b.sortOrder);
      const sourceIndex = sorted.findIndex((item) => item.id === sourceId);
      const targetIndex = sorted.findIndex((item) => item.id === targetId);

      if (sourceIndex === -1 || targetIndex === -1 || sourceIndex === targetIndex) {
        return current;
      }

      const [source] = sorted.splice(sourceIndex, 1);
      sorted.splice(targetIndex, 0, source);

      return sorted.map((item, index) => ({ ...item, sortOrder: index }));
    });
  }

  function handleDrop(event: DragEvent<HTMLDivElement>, targetId: string) {
    event.preventDefault();

    if (draggedId) {
      moveMedia(draggedId, targetId);
      setDraggedId(null);
    }
  }

  async function handlePublishNow() {
    if (!selectedAccount) {
      setSubmitState("Önce Ayarlar bölümünden bir Instagram hesabı ekleyin");
      window.setTimeout(() => setSubmitState(null), 2600);
      return;
    }

    setIsPublishing(true);
    setPublishResult(null);

    const draft = saveDraft({
      title: form.title,
      account: selectedAccount,
      postType: form.postType,
      caption: form.caption,
      hashtags: form.hashtags,
      firstComment: form.firstComment,
      publishDate: form.publishDate,
      publishTime: form.publishTime,
      timezone: form.timezone,
      status: "scheduled",
      mediaItems: orderedMedia,
    });

    const result = await simulateDraftPublishing(draft.id);
    setPublishResult(result);
    setSubmitState(
      result?.status === "published"
        ? `Hemen paylaşım simüle edildi: ${draft.title}`
        : `Simülasyon başarısız oldu: ${draft.title}`,
    );
    window.setTimeout(() => setSubmitState(null), 2600);
    setIsPublishing(false);
  }

  function handleAction(status: "draft" | "pending_approval" | "scheduled") {
    if (!selectedAccount) {
      setSubmitState("Önce Ayarlar bölümünden bir Instagram hesabı ekleyin");
      window.setTimeout(() => setSubmitState(null), 2600);
      return;
    }

    const draft = saveDraft({
      title: form.title,
      account: selectedAccount,
      postType: form.postType,
      caption: form.caption,
      hashtags: form.hashtags,
      firstComment: form.firstComment,
      publishDate: form.publishDate,
      publishTime: form.publishTime,
      timezone: form.timezone,
      status,
      mediaItems: orderedMedia,
    });

    const message =
      status === "draft"
        ? "Taslak kaydedildi"
        : status === "pending_approval"
          ? "Gönderi onay bekleyenlere kaydedildi"
          : "Gönderi programlandı";

    setSubmitState(`${message}: ${draft.title}`);
    window.setTimeout(() => setSubmitState(null), 2200);
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
      <form className="space-y-6 rounded-lg border border-slate-200 bg-white p-5 shadow-panel">
        <section className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Sistem içi başlık</span>
            <input
              className="focus-ring mt-1 w-full rounded-md border-slate-200"
              value={form.title}
              onChange={(event) => updateForm("title", event.target.value)}
              placeholder="Örn. Haziran kampanya postu"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Marka / Instagram hesabı</span>
            <select
              className="focus-ring mt-1 w-full rounded-md border-slate-200"
              value={form.accountId}
              onChange={(event) => updateForm("accountId", event.target.value)}
            >
              {availableAccounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.brand} · {account.handle}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Gönderi türü</span>
            <select
              className="focus-ring mt-1 w-full rounded-md border-slate-200"
              value={form.postType}
              onChange={(event) => updateForm("postType", event.target.value as PostType)}
            >
              <option value="single_image">Tek görsel</option>
              <option value="carousel">Kaydırmalı carousel</option>
              <option value="video">Video</option>
              <option value="reels">Reels</option>
            </select>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Yayın tarihi</span>
              <input
                type="date"
                className="focus-ring mt-1 w-full rounded-md border-slate-200"
                value={form.publishDate}
                onChange={(event) => updateForm("publishDate", event.target.value)}
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Yayın saati</span>
              <input
                type="time"
                className="focus-ring mt-1 w-full rounded-md border-slate-200"
                value={form.publishTime}
                onChange={(event) => updateForm("publishTime", event.target.value)}
              />
            </label>
          </div>
        </section>

        <section>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-950">Medya yükleme</h2>
              <p className="text-sm text-slate-500">
                Birden fazla görsel seçin; kartları sürükleyerek sıralayın.
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handleFilesSelected}
            />
            <button
              type="button"
              className="focus-ring inline-flex items-center justify-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
              onClick={() => fileInputRef.current?.click()}
            >
              <ImagePlus className="h-4 w-4" aria-hidden="true" />
              Görsel ekle
            </button>
          </div>

          {orderedMedia.length === 0 ? (
            <button
              type="button"
              className="focus-ring mt-4 flex min-h-48 w-full flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 text-center hover:border-brand-300 hover:bg-brand-50"
              onClick={() => fileInputRef.current?.click()}
            >
              <ImagePlus className="h-9 w-9 text-slate-400" aria-hidden="true" />
              <span className="mt-3 text-sm font-medium text-slate-800">
                Çoklu görsel yüklemek için tıklayın
              </span>
              <span className="mt-1 text-sm text-slate-500">
                Ön izleme ve sıralama tarayıcı içinde yapılır.
              </span>
            </button>
          ) : (
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {orderedMedia.map((item, index) => (
                <div
                  key={item.id}
                  draggable
                  onDragStart={() => setDraggedId(item.id)}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={(event) => handleDrop(event, item.id)}
                  onDragEnd={() => setDraggedId(null)}
                  className={cn(
                    "group overflow-hidden rounded-lg border bg-white shadow-panel transition",
                    draggedId === item.id ? "border-brand-500 opacity-60" : "border-slate-200",
                  )}
                >
                  <div
                    className="aspect-square bg-cover bg-center"
                    style={{ backgroundImage: `url(${item.previewUrl})` }}
                    aria-label={`${index + 1}. medya ön izlemesi`}
                    role="img"
                  />
                  <div className="flex items-center gap-2 px-3 py-2">
                    <GripVertical className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-slate-800">
                        {index + 1}. {item.file.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {(item.file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <button
                      type="button"
                      className="focus-ring rounded-md p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                      onClick={() => removeMedia(item.id)}
                      aria-label={`${item.file.name} medyasını sil`}
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="grid gap-4">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Caption</span>
            <textarea
              className="focus-ring mt-1 min-h-32 w-full rounded-md border-slate-200"
              value={form.caption}
              onChange={(event) => updateForm("caption", event.target.value)}
              placeholder="Instagram açıklamasını buraya yazın."
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Hashtag</span>
            <input
              className="focus-ring mt-1 w-full rounded-md border-slate-200"
              value={form.hashtags}
              onChange={(event) => updateForm("hashtags", event.target.value)}
              placeholder="#marka #kampanya"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">İlk yorum</span>
            <textarea
              className="focus-ring mt-1 min-h-24 w-full rounded-md border-slate-200"
              value={form.firstComment}
              onChange={(event) => updateForm("firstComment", event.target.value)}
              placeholder="İlk yorumu buraya yazın."
            />
          </label>
          <label className="block max-w-xs">
            <span className="text-sm font-medium text-slate-700">Saat dilimi</span>
            <select
              className="focus-ring mt-1 w-full rounded-md border-slate-200"
              value={form.timezone}
              onChange={(event) => updateForm("timezone", event.target.value)}
            >
              <option>Europe/Istanbul</option>
              <option>UTC</option>
              <option>Europe/London</option>
              <option>Europe/Berlin</option>
              <option>America/New_York</option>
            </select>
          </label>
        </section>

        <div className="flex flex-wrap gap-3 border-t border-slate-200 pt-5">
          <button
            type="button"
            className="focus-ring rounded-md border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            onClick={() => handleAction("draft")}
          >
            Taslak kaydet
          </button>
          <button
            type="button"
            className="focus-ring inline-flex items-center gap-2 rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
            onClick={() => handleAction("pending_approval")}
          >
            <Send className="h-4 w-4" aria-hidden="true" />
            Onaya gönder
          </button>
          <button
            type="button"
            className="focus-ring inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
            onClick={() => handleAction("scheduled")}
          >
            <CalendarClock className="h-4 w-4" aria-hidden="true" />
            Direkt programla
          </button>
          {submitState && (
            <span className="self-center rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
              {submitState}
            </span>
          )}
        </div>
      </form>

      <aside className="space-y-4">
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-panel">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-base font-semibold text-slate-950">Instagram ön izlemesi</h2>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
              {orderedMedia.length || 0} medya
            </span>
          </div>
          <div className="mt-4 overflow-hidden rounded-lg border border-slate-200 bg-white">
            <div className="flex items-center gap-3 border-b border-slate-200 px-3 py-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
                {selectedAccount?.avatarFallback ?? "IG"}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-950">{selectedAccount?.handle}</p>
                <p className="text-xs text-slate-500">{selectedAccount?.brand}</p>
              </div>
            </div>
            <div
              className={cn(
                "flex aspect-square items-center justify-center bg-slate-100 bg-cover bg-center",
                orderedMedia.length === 0 && "p-6 text-center text-sm text-slate-500",
              )}
              style={
                orderedMedia[0]
                  ? { backgroundImage: `url(${orderedMedia[0].previewUrl})` }
                  : undefined
              }
            >
              {orderedMedia.length === 0 && "Ön izleme için en az bir görsel ekleyin."}
            </div>
            <div className="space-y-2 p-3">
              <p className="text-sm text-slate-900">
                <span className="font-semibold">{selectedAccount?.handle}</span>{" "}
                {form.caption || "Caption yazıldığında burada görünecek."}
              </p>
              <p className="text-sm text-brand-700">{form.hashtags || "#hashtag"}</p>
              <p className="text-xs text-slate-500">
                {form.publishDate || "Tarih seçilmedi"} · {form.publishTime || "Saat seçilmedi"} ·{" "}
                {form.timezone}
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-panel">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-brand-600" aria-hidden="true" />
            <h2 className="text-base font-semibold text-slate-950">Direkt paylaşım simülasyonu</h2>
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Bu buton gönderiyi kaydeder, yayın simülasyonunu hemen çalıştırır ve sonucu Yayın geçmişi ekranına düşürür.
          </p>
          <button
            type="button"
            className="focus-ring mt-4 inline-flex w-full items-center justify-center gap-2 rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-70"
            onClick={handlePublishNow}
            disabled={isPublishing}
          >
            {isPublishing ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <Sparkles className="h-4 w-4" aria-hidden="true" />
            )}
            Hemen paylaş / simüle et
          </button>

          {publishResult && (
            <div
              className={cn(
                "mt-4 rounded-md border p-3 text-sm",
                publishResult.status === "published"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                  : "border-rose-200 bg-rose-50 text-rose-800",
              )}
            >
              <p className="font-semibold">
                {publishResult.status === "published" ? "Yayımlandı" : "Başarısız"}
              </p>
              {publishResult.externalPostUrl && (
                <p className="mt-1 break-all">{publishResult.externalPostUrl}</p>
              )}
              {publishResult.failureReason && <p className="mt-1">{publishResult.failureReason}</p>}
              <p className="mt-2 text-xs opacity-80">{publishResult.activityLogMessage}</p>
            </div>
          )}
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-panel">
          <div className="flex items-center gap-2">
            <MessageSquareText className="h-5 w-5 text-slate-500" aria-hidden="true" />
            <h2 className="text-base font-semibold text-slate-950">İlk yorum</h2>
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            {form.firstComment || "İlk yorum yazıldığında burada görünecek."}
          </p>
        </section>
      </aside>
    </div>
  );
}
