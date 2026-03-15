"use client";

/**
 * AuthProvider — global client-side auth context.
 *
 * Architecture:
 * - The root layout (server component) fetches the initial user via getAuthUser()
 *   and passes it as `initialUser`. This means the provider is hydrated with the
 *   correct auth state immediately — no flash of unauthenticated UI.
 * - onAuthStateChange is registered ONCE here, globally. It handles all subsequent
 *   session changes (sign in, sign out, token refresh) without any component
 *   needing to call getUser() or getSession() on its own.
 * - No component should ever call supabase.auth.getUser() or getSession() on the
 *   client side. Use the useAuth() hook instead.
 *
 * Note: Server components and server actions still call getUser() server-side for
 * security — those are isolated per-request checks and are not affected by this provider.
 */

import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "../../lib/supabase/client";

const AuthContext = createContext(null);

export function AuthProvider({ children, initialUser = null }) {
  const [user, setUser] = useState(initialUser);

  useEffect(() => {
    const supabase = createClient();

    /**
     * onAuthStateChange fires immediately with the current session (INITIAL_SESSION
     * event) on registration, and then again on every auth state change.
     * This is the ONLY place we subscribe to auth events — one listener, globally.
     */
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []); // empty deps — register once, unsubscribe on unmount

  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * useAuth — access the current user from any client component.
 *
 * Usage:
 *   const { user } = useAuth();
 *
 * Returns { user: User | null }
 */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (ctx === null) {
    throw new Error("useAuth() must be called inside <AuthProvider>. Make sure AuthProvider wraps your component tree.");
  }
  return ctx;
}
