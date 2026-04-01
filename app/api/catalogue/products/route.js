import { NextResponse } from "next/server";
import { createClient } from "../../../../lib/supabase/server";

const LIMIT = 12;

export async function GET(request) {
  const supabase = await createClient();

  // ── 1. Auth guard ──────────────────────────────────────────────────────────
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ── 2. Parse query params ──────────────────────────────────────────────────
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") ?? "";
  const page     = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const limit    = Math.min(50, parseInt(searchParams.get("limit") ?? String(LIMIT), 10));

  const fromIndex = (page - 1) * limit;
  const toIndex   = fromIndex + limit - 1;

  // ── 3. Build query (RLS ensures only this user's products are accessible) ──
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

  if (category && category.toLowerCase() !== "all") {
    query = query.ilike("category", `%${category}%`);
  }

  query = query
    .order("created_at", { ascending: false })
    .range(fromIndex, toIndex);

  const { data, count, error } = await query;

  if (error) {
    console.error("[GET /api/catalogue/products]", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data: data ?? [], count: count ?? 0 });
}
