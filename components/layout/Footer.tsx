import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-white/10 mt-16">
      <div className="mx-auto max-w-6xl px-4 py-10 grid gap-6 md:grid-cols-3">
        <div>
          <div className="text-lg font-extrabold bg-gradient-to-r from-newvox-200 via-newvox-500 to-newvox-600 bg-clip-text text-transparent">
            NEWVOX Fibra
          </div>
          <div className="mt-2 text-sm text-white/60">
            Internet premium com foco em estabilidade, baixa latência e experiência superior.
          </div>
        </div>

        <div className="text-sm">
          <div className="font-semibold text-white/85">Links</div>
          <div className="mt-3 grid gap-2 text-white/70">
            <Link href="/planos" className="hover:text-white">Planos</Link>
            <Link href="/cobertura" className="hover:text-white">Cobertura</Link>
            <Link href="/central" className="hover:text-white">Central do assinante</Link>
            <Link href="/contato" className="hover:text-white">Contato</Link>
          </div>
        </div>

        <div className="text-sm">
          <div className="font-semibold text-white/85">Legal</div>
          <div className="mt-3 grid gap-2 text-white/70">
            <Link href="/legal/termos" className="hover:text-white">Termos</Link>
            <Link href="/legal/privacidade" className="hover:text-white">Privacidade</Link>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-6 text-center text-xs text-white/50">
        © {new Date().getFullYear()} NEWVOX Fibra. Todos os direitos reservados.
      </div>
    </footer>
  );
}
