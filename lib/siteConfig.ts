import {
  Image as ImageIcon,
  Tag,
  Facebook,
  Instagram,
  Linkedin,
  ShieldCheck,
  TrendingUp,
  Layers,
} from "lucide-react";

export const siteConfig = {
  name: "Tablou.net",
  url: "https://www.tablou.net",
  ogImage: "https://www.tablou.net/og.jpg",
  description:
    "Transformă-ți amintirile în artă! La Tablou.net, creăm tablouri canvas și plexiglas de calitate premium, la orice dimensiune, cu livrare rapidă în toată România.",
  links: {
    twitter: "https://twitter.com/tablounet",
    facebook: "https://www.facebook.com/tablounet",
  },

  // --- MENIUL PRINCIPAL (HEADER) - DOAR TABLOURI ---
  headerNav: [
    {
      label: "Editor",
      href: "/editor",
    },
    {
      label: "Personalizate",
      children: [
        { href: "/canvas", label: "Canvas personalizat" },
        { href: "/afise", label: "Poster personalizat" },
        { href: "/sticla-acrilica", label: "Sticlă Acrilică" },
      ],
    },
    {
      label: "Colecții",
      children: [
        { href: "/shop/canvas", label: "Colecție Canvas" },
        { href: "/shop/acrylic", label: "Colecție Sticlă Acrilică" },
      ],
    },
    {
      label: "Contact",
      href: "/contact",
    },
  ],

  // --- MENIUL FOOTER ---
  footerNav: [
    {
      title: "Companie",
      items: [
        { title: "Despre Noi", href: "/despre-noi" },
        { title: "Blog", href: "/blog" },
        { title: "Contact", href: "/contact" },
      ],
    },
    {
      title: "Legal",
      items: [
        { title: "Termeni & Condiții", href: "/termeni" },
        { title: "Confidențialitate", href: "/confidentialitate" },
        { title: "Politica Cookies", href: "/politica-cookies" },
      ],
    },
    {
      title: "Suport",
      items: [
        { title: "Ghid Dimensiuni", href: "/ghid-dimensiuni" },
        { title: "Instrucțiuni Calitate", href: "/instructiuni-calitate" },
        { title: "Urmărește Comanda", href: "/urmareste-comanda" },
      ],
    },
  ],

  socialLinks: [
    { title: "Facebook", href: "https://www.facebook.com/tablounet", icon: Facebook },
    { title: "Instagram", href: "https://www.instagram.com/tablounet/", icon: Instagram },
  ],
};

export type SiteConfig = typeof siteConfig;