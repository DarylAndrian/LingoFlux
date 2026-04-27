# LingoFlux

**Learn languages in your actual context.**

LingoFlux is a multi-platform language learning app that delivers contextual vocabulary building through timed notifications, AI-powered translation, and support for 7 languages with their native leveling systems.

---

## **Platforms**

- **Mobile:** Flutter (iOS + Android)
- **Web:** Next.js 14
- **Telegram Bot:** Passive learning via Telegram

---

## **Features (MVP)**

- ✅ Multi-language profiles (learn 3+ languages simultaneously, each with independent levels)
- ✅ Native leveling support (TOCFL, HSK, TOPIK, JLPT, NLTV, CU-TFL, CEFR German)
- ✅ 10 words/day per language via randomized notifications
- ✅ Context-aware AI translation (Claude + GPT-4o)
- ✅ Word saving/highlighting with context snippets
- ✅ Camera OCR for real-world text scanning
- ✅ Telegram bot integration (`/start`, `/daily`, `/saved`)
- ✅ Supabase backend (PostgreSQL + RLS + Auth)

---

## **Tech Stack**

| Layer | Technology |
|---|---|
| **Auth** | Supabase Auth (JWT) |
| **Database** | Supabase (PostgreSQL + RLS) |
| **Backend API** | Node.js + Express |
| **Mobile** | Flutter (iOS + Android) |
| **Web** | Next.js 14 (App Router) |
| **Notifications** | FCM, Web Push, Telegram Bot API |
| **AI** | Claude 3.5 Sonnet, GPT-4o |
| **Scheduler** | node-cron |
| **OCR** | Google ML Kit |

---

## **Project Structure**

```
LingoFlux/
├── backend/          # Node.js + Express API
├── mobile/           # Flutter app (iOS + Android)
├── web/              # Next.js web app
├── bot/              # Telegram bot
├── docs/             # PRD, Task List, Architecture
│   ├── PRD.md
│   └── TASKS.md
└── README.md
```

---

## **Documentation**

- **PRD:** [`docs/PRD.md`](docs/PRD.md) — Full product requirements
- **Task List:** [`docs/TASKS.md`](docs/TASKS.md) — Step-by-step build tasks
- **Database Schema:** See PRD Section 9 for ERD + table definitions

---

## **MVP Scope (8 Weeks)**

**Phase 1 (Weeks 1-2):** Database + Auth + API  
**Phase 2 (Weeks 3-4):** Flutter Mobile App  
**Phase 3 (Week 5):** Telegram Bot  
**Phase 4 (Week 6):** AI Integration  
**Phase 5 (Week 7):** Next.js Web App  
**Phase 6 (Week 8):** Testing + Launch  

---

## **Getting Started**

### **Prerequisites**
- Node.js v18+
- Flutter SDK
- Supabase account
- Telegram Bot API token (from BotFather)

### **Setup**

**1. Clone the repo:**
```bash
git clone https://github.com/DarylAndrian/LingoFlux.git
cd LingoFlux
```

**2. Set up Supabase:**
- Go to: https://cgpmvpjwgormgkvrzsoc.supabase.co/project/api/sql
- Open SQL Editor
- Copy contents of `backend/supabase/migrations/001_initial_schema.sql`
- Click "Run" to create tables + seed data

**3. Backend setup:**
```bash
cd backend
cp .env.example .env
# Edit .env with your credentials (already filled for Supabase)
npm install
npm run dev
```

**4. Test connection:**
```bash
node test-connection.js
```

**5. Platform-specific setup:**
- **Mobile:** See `mobile/README.md` (TBD)
- **Web:** See `web/README.md` (TBD)
- **Bot:** See `bot/README.md` (TBD)

---

## **License**

MIT — see LICENSE file (TBD)

---

_End of README_
