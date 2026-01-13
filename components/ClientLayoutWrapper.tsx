"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";
import ContactButton from "./ContactButton";
import CookieConsentBanner from "./CookieConsentBanner";
import PromoTopBar from "./PromoTopBar";

export default function ClientLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  // Verificăm dacă suntem pe o pagină de admin
  const isAdmin = pathname?.startsWith("/admin");

  // Dacă suntem pe admin, returnăm DOAR conținutul (care va fi gestionat de app/admin/layout.tsx)
  if (isAdmin) {
    return <>{children}</>;
  }

  // Dacă suntem pe site-ul public, afișăm layout-ul standard
  return (
    <>
      {pathname === "/" && <PromoTopBar />}
      <Header />
      <main>{children}</main>
      <Footer />
      <ContactButton />
      <CookieConsentBanner />
    </>
  );
}
