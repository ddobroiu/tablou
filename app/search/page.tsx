import { Suspense } from "react";
import SearchPageClient from "./SearchPageClient";

export const metadata = {
  title: "Caută Produse",
  description: "Caută în catalogul de produse Tablou: bannere, afișe, autocolante și multe altele.",
};

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 dark:bg-black py-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Se încarcă căutarea...</p>
        </div>
      </div>
    }>
      <SearchPageClient />
    </Suspense>
  );
}
