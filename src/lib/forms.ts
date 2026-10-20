/**
 * Form submission stub. Replace with a real endpoint (route handler, Formspree,
 * Klaviyo, HubSpot, Shopify customer API…) when going live.
 */
export type FormKind = "newsletter" | "contact" | "wholesale";

export async function submitForm(kind: FormKind, data: Record<string, string>) {
  await new Promise((r) => setTimeout(r, 600));
  if (process.env.NODE_ENV !== "production") {
    console.info(`[mock form] ${kind}`, data);
  }
  return { ok: true as const };
}
