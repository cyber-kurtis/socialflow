"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { MailPlus, ShieldCheck, Trash2, UserRoundCheck } from "lucide-react";
import {
  deleteTeamMember,
  getMemberInitials,
  readTeamMembers,
  saveTeamMember,
  updateTeamMember,
} from "@/lib/team-members";
import type { TeamMember, TeamMemberStatus, UserRole } from "@/lib/types";
import { cn } from "@/lib/ui";

const roleLabels: Record<UserRole, string> = {
  admin: "Admin",
  editor: "İçerik editörü",
  approver: "Onay yetkilisi",
  viewer: "Görüntüleyici",
};

const roleDescriptions: Record<UserRole, string> = {
  admin: "Tüm ayarlar, hesaplar, kullanıcılar ve içerik akışı.",
  editor: "Gönderi oluşturma, taslak düzenleme ve onaya gönderme.",
  approver: "İçerik onaylama, revizyon isteme ve reddetme.",
  viewer: "Sadece dashboard, takvim ve yayın geçmişi görüntüleme.",
};

const statusLabels: Record<TeamMemberStatus, string> = {
  active: "Aktif",
  invited: "Davet edildi",
  disabled: "Pasif",
};

const statusClasses: Record<TeamMemberStatus, string> = {
  active: "bg-emerald-50 text-emerald-700",
  invited: "bg-amber-50 text-amber-700",
  disabled: "bg-slate-100 text-slate-500",
};

type FormState = {
  name: string;
  email: string;
  role: UserRole;
};

const initialForm: FormState = {
  name: "",
  email: "",
  role: "editor",
};

