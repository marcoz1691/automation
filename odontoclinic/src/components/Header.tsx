"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./Logo";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Inicio" },
  { href: "/reservar", label: "Agendar cita" },
  { href: "/mis-citas", label: "Mis citas" },
  { href: "/recepcion", label: "Recepción" },
  { href: "/admin", label: "Admin" },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
        <Logo />
        <nav className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                pathname === link.href
                  ? "bg-primary text-white"
                  : "text-secondary hover:bg-gray-100 hover:text-primary"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/login"
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-primary hover:bg-gray-50"
        >
          Staff
        </Link>
      </div>
    </header>
  );
}
