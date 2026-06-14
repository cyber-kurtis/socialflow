import { SavedPostsList } from "@/components/posts/saved-posts-list";

export default function ScheduledPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-brand-600">Yayın planı</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
          Programlanmış içerikler
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-slate-600">
          Programlanan gönderileri yayın tarihi, saat ve hesap bilgisiyle takip edin. Hazır olan
          gönderilerde test amaçlı yayın simülasyonu çalıştırabilirsiniz.
        </p>
      </div>
      <SavedPostsList
        statuses={["scheduled", "publishing", "failed"]}
        emptyTitle="Programlanmış içerik yok"
        emptyDescription="Yeni gönderi ekranında Programla dediğiniz veya onay ekranından programladığınız içerikler burada görünür."
      />
    </div>
  );
}
