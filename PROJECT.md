# PROJECT.md — DeafLMS Competition Architecture & System Design

## 1. Executive Summary
DeafLMS is an accessible, Deaf-led visual literacy and intelligent diagnostic assessment platform designed specifically for Deaf and Hard-of-Hearing (DHH) learners aged 9–16.

The MVP is engineered to demonstrate a focused, safe, and stable 90-second learning loop across four foundational computer vocabulary words:
1. `Webcam`
2. `Keyboard`
3. `Mouse`
4. `Monitor`

---

## 2. Core Stakeholders & Role Architecture

| Stakeholder Role | Access Mechanism | Primary Responsibility in Platform |
| :--- | :--- | :--- |
| **Learner** (Ages 9–16) | Public / School Registration | Engages with the 5-step visual literacy loop (Watch -> Picture -> Word -> Meaning -> Type). Receives visual affirmation and rule-based review. |
| **Facilitator** (Teacher/Tutor) | Controlled Registration (Invite only) | Reviews diagnostic progress dashboards to see which learning stage (sign, picture, spelling, meaning) requires support. |
| **Administrator** | Internal Institutional Provisioning | Curates verified sign video assets, manages school rosters, and monitors institutional quotas. |
| **Parent / Guardian** | Public Registration | Provides consent, manages accounts for learners under 13, and tracks home vocabulary progress. |
| **Buyer / Sponsor** | Institutional Contract / Pilot | Schools, state education boards, NGOs, and foundations funding pilot cohorts. |

---

## 3. The 5-Step Visual Literacy Architecture

To bridge the gap discovered during user testing where Deaf learners recognize images but struggle to spell or understand written words, DeafLMS implements a five-step progression:

```text
[Step 1: Watch Sign] 
       ↓ (0.5x, 0.75x, 1x slow-motion controls, upper-body signing space preserved)
[Step 2: Select Picture] 
       ↓ (Visual object recognition; English word text is hidden before choice)
[Step 3: Learn Word] 
       ↓ (Large letter display with interactive tap-to-view fingerspelling shapes)
[Step 4: Learn Meaning] 
       ↓ (Short sentences and familiar everyday examples; no auditory analogies)
[Step 5: Type Spelling] 
       ↓ (Physical laptop keyboard, visual QWERTY typing, and attached Colourful Hand trainer; visual confetti affirmation)
[Step 6: Meaning Check] 
       ↓ (Comprehension verification quiz)
[Step 7 & 8: Diagnostic Recommendation]
       ↓ (Rule-based recommendation identifying exact stage for repetition)
[Facilitator Dashboard Update]
```

---

## 4. AI Fit & Safety Boundaries

DeafLMS implements a strict **Retrieval-First Pipeline** to ensure complete safety and prevent AI hallucinations:

1. **Approved Vocabulary Retrieval:**
   - Any query to the AI engine first checks `APPROVED_COMPUTER_WORDS`.
   - If found: the model returns human-reviewed Nigerian Sign Language content with verified reviewer metadata.
   - If not found (e.g., "photosynthesis", "cryptocurrency"): the system explicitly declines to invent or generate sign handshapes, movements, or locations. It returns:
     > *"This word is not yet in our reviewed sign library. I can give you a simple written meaning, but I cannot create or approve its Nigerian Sign Language sign. Ask your facilitator for the reviewed local sign."*

2. **Prohibited AI Behaviors:**
   - Never invent physical sign descriptions or handshapes.
   - Never claim an unverified sign is authentic NSL.
   - Never generate medical or cognitive diagnoses for learners.
   - Never replace a human Deaf instructor.

3. **Offline & Disconnection Fallback:**
   - The entire 4-word MVP functions 100% offline without live internet or external AI API calls.

---

## 5. Technical Specifications

* **Frontend Framework:** Next.js 14.2 (App Router)
* **Language:** TypeScript 5.6 (Strict Type Checking)
* **Styling & Design Tokens:** Tailwind CSS with WCAG 2.2 AA contrast compliance
* **Celebration & Visual Haptics:** Canvas-Confetti (Zero auditory reliance)
* **Database & Auth:** Supabase PostgreSQL with role-based policies (Mock mode active for standalone competition demo)
* **Legal Ownership:** Tech Inclusion Enterprise Ltd, Abuja, Nigeria (Acclusivo Startup)
