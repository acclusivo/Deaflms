# Deaf LMS — K-12 Visual Learning & Digital Literacy Platform

An accessibility-first Learning Management System designed specifically for Deaf and Hard-of-Hearing (DHH) K-12 learners, educators, and school administrators.

---

## Key Features

1. **Tri-Directional Literacy Engine:**
   * **Picture-to-Sign Matching:** Real-world concept illustrations connected to sign language videos.
   * **Sign-to-Text Matching:** Sign demonstrations linked to written English words and sentences.
   * **Fingerspell Word Builder:** Tap-to-spell interactive letter tiles.

2. **Digital & Computer Literacy Track:**
   * **Hardware Explorer:** Interactive computer diagram where students identify webcam, keyboard, mouse, monitor, and ports via teacher sign prompts.
   * **Fingerspell Keyboarding Trainer:** Visual QWERTY keyboard with sign handshapes mapping to keys for touch typing.
   * **Video Call Sign Etiquette:** Proper lighting, camera angle, chat literacy, and live caption activation guidelines.

3. **Sign-First Video Player:**
   * Variable speeds (`0.5x`, `0.75x`, `1.0x`) for inspecting delicate fingerspelling.
   * Segment A-B looping for continuous signing practice.

4. **Interactive Visual Storybook Reader:**
   * Dual-pane illustrated pages with side-by-side synchronized teacher sign video.
   * Tap-to-sign vocabulary popup tags.

5. **Gemini AI Integration:**
   * **"Signy" Student Visual AI Tutor:** Explains difficult words with visual analogies, handshape/movement guidelines, and fingerspelling sequences. Zero auditory dependencies.
   * **Educator AI Co-Pilot:** Generates full DHH-tailored vocabulary banks, sign cues, and matching worksheets from any topic prompt.

6. **Tri-Portal Architecture:**
   * `/student`: Visual learning paths, star counter, trophy case, interactive worksheets.
   * `/teacher`: Curriculum builder, video uploader, AI generator, and gradebook.
   * `/admin`: School KPIs, user roster management, curriculum moderation, and storage quota monitor.

---

## Tech Stack

* **Frontend:** Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS
* **Icons & Animation:** Lucide React, Canvas-Confetti (visual celebrations)
* **Backend:** Supabase (PostgreSQL, Supabase Auth, Supabase Storage)
* **AI Engine:** Google Gemini 1.5/2.0 API (with automatic local mock fallback)
* **Deployment:** Vercel

---

## Getting Started Locally

```bash
cd DeafLMS

# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

---

## Environment Variables (Optional)

The platform runs out-of-the-box with pre-seeded sample courses, lessons, and AI mock responses. To connect to live cloud services, create `.env.local`:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Google Gemini AI
GEMINI_API_KEY=your-gemini-api-key
```

---

## Database Setup (Supabase)

Run the SQL migration script located in:
`supabase/schema.sql`

This creates:
* `profiles` table with role-based policies (`student`, `teacher`, `admin`)
* `courses`, `lessons`, `vocabulary_items`, and `worksheets` tables
* `student_progress` tracking table
* Storage bucket configurations for `sign-videos` and `illustrations`

---

## Deploying to Vercel

1. Push your repository to GitHub / GitLab.
2. Import the project into Vercel.
3. Set the Root Directory to `DeafLMS`.
4. (Optional) Add your `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `GEMINI_API_KEY` in Vercel Environment Variables.
5. Click **Deploy**.
