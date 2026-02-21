"use client";

import { Button } from "../../components/ui/Button";

function onlyDigits(v: string) {
  return (v || "").replace(/\D/g, "");
}
function waLink(phoneE164: string, text: string) {
  const digits = onlyDigits(phoneE164);
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

export default function Contato() {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_E164 || "+5535966666666";
  const msg = "Olá! Quero falar com a NEWVOX Fibra.";

  return (
    <div>
      <h1 className="text-3xl font-extrabold">Contato</h1>
      <p className="mt-3 text-white/65">
        Atendimento rápido via WhatsApp.
      </p>

      <div className="mt-8 rounded-[26px] border border-white/10 bg-white/5 p-8">
        <div className="text-lg font-extrabold">WhatsApp</div>
        <div className="mt-2 text-sm text-white/60">{phone}</div>
        <div className="mt-6">
          <a href={waLink(phone, msg)} target="_blank" rel="noreferrer">
            <Button>Chamar no WhatsApp</Button>
          </a>
        </div>
      </div>
    </div>
  );
}
