import Stripe from "stripe";
import { PRODUCTS, getStock, setStock } from "../lib/store.js";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
export default async (req) => {
  let ev;
  try { ev = stripe.webhooks.constructEvent(await req.text(), req.headers.get("stripe-signature"), process.env.STRIPE_WEBHOOK_SECRET); }
  catch { return new Response("Bad signature", { status: 400 }); }
  if (ev.type === "checkout.session.expired") {          // nobody paid: put the stock back
    const stock = await getStock();
    for (const part of (ev.data.object.metadata?.items || "").split(",").filter(Boolean)) {
      const [id, q] = part.split(":");
      if (PRODUCTS.some(p => p.id === id)) await setStock(id, stock[id] + Number(q));
    }
  }
  return new Response("ok");
};
export const config = { path: "/api/webhook" };
