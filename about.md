
# Product Requirements Document (PRD): The Chamomile Garden

## 1. Project Overview & Aesthetic Vision
**The Chamomile Garden** is a private, cozy, and intimate web app built for a specific user (Adyasha) to log, read, and share her poetry. It functions as a digital garden. 

* **Vibe:** Studio Ghibli meets modern minimalism. Soft, nurturing, warm, and highly tactile.
* **Core Loop:** Adyasha "plants" a poem (creates a post). Public users read it and click a watering can to "water" it (infinite likes). 
* **Primary Device:** **Mobile-first.** The mobile experience must be flawless, with generous touch targets, smooth bottom-sheet modals, and fluid animations.

## 2. Technical Stack
* **Frontend:** React (Next.js or Vite)
* **Styling:** Tailwind CSS
* **Animations:** Framer Motion (for physics-based, bouncy, rich UI interactions)
* **Backend/Database:** Supabase
* **Hosting:** Vercel or Netlify

## 3. Design System & Tokens (Strict Implementation)
The UI must strictly adhere to these specific tokens to maintain the cozy, premium feel. 

**Color Palette:**
* **Background (Main):** `#F4F1E1` (Warm Cream)
* **Card Background:** `#FCFAF2`
* **Primary Action (Buttons):** `#789B73` (Sage Green)
* **Text (Primary/Headings):** `#4A443A` (Soft Earthy Brown)
* **Text (Secondary/Poetry Body):** `#737067` (Muted Moss)
* **Accent (Chamomile Yellow):** `#E8C872`

**Tag Colors (Background / Text):**
* **SOUL:** `#F1E8D9` / `#A48A63`
* **OCEAN:** `#E2EDF8` / `#7BA4C7`
* **LOSS:** `#F4E3E3` / `#C28B8B`
* **GROWTH:** `#E5F0E5` / `#7EA87E`
* **BLUE:** `#E2EBFA` / `#6A8AC2`
* **LOVE:** `#F8E2E8` / `#C4728A`

**Typography:**
* **Headings & Poetry Body:** `Lora` or `Playfair Display` (Google Fonts). Must use a `line-height` of `1.8` for poetry readability.
* **UI Elements (Buttons, Tags, Nav):** `Inter` or `Nunito` (Google Fonts).
* *Note: Never use pure black text. Always use the Primary Text token.*

**Borders & Shadows:**
* **Border Radius:** Use `rounded-2xl` (1rem) for cards and modals. `rounded-full` for tags and buttons.
* **Soft Shadow:** `box-shadow: 0 8px 30px rgba(120, 155, 115, 0.08);` (No harsh gray/black drop shadows).

## 4. Application Architecture & Routing
* `/` : The main garden dashboard (Public view).
* `/secret-garden` : The hidden admin login route. Contains a beautifully minimal password input centered on the screen.

## 5. Core Components & UX Flows

### A. The Dashboard (Public Garden)
* **Layout:** A stylized CSS grid. 1-column on mobile with `gap-6` spacing. 3-to-4 columns on desktop. App padding should be `p-6`.
* **Card Anatomy:** * Top left: Chosen Icon (emoji or SVG).
    * Top right: Close/Menu dot (if admin).
    * Middle: Title (Serif, Bold) and a 2-line clamped preview of the poem.
    * Bottom: Water count (with blue droplet icon) and the theme Tag. 

### B. The Reading Experience (Mobile-Optimized)
* **Trigger:** Tapping a card opens the poem.
* **Interaction:** On mobile, this must be a **Bottom Sheet** sliding up from the bottom, taking up 85% of the screen with a draggable handle at the top. On desktop, a standard centered modal is fine. 
* **Background:** The dashboard behind the modal should gently blur (`backdrop-blur-sm`) and dim.
* **Watering Mechanic:** * A sticky button at the bottom: "Water this" (with a watering can icon).
    * **Infinite Clicks:** Users can spam this button. 
    * **Animation:** Clicking triggers a Framer Motion burst of tiny water drops and green leaves arcing upwards. The watering can icon should tilt `-20deg` on click.

### C. Admin Flow ("The Gardener")
* **Login:** After authenticating at `/secret-garden`, the user is redirected to `/` but with elevated UI state.
* **Floating Action Button (FAB):** A sticky, glowing primary button `+ Plant a Thought` appears.
* **Planting Modal:** Contains inputs for Title, Poem Body (auto-expanding textarea), a dropdown to select the Icon (Moon, Wave, Flower, Stars, etc.), and a dropdown for the Tag.
* **Edit/Delete:** A subtle 3-dot menu appears on cards for the admin to edit typos or delete the post.

## 6. Supabase Database & Security Specs

**Project Details:**
* **URL:** `https://stwmdjbajgppbsipnalo.supabase.co`
* **Project ID:** `stwmdjbajgppbsipnalo`
* **Anon Public Key:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN0d21kamJhamdwcGJzaXBuYWxvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ2ODY5NDUsImV4cCI6MjA5MDI2Mjk0NX0.Etv7Y2l86R53Vcf6QPTtYxcTAqmIN0_Vn0FfQ888-wQ`
* **Publishable Key:** `sb_publishable_BAmP9_CHUbXkjz3JYqA7IA_Tu-41dH4`

**Table Schema: `poems`**
* `id` (uuid, primary key, default `uuid_generate_v4()`)
* `created_at` (timestamptz, default `now()`)
* `title` (text)
* `content` (text)
* `icon_id` (text)
* `tag_name` (text)
* `water_count` (int4, default `0`)

**Database Functions (Crucial for Infinite Watering):**
The engineer must create a Postgres RPC (Remote Procedure Call) to safely increment the water count without race conditions when multiple people click at the same time.
```sql
create or replace function increment_water(poem_id uuid)
returns void as $$
begin
  update poems
  set water_count = water_count + 1
  where id = poem_id;
end;
$$ language plpgsql;
```

**Row Level Security (RLS) Policies:**
1.  **Enable RLS** on the `poems` table.
2.  **Public Read:** `CREATE POLICY "Public profiles are viewable by everyone." ON poems FOR SELECT USING (true);`
3.  **Public Update (Watering Only):** Public users should technically not have raw UPDATE access to avoid malicious text editing. They should ONLY interact via the `increment_water` RPC function. 
4.  **Admin All Access:** Create an authenticated policy allowing full `INSERT`, `UPDATE`, `DELETE` for the admin user.

## 7. Edge Cases & Polish
* **Empty State:** If no poems exist, show a centered, soft graphic of a seed in dirt with text: *"The garden is waiting for its first thought..."*
* **Loading State:** While fetching from Supabase, display skeleton cards that gently pulse in the `FCFAF2` color.
* **Scrollbars:** Hide default webkit scrollbars in the poem reading view for a cleaner, app-like aesthetic.

