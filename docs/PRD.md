# LingoFlux — Product Requirements Document (PRD)

---

## **1. Overview**

**Product Name:** LingoFlux  
**Tagline:** Learn languages in your actual context.  
**Platform:** Web (Next.js), Mobile (Flutter iOS/Android), Telegram Bot  
**Target Users:** Language learners who want contextual, level-based vocabulary building with multi-language support.

---

## **2. Problem Statement**

Language learners struggle with:
- Disconnected flashcards that don't reflect real-world usage
- No standardized level tracking across languages (HSK, JLPT, TOPIK, etc.)
- Learning words without context
- Inconsistent practice due to lack of timely reminders
- Managing multiple languages with different proficiency levels

---

## **3. Goals & Success Metrics**

### **Primary Goals**
1. Help users learn **10 words/day** per active language via timed notifications
2. Provide **context-aware AI translation** for real-world text
3. Support **7 languages** with their native leveling systems
4. Allow users to manage **multiple language profiles** with independent levels

### **Success Metrics (6 months post-launch)**
- **DAU/MAU ratio > 30%** (sticky daily habit)
- **Words saved/user/month > 200**
- **Notification open rate > 40%**
- **Multi-language users > 50%** of active base

---

## **4. User Personas**

### **Persona 1: The Polyglot (Daryl)**
- Learning 3+ languages simultaneously
- Different proficiency levels per language (e.g., TOCFL B1, JLPT N5)
- Needs contextual learning (reads articles, travels, works across cultures)
- Wants notifications across devices + Telegram

### **Persona 2: The Focused Learner**
- Learning 1 target language seriously
- Follows a structured curriculum (HSK 3 → HSK 4)
- Uses mobile app primarily
- Saves words from real-world encounters (OCR)

---

## **5. Feature Requirements**

---

### **5.1 User Authentication & Profiles**
**Description:** Secure login with JWT, profile management, Telegram linking.

| Requirement ID | Description | Priority |
|---|---|---|
| AUTH-1 | User can register via email/password | P0 |
| AUTH-2 | User can log in and receive JWT | P0 |
| AUTH-3 | User can link Telegram account via `/start` | P1 |
| AUTH-4 | User profile stores `telegram_chat_id` | P1 |

---

### **5.2 Multi-Language Profile Management**
**Description:** Users can add multiple languages, each with its own proficiency level.

| Requirement ID | Description | Priority |
|---|---|---|
| LANG-1 | User can add a language (zh-TW, ja, ko, vi, th, de, zh-CN) | P0 |
| LANG-2 | User can select level per language (TOCFL_3, JLPT_N5, etc.) | P0 |
| LANG-3 | User can update level as they progress | P1 |
| LANG-4 | User can deactivate a language (pause notifications) | P2 |
| LANG-5 | System supports 7 languages with native leveling systems | P0 |

---

### **5.3 Daily Word Generation & Notifications**
**Description:** 10 random words/day per active language, delivered via push/Telegram at random times.

| Requirement ID | Description | Priority |
|---|---|---|
| DAILY-1 | Cron generates 10 words/day per user-language pair | P0 |
| DAILY-2 | Words are selected based on user's current level | P0 |
| DAILY-3 | Notifications sent at random times (not bulk) | P0 |
| DAILY-4 | Support FCM (mobile), Web Push (web), Telegram Bot | P0 |
| DAILY-5 | Notification payload includes word, definition, example | P0 |
| DAILY-6 | "Highlight of the Day" shows top saved word | P2 |

---

### **5.4 Word Saving & Highlighting**
**Description:** Users can save words from notifications, OCR scans, or manual search. Context snippets are preserved.

| Requirement ID | Description | Priority |
|---|---|---|
| SAVE-1 | User can save a word from daily notification | P0 |
| SAVE-2 | User can add context snippet (where they saw it) | P1 |
| SAVE-3 | Saved words list viewable in app | P0 |
| SAVE-4 | User can delete saved words | P2 |
| SAVE-5 | Mobile OCR scan → save words from real-world text | P1 |

---

### **5.5 AI Contextual Translation**
**Description:** Translate text with grammar notes and cultural context, tailored to user's level.

| Requirement ID | Description | Priority |
|---|---|---|
| AI-1 | `POST /translate` accepts text + context + level + language | P0 |
| AI-2 | Returns translation, grammar notes, cultural context | P0 |
| AI-3 | Model selection: simple translate → GPT-4o, deep grammar → Claude | P1 |
| AI-4 | Mobile OCR → send to `/translate` → display result | P1 |

---

### **5.6 Dictionary & Curriculum Words**
**Description:** Preloaded word lists per language + level, expandable via user contributions.

