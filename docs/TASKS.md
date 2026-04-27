# LingoFlux — Task List

## **Phase 1: Database & Auth (Week 1)**

- [ ] **Task 1.1:** Create Supabase project
- [ ] **Task 1.2:** Write SQL migration (`profiles`, `language_levels`, `user_language_profiles`, `curriculum_words`, `saved_words`, `daily_words`)
- [ ] **Task 1.3:** Enable RLS on all tables + write policies
- [ ] **Task 1.4:** Seed `language_levels` for 7 languages (TOCFL, HSK, TOPIK, JLPT, NLTV, CU-TFL, CEFR German)
- [ ] **Task 1.5:** Seed `curriculum_words` (100 words per language/level)
- [ ] **Task 1.6:** Set up Supabase Auth (email/password)
- [ ] **Task 1.7:** Test RLS policies (user can only access own data)

---

## **Phase 2: Backend API (Week 2)**

- [ ] **Task 2.1:** Scaffold Node.js + Express project
- [ ] **Task 2.2:** Implement `POST /auth/register` + `POST /auth/login`
- [ ] **Task 2.3:** Implement `GET /languages/levels?lang=ja`
- [ ] **Task 2.4:** Implement `POST /users/languages` (add language to profile)
- [ ] **Task 2.5:** Implement `GET /users/languages` (list user's languages)
- [ ] **Task 2.6:** Implement `POST /words/save` (save a word)
- [ ] **Task 2.7:** Implement `GET /words/saved` (list saved words)
- [ ] **Task 2.8:** Implement `POST /translate` (AI translation endpoint)
- [ ] **Task 2.9:** Write daily word generation cron logic
- [ ] **Task 2.10:** Write notification dispatcher (FCM + Telegram)

---

## **Phase 3: Flutter Mobile App (Week 3-4)**

- [ ] **Task 3.1:** Scaffold Flutter project (iOS + Android)
- [ ] **Task 3.2:** Set up `supabase_flutter` + JWT handling
- [ ] **Task 3.3:** Build onboarding screens (sign up → pick language → pick level)
- [ ] **Task 3.4:** Build home dashboard (today's words, streak counter)
- [ ] **Task 3.5:** Build word detail screen (definition, example, save button)
- [ ] **Task 3.6:** Build saved words list + search
- [ ] **Task 3.7:** Integrate FCM push notifications
- [ ] **Task 3.8:** Integrate camera OCR (`google_mlkit_text_recognition`)
- [ ] **Task 3.9:** Build language manager (add/remove languages, change levels)
- [ ] **Task 3.10:** Test on iOS Simulator + Android Emulator

---

## **Phase 4: Telegram Bot (Week 5)**

- [ ] **Task 4.1:** Create Telegram bot via BotFather
- [ ] **Task 4.2:** Implement `/start` command (link `chat_id` to user)
- [ ] **Task 4.3:** Implement daily word sender (poll `daily_words` + send via Bot API)
- [ ] **Task 4.4:** Implement `/daily` command (show today's words)
- [ ] **Task 4.5:** Implement `/saved` command (list saved words)
- [ ] **Task 4.6:** Deploy bot (polling or webhook mode)

---

## **Phase 5: AI Integration (Week 6)**

- [ ] **Task 5.1:** Set up Claude API + GPT-4o API keys
- [ ] **Task 5.2:** Implement smart routing (simple translate → GPT-4o, grammar → Claude)
- [ ] **Task 5.3:** Build prompt templates for contextual translation
- [ ] **Task 5.4:** Test translation quality across 7 languages
- [ ] **Task 5.5:** Add streaming response to Flutter app (if supported)

---

## **Phase 6: Web App — Next.js (Week 7)**

- [ ] **Task 6.1:** Scaffold Next.js 14 project (App Router + Tailwind)
- [ ] **Task 6.2:** Build landing page (hero, features, CTA)
- [ ] **Task 6.3:** Build dashboard (same as mobile, responsive)
- [ ] **Task 6.4:** Integrate Supabase JS client
- [ ] **Task 6.5:** Add Web Push notification support (optional)
- [ ] **Task 6.6:** Deploy to Vercel

---

## **Phase 7: Testing & Launch (Week 8)**

- [ ] **Task 7.1:** Write unit tests for API routes
- [ ] **Task 7.2:** Write integration tests for Supabase RLS
- [ ] **Task 7.3:** Run E2E tests on Flutter (integration_test)
- [ ] **Task 7.4:** Load test daily word cron (simulate 1k users)
- [ ] **Task 7.5:** Beta test with 10-20 real users
- [ ] **Task 7.6:** Deploy Flutter to Play Store + App Store
- [ ] **Task 7.7:** Set up monitoring (Sentry, Supabase logs)
- [ ] **Task 7.8:** Launch

---

## **MVP Checklist (Must Complete for Phase 1)**

- [ ] Supabase schema + seed data
- [ ] User auth (email/password)
- [ ] Multi-language profiles
- [ ] Daily word cron (10×/day)
- [ ] FCM push notifications
- [ ] Telegram bot (`/start` + daily words)
- [ ] Flutter onboarding + dashboard
- [ ] AI translation endpoint

---

_Update checkboxes as tasks are completed._
