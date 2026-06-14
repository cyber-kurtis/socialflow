import { RealDetailsForm } from "@/components/settings/real-details-form";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-brand-600">Kurulum</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
          Gerçek bilgileri gir
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-slate-600">
          Firma, kullanıcı ve Instagram hesap bilgilerini buradan kaydedin. Bu bilgiler şimdilik
          tarayıcıda saklanır; Supabase bağlantısı geldiğinde aynı alanlar veritabanına taşınır.
        </p>
      </div>
      <RealDetailsForm />
    </div>
  );
}
