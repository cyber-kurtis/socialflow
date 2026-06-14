import { SavedPostsList } from "@/components/posts/saved-posts-list";

export default function ApprovalsPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-brand-600">Onay akışı</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
          Onay bekleyen içerikler
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-slate-600">
          Onaya gönderilen içerikleri inceleyin, onaylayın, revizyon isteyin, programlayın veya
          reddedin.
        </p>
      </div>
      <SavedPostsList
        statuses={["pending_approval", "approved"]}
        emptyTitle="Onay bekleyen içerik yok"
        emptyDescription="Yeni gönderi ekranında Onaya gönder dediğiniz içerikler burada görünür."
      />
    </div>
  );
}
