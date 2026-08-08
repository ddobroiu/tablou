import { JUDETE_DATA } from "./judeteData";

export type BlogPost = {
  slug: string;
  source?: string;
  title: string;
  description: string;
  date: string; // ISO date
  author?: string;
  tags: string[];
  hero?: string;
  contentHtml: string;
};

// TODO: write original Tablou blog content
const STATIC_POSTS: BlogPost[] = [];

const COUNTY_POSTS: BlogPost[] = JUDETE_DATA.map((j, index) => ({
  slug: `servicii-print-judet-${j.slug}`,
  title: `Servicii de print în județul ${j.name} - Tablou.net`,
  description: `Găsește soluții de print profesional în județul ${j.name}. Livrăm rapid bannere, autocolante și pliante în ${j.localities.join(', ')} și localitățile învecinate.`,
  date: new Date(2024, 8, 1 + (index * 6), 9 + (index % 8), (index * 7) % 60).toISOString(),
  author: "Echipa Tablou",
  tags: [j.name.toLowerCase(), "print digital", "bannere", j.slug],
  contentHtml: `
    <p>Dacă ai nevoie de materiale publicitare de impact în județul <b>${j.name}</b>, Tablou.net este soluția ta modernă și rapidă. Oferim servicii de print digital de înaltă calitate, optimizate pentru vizibilitate maximă.</p>

    <h2>Livrare rapidă în ${j.name}</h2>
    <p>Sistemul nostru de logistică asigură livrarea comenzilor tale în cel mai scurt timp în localități precum: ${j.localities.join(', ')}.</p>

    <h2>Produse disponibile:</h2>
    <ul>
      <li><b>Bannere Publicitare:</b> Ideale pentru promovare outdoor durabilă.</li>
      <li><b>Autocolante Personalizate:</b> Decupate la formă, gata de aplicat.</li>
      <li><b>Pliante și Flyere:</b> Pentru o comunicare directă cu potențialii clienți.</li>
      <li><b>Canvas și Tablouri:</b> Transformă sediul într-un spațiu modern.</li>
      <li><b>Panouri Rigide:</b> Din plexiglass sau PVC, pentru semnalistică premium.</li>
    </ul>

    <p>Folosește configuratorul nostru online pentru a calcula prețul instant. Selectezi materialul, introduci dimensiunile și plasezi comanda fără telefoane sau e-mailuri inutile. Calitatea Tablou.net este acum disponibilă pentru orice afacere din <b>${j.name}</b>!</p>
  `
}));

export const POSTS: BlogPost[] = [...STATIC_POSTS, ...COUNTY_POSTS];

export function getAllPosts() {
  return POSTS.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string) {
  return POSTS.find((p) => p.slug === slug);
}

export function getAllTags() {
  const tags = new Set<string>();
  POSTS.forEach((p) => p.tags.forEach((t) => tags.add(t)));
  return Array.from(tags);
}

export function getAllBlogSlugs() {
  return POSTS.map((p) => p.slug);
}
