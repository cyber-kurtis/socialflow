import { History } from "lucide-react";
import { PlaceholderPage } from "@/components/common/placeholder-page";

export default function HistoryPage() {
  return (
    <PlaceholderPage
      icon={History}
      eyebrow="Raporlama"
      title="Yayın geçmişi"
      description="Yayımlanan, başarısız olan ve iptal edilen gönderilerin geçmiş kayıtları."
      items={["Yayımlandı", "Başarısız", "External URL", "Deneme kayıtları"]}
    />
  );
}
