# 🔐 Authentication Setup Plan — Jeweller Frontend

> **Strategy:** Supabase Auth (email/password + Google OAuth) with `@supabase/ssr` for
> server-side session handling in Next.js App Router. Each step below is self-contained
> and executable in order.

---

## Prerequisites Checklist

- [ ] Supabase project created at [supabase.com](https://supabase.com)
- [ ] Google OAuth app created at [console.cloud.google.com](https://console.cloud.google.com)
- [ ] Node ≥ 18, Next.js 16 (already installed)

---

## Step 1 — Supabase Project Config (Dashboard)

### 1a. Enable Email Auth Provider
> Dashboard → Authentication → Providers → Email

- [x] Enable **Email** provider
- [ ] Optional: disable "Confirm email" for dev speed (re-enable in production)

### 1b. Enable Google OAuth Provider
> Dashboard → Authentication → Providers → Google

Fill in:
| Field | Value |
|---|---|
| Client ID | `<from Google Cloud Console>` |
| Client Secret | `<from Google Cloud Console>` |

Callback URL to paste in Google Cloud Console:
```
https://<your-supabase-project-ref>.supabase.co/auth/v1/callback
```

### 1c. Set Site URL & Redirect URLs
> Dashboard → Authentication → URL Configuration

| Setting | Value |
|---|---|
| Site URL | `http://localhost:3000` |
| Redirect URLs | `http://localhost:3000/auth/callback` |

---

## Step 2 — Database Table: `profiles`

> Run in Supabase → SQL Editor

```sql
-- profiles table (extends the built-in auth.users table)
create table public.profiles (
  id          uuid references auth.users(id) on delete cascade primary key,
  email       text not null,
  full_name   text,
  avatar_url  text,
  role        text not null default 'customer', -- 'customer' | 'retailer' | 'admin'
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Row Level Security
alter table public.profiles enable row level security;

-- Policy: users can read/update their own profile
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Auto-create profile on new user signup via trigger
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

---

## Step 3 — Environment Variables

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-public-key>
```

> ⚠️ Never commit `.env.local`. It is already listed in `.gitignore` by default.

---

## Step 4 — Install Supabase Packages

```bash
npm install @supabase/supabase-js @supabase/ssr
```

---

## Step 5 — Supabase Client Utilities

Create the following files:

### `lib/supabase/client.js`
Browser-side Supabase client (used in Client Components).

### `lib/supabase/server.js`
Server-side Supabase client (used in Server Components, Route Handlers, Server Actions).

### `lib/supabase/middleware.js`
Session refresh helper called by Next.js middleware.

---

## Step 6 — Next.js Middleware (`middleware.js`)

File at the project root. Responsibilities:
- Refresh the auth session on every request
- Redirect unauthenticated users away from protected routes
- Redirect authenticated users away from `/signin` and `/signup`

Protected route prefixes (will be configured):
```
/dashboard
/profile
/orders
```

---

## Step 7 — Auth Route Handler (`app/auth/callback/route.js`)

Exchanges the OAuth/magic-link `code` from Supabase for a session cookie.
Required for Google OAuth to work correctly with SSR.

---

## Step 8 — Server Actions (`lib/actions/auth.js`)

Typed server actions for:
| Action | Description |
|---|---|
| `signUp(email, password)` | Creates user + profiles row |
| `signIn(email, password)` | Creates session |
| `signInWithGoogle()` | Initiates OAuth flow |
| `signOut()` | Destroys session |

---

## Step 9 — Wire Forms to Server Actions

- `SignUpForm.jsx` → call `signUp()` action on submit
- `SignInForm.jsx` → call `signIn()` and `signInWithGoogle()` actions
- Show field-level errors and loading states

---

## Step 10 — Protected Layout / Dashboard Stub

- `app/dashboard/page.jsx` — server component that reads session, redirects to `/signin` if unauthenticated
- `app/dashboard/layout.jsx` — shared layout for the authenticated area

---

## Step 11 — Sign Out Button Component

`components/auth/SignOutButton.jsx` — calls `signOut()` action, redirects to `/signin`.

---

## Execution Order Summary

| # | Step | File(s) |
|---|---|---|
| 1 | Supabase Dashboard config | (no code) |
| 2 | Run SQL for `profiles` table | SQL Editor |
| 3 | Add `.env.local` | `.env.local` |
| 4 | Install packages | `package.json` |
| 5 | Supabase client utils | `lib/supabase/` |
| 6 | Middleware | `middleware.js` |
| 7 | OAuth callback route | `app/auth/callback/route.js` |
| 8 | Server actions | `lib/actions/auth.js` |
| 9 | Wire forms | `SignUpForm.jsx`, `SignInForm.jsx` |
| 10 | Protected dashboard | `app/dashboard/` |
| 11 | Sign out button | `components/auth/SignOutButton.jsx` |

---

## Notes

- All auth state is managed **server-side** via cookies using `@supabase/ssr` — no `localStorage`.
- Google OAuth requires a published Google Cloud OAuth consent screen for production.
- For production, re-enable email confirmation in Supabase Dashboard.

---

> **Next action:** Share your `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
> and we'll execute Step 3 onwards.
