import { DraftsList } from "@/components/drafts/drafts-list";

export default function DraftsPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-brand-600">İçerik havuzu</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
          Taslaklar ve kayıtlı gönderiler
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-slate-600">
          Hazırladığınız gerçek gönderi bilgileri burada saklanır. Supabase bağlantısı gelene kadar
          kayıtlar bu tarayıcıda tutulur.
        </p>
      </div>
      <DraftsList />
    </div>
  );
}
