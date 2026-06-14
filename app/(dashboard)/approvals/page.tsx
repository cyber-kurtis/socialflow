import { CheckSquare } from "lucide-react";
import { PlaceholderPage } from "@/components/common/placeholder-page";

export default function ApprovalsPage() {
  return (
    <PlaceholderPage
      icon={CheckSquare}
      eyebrow="Onay akışı"
      title="Onay bekleyen içerikler"
      description="Onay yetkililerinin inceleme, revizyon isteme veya reddetme işlemleri için temel ekran."
      items={["Onayla", "Revizyon iste", "Reddet", "Yorum ekle"]}
    />
  );
}
