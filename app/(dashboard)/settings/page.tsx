import { Settings } from "lucide-react";
import { PlaceholderPage } from "@/components/common/placeholder-page";

export default function SettingsPage() {
  return (
    <PlaceholderPage
      icon={Settings}
      eyebrow="Uygulama"
      title="Ayarlar"
      description="Organizasyon, varsayılan saat dilimi ve simülasyon modu ayarları için başlangıç ekranı."
      items={["Europe/Istanbul", "Simülasyon modu", "Tema mimarisi", "Netlify uyumu"]}
    />
  );
}
