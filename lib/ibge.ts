export type UF = { id: number; sigla: string; nome: string };
export type Municipio = { id: number; nome: string };

export async function fetchUFs(): Promise<UF[]> {
  const res = await fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados", { cache: "force-cache" });
  if (!res.ok) throw new Error("Falha ao carregar UFs");
  const data = (await res.json()) as UF[];
  return data.sort((a, b) => a.nome.localeCompare(b.nome));
}

export async function fetchMunicipiosByUF(uf: string): Promise<Municipio[]> {
  const res = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`, { cache: "force-cache" });
  if (!res.ok) throw new Error("Falha ao carregar municípios");
  const data = (await res.json()) as Municipio[];
  return data.sort((a, b) => a.nome.localeCompare(b.nome));
}
