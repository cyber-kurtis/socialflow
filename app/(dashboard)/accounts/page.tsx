import { Camera } from "lucide-react";
import { PlaceholderPage } from "@/components/common/placeholder-page";

export default function AccountsPage() {
  return (
    <PlaceholderPage
      icon={Camera}
      eyebrow="Hesap yönetimi"
      title="Instagram hesapları"
      description="İlk fazda gerçek Meta bağlantısı yoktur; hesaplar mock veri olarak kullanılır."
      items={["@socialflow_tr", "@studionova", "@mavikutu", "Bağlantı kapalı"]}
    />
  );
}
