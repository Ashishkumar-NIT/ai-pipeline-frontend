# 🚀 Deployment Guide — Vercel + Supabase + Google OAuth

---

## 1. Deploy to Vercel

### 1a. Push to GitHub
```bash
git add .
git commit -m "production build"
git push origin main
```

### 1b. Import on Vercel
1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repo
3. Framework: **Next.js** (auto-detected)
4. Build command: `npm run build` (default)
5. Output directory: `.next` (default)
6. Click **Deploy** — note the assigned URL, e.g. `https://jwellerfrontend.vercel.app`

---

## 2. Set Environment Variables in Vercel

> Dashboard → Project → Settings → Environment Variables

Add **all three environments** (Production, Preview, Development) unless noted:

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://ljxgwiuvdpuarvdszjts.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | *(your anon key — same as in `.env`)* |
| `NEXT_PUBLIC_API_URL` | `https://ai-pipeline-production-daac.up.railway.app` |
| `NEXT_PUBLIC_SITE_URL` | `https://jwellerfrontend.vercel.app` ← **use your actual Vercel URL** |

> ⚠️ After adding env vars, trigger a **Redeploy** (Deployments → three dots → Redeploy) for them to take effect.

---

## 3. Supabase — Update Auth URLs

> [supabase.com](https://supabase.com) → Project → Authentication → URL Configuration

| Setting | Value |
|---|---|
| **Site URL** | `https://jwellerfrontend.vercel.app` |
| **Redirect URLs** | Add `https://jwellerfrontend.vercel.app/auth/callback` |

Keep `http://localhost:3000/auth/callback` in Redirect URLs for local dev — Supabase allows multiple.

---

## 4. Google OAuth — Update Authorised Origins & Redirect URIs

> [console.cloud.google.com](https://console.cloud.google.com) → APIs & Services → Credentials → your OAuth 2.0 Client ID

### Authorised JavaScript Origins
```
http://localhost:3000
https://jwellerfrontend.vercel.app
```

### Authorised Redirect URIs
```
http://localhost:3000/auth/callback
https://jwellerfrontend.vercel.app/auth/callback
https://ljxgwiuvdpuarvdszjts.supabase.co/auth/v1/callback
```

> The Supabase callback URL (`*.supabase.co/auth/v1/callback`) is **required** — Supabase handles the OAuth exchange there and then forwards to your app's `/auth/callback`.

---

## 5. Railway Backend — Add CORS for Vercel Origin

In your FastAPI app (`main.py`), update `origins`:

```python
origins = [
    "http://localhost:3000",
    "https://jwellerfrontend.vercel.app",   # ← add your Vercel URL
]
```

Redeploy the Railway service after this change.

---

## 6. Supabase — Enable Google Provider

> Authentication → Providers → Google

| Field | Value |
|---|---|
| Client ID | *(from Google Cloud Console)* |
| Client Secret | *(from Google Cloud Console)* |
| Callback URL *(read-only)* | `https://ljxgwiuvdpuarvdszjts.supabase.co/auth/v1/callback` |

Paste this callback URL into Google Cloud Console (Authorised Redirect URIs, step 4 above).

---

## 7. Vercel Preview Deployments (Optional)

Every PR gets a unique preview URL like `https://jwellerfrontend-git-pr-42-you.vercel.app`.  
Add a **wildcard** to Supabase Redirect URLs and CORS to cover them:

- Supabase Redirect URL: `https://*-you.vercel.app/auth/callback`
- FastAPI CORS origins: use `re.match` or add specific preview URLs as needed.

---

## Checklist

- [ ] Vercel project created and first deploy succeeded
- [ ] All 4 env vars set in Vercel dashboard
- [ ] `NEXT_PUBLIC_SITE_URL` matches the actual Vercel URL
- [ ] Supabase Site URL and Redirect URL updated
- [ ] Google Cloud Console — Authorised Origins + Redirect URIs updated
- [ ] Supabase Google Provider — Client ID + Secret filled in
- [ ] Railway FastAPI CORS `origins` includes Vercel URL
- [ ] Redeploy Vercel after env var changes
- [ ] Test sign-up, sign-in, Google OAuth, and product upload on production
