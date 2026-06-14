import { Clock } from "lucide-react";
import { PlaceholderPage } from "@/components/common/placeholder-page";

export default function ScheduledPage() {
  return (
    <PlaceholderPage
      icon={Clock}
      eyebrow="Yayın planı"
      title="Programlanmış içerikler"
      description="Onaylanmış ve yayın tarihi atanmış gönderilerin takip ekranı."
      items={["Planlı yayınlar", "Saat dilimi", "Mock yayınlama", "İptal akışı"]}
    />
  );
}
