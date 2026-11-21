import { getStore } from "@netlify/blobs";
// price is in pence (1500 = £15). stock is the STARTING amount only; live stock is kept by the site.
// To add a product: copy a block, add a photo to public/img/<id>.jpg.
export const PRODUCTS = [
  { id: "honeycomb-silver", name: "Honeycomb Silver", price: 1500, stock: 1, desc: "Silver steel bracelet, honeycomb-textured dial, fluted bezel and date window. Quartz." },
  { id: "chrono-silver", name: "Silver Chrono", price: 1500, stock: 1, desc: "Bold silver-tone watch with a textured bezel and chronograph-style sub-dials. Quartz." },
  { id: "two-tone", name: "Gold & Steel", price: 1500, stock: 1, desc: "Two-tone gold and silver bracelet, gold bezel, Roman numeral dial with day and date. Quartz." },
  { id: "moonphase-black", name: "Midnight Moon", price: 1500, stock: 1, desc: "Black Roman-numeral dial with a blue moon sub-dial on a polished silver bracelet. Quartz." },
  { id: "rectangle-gold", name: "Gold Rectangle", price: 1500, stock: 1, desc: "Slim rectangular gold case with Roman numerals, date window and a brown leather strap." },
  { id: "cuban-bracelet", name: "Cuban Chain Bracelet", price: 300, stock: 1, desc: "Stainless steel Cuban link bracelet." },
  { id: "croc-cardholder", name: "Croc Card Holder", price: 500, stock: 3, desc: "Slim black croc-effect card holder with several card slots." },
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
