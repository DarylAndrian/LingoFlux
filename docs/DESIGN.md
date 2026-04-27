# LingoFlux — Design System & UI Guidelines

**Theme:** "Ink & Paper" — Grounded in linguistics, human learning, tactile study sessions.

---

## **1. Design Principles**

1. **Minimal Friction:** Tap → Read → Save. No nested menus.
2. **Context-First:** Word + example sentence always visible. Grammar notes are expandable.
3. **Streak-Driven:** Visual streak counter on every screen header.
4. **Language-Agnostic:** Same layout works for LTR (English) and RTL (Arabic, if added later).
5. **Warm & Focused:** No neon colors, no "AI-blue" — feels like a study library, not a tech startup.

---

## **2. Color Palette**

### **Light Mode (Default)**

| Role | Hex | Usage | Psychology |
|---|---|---|---|
| **Primary** | `#2D3047` | Headings, primary text, icons | Charcoal Ink — serious, readable |
| **Secondary** | `#419D78` | Progress bars, success states, level badges | Forest Green — growth, calm |
| **Accent** | `#E3B505` | Streak counters, CTAs, highlights | Goldenrod — achievement, warm |
| **Background** | `#FAF9F6` | App background | Warm White — book page, easy on eyes |
| **Surface** | `#FFFFFF` | Cards, modals, sheets | Pure White — content contrast |
| **Text Primary** | `#2D3047` | Body text, labels | Same as Primary |
| **Text Secondary** | `#6B6870` | Hints, timestamps, metadata | Muted Gray — unobtrusive |
| **Error** | `#D64933` | Validation errors, delete actions | Terracotta — natural red, not neon |
| **Border** | `#E5E3E0` | Dividers, input underlines | Paper edge — subtle |

### **Dark Mode (Phase2)**

| Role | Hex | Usage |
|---|---|---|
| **Background** | `#1A1B2E` | Deep navy, not pure black |
| **Surface** | `#252742` | Slightly lighter navy |
| **Text Primary** | `#E8E6F0` | Warm off-white |
| **Accent** | `#419D78` | Same green — works on dark |

---

## **3. Typography**

### **Font Families**

| Type | Font | Fallback | Vibe |
|---|---|---|---|
| **Headings** | *Playfair Display* (Serif) | Georgia, serif | Classical, academic, trustworthy |
| **Body** | *Source Sans Pro* (Humanist Sans) | Segoe UI, sans-serif | Warm, approachable, readable |
| **Monospace** | *JetBrains Mono* | Consolas, monospace | Dictionary entries, grammar notes |

### **Type Scale**

| Element | Size | Weight | Font |
|---|---|---|---|
| **H1 (Screen Title)** | 28px | 700 (Bold) | Playfair Display |
| **H2 (Section Header)** | 22px | 600 (Semi-bold) | Playfair Display |
| **Body (Main Text)** | 16px | 400 (Regular) | Source Sans Pro |
| **Body Small** | 14px | 400 | Source Sans Pro |
| **Caption / Metadata** | 12px | 400 | Source Sans Pro |
| **Word (Large)** | 32px | 700 | Playfair Display |
| **Pinyin / Romaji** | 16px | 400 | JetBrains Mono |
| **Example Sentence** | 16px | 400 (Italic) | Playfair Display |

---

## **4. Spacing & Layout**

| Token | Value | Usage |
|---|---|---|
| **XS** | 4px | Fine adjustments |
| **SM** | 8px | Tight spacing (icon + text) |
| **MD** | 16px | Standard padding (cards, buttons) |
| **LG** | 24px | Section spacing |
| **XL** | 32px | Screen margins |
| **2XL** | 48px | Major section breaks |

**Border Radius:**
- Buttons: `8px`
- Cards: `2px` (subtle, not rounded like "modern AI app")
- Modals: `4px`
- Inputs: `0px` (underline style, no boxes)

---

## **5. UI Components**

### **5.1 Buttons**

**Primary Button**
- Background: #419D78 (Secondary Green)
- Text: #FFFFFF
- Font: Source Sans Pro, 16px, 600
- Padding: 16px (vertical), 32px (horizontal)
- Radius: 8px
- Hover: Darken 10%

