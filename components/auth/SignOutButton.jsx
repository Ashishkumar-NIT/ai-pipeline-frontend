"use client";

import { signOut } from "../../lib/actions/auth";

export function SignOutButton() {
  return (
    <form action={signOut}>
      <button
        type="submit"
        className="bg-[#000000] text-white px-[18px] py-[8px] rounded-md text-[14px] font-medium cursor-pointer hover:bg-black/90 transition-colors font-sans"
      >
        Sign out
      </button>
    </form>
  );
}
