"use client";

import { useMemo } from "react";

function toWaLink(phoneE164: string, text: string) {
  const digits = phoneE164.replace(/[^\d]/g, "");
  const msg = encodeURIComponent(text);
  return `https://wa.me/${digits}?text=${msg}`;
}

export function WhatsAppFloat({ city }: { city?: string }) {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_E164 || "+5535966666666";
  const link = useMemo(() => {
    const msg = `Olá! Quero contratar a NEWVOX Fibra${city ? ` em ${city}` : ""}.`;
    return toWaLink(phone, msg);
  }, [phone, city]);

  return (
    <a
      href={link}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-5 right-5 z-50 rounded-full border border-white/10 bg-white/10 px-5 py-3 text-sm font-extrabold text-white shadow-xl backdrop-blur hover:bg-white/15"
      aria-label="Falar no WhatsApp"
    >
      WhatsApp
    </a>
  );
}
