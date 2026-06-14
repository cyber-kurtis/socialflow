"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  Camera,
  CheckSquare,
  ChevronLeft,
  Clock,
  FileText,
  History,
  Home,
  PlusCircle,
  Settings,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";
import { cn } from "@/lib/ui";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/calendar", label: "İçerik takvimi", icon: CalendarDays },
  { href: "/posts/new", label: "Yeni gönderi", icon: PlusCircle },
  { href: "/drafts", label: "Taslaklar", icon: FileText },
  { href: "/approvals", label: "Onay bekleyenler", icon: CheckSquare },
  { href: "/scheduled", label: "Programlanmış", icon: Clock },
  { href: "/history", label: "Yayın geçmişi", icon: History },
  { href: "/accounts", label: "Instagram hesapları", icon: Camera },
  { href: "/users", label: "Kullanıcılar", icon: Users },
  { href: "/settings", label: "Ayarlar", icon: Settings },
];

type SidebarProps = {
  collapsed: boolean;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  onToggleCollapsed: () => void;
};

export function Sidebar({
  collapsed,
  mobileOpen,
  onCloseMobile,
  onToggleCollapsed,
}: SidebarProps) {
  const pathname = usePathname();

  const sidebarContent = (
    <div className="flex h-full flex-col border-r border-slate-200 bg-white">
      <div className="flex h-16 items-center justify-between px-4">
        <Link href="/dashboard" className="flex items-center gap-3" onClick={onCloseMobile}>
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-brand-600 text-sm font-semibold text-white">
            SF
          </div>
          {!collapsed && (
            <div>
              <p className="font-semibold leading-5 text-slate-950">SocialFlow</p>
              <p className="text-xs text-slate-500">Yönetim paneli</p>
            </div>
          )}
        </Link>
        <button
          type="button"
          className="focus-ring rounded-md p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
          onClick={onCloseMobile}
          aria-label="Menüyü kapat"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const active =
            pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onCloseMobile}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition",
                active
                  ? "bg-brand-50 text-brand-700"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-950",
                collapsed && "justify-center px-2",
              )}
              title={collapsed ? item.label : undefined}
            >
              <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-slate-200 p-3">
        {!collapsed && (
          <div className="mb-3 rounded-md bg-slate-50 p-3">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-900">
              <ShieldCheck className="h-4 w-4 text-emerald-600" aria-hidden="true" />
              Simülasyon modu
            </div>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              Gerçek Instagram veya Meta API bağlantısı kapalı.
            </p>
          </div>
        )}
        <button
          type="button"
          className="focus-ring hidden w-full items-center justify-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 lg:flex"
          onClick={onToggleCollapsed}
        >
          <ChevronLeft
            className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")}
            aria-hidden="true"
          />
          {!collapsed && <span>Menüyü daralt</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 hidden transition-all duration-200 lg:block",
          collapsed ? "w-20" : "w-72",
        )}
      >
        {sidebarContent}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-slate-950/30"
            onClick={onCloseMobile}
            aria-label="Menü arka planını kapat"
          />
          <aside className="relative h-full w-72 max-w-[86vw]">{sidebarContent}</aside>
        </div>
      )}
    </>
  );
}
