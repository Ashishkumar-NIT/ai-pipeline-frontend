import { getAuthUser } from "../../../lib/supabase/queries";
import { redirect } from "next/navigation";
import Link from "next/link";
import { AddProductForm } from "../../../components/product/AddProductForm";
import { SignOutButton } from "../../../components/auth/SignOutButton";

export const metadata = { title: "Add Product — Celestique" };

export default async function AddProductPage() {
  const user = await getAuthUser();

  if (!user) redirect("/signin");

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-[#e5e5e5] bg-white px-10 py-4">
        {/* Left - Back to dashboard */}
        <Link
          href="/dashboard/wholesaler"
          className="flex items-center gap-2 text-sm text-[#374151] hover:text-[#111827] transition-colors cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          <span>Back to dashboard</span>
        </Link>

        {/* Right - User info and sign out */}
        <div className="flex flex-col items-end gap-1.5">
          <span className="text-[13px] text-[#6B7280]">{user.email}</span>
          <SignOutButton />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col gap-10 max-w-[1100px] w-full mx-auto px-10 py-10">
        <AddProductForm />
      </main>

      {/* Footer */}
      <footer className="border-t border-[#e5e5e5] bg-white px-10 py-4">
        <div className="max-w-[1100px] mx-auto flex items-center justify-between">
          <p className="text-sm text-[#6B7280]">
            All Rights Reserved © Jewels India
          </p>
          <p className="text-sm text-[#374151]">Crafted with ❤️ in blr</p>
        </div>
      </footer>
    </div>
  );
}
