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
  { id: "croc-cardholder", name: "Croc Card Holder", price: 500, stock: 3, desc: "Slim black croc-effect card holder with several card slots." }
];
const store = () => getStore("stock");
export async function getStock() {
  const s = store(), out = {};
  for (const p of PRODUCTS) { const v = await s.get(p.id); out[p.id] = v === null ? p.stock : Number(v); }
  return out;
}
export const setStock = (id, n) => store().set(id, String(Math.max(0, n)));
