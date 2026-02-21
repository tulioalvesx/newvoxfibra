"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button } from "../ui/Button";

const nav = [
  { href: "/", label: "Home" },
  { href: "/planos", label: "Planos" },
  { href: "/cobertura", label: "Cobertura" },
  { href: "/beneficios", label: "Rede & Mesh" },
  { href: "/central", label: "Central" },
  { href: "/contato", label: "Contato" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0b0f17]/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/brand/newvox-logo.png" alt="NEWVOX Fibra" width={150} height={40} priority />
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className="text-sm font-semibold text-white/80 hover:text-white">
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex">
          <Link href="/planos">
            <Button>Ver planos</Button>
          </Link>
        </div>

        <button
          className="md:hidden rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-white/85"
          onClick={() => setOpen(!open)}
          aria-label="Abrir menu"
        >
          Menu
        </button>
      </div>

      {open ? (
        <div className="md:hidden border-t border-white/10 bg-[#0b0f17]/95">
          <div className="mx-auto max-w-6xl px-4 py-4 grid gap-2">
            {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white/85"
                onClick={() => setOpen(false)}
              >
                {n.label}
              </Link>
            ))}
            <Link href="/planos" onClick={() => setOpen(false)}>
              <Button className="w-full">Ver planos</Button>
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
