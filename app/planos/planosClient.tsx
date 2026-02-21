"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { WhatsAppFloat } from "../../components/widgets/WhatsAppFloat";
import { fetchMunicipiosByUF, fetchUFs, UF, Municipio } from "../../lib/ibge";
import type { Plan } from "../../lib/strapi";

function onlyDigits(v: string) {
  return (v || "").replace(/\D/g, "");
}

function waLink(phoneE164: string, text: string) {
  const digits = onlyDigits(phoneE164);
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

async function hasCoverage(city: string, uf: string) {
  const base = process.env.NEXT_PUBLIC_STRAPI_URL;
  if (!base) {
    // Sem Strapi: por padrão, só São Sebastião do Paraíso MG
    return city.toLowerCase().includes("são sebastião do paraíso") && uf === "MG";
  }
  const url = `${base.replace(/\/$/, "")}/api/coverage-cities?filters[active][$eq]=true&filters[city][$eqi]=${encodeURIComponent(city)}&filters[uf][$eq]=${encodeURIComponent(uf)}&pagination[pageSize]=1`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) return false;
  const data = await res.json().catch(() => null) as any;
  return (data?.data?.length || 0) > 0;
}

export function PlanosClient({ plans }: { plans: Plan[] }) {
  const [ufs, setUfs] = useState<UF[]>([]);
  const [municipios, setMunicipios] = useState<Municipio[]>([]);
  const [uf, setUf] = useState("MG");
  const [city, setCity] = useState("São Sebastião do Paraíso");
  const [loadingCities, setLoadingCities] = useState(false);
  const [checking, setChecking] = useState(false);
  const [covered, setCovered] = useState<boolean | null>(null);

  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_E164 || "+5535966666666";

  useEffect(() => {
    fetchUFs().then(setUfs).catch(() => setUfs([]));
  }, []);

  useEffect(() => {
    setLoadingCities(true);
    fetchMunicipiosByUF(uf)
      .then((m) => setMunicipios(m))
      .catch(() => setMunicipios([]))
      .finally(() => setLoadingCities(false));
  }, [uf]);

  const selectedCityLabel = useMemo(() => `${city} - ${uf}`, [city, uf]);

  async function checkCoverage() {
    setChecking(true);
    const ok = await hasCoverage(city, uf);
    setCovered(ok);
    setChecking(false);
  }

  useEffect(() => { setCovered(null); }, [city, uf]);

  return (
    <div className="relative">
      <div className="flex flex-col gap-3">
        <h1 className="text-3xl font-extrabold">Planos por cidade</h1>
        <p className="text-white/60">Selecione sua cidade para consultar disponibilidade. Se não tiver cobertura, você entra na lista de interesse.</p>
      </div>

      <div className="mt-8 grid gap-4 rounded-[26px] border border-white/10 bg-white/5 p-6 md:grid-cols-3">
        <label className="block">
          <div className="mb-2 text-sm font-semibold text-white/85">UF</div>
          <select
            value={uf}
            onChange={(e) => setUf(e.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-base text-white focus:border-newvox-400/60 focus:outline-none focus:ring-2 focus:ring-newvox-400/30"
          >
            {ufs.map((u) => (
              <option key={u.id} value={u.sigla} className="bg-[#0b0f17]">{u.nome} ({u.sigla})</option>
            ))}
          </select>
        </label>

        <label className="block md:col-span-2">
          <div className="mb-2 text-sm font-semibold text-white/85">Cidade</div>
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            disabled={loadingCities}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-base text-white focus:border-newvox-400/60 focus:outline-none focus:ring-2 focus:ring-newvox-400/30 disabled:opacity-60"
          >
            {municipios.map((m) => (
              <option key={m.id} value={m.nome} className="bg-[#0b0f17]">{m.nome}</option>
            ))}
          </select>
          <div className="mt-2 text-sm text-white/55">
            {loadingCities ? "Carregando cidades..." : `Selecionado: ${selectedCityLabel}`}
          </div>
        </label>

        <div className="md:col-span-3 flex flex-wrap items-center gap-3">
          <Button onClick={checkCoverage} disabled={checking}>
            {checking ? "Verificando..." : "Verificar cobertura"}
          </Button>

          {covered === true ? (
            <div className="rounded-full border border-newvox-400/30 bg-newvox-400/15 px-4 py-2 text-sm font-semibold text-newvox-100">
              Temos cobertura ✅
            </div>
          ) : covered === false ? (
            <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/80">
              Ainda não temos cobertura 😕
            </div>
          ) : (
            <div className="text-sm text-white/55">Clique em “Verificar cobertura”.</div>
          )}
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-2xl font-extrabold">Ofertas</h2>
        <p className="mt-2 text-sm text-white/60">Valores e disponibilidade podem variar por cidade/região.</p>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {(plans?.length ? plans : [
            { id: 1, attributes: { name: "299 Mega", speedMbps: 299, price: 79.99, promotional: false, promoNote: "", order: 1, active: true } } as any,
            { id: 2, attributes: { name: "399 Mega", speedMbps: 399, price: 89.99, promotional: false, promoNote: "", order: 2, active: true } } as any,
            { id: 3, attributes: { name: "599 Mega", speedMbps: 599, price: 99.99, promotional: false, promoNote: "", order: 3, active: true } } as any,
            { id: 4, attributes: { name: "799 Mega", speedMbps: 799, price: 129.99, promotional: false, promoNote: "", order: 4, active: true } } as any,
            { id: 5, attributes: { name: "249 Mega (Promo)", speedMbps: 249, price: 59.99, promotional: true, promoNote: "6 primeiros meses. Depois R$ 74,99", order: 0, active: true } } as any,
          ]).map((p: any) => {
            const msg = covered === false
              ? `Olá! Tenho interesse em cobertura da NEWVOX Fibra em ${selectedCityLabel}. Pode me avisar quando tiver disponibilidade?`
              : `Olá! Quero contratar a NEWVOX Fibra em ${selectedCityLabel}. Plano: ${p.attributes.name} (${p.attributes.speedMbps} Mbps).`;

            return (
              <div key={p.id} className="rounded-[22px] border border-white/10 bg-white/5 p-6">
                <div className="flex items-center justify-between">
                  <div className="text-lg font-extrabold">{p.attributes.name}</div>
                  {p.attributes.promotional ? (
                    <div className="rounded-full bg-newvox-400/20 border border-newvox-400/30 px-3 py-1 text-xs font-extrabold text-newvox-100">
                      Promo
                    </div>
                  ) : null}
                </div>

                <div className="mt-2 text-sm text-white/60">Até {p.attributes.speedMbps} Mbps</div>

                <div className="mt-5 text-3xl font-extrabold">
                  R$ {Number(p.attributes.price).toFixed(2).replace(".", ",")}
                  <span className="text-sm font-semibold text-white/55">/mês</span>
                </div>

                {p.attributes.promoNote ? (
                  <div className="mt-2 text-sm text-white/55">{p.attributes.promoNote}</div>
                ) : null}

                <div className="mt-6 grid gap-3">
                  <a href={waLink(whatsapp, msg)} target="_blank" rel="noreferrer">
                    <Button className="w-full">
                      {covered === false ? "Entrar na lista" : "Assinar no WhatsApp"}
                    </Button>
                  </a>
                  <div className="text-xs text-white/50">
                    {covered === false
                      ? "Sem cobertura: seu contato vai para fila de interesse."
                      : "Atendimento rápido via WhatsApp."}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <WhatsAppFloat city={selectedCityLabel} />
    </div>
  );
}
