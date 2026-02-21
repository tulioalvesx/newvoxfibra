import { Plan, strapiFetch } from "../../lib/strapi";
import { PlanosClient } from "./planosClient";

async function getPlans() {
  const hasStrapi = !!process.env.NEXT_PUBLIC_STRAPI_URL;
  if (!hasStrapi) return [] as Plan[];
  try {
    const res = await strapiFetch<{ data: Plan[] }>("/api/plans?filters[active][$eq]=true&sort=order:asc");
    return res.data;
  } catch {
    return [] as Plan[];
  }
}

export default async function PlanosPage() {
  const plans = await getPlans();
  return <PlanosClient plans={plans} />;
}
