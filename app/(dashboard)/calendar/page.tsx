import { CalendarDays } from "lucide-react";
import { PlaceholderPage } from "@/components/common/placeholder-page";

export default function CalendarPage() {
  return (
    <PlaceholderPage
      icon={CalendarDays}
      eyebrow="İçerik planlama"
      title="İçerik takvimi"
      description="Aylık, haftalık ve günlük takvim görünümleri için demo başlangıç ekranı."
      items={["Aylık görünüm", "Haftalık görünüm", "Durum rozetleri", "Detay paneli"]}
    />
  );
}
