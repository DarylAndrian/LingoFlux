# LingoFlux — Local Development Guide

This guide helps you run the LingoFlux web app on your local machine.

---

## 🚀 Quick Start (Your Machine)

### **Step 1: Clone the Repository**

```bash
git clone <your-repo-url> LingoFlux
cd LingoFlux
```

### **Step 2: Setup Backend**

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Add your environment variables:
# SUPABASE_URL=your-supabase-url
# SUPABASE_ANON_KEY=your-anon-key
# SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
# OPENAI_API_KEY=your-openai-key
# ANTHROPIC_API_KEY=your-anthropic-key
# TELEGRAM_BOT_TOKEN=your-telegram-token

# Start backend server
npm run dev
```

Backend will run on **http://localhost:3001**

---

### **Step 3: Setup Web App**

Open a **new terminal window**:

```bash
cd web

# Install dependencies
npm install

# Start development server
npm run dev
```

Web app will run on **http://localhost:3000**

---

### **Step 4: Access the App**

1. Open your browser
2. Visit **http://localhost:3000**
3. Sign up for an account
4. Start learning!

---

## 📦 What You Need

| Component | Requirements |
|-----------|--------------|
| **Node.js** | Versions 18+ or 20+ |
| **npm** | Comes with Node.js |
| **Supabase** | Free project at supabase.com |
| **API Keys** | OpenAI + Anthropic (optional for AI translation) |

---

## 🔧 Environment Variables

Create these `.env` files:

### **Backend (`backend/.env`)**
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
OPENAI_API_KEY=your-openai-key
ANTHROPIC_API_KEY=your-anthropic-key
TELEGRAM_BOT_TOKEN=your-telegram-token
PORT=3001
```

### **Web App (`web/.env.local`)**
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

## 🗄️ Database Setup

### **Option 1: Manual SQL (Recommended)**

1. Go to Supabase Dashboard: https://supabase.com/dashboard
2. Open SQL Editor
3. Run the schema: `backend/supabase/migrations/safe-migration.sql`
4. Seed data: `node backend/seed-database.js`

### **Option 2: Apply Schema Script**

```bash
cd backend
node seed-database.js
```

---

## 🌐 Accessing on Your Network

To access from other devices on your network:

### **Backend:**
```bash
# Get your machine's IP
ip addr show  # Linux/Mac
ipconfig      # Windows

# Use this URL in your app:
# http://YOUR-IP:3001
```

### **Web App:**
```bash
# Update web/.env.local:
NEXT_PUBLIC_API_URL=http://YOUR-IP:3001
```

---

## 📱 Mobile App (Flutter)

```bash
cd mobile

# Get dependencies
flutter pub get

# Run on your device/emulator
flutter run
```

---

## 🧪 Testing

### **Test Backend:**
```bash
curl http://localhost:3001/health
# Expected: {"status":"OK","timestamp":"..."}

curl http://localhost:3001/api/v1/languages/levels?language=zh-CN
# Expected: Array of language levels
```

### **Test Web App:**
```bash
curl http://localhost:3000
# Expected: HTML landing page
```

---

## 🚨 Troubleshooting

### **Problem: Backend won't start**
```bash
# Check if port is in use
lsof -i :3001  # Linux/Mac
netstat -ano | findstr :3001  # Windows

# Kill the process
kill -9 <PID>
```

### **Problem: Web app can't connect to backend**
- Check if backend is running
- Verify `.env.local` has correct `NEXT_PUBLIC_API_URL`
- Check CORS settings in backend

### **Problem: Database connection failed**
- Verify Supabase credentials in `.env`
- Check Supabase project is active
- Run tests: `node backend/test-connection.js`

---

## 📚 Documentation Files

| File | Description |
|------|-------------|
| `README.md` | Project overview |
| `web/WEB_README.md` | Web app specific guide |
| `DATABASE_SETUP.md` | Database setup instructions |
| `QUICK_SETUP.md` | Quick start guide |
| `FCM_SETUP.md` | Push notification setup |

---

## 🎯 Next Steps

1. ✅ **Clone repo** - Done
2. ✅ **Install dependencies** - `npm install`
3. ✅ **Setup database** - Run SQL schema
4. ✅ **Start backend** - `npm run dev` (port 3001)
5. ✅ **Start web app** - `npm run dev` (port 3000)
6. ✅ **Test app** - Visit http://localhost:3000

---

## 📞 Support

Need help? Check the documentation files:
- `QUICK_SETUP.md` - Step-by-step setup
- `DATABASE_SETUP.md` - Database guide
- `FIXES_APPLIED.md` - Known issues and fixes

---

**Happy coding! 🚀**

_Last updated: May 2, 2026_
