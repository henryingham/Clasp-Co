import { getStore } from "@netlify/blobs";
// price is in pence (1500 = £15). stock is the STARTING amount only; live stock is kept by the site.
// To add a product: copy a block, add a photo to public/img/<id>.jpg.
export const PRODUCTS = [
  { id: "black-cardholder", name: "Black Card Holder", price: 500, stock: 0, desc: "Slim black leather-look card holder with several card slots." },
  { id: "slate-square", name: "Slate Square", price: 1000, stock: 0, desc: "Square black case, textured grey dial and a soft grey silicone strap. Quartz." },
  { id: "racer-black", name: "Racer Black", price: 1000, stock: 0, desc: "Black chronograph-style dial with red accents on a black fabric strap. Quartz." },
  { id: "graphite-octagon", name: "Graphite Octagon", price: 1500, stock: 0, desc: "Octagonal matte grey case and bracelet with a skeleton-style dial." },
  { id: "olive-octagon", name: "Olive Octagon", price: 1500, stock: 0, desc: "Octagonal matte olive-green case and bracelet with a skeleton-style dial." },
  { id: "herringbone-chain", name: "Herringbone Chain", price: 500, stock: 0, desc: "Flat herringbone chain necklace." },
  { id: "blue-steel", name: "Blue Steel", price: 2500, stock: 0, desc: "Blue dial, silver steel bracelet, day and date window. Quartz." },
  { id: "steel-noir", name: "Steel Noir", price: 2500, stock: 0, desc: "Black dial, silver steel bracelet, day and date window. Quartz." },
  { id: "gold-rope-bracelet", name: "Gold Rope Bracelet", price: 500, stock: 0, desc: "Gold-tone twisted rope bracelet." },
  { id: "link-bracelet", name: "Link Bracelet", price: 400, stock: 0, desc: "Chunky silver-tone link bracelet with a toggle clasp." },
  { id: "brown-cardholder", name: "Brown Card Holder", price: 300, stock: 0, desc: "Slim brown textured card holder with several card slots." },
  { id: "tennis-bracelet", name: "Crystal Tennis Bracelet", price: 300, stock: 0, desc: "Silver-tone bracelet set with sparkling clear stones." },
  { id: "rope-chain", name: "Rope Chain", price: 600, stock: 0, desc: "Silver-tone twisted rope chain necklace." },
  { id: "honeycomb-navy", name: "Honeycomb Navy", price: 1500, stock: 0, desc: "Navy honeycomb dial, fluted bezel, steel bracelet and date window. Quartz." },
  { id: "honeycomb-ice", name: "Honeycomb Ice", price: 1500, stock: 0, desc: "Pale blue honeycomb dial, fluted bezel, steel bracelet and date window. Quartz." },
  { id: "slate-steel-square", name: "Slate Steel Square", price: 1000, stock: 0, desc: "Square case with a grey dial, steel bracelet and date window. Quartz." }
];
const store = () => getStore("stock");
export async function getStock() {
  const s = store(), out = {};
  for (const p of PRODUCTS) { const v = await s.get(p.id); out[p.id] = v === null ? p.stock : Number(v); }
  return out;
}
export const setStock = (id, n) => store().set(id, String(Math.max(0, n)));
export const ordersStore = () => getStore("orders");
