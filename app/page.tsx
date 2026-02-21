import Image from "next/image";
import Link from "next/link";
import { Button } from "../components/ui/Button";
import { WhatsAppFloat } from "../components/widgets/WhatsAppFloat";
import { strapiFetch, strapiUrl, Banner, Plan } from "../lib/strapi";

async function getHomeData() {
  const hasStrapi = !!process.env.NEXT_PUBLIC_STRAPI_URL;
  if (!hasStrapi) return { banners: [] as Banner[], plans: [] as Plan[] };

  const [bannersRes, plansRes] = await Promise.allSettled([
    strapiFetch<{ data: Banner[] }>("/api/banners?filters[active][$eq]=true&sort=slot:asc&populate=*"),
    strapiFetch<{ data: Plan[] }>("/api/plans?filters[active][$eq]=true&sort=order:asc"),
  ]);

  const banners = bannersRes.status === "fulfilled" ? bannersRes.value.data : [];
  const plans = plansRes.status === "fulfilled" ? plansRes.value.data : [];

  return { banners, plans };
}

export default async function Home() {
  const { banners, plans } = await getHomeData();
  const hero = banners?.[0];

  return (
    <div className="relative">
      <section className="rounded-[28px] border border-white/10 bg-white/5 overflow-hidden">
        <div className="grid gap-10 p-8 md:grid-cols-2 md:p-12">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white/70">
              Premium • Baixa latência • Estabilidade
            </div>

            <h1 className="mt-5 text-4xl font-extrabold tracking-tight md:text-5xl">
              {hero?.attributes?.title || "Internet premium de verdade para sua casa e empresa."}
            </h1>

            <p className="mt-4 text-base text-white/70">
              {hero?.attributes?.subtitle ||
                "Rede robusta, Wi‑Fi Mesh e suporte ágil. Experiência superior para trabalho, games e streaming."}
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/planos">
                <Button>Ver planos</Button>
              </Link>
              <Link href="/cobertura">
                <Button variant="secondary">Consultar cobertura</Button>
              </Link>
            </div>

            <div className="mt-8 grid gap-3 text-sm text-white/70">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-newvox-400" />
                SLA operacional e engenharia focada em estabilidade
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-newvox-300" />
                Wi‑Fi Mesh para casa toda (opcional)
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-newvox-200" />
                Atendimento rápido via WhatsApp
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-[16/10] rounded-[24px] border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-4">
              {hero?.attributes?.imageDesktop?.data?.attributes?.url ? (
                <Image
                  src={strapiUrl(hero.attributes.imageDesktop.data.attributes.url)}
                  alt="Banner"
                  width={1200}
                  height={800}
                  className="h-full w-full rounded-[18px] object-cover"
                />
              ) : (
                <div className="h-full w-full rounded-[18px] border border-white/10 bg-[radial-gradient(circle_at_20%_10%,rgba(255,138,0,0.25),transparent_40%),radial-gradient(circle_at_80%_30%,rgba(255,213,95,0.20),transparent_45%),radial-gradient(circle_at_50%_90%,rgba(120,160,255,0.16),transparent_50%)]" />
              )}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-[18px] border border-white/10 bg-white/5 p-4">
                <div className="text-xs font-semibold text-white/60">Rede</div>
                <div className="mt-1 text-sm font-bold">Qualidade e estabilidade</div>
              </div>
              <div className="rounded-[18px] border border-white/10 bg-white/5 p-4">
                <div className="text-xs font-semibold text-white/60">Wi‑Fi</div>
                <div className="mt-1 text-sm font-bold">Mesh (opcional)</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-12">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold">Planos</h2>
            <p className="mt-2 text-sm text-white/60">Os preços podem variar por cidade/região. Consulte disponibilidade.</p>
          </div>
          <Link href="/planos" className="text-sm font-semibold text-white/75 hover:text-white">
            Ver todos →
          </Link>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {(plans?.length ? plans.slice(0, 3) : [
            { id: 1, attributes: { name: "299 Mega", speedMbps: 299, price: 79.99, promotional: false, promoNote: "", order: 1, active: true } } as any,
            { id: 2, attributes: { name: "599 Mega", speedMbps: 599, price: 99.99, promotional: false, promoNote: "", order: 2, active: true } } as any,
            { id: 3, attributes: { name: "249 Mega (Promo)", speedMbps: 249, price: 59.99, promotional: true, promoNote: "6 meses, depois R$ 74,99", order: 0, active: true } } as any,
          ]).map((p: any) => (
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
              {p.attributes.promoNote ? <div className="mt-2 text-sm text-white/55">{p.attributes.promoNote}</div> : null}
              <div className="mt-6">
                <Link href="/planos">
                  <Button className="w-full">Consultar na minha cidade</Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <WhatsAppFloat />
    </div>
  );
}
