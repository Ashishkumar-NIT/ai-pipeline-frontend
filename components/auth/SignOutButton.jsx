"use client";

import { signOut } from "../../lib/actions/auth";

export function SignOutButton() {
  return (
    <form action={signOut}>
      <button
        type="submit"
        className="bg-black text-white px-3.5 py-2 rounded-md text-[13px] cursor-pointer hover:bg-black/90 transition-colors font-sfpro"
      >
        Sign Out
      </button>
    </form>
  );
}
