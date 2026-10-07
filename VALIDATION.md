# VALIDATION.md — DeafLMS Assumptions & Evidence Map

## 1. Overview
This document tracks critical hypotheses, assumptions, and validation statuses for the DeafLMS competition MVP. Every claim presented to judges in the ACE pitch competition is categorized based on verified evidence versus unverified assumptions.

---

## 2. Hypothesis & Evidence Matrix

| Area | Hypothesis | Evidence Status | Current Supporting Data | Next Validation Milestone |
| :--- | :--- | :--- | :--- | :--- |
| **Learner Problem** | Deaf learners experience a specific gap between recognizing an image and understanding its English spelling and simple meaning. | **Discovery Evidence** (Early Validation) | Qualitative observations of 16-year-old (`DL-01`) and 10-year-old (`DL-02`) Deaf learners. | 30-student cohort pilot across 2 inclusive schools in Abuja. |
| **Interface Ergonomics** | Physical laptop keyboarding and visual QWERTY typing engage Deaf learners more effectively than paper handwriting. | **Discovery Evidence** | Strong positive engagement and spontaneous keyboard exploration during `DL-01` session. | Comparative trial measuring task completion time vs. pencil-and-paper worksheets. |
| **AI Safety Boundaries** | Restricting AI to pre-reviewed vocabulary and forbidding generative sign descriptions prevents misinformation. | **Validated in Prototype** | Retrieval-first engine implemented. Non-approved queries (e.g. "photosynthesis") return explicit refusal disclaimers. | Zero hallucinations in automated unit testing suite across 50 out-of-domain terms. |
| **Offline Reliability** | Pitch competition demos must not rely on live Wi-Fi or external AI cloud APIs. | **Validated in Prototype** | Complete 4-word learning loop and fallback mock engine execute with zero active network requests. | Live pitch rehearsal under simulated offline conditions. |
| **Institutional Willingness to Pay** | Special education schools and sponsor NGOs will pay an annual license for diagnostic learning tracking. | **Unverified Assumption** | Informal feedback from educators expressing high interest in learning gap identification. | Formal Letters of Intent (LOIs) from 3 partner schools and NGO grant sponsors. |
| **Pricing Validation** | ₦5,000/month for family supporter and ₦45,000/year for school licensing reflect sustainable price points. | **Unverified Assumption** (Explicitly labeled as proposed price) | Initial willingness-to-pay interviews with parents and private special education heads. | Price sensitivity survey with 50 prospective buyers during pilot recruitment. |

---

## 3. Prohibited Claims Audit Record

The following unsupported marketing claims were strictly audited and removed from the application:

* ❌ **"Pedagogically proven"** → Replaced with: *"Early-stage prototype currently being tested with Deaf learners."*
* ❌ **"NERDC curriculum certified"** → Replaced with: *"Proposed future curriculum alignment."*
* ❌ **"WCAG 2.2 AAA certified"** → Replaced with: *"Designed toward WCAG 2.2 AA standards; formal testing in progress."*
* ❌ **"AI understands and generates NSL"** → Replaced with: *"AI never invents signs; all approved signs are verified by human Deaf educators."*
* ❌ **"District-wide deployment / 24+ completed modules"** → Replaced with: *"Initial four-word competition MVP (Webcam, Keyboard, Mouse, Monitor)."*
* ❌ **"Deaf LMS Education Foundation (Lagos)"** → Replaced with: *"DeafLMS is a product of Acclusivo, owned by Tech Inclusion Enterprise Ltd, Abuja, Nigeria."*
* ❌ **Public meeting link (`meet.google.com`)** → Completely removed to protect child safeguarding.
