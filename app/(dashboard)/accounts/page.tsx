import { AccountsSummary } from "@/components/accounts/accounts-summary";

export default function AccountsPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-brand-600">Hesap yönetimi</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
          Instagram hesapları
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-slate-600">
          İçerik hazırlarken kullanacağınız gerçek marka ve Instagram hesaplarını buradan takip
          edin.
        </p>
      </div>
      <AccountsSummary />
    </div>
  );
}