**Secondary Button**
- Background: Transparent
- Border: 1px solid #2D3047
- Text: #2D3047
- Font: Source Sans Pro, 16px, 600
- Padding: 16px, 32px
- Radius: 8px

**Ghost Button (e.g., "Skip")**
- Background: Transparent
- Text: #6B6870
- Font: Source Sans Pro, 14px, 400
- No border

**Save Button (Special)**
- Icon: 🔖 (bookmark)
- Color: #E3B505 (Accent) when saved
- Color: #6B6870 when unsaved
- Text: "Save" / "Saved"

---

### **5.2 Word Card (Core Component)**

**Mobile (Full Card)**
```
┌─────────────────────────────────┐
│  今日 (きょう)                │  ← 32px, Playfair Display
│  kyō — today                  │  ← 16px, JetBrains Mono, #6B6870
│                               │
│  "今日はいい天気です。"       │  ← 16px, Playfair Display Italic
│  (Today is nice weather.)     │  ← 14px, Source Sans Pro, #6B6870
│                               │
│  Grammar Notes: [Expand ▼]    │  ← 12px, collapsible
│                               │
│  [ 🔖 Save ]    [ → More ]    │  ← Flat buttons, 8px radius
└─────────────────────────────────┘
```

**Web (Compact Card)**
```
┌─────────────────────────────────┐
│  今日 (きょう) — kyō — today  │  ← Inline layout
│  "今日はいい天気です。"       │
│  [🔖 Save] [📖 Grammar]       │
└─────────────────────────────────┘
```

---

### **5.3 Streak Counter**

**Header Placement**
```
┌─────────────────────────────────┐
│  LingoFlux    🔥 12 days       │  ← Top-right, #E3B505 text
└─────────────────────────────────┘
```

**Milestone States**
- <7 days: `🔥 5 days` (normal)
- 7-30 days: `🔥 14 days` (bold, slightly larger)
- 30+ days: `🔥 45 days` (pulsing animation, gold border)

---

### **5.4 Input Fields (Underline Style)**

```
Word Search
───────────────────────────────  ← 1px border-bottom, #2D3047
                              ↑ Floating label (12px, #6B6870)
```

**Focus State:**
```
───────────────────────────────  ← 2px border-bottom, #419D78
```

**Error State:**
```
───────────────────────────────  ← 2px border-bottom, #D64933
Required field                 ← 12px, #D64933
```

---

### **5.5 Navigation**

**Mobile (Bottom Tab Bar)**
```
┌─────────┬─────────┬─────────┬─────────┐
│  🏠    │  📖    │  🔖    │  ⚙️    │
│ Dashboard│ Words  │ Saved   │ Settings│
└─────────┴─────────┴─────────┴─────────┘
```
- Icon: 24px, outline stroke (1.5px)
- Active: #419D78, Filled
- Inactive: #6B6870, Outlined

**Web (Sidebar)**
```
LingoFlux
────────────
🏠 Dashboard
📖 Browse Words
🔖 Saved Words
⚙️ Settings
────────────
🔥 12 days
```

---

### **5.6 Dividers**

**Standard Divider**
```
───────────────  ← 1px dashed, #E5E3E0
```

**Section Break**
```
··············  ← 1px dotted, #E5E3E0
```

No solid lines — always dashed/dotted to resemble notebook paper.

---

## **6. Screen Wireframes (Mobile)**

### **6.1 Onboarding — Screen 1: Sign Up**
```
┌─────────────────────────────────┐
│  ← Back                         │
│                                 │
│  Welcome to LingoFlux           │  ← 28px, Playfair Display
│  Learn in your context.         │  ← 16px, Source Sans Pro
│                                 │
│  Email                          │
│  ───────────────────────       │
│                                 │
│  Password                       │
│  ───────────────────────       │
│                                 │
│  [ 🚀 Create Account ]         │  ← Primary Button, full-width
│                                 │
│  Already have an account? Log in│  ← Ghost link
└─────────────────────────────────┘
```

