# DeafLMS — Visual-Literacy & Intelligent Diagnostic Platform

> **From Sign to Meaning—One Clear Step at a Time**
>
> Early-stage prototype currently being tested with Deaf learners.  
> Developed by **Acclusivo**, a Deaf-led inclusive-technology startup owned by **Tech Inclusion Enterprise Ltd**, Abuja, Nigeria.

---

## 1. Product Positioning & Mission

**DeafLMS** is a Deaf-led visual-literacy and intelligent assessment platform. It helps identify where a learner is struggling between sign, picture, written word, spelling and meaning, then recommends the appropriate next learning activity.

### What DeafLMS Is:
* A structured, five-step visual literacy bridge connecting human-reviewed signs, real object pictures, English written words, touch-typing spelling, and simple everyday meanings.
* An intelligent, rule-based diagnostic assessment tool that shows educators and facilitators exactly where a student needs support.
* A zero-auditory, child-safe learning environment designed toward WCAG 2.2 AA standards.

### What DeafLMS Is NOT:
* Not an unreviewed video repository.
* Not an automatic sign-language translator.
* Not an ungrounded AI that invents Nigerian Sign Language handshapes.
* Not a replacement for Deaf teachers or human facilitators.
* Not a medical or cognitive diagnostic tool.

---

## 2. ACE Pitch Competition 90-Second Demo

* **Primary Demo Route:** [`/demo`](http://localhost:3000/demo)
* **Target Journey Duration:** Under 90 seconds
* **Four Foundational Computer Words:**
  1. `Webcam`
  2. `Keyboard`
  3. `Mouse`
  4. `Monitor`

### The 8-Step Competition Journey:
1. **Step 1: Watch Sign Video** — Human-reviewed sign video with 0.5x, 0.75x, and 1.0x slow-motion controls, full upper-body signing space preserved.
2. **Step 2: Select Picture** — Match the sign to the real physical object. (Written answer hidden until learner responds).
3. **Step 3: Learn the Word** — Inspect large English letters with tap-to-view fingerspelling handshapes.
4. **Step 4: Learn Simple Meaning** — Short, accessible sentences with zero confusing jargon.
5. **Step 5: Practise Spelling** — Type on physical laptop keys or on-screen visual keyboard with visual confetti affirmation.
6. **Step 6: Check Understanding** — Comprehension check question based on the simple meaning.
7. **Step 7: View Result** — Immediate visual confirmation with options to "Watch Again", "Try Again", or "Continue".
8. **Step 8: Learning Recommendation** — Rule-based diagnostic logic recommending the specific stage to repeat if errors occurred.
9. **Sample Facilitator Results** — One-click transition to [`/facilitator-results`](http://localhost:3000/facilitator-results).

---

## 3. Five Evaluation Criteria Alignment

| Evaluation Pillar | Competition Alignment & Engineering Implementation |
| :--- | :--- |
| **1. AI Fit (20 pts)** | Retrieval-first safety pipeline. AI strictly retrieves approved vocabulary from a reviewed library. Never invents signs or generates physical directions. Safe fallback when offline. |
| **2. Service Design (20 pts)** | Clear separation of stakeholders: Learner, Facilitator, Admin, Parent/Guardian, School/NGO Sponsor. Transparent 5-step cognitive bridge from sign to meaning. |
| **3. Prototype (20 pts)** | Robust, stable 4-word loop runnable offline in under 90 seconds. Physical keyboard listening, variable speed video, immediate visual affirmation, one-click restart. |
| **4. User Testing (20 pts)** | Honest discovery observations from two Deaf learners (ages 16 and 10) documented in [`USER_TESTING.md`](./USER_TESTING.md). No invented traction. Statuses marked as "Awaiting retest." |
| **5. Business Model Linkage (20 pts)** | Clear user vs. buyer distinction. Proposed school/learning centre pilot licenses and sponsored cohort models. All prices clearly marked as proposed. |

---

## 4. Key Routes & Pages

* [`/`](http://localhost:3000/) — Revised homepage with learner problem, 5-step solution, and pilot invitation.
* [`/demo`](http://localhost:3000/demo) — 90-second four-word competition learner journey with restart capability.
* [`/keyboard-trainer`](http://localhost:3000/keyboard-trainer) — Attached Colourful Hand Virtual Keyboard Trainer with bilateral touch typing curriculum (ASDF → JKL; → GH → Vocab) and AnySign ASL handshapes.
* [`/facilitator-results`](http://localhost:3000/facilitator-results) — Sample educator diagnostic dashboard showing error stages without medical claims.
* [`/user-testing`](http://localhost:3000/user-testing) — Observed user testing logs and product iterations.
* [`/pricing`](http://localhost:3000/pricing) — Transparent proposed pricing tiers and pilot partnership inquiry.
* [`/accessibility`](http://localhost:3000/accessibility) — Accessibility commitment designed toward WCAG 2.2 AA.
* [`/privacy`](http://localhost:3000/privacy) — Child privacy pledge (zero collection of audiological or biometric records).

---

## 5. Technology Stack

* **Framework:** Next.js 14 (App Router), React 18, TypeScript
* **Styling:** Tailwind CSS (Modern, high-contrast, accessible design system)
* **Icons & Visual Rewards:** Lucide React, Canvas-Confetti (100% visual celebrations)
* **AI Engine:** Google Gemini API with strict retrieval bounds and instant offline mock fallback
* **State & Data:** In-memory verified vocabulary store with Supabase migration schema ready

---

## 6. Running Locally

```bash
# Clone the repository and navigate into folder
cd DeafLMS

# Install dependencies
npm install

# Run the Next.js development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 7. Company & Governance Structure

* **Legal Owner:** Tech Inclusion Enterprise Ltd, Abuja, Nigeria.
* **Operating Startup:** Acclusivo (Deaf-led inclusive-technology startup).
* **Product:** DeafLMS is a product of Acclusivo.
* **Nonprofit Partner:** Tech Inclusion for the Deaf Initiative (TIDI) is an independent nonprofit and possible pilot partner; TIDI does not own Acclusivo or DeafLMS.

> DeafLMS is a product of Acclusivo, owned by Tech Inclusion Enterprise Ltd, Abuja, Nigeria.  
> © 2026 Tech Inclusion Enterprise Ltd. All rights reserved.
