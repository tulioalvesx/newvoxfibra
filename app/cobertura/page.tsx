import Link from "next/link";
import { Button } from "../../components/ui/Button";

export default function Cobertura() {
  return (
    <div>
      <h1 className="text-3xl font-extrabold">Cobertura</h1>
      <p className="mt-3 text-white/65">
        Consulte a disponibilidade por cidade. Se ainda não atendermos sua região, você pode entrar na lista de interesse.
      </p>

      <div className="mt-8 rounded-[26px] border border-white/10 bg-white/5 p-8">
        <div className="text-lg font-extrabold">Começar pela consulta</div>
        <p className="mt-2 text-sm text-white/60">
          A consulta usa a base do IBGE (todas as cidades do Brasil) e libera planos apenas onde há cobertura ativa no painel.
        </p>
        <div className="mt-6">
          <Link href="/planos">
            <Button>Consultar minha cidade</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
