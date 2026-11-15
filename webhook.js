import Stripe from "stripe";
import { PRODUCTS, getStock, setStock, ordersStore } from "../lib/store.js";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
export default async (req) => {
  let ev;
  try { ev = stripe.webhooks.constructEvent(await req.text(), req.headers.get("stripe-signature"), process.env.STRIPE_WEBHOOK_SECRET); }
  catch { return new Response("Bad signature", { status: 400 }); }
  const s = ev.data.object;
  if (ev.type !== "checkout.session.completed" || s.payment_status !== "paid") return new Response("ok");
  const orders = ordersStore();
  if (await orders.get(s.id) !== null) return new Response("ok");          // already handled (Stripe retries)
  const items = (s.metadata?.items || "").split(",").filter(Boolean)
    .map(x => { const [id, q] = x.split(":"); return { id, q: Number(q) }; }).filter(i => PRODUCTS.some(p => p.id === i.id));
  const stock = await getStock();
  const enough = items.length > 0 && items.every(i => stock[i.id] >= i.q);
  const rec = { id: s.id, name: s.metadata?.name, email: s.customer_details?.email || s.customer_email, items,
    total: s.amount_total, at: new Date().toISOString(), status: enough ? "paid" : "refunded-soldout", collected: false };
  await orders.setJSON(s.id, rec);
  if (enough) for (const i of items) await setStock(i.id, stock[i.id] - i.q);
  else {
    try { await stripe.refunds.create({ payment_intent: s.payment_intent }); }
    catch { await orders.setJSON(s.id, { ...rec, status: "SOLD OUT - REFUND BY HAND" }); }
  }
  return new Response("ok");
};
export const config = { path: "/api/webhook" };
