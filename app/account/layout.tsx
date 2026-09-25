import type { Metadata } from "next";

// Paginile de cont sunt private: nu apar in Google (si robots.txt le blocheaza)
export const metadata: Metadata = {
    title: "Contul meu",
    robots: { index: false, follow: false },
};

export default function AccountLayout({ children }: { children: React.ReactNode }) {
    return children;
}
