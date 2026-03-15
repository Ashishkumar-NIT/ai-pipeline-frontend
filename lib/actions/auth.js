"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "../supabase/server";

// Helper: resolve the destination URL based on the user's role
function roleDestination(role) {
  if (role === "wholesaler") return "/dashboard/add-product";
  if (role === "retailer") return "/";
  return "/select-role"; // no role yet — must choose
}

// ─── Sign Up ────────────────────────────────────────────────────────────────
export async function signUp(formData) {
  const supabase = await createClient();
  const email    = formData.get("email");
  const password = formData.get("password");
  const role     = formData.get("role"); // "wholesaler" | "retailer"

  if (!["wholesaler", "retailer"].includes(role)) {
    return { error: "Please select a role (Wholesaler or Retailer)." };
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { role }, // stored in raw_user_meta_data → triggers profile creation
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/auth/callback`,
    },
  });

  if (error) return { error: error.message };

  revalidatePath("/", "layout");
  redirect(roleDestination(role));
}

// ─── Sign In ────────────────────────────────────────────────────────────────

export async function signIn(formData) {
  const supabase = await createClient();
  const email    = formData.get("email");
  const password = formData.get("password");

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: error.message };

  // Read role from metadata (set at signup time)
  const role = data.user?.user_metadata?.role;

  // If no role in metadata, check profiles table as fallback
  if (!role) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .single();

    revalidatePath("/", "layout");
    redirect(roleDestination(profile?.role ?? null));
  }

  revalidatePath("/", "layout");
  redirect(roleDestination(role));
}

// ─── Sign In with Google (OAuth) ────────────────────────────────────────────

export async function signInWithGoogle() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      // After OAuth, the callback route will check role and route accordingly
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/auth/callback`,
    },
  });

  if (error) return { error: error.message };

  // data.url is the Google consent screen URL — redirect the user there
  redirect(data.url);
}

// ─── Sign Out ───────────────────────────────────────────────────────────────

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/signin");
}
