export default function Beneficios() {
  return (
    <div>
      <h1 className="text-3xl font-extrabold">Rede & Mesh</h1>
      <p className="mt-3 text-white/65">
        Pilares da NEWVOX: estabilidade, baixa latência e experiência premium.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {[
          {
            title: "Rede robusta",
            desc: "Projeto focado em estabilidade e performance para streaming, trabalho e games.",
          },
          {
            title: "Wi‑Fi Mesh (opcional)",
            desc: "Cobertura Wi‑Fi mais uniforme em ambientes grandes, com roaming inteligente.",
          },
          {
            title: "Suporte ágil",
            desc: "Atendimento via WhatsApp e times de campo com foco em primeira solução.",
          },
        ].map((c) => (
          <div key={c.title} className="rounded-[22px] border border-white/10 bg-white/5 p-6">
            <div className="text-lg font-extrabold">{c.title}</div>
            <div className="mt-2 text-sm text-white/60">{c.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
