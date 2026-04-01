"use client";

import { useState } from "react";

// ── Skeleton ─────────────────────────────────────────────────────────────────
function CatalogueCardSkeleton() {
  return (
    <article className="flex flex-col animate-pulse">
      <div className="relative aspect-4/5 w-full bg-gray-100 mb-5 rounded" />
      <div className="space-y-2 border-b border-gray-100 pb-4">
        <div className="flex items-center justify-between gap-2">
          <div className="h-2.5 w-2/3 bg-gray-100 rounded" />
          <div className="h-2.5 w-1/5 bg-gray-100 rounded" />
        </div>
        <div className="h-2 w-1/2 bg-gray-100 rounded" />
        <div className="h-2 w-1/3 bg-gray-100 rounded" />
      </div>
    </article>
  );
}

// ── Product Card ──────────────────────────────────────────────────────────────
function CatalogueProductCard({ product }) {
  const [imgError, setImgError] = useState(false);
  const [variantIdx, setVariantIdx] = useState(0);

  const variants =
    Array.isArray(product.generated_image_urls) &&
    product.generated_image_urls.length > 0
      ? product.generated_image_urls
      : [product.processed_image_url || product.image_url || product.raw_image_url].filter(Boolean);

  const hasMultiple = variants.length > 1;
  const activeUrl = variants[variantIdx] ?? null;

  const uploadedAt = product.created_at
    ? new Date(product.created_at).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : null;

  return (
    <article className="group flex flex-col cursor-pointer">
      {/* ── Image ── */}
      <div className="relative aspect-4/5 w-full overflow-hidden bg-gray-50 mb-5 rounded">
        {activeUrl && !imgError ? (
          <img
            src={activeUrl}
            alt={product.title || product.jewellery_type || "Jewellery"}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-celestique-dark/20">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6.5 2h11l4 6-9.5 14L2.5 8l4-6z" />
            </svg>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {product.stock_available && (
            <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-celestique-dark bg-white/90 backdrop-blur px-2.5 py-1">
              In Stock
            </span>
          )}
          {!product.stock_available && product.make_to_order_days && (
            <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-celestique-dark bg-white/90 backdrop-blur px-2.5 py-1">
              Made to Order
            </span>
          )}
        </div>

        {/* Variant carousel */}
        {hasMultiple && (
          <>
            <button
              onClick={() => { setVariantIdx((i) => (i - 1 + variants.length) % variants.length); setImgError(false); }}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 backdrop-blur flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-celestique-dark text-sm rounded"
              aria-label="Previous variant"
            >
              &#8592;
            </button>
            <button
              onClick={() => { setVariantIdx((i) => (i + 1) % variants.length); setImgError(false); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 backdrop-blur flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-celestique-dark text-sm rounded"
              aria-label="Next variant"
            >
              &#8594;
            </button>
            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
              {variants.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setVariantIdx(i); setImgError(false); }}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${i === variantIdx ? "bg-celestique-dark" : "bg-celestique-dark/30"}`}
                  aria-label={`Variant ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* ── Meta ── */}
      <div className="space-y-1 border-b border-celestique-dark/10 pb-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-sans text-[11px] uppercase tracking-[0.12em] font-bold text-celestique-dark leading-tight line-clamp-1">
            {product.title ||
              `${product.jewellery_type
                ? product.jewellery_type.charAt(0).toUpperCase() + product.jewellery_type.slice(1)
                : "Jewellery"} Piece`}
          </h3>
          {product.category && (
            <span className="text-[9px] uppercase tracking-[0.1em] text-celestique-dark/40 shrink-0">
              {product.category}
            </span>
          )}
        </div>
        {product.metal_purity && (
          <p className="text-[9px] uppercase tracking-widest text-celestique-dark/50">
            {product.metal_purity}
            {product.net_weight ? ` · ${product.net_weight}g net` : ""}
          </p>
        )}
        {uploadedAt && (
          <p className="text-[9px] uppercase tracking-widest text-celestique-dark/30">
            Added {uploadedAt}
          </p>
        )}
      </div>
    </article>
  );
}

// ── CatalogueGrid ─────────────────────────────────────────────────────────────
/**
 * @param {Object}   props
 * @param {Array}    props.products     - Array of product objects from Supabase
 * @param {boolean}  props.isLoading    - Show skeleton when true
 * @param {number}   props.skeletonCount - How many skeleton cards to show
 * @param {string}   props.activeCategory - Currently selected category label (for empty message)
 */
export default function CatalogueGrid({
  products = [],
  isLoading = false,
  skeletonCount = 12,
  activeCategory = "All",
}) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-14">
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <CatalogueCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    const isFiltered = activeCategory !== "All";
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center border border-dashed border-celestique-dark/15 rounded">
        <div className="w-14 h-14 border border-celestique-dark/20 flex items-center justify-center mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-celestique-dark/25" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6.5 2h11l4 6-9.5 14L2.5 8l4-6z" />
          </svg>
        </div>
        <h3 className="font-sans text-sm uppercase tracking-[0.2em] font-bold text-celestique-dark/40 mb-2">
          {isFiltered ? `No ${activeCategory} yet` : "No products yet"}
        </h3>
        <p className="text-[10px] uppercase tracking-[0.15em] text-celestique-dark/30 max-w-xs leading-loose">
          {isFiltered
            ? `You haven't uploaded anything in ${activeCategory}. Switch to a different category or upload your first piece.`
            : "Products you upload will appear here once they're processed."}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-14">
      {products.map((product) => (
        <CatalogueProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
