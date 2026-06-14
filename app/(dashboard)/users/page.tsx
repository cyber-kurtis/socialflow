import { TeamMembersManager } from "@/components/users/team-members-manager";

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-brand-600">Yetkilendirme</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
          Kullanıcılar ve yetkiler
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-slate-600">
          İçerik hazırlayan, onaylayan ve sadece görüntüleyen ekip üyelerini buradan yönetin.
        </p>
      </div>
      <TeamMembersManager />
    </div>
  );
}
