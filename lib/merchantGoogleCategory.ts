import type { Product } from "@/lib/products";

/**
 * Google Product Category IDs — official taxonomy
 * @see https://www.google.com/basepages/producttype/taxonomy-with-ids.en-US.txt
 */
export function googleProductCategoryId(product: Product): string {
  const routeFull = (product.routeSlug || "").toLowerCase();
  const routePath = routeFull.split("?")[0];
  const cat = String(product.metadata?.category || "").toLowerCase();
  const title = (product.title || "").toLowerCase();
  const id = String(product.id || "").toLowerCase();
  const hay = `${routeFull} ${cat} ${title} ${id}`;

  if (routePath.startsWith("canvas-product/")) return "500044";
  if (routePath.startsWith("banner-product/")) return "976";
  if (routePath.startsWith("semnalistica-product/")) return "976";

  if (routeFull.includes("configurator/tricouri")) return "212";
  if (routeFull.includes("configurator/hanorace")) return "212";
  if (routeFull.includes("configurator/sepci")) return "173";
  if (routeFull.includes("configurator/carti-vizita")) return "957";
  if (routeFull.includes("configurator/rollup")) return "5865";
  if (routeFull.includes("configurator/canvas")) return "500044";
  if (routeFull.includes("configurator/tapet")) return "2334";
  if (routeFull.includes("configurator/window-graphics")) return "5989";
  if (routeFull.includes("configurator/autocolante")) return "3221";
  if (routeFull.includes("configurator/pliante") || routeFull.includes("configurator/flayere")) {
    return "5884";
  }
  if (routeFull.includes("configurator/afise")) return "500044";
  if (routeFull.includes("configurator/banner-verso") || routeFull.includes("configurator/banner")) {
    return "976";
  }
  if (routeFull.includes("configurator/materiale")) return "976";
  if (
    routeFull.includes("configurator/fonduri-eu") ||
    routeFull.includes("configurator/fonduri-pnrr") ||
    routeFull.includes("configurator/fonduri")
  ) {
    return "976";
  }
  if (routeFull.includes("configurator/semnalistica")) return "976";
  if (routeFull.includes("configurator/custom-glass")) return "5989";

  if (cat === "canvas") return "500044";
  if (cat === "bannere") return "976";
  if (cat === "semnalistica") return "976";
  if (cat === "fonduri-europene") return "976";

  if (cat === "configuratoare") {
    return categoryFromConfiguratorHay(hay);
  }

  if (cat === "campanii-seo") {
    if (routeFull.includes("canvas")) return "500044";
    if (routeFull.includes("tapet")) return "2334";
    if (routeFull.includes("rollup")) return "5865";
    if (routeFull.includes("window-graphics")) return "5989";
    if (routeFull.includes("autocolante")) return "3221";
    if (routeFull.includes("pliante") || routeFull.includes("flayere")) return "5884";
    if (routeFull.includes("afise")) return "500044";
    if (routeFull.includes("tricouri")) return "212";
    if (routeFull.includes("hanorace")) return "212";
    if (routeFull.includes("sepci")) return "173";
    if (routeFull.includes("carti-vizita")) return "957";
    if (routeFull.includes("fonduri") || routeFull.includes("pnrr")) return "976";
    if (routeFull.includes("materiale")) return "976";
    if (routeFull.includes("semnalistica")) return "976";
    if (routeFull.includes("banner")) return "976";
    if (id.startsWith("seo-canvas-gen")) return "500044";
    if (id.startsWith("seo-pnrr-gen")) return "976";
    if (id.startsWith("seo-pub-gen")) return categoryFromConfiguratorHay(routeFull);
    return categoryFromConfiguratorHay(hay);
  }

  if (hay.includes("tricou") || hay.includes("textil")) return "212";
  if (hay.includes("hanorac")) return "212";
  if (hay.includes("sapc") || hay.includes("sepci") || hay.includes("șepc")) return "173";
  if (hay.includes("carte de vizit")) return "957";
  if (hay.includes("rollup")) return "5865";
  if (hay.includes("canvas") || hay.includes("tablou")) return "500044";
  if (hay.includes("tapet") || hay.includes("fototapet")) return "2334";
  if (hay.includes("autocolant") || hay.includes("sticker")) return "3221";
  if (hay.includes("pliant") || hay.includes("flyer") || hay.includes("flutura")) return "5884";
  if (hay.includes("afiș") || hay.includes("afis") || hay.includes("poster")) return "500044";

  return "976";
}

function categoryFromConfiguratorHay(hay: string): string {
  if (hay.includes("tricouri") || hay.includes("tricou")) return "212";
  if (hay.includes("hanorace") || hay.includes("hanorac")) return "212";
  if (hay.includes("sepci") || hay.includes("sapc")) return "173";
  if (hay.includes("carti-vizita") || hay.includes("vizita")) return "957";
  if (hay.includes("rollup")) return "5865";
  if (hay.includes("canvas")) return "500044";
  if (hay.includes("tapet")) return "2334";
  if (hay.includes("window-graphics") || hay.includes("window graphics")) return "5989";
  if (hay.includes("autocolante") || hay.includes("autocolant")) return "3221";
  if (hay.includes("pliante") || hay.includes("flayere") || hay.includes("flyere")) return "5884";
  if (hay.includes("afise") || hay.includes("afis")) return "500044";
  if (hay.includes("fonduri") || hay.includes("pnrr")) return "976";
  if (hay.includes("semnalistica")) return "976";
  if (hay.includes("materiale")) return "976";
  if (hay.includes("banner")) return "976";
  return "976";
}
