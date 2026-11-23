import { PRODUCTS, getStock, setStock, getPrices, setPrice, ordersStore } from "../lib/store.js";
export default async (req) => {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw || req.headers.get("x-admin-password") !== pw) { await new Promise(r => setTimeout(r, 1000)); return new Response("Unauthorised", { status: 401 }); }
  const o = ordersStore();
  if (req.method === "POST") {
    const b = await req.json().catch(() => ({}));
    if (b.action === "stock" && PRODUCTS.some(p => p.id === b.id)) await setStock(b.id, Math.max(0, Math.floor(Number(b.left)) || 0));
    if (b.action === "price" && PRODUCTS.some(p => p.id === b.id)) {
      const pence = Math.round(Number(b.price) * 100);
      if (pence >= 30 && pence <= 100000) await setPrice(b.id, pence);   // Stripe minimum is 30p
    }
    if (b.action === "collected" || b.action === "delete") {
      const r = await o.get(String(b.id), { type: "json" });
      if (r) { if (b.action === "delete") await o.delete(String(b.id)); else await o.setJSON(String(b.id), { ...r, collected: !!b.value }); }
    }
    return Response.json({ ok: true });
  }
  const [stock, prices] = await Promise.all([getStock(), getPrices()]);
  const { blobs } = await o.list();
  const orders = (await Promise.all(blobs.map(x => o.get(x.key, { type: "json" })))).filter(Boolean).sort((a, b) => b.at.localeCompare(a.at));
  return Response.json({ products: PRODUCTS.map(p => ({ id: p.id, name: p.name, left: stock[p.id], price: prices[p.id] })), orders });
};
export const config = { path: "/api/admin" };
