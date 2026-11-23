import { PRODUCTS, getStock, getPrices } from "../lib/store.js";
export default async () => {
  const [s, pr] = await Promise.all([getStock(), getPrices()]);
  return Response.json(PRODUCTS.map(p => ({ id: p.id, name: p.name, price: pr[p.id], desc: p.desc, left: s[p.id] })));
};
export const config = { path: "/api/products" };
