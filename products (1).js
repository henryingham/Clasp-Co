import { PRODUCTS, getStock } from "../lib/products.js";
export default async () => {
  const s = await getStock();
  return Response.json(PRODUCTS.map(p => ({ id: p.id, name: p.name, price: p.price, desc: p.desc, left: s[p.id] })));
};
export const config = { path: "/api/products" };
