# 🌐 LingoFlux Web App

The web version of LingoFlux - built with Next.js 14 and Tailwind CSS.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

**Access:** http://localhost:3000

---

## 📦 Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State:** React Hooks + localStorage
- **Backend:** Node.js API (port 3001)

---

## 📁 Structure

```
web/
├── app/                    # Next.js App Router pages
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Landing page
│   ├── login/              # Login page
│   ├── signup/             # Signup page
│   └── dashboard/          # User dashboard
├── components/             # Reusable components
│   ├── LanguageBadge.tsx
│   └── WordCard.tsx
└── package.json
```

---

## 🎨 Features

- ✅ Landing page with hero and features
- ✅ User authentication (signup/login)
- ✅ Dashboard with daily words
- ✅ Language switching
- ✅ Word saving
- ✅ Streak tracking
- ✅ Responsive design

---

## 🔗 API Integration

All pages connect to the backend API at `http://localhost:3001`.

---

## 📝 Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/signup` | User registration |
| `/login` | User login |
| `/dashboard` | Main dashboard |

---

## 🎯 Status

**✅ Production Ready**
- All core pages implemented
- API integration complete
- Responsive design
- Error handling

---

_Built: May 2, 2026_
