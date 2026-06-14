import { NewPostForm } from "@/components/posts/new-post-form";
import { mockSocialAccounts } from "@/lib/mock-data";

export default function NewPostPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-brand-600">İçerik hazırlama</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
          Yeni gönderi oluştur
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-slate-600">
          Medyaları yükleyin, sıralayın, Instagram ön izlemesini kontrol edin ve gerçek paylaşım
          bilgilerini hazırlayın.
        </p>
      </div>
      <NewPostForm accounts={mockSocialAccounts} />
    </div>
  );
}