export function TeamMembersManager() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [form, setForm] = useState<FormState>(initialForm);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    function refresh() {
      setMembers(readTeamMembers());
    }

    refresh();
    window.addEventListener("socialflow:team-updated", refresh);
    window.addEventListener("storage", refresh);

    return () => {
      window.removeEventListener("socialflow:team-updated", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  const counts = useMemo(() => {
    return {
      total: members.length,
      active: members.filter((member) => member.status === "active").length,
      approvers: members.filter((member) => member.role === "approver").length,
      admins: members.filter((member) => member.role === "admin").length,
    };
  }, [members]);

  function refresh() {
    setMembers(readTeamMembers());
  }

  function showMessage(value: string) {
    setMessage(value);
    window.setTimeout(() => setMessage(null), 2400);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.email.trim()) {
      showMessage("E-posta alanı zorunlu.");
      return;
    }

    saveTeamMember(form);
    setForm(initialForm);
    refresh();
    showMessage("Kullanıcı davet listesine eklendi.");
  }

  function handleRole(id: string, role: UserRole) {
    updateTeamMember(id, { role });
    refresh();
  }

  function handleStatus(id: string, status: TeamMemberStatus) {
    updateTeamMember(id, { status });
    refresh();
  }

  function handleDelete(id: string) {
    deleteTeamMember(id);
    refresh();
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-4">
        <SummaryCard label="Toplam kullanıcı" value={counts.total} />
        <SummaryCard label="Aktif kullanıcı" value={counts.active} />
        <SummaryCard label="Onay yetkilisi" value={counts.approvers} />
        <SummaryCard label="Admin" value={counts.admins} />
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-panel">
        <div className="flex items-center gap-2">
          <MailPlus className="h-5 w-5 text-brand-600" aria-hidden="true" />
          <h2 className="text-base font-semibold text-slate-950">Yeni kullanıcı ekle</h2>
        </div>
        <p className="mt-1 text-sm text-slate-500">
          Bu aşamada gerçek e-posta gönderilmez; kullanıcı Supabase Auth bağlandığında davet
          sistemine taşınacak şekilde kayda alınır.
        </p>

        <form className="mt-5 grid gap-4 md:grid-cols-[1fr_1fr_220px_auto]" onSubmit={handleSubmit}>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Ad soyad</span>
            <input
              className="focus-ring mt-1 w-full rounded-md border-slate-200"
              value={form.name}
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
              placeholder="Örn. Ayşe Demir"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">E-posta</span>
            <input
              type="email"
              className="focus-ring mt-1 w-full rounded-md border-slate-200"
              value={form.email}
              onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
              placeholder="kullanici@firma.com"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Rol</span>
            <select
              className="focus-ring mt-1 w-full rounded-md border-slate-200"
              value={form.role}
              onChange={(event) =>
                setForm((current) => ({ ...current, role: event.target.value as UserRole }))
              }
            >
              {Object.entries(roleLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <button
            type="submit"
            className="focus-ring mt-6 inline-flex h-10 items-center justify-center rounded-md bg-brand-600 px-4 text-sm font-medium text-white hover:bg-brand-700"
          >
            Ekle
          </button>
        </form>
        {message && (
          <p className="mt-4 rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
            {message}
          </p>
        )}
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="rounded-lg border border-slate-200 bg-white shadow-panel">
          <div className="border-b border-slate-200 px-5 py-4">
            <h2 className="text-base font-semibold text-slate-950">Kullanıcı listesi</h2>
            <p className="mt-1 text-sm text-slate-500">
              Rol ve aktiflik durumunu buradan değiştirebilirsiniz.
            </p>
          </div>

          <div className="divide-y divide-slate-100">
            {members.map((member) => (
              <article key={member.id} className="grid gap-4 p-5 xl:grid-cols-[1fr_auto]">
                <div className="flex min-w-0 gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
                    {getMemberInitials(member)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-slate-950">{member.name}</h3>
                      <span
                        className={cn(
                          "rounded-full px-2.5 py-1 text-xs font-medium",
                          statusClasses[member.status],
                        )}
                      >
                        {statusLabels[member.status]}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-slate-500">{member.email}</p>
                    <p className="mt-2 text-sm text-slate-600">
                      {roleLabels[member.role]} · {roleDescriptions[member.role]}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 xl:justify-end">
                  <select
                    className="focus-ring rounded-md border-slate-200 text-sm"
                    value={member.role}
                    onChange={(event) => handleRole(member.id, event.target.value as UserRole)}
                  >
                    {Object.entries(roleLabels).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                  <select
                    className="focus-ring rounded-md border-slate-200 text-sm"
                    value={member.status}
                    onChange={(event) =>
                      handleStatus(member.id, event.target.value as TeamMemberStatus)
                    }
                  >
                    {Object.entries(statusLabels).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded-md text-slate-400 hover:bg-rose-50 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-40"
                    onClick={() => handleDelete(member.id)}
                    disabled={member.id === "owner"}
                    aria-label="Kullanıcıyı sil"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>

        <aside className="space-y-4">
          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-panel">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-600" aria-hidden="true" />
              <h2 className="text-base font-semibold text-slate-950">Rol açıklamaları</h2>
            </div>
            <div className="mt-4 space-y-3">
              {Object.entries(roleDescriptions).map(([role, description]) => (
                <div key={role} className="rounded-md bg-slate-50 p-3">
                  <p className="text-sm font-semibold text-slate-900">
                    {roleLabels[role as UserRole]}
                  </p>
                  <p className="mt-1 text-sm leading-5 text-slate-600">{description}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-panel">
            <div className="flex items-center gap-2">
              <UserRoundCheck className="h-5 w-5 text-brand-600" aria-hidden="true" />
              <h2 className="text-base font-semibold text-slate-950">Sonraki bağlantı</h2>
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Supabase Auth açıldığında bu listedeki kullanıcılar gerçek davet akışına bağlanacak.
              Şimdilik panel davranışını netleştirmek için yerel kayıtla çalışıyor.
            </p>
          </section>
        </aside>
      </section>
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-panel">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-slate-950">{value}</p>
    </div>
  );
}
