import { createClient } from "../../../../lib/supabase/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import CatalogueClient from "../../../../components/wholesaler/catalogue/CatalogueClient";

export const metadata = { title: "My Catalogue — Celestique" };

const LIMIT = 12;

export default async function CataloguePage({ searchParams }) {
  const supabase = await createClient();

  // ── 1. Auth guard ──────────────────────────────────────────────────────────
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/signin");

  const role = user.user_metadata?.role;
  if (!role) redirect("/select-role");
  if (role !== "wholesaler") redirect("/");

  // ── 2. Read initial category from URL ─────────────────────────────────────
  const rawCategory = (await searchParams)?.category ?? "all";
  const initialCategory = rawCategory.toLowerCase();

  // ── 3. Fetch first page of products (SSR for instant load) ────────────────
  let query = supabase
    .from("products")
    .select(
      `id,
       title,
       jewellery_type,
       category,
       style,
       size,
       stock_available,
       make_to_order_days,
       metal_purity,
       net_weight,
       gross_weight,
       stone_weight,
       raw_image_url,
       processed_image_url,
       generated_image_urls,
       image_url,
       wholesaler_email,
       created_at`,
      { count: "exact" }
    )
    .eq("wholesaler_id", user.id);

  if (initialCategory && initialCategory !== "all") {
    query = query.ilike("category", `%${initialCategory}%`);
  }

  query = query
    .order("created_at", { ascending: false })
    .range(0, LIMIT - 1);

  const { data, count, error } = await query;

  if (error) {
    console.error("[CataloguePage] Supabase error:", error.message);
  }

  const initialProducts = data ?? [];
  const initialCount = count ?? 0;

  return (
    <Suspense>
      <CatalogueClient
        initialProducts={initialProducts}
        initialCount={initialCount}
        initialCategory={initialCategory}
        wholesalerId={user.id}
        userEmail={user.email}
      />
    </Suspense>
  );
}
