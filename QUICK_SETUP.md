# LingoFlux - Quick Setup Guide

## 🚀 **Get LingoFlux Running in 10 Minutes**

### **Step 1: Apply Database Schema (5 min)**

1. Go to: https://console.supabase.com/project/cgpmvpjwgormgkvrzsoc/sql
2. Create a new query
3. Copy contents of: `/backend/supabase/migrations/001_initial_schema.sql`
4. Paste and click "Run"
5. Verify: Tables `profiles`, `language_levels`, `user_language_profiles`, `curriculum_words`, `saved_words`, `daily_words` should appear

**Test connection:**
```bash
cd /root/.openclaw/shared-resources/LingoFlux/backend
node test-connection.js
```

---

### **Step 2: Add API Keys (2 min)**

Edit `/backend/.env`:
```bash
# AI APIs
OPENAI_API_KEY=sk-your-openai-key-here
ANTHROPIC_API_KEY=sk-ant-your-anthropic-key-here

# Telegram Bot
TELEGRAM_BOT_TOKEN=123456:ABC-DEF-ghij-klmnoPQRSTU
```

**Where to get keys:**
- OpenAI: https://platform.openai.com/api-keys
- Anthropic: https://console.anthropic.com/settings/keys
- Telegram: @BotFather → /newbot

---

### **Step 3: Start Backend (1 min)**

```bash
cd /root/.openclaw/shared-resources/LingoFlux/backend
npm start
```

**Expected output:**
```
🚀 LingoFlux API running on port 3001
⏰ Cron jobs started
```

---

### **Step 4: Test Backend APIs (2 min)**

**Health check:**
```bash
curl http://localhost:3001/health
```
Expected: `{"status":"OK","timestamp":"..."}`

**Test auth:**
```bash
curl -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"testpass123"}'
```

---

### **Step 5: Build Flutter App (Optional)**

```bash
cd /root/.openclaw/shared-resources/LingoFlux/mobile
flutter pub get
flutter run
```

---

## 📱 **Telegram Bot Setup (Optional)**

1. Create bot: DM @BotFather → `/newbot` → Get token
2. Add token to `.env`: `TELEGRAM_BOT_TOKEN=your-token-here`
3. Test: Send message to bot → Should respond with inline keyboard

---

## 🔧 **Troubleshooting**

### **Supabase Connection Fails**
- Verify `.env` has correct `SUPABASE_URL` and keys
- Check Supabase project is active
- Ensure tables exist: Run `test-connection.js`

### **Backend Won't Start**
- Check port 3001 is free: `lsof -i :3001`
- Try different port in `.env`: `PORT=3002`
- Check logs: `npm start` output

### **Flutter Build Fails**
- Run: `flutter doctor` to check setup
- Install missing dependencies: `flutter pub get`
- Update Flutter: `flutter upgrade`

### **Telegram Bot Not Responding**
- Verify `TELEGRAM_BOT_TOKEN` is correct
- Check backend logs: Look for "Telegram connected"
- Test manually: `curl https://api.telegram.org/bot<token>/getMe`

---

## 🎯 **Next Steps After Setup**

1. **Seeding Words:** Generate vocabulary for all 7 languages
2. **Test Auth Flow:** Register → Login → Get JWT
3. **Test Translation:** Add words → Call `/translate` endpoint
4. **Test Flutter:** Build app → Test on emulator
5. **Test Telegram:** Link account → Try `/daily` command
6. **Add FCM:** Configure Firebase → Test push notifications

---

## 📊 **Current Status**

| System | Status | Note |
|--------|--------|------|
| **Backend** | ✅ Running | All routes functional |
| **Database** | ⚠️ Needs schema | Apply SQL file |
| **Flutter** | ✅ Screens ready | Needs build test |
| **Telegram** | ⚠️ Ready | Needs bot token |
| **AI** | ⚠️ Ready | Needs API keys |
| **Push** | ❌ Not started | Needs Firebase setup |

---

## 💡 **Quick Commands**

```bash
# Backend
cd /root/.openclaw/shared-resources/LingoFlux/backend
npm start                    # Start backend
node test-connection.js      # Test DB

# Flutter
cd /root/.openclaw/shared-resources/LingoFlux/mobile
flutter pub get              # Install deps
flutter run                  # Run app
flutter build apk            # Build Android APK

# Telegram test
curl https://api.telegram.org/bot<TOKEN>/getMe
```

---

**Need help?** See `FIXES_APPLIED.md` for detailed technical info.

---

_Last updated: May 2, 2026_