"use client";

import { useMemo, useState } from "react";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";

function onlyDigits(v: string) {
  return (v || "").replace(/\D/g, "");
}

function maskCpf(value: string) {
  const v = onlyDigits(value).slice(0, 11);
  const p1 = v.slice(0, 3);
  const p2 = v.slice(3, 6);
  const p3 = v.slice(6, 9);
  const p4 = v.slice(9, 11);
  let out = p1;
  if (p2) out += "." + p2;
  if (p3) out += "." + p3;
  if (p4) out += "-" + p4;
  return out;
}

function waLink(phoneE164: string, text: string) {
  const digits = onlyDigits(phoneE164);
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

export default function Central() {
  const [cpf, setCpf] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const portal = process.env.NEXT_PUBLIC_IXC_PORTAL_URL || "https://ixc.newvox.com.br";
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_E164 || "+5535966666666";

  const wa = useMemo(() => {
    const msg = `Olá! Tentei acessar a Central pelo site da NEWVOX e meu CPF não foi encontrado. CPF: ${cpf}`;
    return waLink(phone, msg);
  }, [phone, cpf]);

  async function submit() {
    setErr(null);
    setLoading(true);

    try {
      const res = await fetch("/api/ixc/validate-cpf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cpf }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (data?.error === "invalid_cpf") setErr("CPF inválido. Verifique e tente novamente.");
        else if (data?.error === "ixc_not_configured") setErr("Central temporariamente indisponível. Tente novamente mais tarde.");
        else setErr("Não foi possível validar agora. Tente novamente.");
        return;
      }

      if (data?.exists) {
        window.location.href = portal;
        return;
      }

      setErr("Cadastro não encontrado. Verifique o CPF ou fale com nosso atendimento.");
    } catch {
      setErr("Falha de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl">
      <h1 className="text-3xl font-extrabold">Central do Assinante</h1>
      <p className="mt-3 text-white/65">
        Digite seu CPF para acessar a Central do Assinante.
      </p>

      <div className="mt-8 rounded-[26px] border border-white/10 bg-white/5 p-6">
        <Input
          label="CPF"
          placeholder="000.000.000-00"
          value={cpf}
          onChange={(e) => setCpf(maskCpf(e.target.value))}
          error={err || undefined}
          hint="Ao confirmar o cadastro, você será direcionado automaticamente para a Central."
        />

        <div className="mt-5 flex flex-wrap gap-3">
          <Button onClick={submit} disabled={loading}>
            {loading ? "Validando..." : "Acessar Central"}
          </Button>

          <a href={wa} target="_blank" rel="noreferrer">
            <Button variant="secondary">Falar no WhatsApp</Button>
          </a>
        </div>
      </div>
    </div>
  );
}
