import Stripe from "stripe";
import { PRODUCTS, getStock, getPrices } from "../lib/store.js";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const err = (m, s = 400) => Response.json({ error: m }, { status: s });
export default async (req) => {
  if (req.method !== "POST") return err("Method not allowed", 405);
  const { name, email, items } = await req.json().catch(() => ({}));
  const em = String(email || "").trim().toLowerCase();
  if (!String(name || "").trim() || !/^[^@\s]+@gsal\.org\.uk$/.test(em))
    return err("Please enter your name and your school email (ending @gsal.org.uk).");
  const want = (Array.isArray(items) ? items : [])
    .map(i => ({ p: PRODUCTS.find(p => p.id === i.id), q: Math.floor(Number(i.qty)) }))
    .filter(x => x.p && x.q > 0);
  if (!want.length || want.reduce((a, x) => a + x.q, 0) > 10) return err("Please check your basket.");
  const [stock, prices] = await Promise.all([getStock(), getPrices()]);
  for (const { p, q } of want) if (q > stock[p.id]) return err(`Sorry, ${p.name} has just sold out or doesn't have enough left.`, 409);
  try {
    const origin = new URL(req.url).origin;
    const s = await stripe.checkout.sessions.create({
      mode: "payment", customer_email: em,
      line_items: want.map(({ p, q }) => ({ quantity: q, price_data: { currency: "gbp", unit_amount: prices[p.id], product_data: { name: p.name } } })),
      metadata: { name: String(name).trim().slice(0, 80), items: want.map(({ p, q }) => `${p.id}:${q}`).join(",") },
      payment_intent_data: { description: "Clasp & Co - collect Friday in the rotunda" },
      success_url: origin + "/?paid=1", cancel_url: origin + "/"
    });
    return Response.json({ url: s.url });
  } catch (e) { return err("Couldn't start the payment. Please try again.", 500); }
};
export const config = { path: "/api/checkout" };
