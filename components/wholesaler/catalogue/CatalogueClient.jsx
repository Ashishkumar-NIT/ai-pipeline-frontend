"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useTransition, useCallback } from "react";
import CatalogueGrid from "./CatalogueGrid";
import { categories as ALL_CATEGORIES } from "../../../lib/config/catalogueCategories";
import Link from "next/link";

const LIMIT = 12;

// All tabs: "All" + the 8 static categories
const TABS = [{ name: "All", slug: "all" }, ...ALL_CATEGORIES];

export default function CatalogueClient({ initialProducts, initialCount, initialCategory, wholesalerId, userEmail }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [activeSlug, setActiveSlug]     = useState(initialCategory);
  const [products, setProducts]         = useState(initialProducts);
  const [totalCount, setTotalCount]     = useState(initialCount);
  const [page, setPage]                 = useState(1);
  const [isPending, startTransition]    = useTransition();
  const [isLoading, setIsLoading]       = useState(false);

  const totalPages = Math.max(1, Math.ceil(totalCount / LIMIT));

  // Fetch products from the client-side API route
  const fetchProducts = useCallback(async (slug, pageNum) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        category: slug === "all" ? "" : slug,
        page: String(pageNum),
        limit: String(LIMIT),
      });
      const res = await fetch(`/api/catalogue/products?${params}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const json = await res.json();
      setProducts(json.data ?? []);
      setTotalCount(json.count ?? 0);
    } catch (err) {
      console.error("[CatalogueClient] fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // When tab changes: reset page, update URL param, re-fetch
  function handleTabChange(slug) {
    if (slug === activeSlug) return;
    setActiveSlug(slug);
    setPage(1);
    // Update the URL without navigation
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (slug === "all") {
        params.delete("category");
      } else {
        params.set("category", slug);
      }
      router.replace(`?${params.toString()}`, { scroll: false });
    });
    fetchProducts(slug, 1);
  }

  // When page changes
  function handlePageChange(newPage) {
    if (newPage === page || newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
    fetchProducts(activeSlug, newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const activeTab = TABS.find((t) => t.slug === activeSlug) ?? TABS[0];

  // ── Empty state: wholesaler has 0 products total ─────────────────────────
  const isFirstLoad = !isLoading && activeSlug === "all" && totalCount === 0;

  return (
    <div className="min-h-screen bg-white">
      {/* ── Header ── */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-celestique-dark/10">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/wholesaler"
              className="text-[9px] uppercase tracking-[0.25em] font-bold text-celestique-dark/40 hover:text-celestique-dark transition-colors flex items-center gap-2"
            >
              <span className="text-base leading-none">&#8592;</span>
              Dashboard
            </Link>
            <span className="text-celestique-dark/20">/</span>
            <span className="text-[9px] uppercase tracking-[0.25em] font-bold text-celestique-dark">
              My Catalogue
            </span>
          </div>
          <span className="hidden sm:block text-[9px] uppercase tracking-[0.15em] text-celestique-dark/40">
            {userEmail}
          </span>
        </div>
      </header>

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-14">

        {/* ── Hero bar ── */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-12 border-b border-celestique-dark/10 mb-12">
          <div className="space-y-3">
            <span className="block text-[9px] uppercase tracking-[0.3em] font-bold text-celestique-dark/35">
              / YOUR CATALOGUE
            </span>
            <h1 className="font-serif text-5xl md:text-6xl tracking-tighter text-celestique-dark uppercase leading-none">
              My Catalogue
            </h1>
          </div>
          <div className="flex flex-col items-start md:items-end gap-1">
            <span className="font-serif text-4xl md:text-5xl text-celestique-dark">
              {totalCount}
            </span>
            <span className="text-[9px] uppercase tracking-[0.2em] text-celestique-dark/40 font-bold">
              {activeSlug === "all" ? "total pieces" : `pieces in ${activeTab.name}`}
            </span>
          </div>
        </div>

        {/* ── Zero-products global empty state ── */}
        {isFirstLoad ? (
          <div className="flex flex-col items-center justify-center py-40 text-center border border-dashed border-celestique-dark/15 rounded">
            <div className="w-16 h-16 border border-celestique-dark/15 flex items-center justify-center mb-8">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-celestique-dark/20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6.5 2h11l4 6-9.5 14L2.5 8l4-6z" />
              </svg>
            </div>
            <h2 className="font-sans text-sm uppercase tracking-[0.25em] font-bold text-celestique-dark/40 mb-3">
              Your catalogue is empty
            </h2>
            <p className="text-[10px] uppercase tracking-[0.15em] text-celestique-dark/30 max-w-xs leading-loose mb-10">
              Start uploading your jewelry pieces to build your catalogue.
            </p>
            <Link
              href="/dashboard/wholesaler/add-product"
              className="text-[9px] uppercase tracking-[0.25em] font-bold px-8 py-4 bg-celestique-dark text-white hover:bg-celestique-dark/85 transition-colors"
            >
              Upload First Product
            </Link>
          </div>
        ) : (
          <>
            {/* ── Category Tabs ── */}
            <div className="mb-10 overflow-x-auto pb-2 -mx-2 px-2">
              <div className="flex gap-1 min-w-max">
                {TABS.map((tab) => (
                  <button
                    key={tab.slug}
                    onClick={() => handleTabChange(tab.slug)}
                    disabled={isPending}
                    className={`px-5 py-2.5 rounded-full text-[10px] uppercase tracking-[0.2em] font-bold transition-all duration-200 whitespace-nowrap ${
                      activeSlug === tab.slug
                        ? "bg-celestique-dark text-white"
                        : "bg-gray-100 text-celestique-dark/50 hover:bg-gray-200 hover:text-celestique-dark"
                    }`}
                  >
                    {tab.name}
                  </button>
                ))}
              </div>
            </div>

            {/* ── Grid ── */}
            <CatalogueGrid
              products={products}
              isLoading={isLoading}
              skeletonCount={LIMIT}
              activeCategory={activeTab.name}
            />

            {/* ── Pagination ── */}
            {!isLoading && totalPages > 1 && (
              <div className="mt-16 flex items-center justify-center gap-2">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className="w-9 h-9 flex items-center justify-center border border-celestique-dark/20 text-celestique-dark/50 hover:border-celestique-dark hover:text-celestique-dark disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-sm"
                  aria-label="Previous page"
                >
                  &#8592;
                </button>

                {Array.from({ length: totalPages }).map((_, i) => {
                  const n = i + 1;
                  // Show first, last, current and ±1 neighbours; replace others with ellipsis
                  const show = n === 1 || n === totalPages || Math.abs(n - page) <= 1;
                  const isEllipsis = !show && (n === 2 || n === totalPages - 1);
                  if (isEllipsis) return <span key={n} className="text-celestique-dark/30 text-xs px-1">…</span>;
                  if (!show) return null;
                  return (
                    <button
                      key={n}
                      onClick={() => handlePageChange(n)}
                      className={`w-9 h-9 text-[10px] uppercase tracking-widest font-bold transition-colors border ${
                        page === n
                          ? "bg-celestique-dark text-white border-celestique-dark"
                          : "border-celestique-dark/20 text-celestique-dark/50 hover:border-celestique-dark hover:text-celestique-dark"
                      }`}
                    >
                      {n}
                    </button>
                  );
                })}

                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages}
                  className="w-9 h-9 flex items-center justify-center border border-celestique-dark/20 text-celestique-dark/50 hover:border-celestique-dark hover:text-celestique-dark disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-sm"
                  aria-label="Next page"
                >
                  &#8594;
                </button>
              </div>
            )}

            {/* ── Upload CTA ── */}
            <div className="mt-20 pt-12 border-t border-celestique-dark/10 flex flex-col sm:flex-row items-center justify-between gap-6">
              <p className="text-[10px] uppercase tracking-[0.2em] text-celestique-dark/35 font-bold">
                Add more to your catalogue
              </p>
              <Link
                href="/dashboard/wholesaler/add-product"
                className="text-[9px] uppercase tracking-[0.25em] font-bold px-8 py-4 border border-celestique-dark text-celestique-dark hover:bg-celestique-dark hover:text-white transition-colors"
              >
                + Upload New Product
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
