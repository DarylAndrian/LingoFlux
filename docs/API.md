# LingoFlux — API Specification

Base URL: `https://api.lingoflux.com/api/v1`  
Auth: `Authorization: Bearer <JWT>` (Supabase Auth token)

---

## **1. Authentication**

### **1.1 Register**
`POST /auth/register`

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response (201):**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com"
  },
  "session": {
    "access_token": "jwt-token",
    "refresh_token": "refresh-token",
    "expires_in": 3600
  }
}
```

---

### **1.2 Login**
`POST /auth/login`

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response (200):** Same as register.

---

## **2. Language Levels**

### **2.1 List Levels for a Language**
`GET /languages/levels?language=ja`

**Response (200):**
```json
[
  {
    "id": 15,
    "language_code": "ja",
    "level_code": "JLPT_N5",
    "cefr_equivalent": "A1",
    "display_name": "JLPT N5",
    "sort_order": 1
  },
  {
    "id": 16,
    "language_code": "ja",
    "level_code": "JLPT_N4",
    "cefr_equivalent": "A2",
    "display_name": "JLPT N4",
    "sort_order": 2
  }
]
```

---

## **3. User Language Profiles**

### **3.1 List My Languages**
`GET /users/languages`

**Headers:** `Authorization: Bearer <JWT>`

**Response (200):**
```json
[
  {
    "id": 1,
    "language_code": "ja",
    "current_level": {
      "id": 15,
      "level_code": "JLPT_N5",
      "display_name": "JLPT N5",
      "cefr_equivalent": "A1"
    },
    "is_active": true,
    "started_at": "2026-04-27T12:00:00Z",
    "streak_days": 12
  },
  {
    "id": 2,
    "language_code": "zh-TW",
    "current_level": {
      "id": 3,
      "level_code": "TOCFL_3",
      "display_name": "TOCFL Level 3",
      "cefr_equivalent": "B1"
    },
    "is_active": true,
    "started_at": "2026-04-20T10:00:00Z",
    "streak_days": 5
  }
]
```

---

### **3.2 Add a Language**
`POST /users/languages`

**Request:**
```json
{
  "language_code": "ja",
  "level_id": 15
}
```

**Response (201):**
```json
{
  "id": 3,
  "language_code": "ja",
  "current_level_id": 15,
  "is_active": true
}
```

---

### **3.3 Update Level**
`PUT /users/languages/:id`

**Request:**
```json
{
  "level_id": 16
}
```

**Response (200):** Updated profile object.

---

### **3.4 Deactivate Language**
`DELETE /users/languages/:id`

**Response (204):** No content.

---

## **4. Words**

### **4.1 Get Today's Words**
`GET /words/daily?date=2026-04-27`

**Response (200):**
```json
[
  {
    "id": 101,
    "scheduled_for": "2026-04-27T08:30:00Z",
    "word": {
      "id": 55,
      "word": "今日",
      "pinyin_romaji": "kyō",
      "definition": "today",
      "example_sentence": "今日はいい天気です。",
      "language_code": "ja",
      "level": "JLPT_N5"
    },
    "interacted": false
  },
  {
    "id": 102,
    "scheduled_for": "2026-04-27T14:20:00Z",
    "word": {
      "id": 56,
      "word": "猫",
      "pinyin_romaji": "neko",
      "definition": "cat",
      "example_sentence": "これは猫です。",
      "language_code": "ja",
      "level": "JLPT_N5"
    },
    "interacted": false
  }
]
```

---

### **4.2 Save a Word**
`POST /words/save`

**Request:**
```json
{
  "word_id": 55,
  "context_snippet": "Seen in newspaper article about weather"
}
```

**Response (201):**
```json
{
  "id": 501,
  "user_id": "uuid",
  "word_id": 55,
  "context_snippet": "Seen in newspaper article about weather",
  "saved_at": "2026-04-27T08:35:00Z"
}
```

---

### **4.3 List Saved Words**
`GET /words/saved?language=ja&limit=20&offset=0`

**Response (200):**
```json
[
  {
    "id": 501,
    "word": {
      "id": 55,
      "word": "今日",
      "pinyin_romaji": "kyō",
      "definition": "today",
      "example_sentence": "今日はいい天気です。"
    },
    "context_snippet": "Seen in newspaper article about weather",
    "saved_at": "2026-04-27T08:35:00Z"
  }
]
```

---

### **4.4 Delete Saved Word**
`DELETE /words/saved/:id`

**Response (204):** No content.

---

## **5. AI Translation**

### **5.1 Translate with Context**
`POST /translate`

**Request:**
```json
{
  "text": "今日はいい天気です。",
  "surrounding_context": "朝起きて、窓の外を見ました。今日はいい天気です。",
  "user_level": "JLPT_N5",
  "language_pair": "ja"
}
```

**Response (200):**
```json
{
  "translation": "Today is nice weather.",
  "grammar_notes": "Use of 'は' (wa) as topic marker. 'いい' (ii) is the informal form of '良い' (yoi) meaning 'good/nice'.",
  "cultural_context": "Commenting on weather is a common conversation starter in Japan, similar to Western cultures.",
  "similar_words": ["明日", "昨日", "天気予報"]
}
```

---

## **6. Dictionary (Phase2)**

### **6.1 Lookup Word**
`GET /dictionary?language=ja&word=猫`

**Response (200):**
```json
{
  "word": "猫",
  "pinyin_romaji": "neko",
  "definitions": [
    {
      "part_of_speech": "noun",
      "meaning": "cat",
      "example": "猫が好きです。 (I like cats.)"
    }
  ],
  "level": "JLPT_N5"
}
```

---

## **7. Progress Tracking**

### **7.1 Get Streak Info**
`GET /progress/streak`

**Response (200):**
```json
{
  "current_streak": 12,
  "longest_streak": 45,
  "last_activity": "2026-04-27T08:35:00Z",
  "words_saved_today": 3,
  "words_saved_this_month": 87
}
```

---

## **8. Telegram Bot Endpoints (Internal)**

### **8.1 Link Telegram**
`POST /telegram/link`

**Request:**
```json
{
  "telegram_chat_id": "123456789",
  "email": "user@example.com"
}
```

**Response (200):**
```json
{
  "linked": true,
  "user_id": "uuid"
}
```

---

### **8.2 Get Daily Words for Telegram**
`GET /telegram/daily?chat_id=123456789`

**Response (200):**
```json
{
  "words": [
    {
      "word": "今日",
      "pinyin_romaji": "kyō",
      "definition": "today",
      "example_sentence": "今日はいい天気です。",
      "language_code": "ja",
      "level": "JLPT_N5"
    }
  ]
}
```

---

## **9. Error Responses**

All endpoints return standard HTTP status codes.

**400 Bad Request:**
```json
{
  "error": "Invalid language_code. Must be one of: zh-TW, zh-CN, ja, ko, vi, th, de"
}
```

**401 Unauthorized:**
```json
{
  "error": "Invalid or expired token"
}
```

**404 Not Found:**
```json
{
  "error": "Word not found"
}
```

**500 Internal Server Error:**
```json
{
  "error": "Internal server error"
}
```

---

## **10. Rate Limiting**

- **Translation endpoint:** 60 requests/minute per user
- **All other endpoints:** 1000 requests/minute per user

Headers:
- `X-RateLimit-Limit: 60`
- `X-RateLimit-Remaining: 45`
- `X-RateLimit-Reset: 1620000000`

---

_End of API Specification_
