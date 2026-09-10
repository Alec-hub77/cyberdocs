"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "@/context/AppContext";
import ProgressBar from "@/components/ui/ProgressBar";
import LogoutButton from "@/components/forms/LogoutButton";
import {
  Terminal,
  FileText,
  Wrench,
  SquareTerminal,
  Map,
  Bookmark,
  StickyNote,
  Plus,
  X,
  LogIn,
} from "lucide-react";

const NAV = [
  { href: "/", label: "dashboard", icon: Terminal, exact: true },
  { href: "/roadmap", label: "roadmap", icon: Map },
  { href: "/articles", label: "articles", icon: FileText },
  { href: "/tools", label: "tools", icon: Wrench },
  { href: "/commands", label: "commands", icon: SquareTerminal },
  { href: "/notes", label: "notes", icon: StickyNote },
  { href: "/saved", label: "saved", icon: Bookmark },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { percentDone, user } = useApp();

  return (
    <>
      {open && <div className="fixed inset-0 z-30 bg-void/70 backdrop-blur-sm lg:hidden" onClick={onClose} />}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-line bg-surface transition-transform lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-line px-4 py-4">
          <Link href="/" className="group flex items-center gap-2" onClick={onClose}>
            <span className="border border-term-600 px-1.5 py-0.5 text-term-400 group-hover:bg-term-900/40">
              &gt;_
            </span>
            <span className="text-sm font-bold tracking-tight text-ink">cyberdocs</span>
          </Link>
          <button onClick={onClose} className="text-muted lg:hidden">
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-2 py-4">
          <p className="px-2 pb-2 text-[10px] text-muted">/home/user/</p>
          <ul className="space-y-0.5">
            {NAV.map((item) => {
              const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className={`flex items-center gap-2.5 border-l-2 px-2.5 py-2 text-sm transition-colors ${
                      active
                        ? "border-term-500 bg-raised text-term-300"
                        : "border-transparent text-muted hover:border-line2 hover:text-ink"
                    }`}
                  >
                    <Icon size={15} />
                    <span>./{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-line px-4 py-4">
          <Link
            href="/new"
            onClick={onClose}
            className="mb-4 flex items-center justify-center gap-2 border border-term-600 bg-term-900/30 py-2 text-xs text-term-300 transition-colors hover:bg-term-900/50"
          >
            <Plus size={14} /> додати матеріал
          </Link>
          <ProgressBar percent={percentDone} label="прогрес roadmap" />
          <p className="mb-4 mt-3 text-[10px] leading-relaxed text-muted">
            Прогрес зберігається локально у вашому браузері. Нічого не надсилається на сервер.
          </p>

          <div className="border-t border-line pt-3">
            {user ? (
              <div className="space-y-2">
                <p className="truncate text-[11px] text-muted" title={user.email}>
                  {user.email}
                </p>
                <LogoutButton />
              </div>
            ) : (
              <Link
                href="/login"
                onClick={onClose}
                className="flex items-center justify-center gap-2 border border-line px-2.5 py-2 text-xs text-muted transition-colors hover:border-term-600 hover:text-term-300"
              >
                <LogIn size={13} /> увійти для заміток/tools
              </Link>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
