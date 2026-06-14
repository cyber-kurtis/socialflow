import { FileText } from "lucide-react";
import { PlaceholderPage } from "@/components/common/placeholder-page";

export default function DraftsPage() {
  return (
    <PlaceholderPage
      icon={FileText}
      eyebrow="İçerik havuzu"
      title="Taslaklar"
      description="Hazırlanıp henüz onaya gönderilmemiş içerikler burada listelenecek."
      items={["Taslak kaydetme", "Düzenleme", "Medya sırası", "Onaya gönderme"]}
    />
  );
}
