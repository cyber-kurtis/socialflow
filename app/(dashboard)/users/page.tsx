import { Users } from "lucide-react";
import { PlaceholderPage } from "@/components/common/placeholder-page";

export default function UsersPage() {
  return (
    <PlaceholderPage
      icon={Users}
      eyebrow="Yetkilendirme"
      title="Kullanıcılar ve yetkiler"
      description="Admin, içerik editörü, onay yetkilisi ve görüntüleyici rolleri için yönetim alanı."
      items={["Admin", "İçerik editörü", "Onay yetkilisi", "Görüntüleyici"]}
    />
  );
}
