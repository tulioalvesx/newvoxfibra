import { NextResponse } from "next/server";

function onlyDigits(v: string) {
  return (v || "").replace(/\D/g, "");
}

/**
 * Validação simples: consulta o IXC Webservice e verifica se existe CLIENTE ATIVO pelo CPF/CNPJ.
 *
 * A documentação/integrações costumam usar:
 * - endpoint: /webservice/v1/cliente
 * - listagem com header: ixcsoft: listar
 * - filtros via body (qtype/query/oper etc.)
 *
 * IMPORTANTE:
 * - O token e host ficam no servidor (env vars).
 */
export async function POST(req: Request) {
  try {
    const { cpf } = (await req.json()) as { cpf?: string };
    const doc = onlyDigits(cpf || "");
    if (!doc || doc.length < 11) {
      return NextResponse.json({ error: "invalid_cpf" }, { status: 400 });
    }

    const host = process.env.IXC_HOST;
    const token = process.env.IXC_TOKEN;
    const cpfField = process.env.IXC_CPF_FIELD || "cliente.cnpj_cpf";
    const activeField = process.env.IXC_ACTIVE_FIELD || "cliente.ativo";

    if (!host || !token) {
      // Em dev, sem token, apenas bloqueia com erro claro.
      return NextResponse.json(
        { error: "ixc_not_configured", message: "Configure IXC_HOST e IXC_TOKEN no servidor." },
        { status: 500 }
      );
    }

    const url = `${host.replace(/\/$/, "")}/webservice/v1/cliente`;
    // A maioria das integrações usa Basic Auth com token (user) e senha em branco ou "x".
    // Para evitar suposições perigosas, mantemos o token como username e senha vazia.
    const auth = Buffer.from(`${token}:`).toString("base64");

    // Busca por CPF/CNPJ
    // Observação: alguns ambientes usam campo "cliente.cnpj_cpf" e ativo "S" / "SIM" / "1".
    // Aqui filtramos por CPF e depois checamos ativo na resposta.
    const payload = {
      qtype: cpfField,
      query: doc,
      oper: "=",
      page: "1",
      rp: "1",
      sortname: "cliente.id",
      sortorder: "asc",
    };

    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
        ixcsoft: "listar",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      return NextResponse.json({ error: "ixc_error", status: res.status, body: txt }, { status: 502 });
    }

    const data = await res.json().catch(() => null) as any;
    const rows = data?.registros || data?.dados || data?.data || data?.result || [];
    const first = Array.isArray(rows) ? rows[0] : null;

    if (!first) return NextResponse.json({ exists: false });

    // checagem de ativo: tentamos alguns padrões comuns
    const activeVal = first?.ativo ?? first?.[activeField.split(".").pop() || "ativo"] ?? first?.[activeField] ?? "";
    const active = String(activeVal).toLowerCase();
    const isActive = ["s", "sim", "1", "true", "ativo", "a"].includes(active);

    return NextResponse.json({ exists: isActive });
  } catch (e: any) {
    return NextResponse.json({ error: "server_error", message: e?.message || String(e) }, { status: 500 });
  }
}