| Requirement ID | Description | Priority |
|---|---|---|
| DICT-1 | Seed `curriculum_words` with 100+ words per language/level | P0 |
| DICT-2 | `GET /dictionary?lang=ja&word=猫` returns full entry | P2 |
| DICT-3 | Users can suggest new words to curriculum | P3 |

---

### **5.7 Telegram Bot**
**Description:** Passive learning via Telegram. Receive words, check saved list, manage levels.

| Requirement ID | Description | Priority |
|---|---|---|
| BOT-1 | `/start` links Telegram `chat_id` to user account | P1 |
| BOT-2 | Bot sends daily words (same as push notifications) | P1 |
| BOT-3 | `/saved` lists recent saved words | P2 |
| BOT-4 | `/level` shows current levels per language | P2 |
| BOT-5 | `/switch [lang]` changes active language | P3 |

---

### **5.8 Progress Tracking & Streaks**
**Description:** Dashboard showing learning activity, streaks, and milestones.

| Requirement ID | Description | Priority |
|---|---|---|
| PROG-1 | Track words saved per day/week/month | P1 |
| PROG-2 | Streak counter (consecutive days with ≥1 saved word) | P1 |
| PROG-3 | Level progression prompt when user masters enough words | P2 |
| PROG-4 | Dashboard shows "Highlight of the Day" | P2 |

---

## **6. Non-Functional Requirements**

| Category | Requirement |
|---|---|
| **Performance** | Daily word generation cron completes in <5s for 10k users |
| **Scalability** | Support 100k+ users with independent language profiles |
| **Security** | RLS policies on all Supabase tables; JWT auth for API |
| **Availability** | 99.9% uptime for notification delivery |
| **Latency** | AI translation response <3s (streaming if possible) |
| **Compliance** | GDPR-compliant (user data deletion endpoint) |

---

## **7. Tech Stack**

| Layer | Technology |
|---|---|
| **Auth** | Supabase Auth (JWT + refresh tokens) |
| **Database** | Supabase (PostgreSQL + RLS) |
| **Backend API** | Node.js + Express (or Supabase Edge Functions) |
| **Mobile** | Flutter (iOS + Android) |
| **Web** | Next.js 14 (App Router) + Tailwind CSS |
| **Notifications** | FCM (mobile), Web Push API (web), Telegram Bot API |
| **AI** | Claude 3.5 Sonnet (grammar), GPT-4o (translation) |
| **Scheduler** | node-cron (or Supabase cron) |
| **OCR** | Google ML Kit (mobile) |

---

## **8. MVP Scope (Phase 1 — 8 Weeks)**

**In Scope:**
- ✅ Supabase schema + RLS + seed data (7 languages)
- ✅ User auth (email/password)
- ✅ Multi-language profiles (add language, set level)
- ✅ Daily word generation (10×/day per language)
- ✅ FCM push notifications (mobile)
- ✅ Telegram bot (`/start` + daily words)
- ✅ Save words from notifications
- ✅ Flutter app (onboarding + dashboard + saved words)
- ✅ AI translation (`/translate` endpoint)

**Out of Scope (Phase 2+):**
- ❌ Browser extension
- ❌ Web Push notifications
- ❌ Advanced progress analytics
- ❌ User-contributed dictionary words
- ❌ Social features (share progress)

---

## **9. Language Level Structures**

### **TOCFL (Taiwan Mandarin) — 6 levels**
- Band A: Level 1 (A1), Level 2 (A2)
- Band B: Level 3 (B1), Level 4 (B2)
- Band C: Level 5 (C1), Level 6 (C2)

### **HSK (China Mandarin) — 6 levels (old) / 9 levels (new 3.0)**
- HSK 1-2 (A1-A2), HSK 3-4 (B1-B2), HSK 5-6 (C1-C2)

### **TOPIK (Korean) — 6 levels**
- TOPIK I: Level 1 (A1), Level 2 (A2)
- TOPIK II: Level 3 (B1), Level 4 (B2), Level 5 (C1), Level 6 (C2)

### **JLPT (Japanese) — 5 levels**
- N5 (A1), N4 (A2), N3 (B1), N2 (B2), N1 (C1-C2)

### **NLTV (Vietnamese) — 6 levels**
- Level 1 (A1) → Level 6 (C2)

### **CU-TFL (Thai) — 6 levels**
- Level 1 (A1) → Level 6 (C2)

### **CEFR (German) — 6 levels**
- A1, A2, B1, B2, C1, C2 (direct mapping)

---

## **10. Customer Journey**

1. **Onboarding:** Sign up → Pick language → Pick level → Push permission
2. **Daily Loop:** Random notification → Tap → View word → Save if useful
3. **Contextual Translation:** Camera OCR / Browser extension → Send to `/translate` → Save words
4. **Progress:** Dashboard shows streak, saved words, level progression
5. **Re-engagement:** Telegram bot sends words even if app isn't opened

---

_End of PRD_
