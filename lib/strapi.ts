export type Banner = {
  id: number;
  attributes: {
    slot: number;
    title: string;
    subtitle: string;
    ctaText: string;
    ctaLink: string;
    active: boolean;
    imageDesktop?: { data?: { attributes: { url: string } } };
    imageMobile?: { data?: { attributes: { url: string } } };
  };
};

export type Plan = {
  id: number;
  attributes: {
    name: string;
    speedMbps: number;
    price: number;
    promotional: boolean;
    promoNote?: string;
    order: number;
    active: boolean;
  };
};

export async function strapiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const base = process.env.NEXT_PUBLIC_STRAPI_URL;
  if (!base) throw new Error("NEXT_PUBLIC_STRAPI_URL not set");
  const url = `${base}${path.startsWith("/") ? "" : "/"}${path}`;

  const token = process.env.STRAPI_READONLY_TOKEN || "";
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init?.headers as any),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(url, { ...init, headers, cache: "no-store" });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Strapi error ${res.status}: ${body}`);
  }
  return res.json();
}

export function strapiUrl(path?: string) {
  const base = process.env.NEXT_PUBLIC_STRAPI_URL || "";
  if (!path) return base;
  if (!base) return path;
  return path.startsWith("http") ? path : `${base}${path}`;
}
