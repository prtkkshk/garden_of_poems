# 🌸 The Chamomile Garden

> A quiet, cozy digital garden for poetry. Plant thoughts. Let them bloom.

---

## Stack

- **Next.js 14** (App Router)
- **Tailwind CSS** — custom design tokens baked in
- **Framer Motion** — bouncy, physics-based animations
- **Supabase** — database + RPC for safe water counting

---

## 🚀 Getting Started

### 1. Set up Supabase

Go to your [Supabase SQL Editor](https://supabase.com/dashboard/project/stwmdjbajgppbsipnalo/sql/new) and run the contents of **`setup.sql`** in full. This creates:

- The `poems` table with the correct schema
- Row Level Security policies
- The `increment_water` RPC function (prevents race conditions)

### 2. Install dependencies

```bash
npm install
```

### 3. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — the garden is alive 🌱

---

## 🗝️ Admin Access

Navigate to `/secret-garden` and enter the admin password.

Once logged in, you'll see:

- A **"+ Plant a thought"** floating button
- **3-dot menus** on every poem card for edit / delete
- **Edit & Delete** buttons inside the reading modal

To log out, click the **"Gardener"** badge in the top-right corner.

---

## 🌍 Deploying to Vercel

1. Push this project to GitHub
2. Import the repo at [vercel.com](https://vercel.com)
3. No environment variables needed — Supabase keys are baked in for this private project
4. Hit **Deploy** 🎉

---

## 📁 Project Structure

```
chamomile-garden/
├── app/
│   ├── layout.tsx          # Root layout, Google Fonts (Lora + Nunito)
│   ├── page.tsx            # Main garden dashboard
│   ├── globals.css         # Design tokens, utilities, scrollbar hiding
│   └── secret-garden/
│       └── page.tsx        # Admin login
├── components/
│   ├── PoemCard.tsx        # Card with 3-dot admin menu
│   ├── PoemModal.tsx       # Bottom sheet (mobile) / Modal (desktop) + water animation
│   ├── PlantModal.tsx      # Create / edit poem form
│   ├── TagBadge.tsx        # Coloured tag chips
│   ├── SkeletonCard.tsx    # Loading pulse cards
│   └── EmptyState.tsx      # Seed illustration when garden is empty
├── lib/
│   ├── supabase.ts         # Client, types, ICONS, TAGS, TAG_STYLES
│   └── auth.ts             # Password check + localStorage admin session
├── setup.sql               # Run this in Supabase SQL editor first!
└── tailwind.config.js      # All design tokens
```

---

## 🎨 Design Tokens (quick ref)

| Token | Value | Use |
|---|---|---|
| Background | `#F4F1E1` | Page background |
| Card | `#FCFAF2` | Cards & modals |
| Sage Green | `#789B73` | Buttons, FAB |
| Earth Brown | `#4A443A` | Headings |
| Muted Moss | `#737067` | Body text |
| Chamomile | `#E8C872` | Accent line |

---

Made with 🌸 for Adyasha.
