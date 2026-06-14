import type {
  ActivityLog,
  DemoPost,
  SocialAccount,
  StatusDistributionItem,
} from "@/lib/types";

export const mockSocialAccounts: SocialAccount[] = [
  {
    id: "acc-socialflow",
    name: "SocialFlow Türkiye",
    handle: "@socialflow_tr",
    brand: "SocialFlow",
    avatarFallback: "SF",
  },
  {
    id: "acc-studio",
    name: "Studio Nova",
    handle: "@studionova",
    brand: "Studio Nova",
    avatarFallback: "SN",
  },
  {
    id: "acc-retail",
    name: "Mavi Kutu",
    handle: "@mavikutu",
    brand: "Mavi Kutu",
    avatarFallback: "MK",
  },
];

export const dashboardStats = {
  scheduledThisWeek: 12,
  pendingApproval: 5,
  failedPosts: 1,
  publishedThisMonth: 38,
};

export const upcomingPosts: DemoPost[] = [
  {
    id: "post-001",
    title: "Haziran ürün vitrini",
    account: mockSocialAccounts[2],
    status: "scheduled",
    postType: "carousel",
    scheduledAt: "17 Haziran 2026, 10:00",
    caption: "Yeni sezon seçkisi yayında. Favorinizi yorumlara bırakın.",
    mediaPreview: "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 45%, #f8fafc 100%)",
  },
  {
    id: "post-002",
    title: "Ekip arkası kısa video",
    account: mockSocialAccounts[1],
    status: "pending_approval",
    postType: "reels",
    scheduledAt: "18 Haziran 2026, 19:30",
    caption: "Stüdyoda bu hafta: çekim hazırlıkları ve küçük detaylar.",
    mediaPreview: "linear-gradient(135deg, #fce7f3 0%, #fbcfe8 45%, #fff7ed 100%)",
  },
  {
    id: "post-003",
    title: "Müşteri yorumu paylaşımı",
    account: mockSocialAccounts[0],
    status: "approved",
    postType: "single_image",
    scheduledAt: "19 Haziran 2026, 12:15",
    caption: "Planlama ekipleri için daha düzenli bir onay akışı.",
    mediaPreview: "linear-gradient(135deg, #dcfce7 0%, #bbf7d0 45%, #f0fdf4 100%)",
  },
  {
    id: "post-004",
    title: "Hafta sonu kampanyası",
    account: mockSocialAccounts[2],
    status: "draft",
    postType: "carousel",
    scheduledAt: "20 Haziran 2026, 09:00",
    caption: "Hafta sonuna özel öneriler ve avantajlı setler.",
    mediaPreview: "linear-gradient(135deg, #ede9fe 0%, #ddd6fe 45%, #faf5ff 100%)",
  },
  {
    id: "post-005",
    title: "Aylık rapor özeti",
    account: mockSocialAccounts[0],
    status: "scheduled",
    postType: "single_image",
    scheduledAt: "22 Haziran 2026, 14:00",
    caption: "Haziran performansından öne çıkan başlıklar.",
    mediaPreview: "linear-gradient(135deg, #e0f2fe 0%, #bae6fd 45%, #f8fafc 100%)",
  },
];

export const statusDistribution: StatusDistributionItem[] = [
  {
    status: "draft",
    label: "Taslak",
    count: 8,
    colorClass: "bg-slate-500",
  },
  {
    status: "pending_approval",
    label: "Onay bekleyen",
    count: 5,
    colorClass: "bg-amber-500",
  },
  {
    status: "scheduled",
    label: "Programlı",
    count: 12,
    colorClass: "bg-brand-500",
  },
  {
    status: "published",
    label: "Yayımlandı",
    count: 38,
    colorClass: "bg-emerald-500",
  },
  {
    status: "failed",
    label: "Başarısız",
    count: 1,
    colorClass: "bg-rose-500",
  },
];

export const recentActivities: ActivityLog[] = [
  {
    id: "activity-001",
    title: "Haziran ürün vitrini programlandı",
    description: "Mavi Kutu hesabı için 17 Haziran 10:00 yayını oluşturuldu.",
    time: "09:42",
  },
  {
    id: "activity-002",
    title: "Ekip arkası kısa video onaya gönderildi",
    description: "Studio Nova hesabında onay yetkilisi bekleniyor.",
    time: "08:18",
  },
  {
    id: "activity-003",
    title: "Mock yayınlama tamamlandı",
    description: "SocialFlow Türkiye için sahte external_post_url üretildi.",
    time: "Dün",
  },
];

export const statusLabels: Record<StatusDistributionItem["status"], string> = {
  draft: "Taslak",
  pending_approval: "Onay bekliyor",
  revision_requested: "Revizyon istendi",
  approved: "Onaylandı",
  scheduled: "Programlandı",
  publishing: "Yayımlanıyor",
  published: "Yayımlandı",
  failed: "Başarısız",
  rejected: "Reddedildi",
  cancelled: "İptal edildi",
};