### **6.2 Onboarding — Screen 2: Pick Language**
```
┌─────────────────────────────────┐
│  ← Back    Step 1/3            │
│                                 │
│  Choose a language             │
│                                 │
│  ┌─────────────────────────┐   │
│  │ 🇭🇼 Mandarin (Taiwan) │   │  ← List item, tap to select
│  │ 🇨🇳 Mandarin (China)  │   │
│  │ 🇯🇵 Japanese           │   │
│  │ 🇰🇷 Korean             │   │
│  │ 🇻🇳 Vietnamese         │   │
│  │ 🇹🇭 Thai               │   │
│  │ 🇩🇪 German             │   │
│  └─────────────────────────┘   │
│                                 │
│  [ Continue → ]                │  ← Primary button
└─────────────────────────────────┘
```

### **6.3 Onboarding — Screen 3: Pick Level**
```
┌─────────────────────────────────┐
│  ← Back    Step 2/3            │
│                                 │
│  Your level in Japanese (JLPT) │
│                                 │
│  ┌─────────────────────────┐   │
│  │  N5 (A1) Beginner     │   │  ← Radio buttons
│  │  N4 (A2) Elementary   │   │
│  │  N3 (B1) Intermediate │   │
│  │  N2 (B2) Advanced     │   │
│  │  N1 (C1) Mastery      │   │
│  └─────────────────────────┘   │
│                                 │
│  [ Continue → ]                │
└─────────────────────────────────┘
```

### **6.4 Dashboard (Main Screen)**
```
┌─────────────────────────────────┐
│  LingoFlux    🔥 12 days       │
│──────── ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ │
│                                 │
│  📚 Today is Monday            │  ← Date header
│                                 │
│  ┌─────────────────────────┐   │
│  │  今日 (きょう)          │   │  ← Word card
│  │  kyō — today            │   │
│  │                         │   │
│  │  "今日はいい天気です。"│   │
│  │  (Today is nice weather)│   │
│  │                         │   │
│  │  [ 🔖 Save ] [→ More] │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │  猫 (ねこ)              │   │  ← 2nd word
│  │  neko — cat             │   │
│  │  "これは猫です。"       │   │
│  │  [ 🔖 Save ] [→ More] │   │
│  └─────────────────────────┘   │
│                                 │
│  Highlight of the Day:           │
│  "勉強" (べんきょう) — to study│  ← From saved words
└─────────────────────────────────┘
```

---

## **7. Telegram Message Templates**

### **7.1 Daily Word Message**
```
📚 LingoFlux — Daily Word

*今日 (kyō)* — today
_JLPT N5 — A1_

"今日はいい天気です。"
(Today is nice weather.)

[ 🔖 Save Word ]  ← Inline keyboard button
```

### **7.2 /saved Command Response**
```
📖 Your Saved Words (Japanese)

1. 今日 (kyō) — today
   Saved: 2 hours ago

2. 猫 (neko) — cat
   Saved: 5 hours ago

3. 勉強 (べんきょう) — to study
   Saved: 1 day ago

_Showing 3 of 12 saved words_
```

### **7.3 /level Command Response**
```
📊 Your Language Levels

🇯🇵 Japanese: JLPT N5 (A1) 🔥 12 days
🇭🇼 Mandarin: TOCFL 3 (B1) 🔥 5 days
🇩🇪 German: A2 🔥 1 day
```

---

## **8. Web Landing Page Wireframe**

```
┌─────────────────────────────────────────────────┐
│  LingoFlux          [Log in] [Sign up free]  │  ← Header
│───────────────────────────────────────────────│
│                                                 │
│  Learn languages in your actual context.        │  ← 48px Playfair Display
│                                                 │
│  Contextual vocabulary building for             │
│  polyglots and focused learners alike.          │  ← 18px Source Sans Pro
│                                                 │
│  [ 🚀 Get Started ]  [ 📖 See Demo ]          │  ← Two CTAs
│                                                 │
│  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─  │
│                                                 │
│  ✦ 7 Languages Supported                       │
│  ✦ Native Leveling Systems (HSK, JLPT, etc.)  │
│  ✦ 10 Words/Day via Timed Notifications       │
│  ✦ AI-Powered Context Translation              │
│                                                 │
│  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─  │
│                                                 │
│  © 2026 LingoFlux                             │  ← Footer
└─────────────────────────────────────────────────┘
```

---

_End of Design System & UI Guidelines_
