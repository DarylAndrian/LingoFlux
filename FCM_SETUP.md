# FCM Push Notification Setup for LingoFlux

## 📱 Firebase Cloud Messaging Setup

### Step 1: Create Firebase Project

1. Go to: https://console.firebase.google.com/
2. Click "Add project"
3. Name: "LingoFlux"
4. Disable Google Analytics (optional)
5. Click "Create project"

### Step 2: Add Android App

1. In Firebase Console, click "Add app" → Android
2. Package name: `com.example.lingoflux`
3. Download `google-services.json`
4. Place in: `/mobile/android/app/`
5. Add dependencies to `android/build.gradle`:
```gradle
buildscript {
    dependencies {
        classpath 'com.google.gms:google-services:4.3.15'  // or latest
    }
}
```

Add to `android/app/build.gradle`:
```gradle
apply plugin: 'com.google.gms.google-services'

dependencies {
    implementation 'com.google.firebase:firebase-messaging:23.4.0'
}
```

### Step 3: Add iOS App (Optional)

1. Click "Add app" → iOS
2. Bundle ID: `com.example.lingoflux`
3. Download `GoogleService-Info.plist`
4. Add to Xcode project

### Step 4: Configure Flutter

Ensure `pubspec.yaml` has:
```yaml
dependencies:
  firebase_core: ^2.24.2
  firebase_messaging: ^14.7.10
  flutter_local_notifications: ^17.0.0
```

Add to `lib/main.dart`:
```dart
import 'package:firebase_core/firebase_core.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  await Firebase.initializeApp();
  await _setupNotifications();
  
  await Supabase.initialize(...);
  runApp(const LingoFluxApp());
}

Future<void> _setupNotifications() async {
  final flutterLocalNotificationsPlugin = FlutterLocalNotificationsPlugin();
  
  const AndroidInitializationSettings initializationSettingsAndroid =
      AndroidInitializationSettings('@mipmap/ic_launcher');
  
  final DarwinInitializationSettings initializationSettingsDarwin =
      DarwinInitializationSettings();

  final InitializationSettings initializationSettings = InitializationSettings(
    android: initializationSettingsAndroid,
    iOS: initializationSettingsDarwin,
  );

  await flutterLocalNotificationsPlugin.initialize(initializationSettings);
}
```

### Step 5: Get FCM Token

Add to your app initialization:
```dart
import 'package:firebase_messaging/firebase_messaging.dart';

Future<String?> getFCMToken() async {
  final messaging = FirebaseMessaging.instance;
  
  // Request permission
  NotificationSettings settings = await messaging.requestPermission();
  
  if (settings.authorizationStatus == AuthorizationStatus.authorized) {
    String? token = await messaging.getToken();
    
    // Send token to backend
    if (token != null) {
      await sendFCMTokenToBackend(token);
    }
    
    return token;
  }
  
  return null;
}

Future<void> sendFCMTokenToBackend(String token) async {
  // Call your backend API to save the token
  // Example:
  // await ApiService.saveFCMToken(token);
}
```

### Step 6: Handle Notifications

```dart
Future<void> _handleBackgroundMessage(RemoteMessage message) async {
  await Firebase.initializeApp();
}

FirebaseMessaging.onBackgroundMessage(_handleBackgroundMessage);

// Foreground messages
FirebaseMessaging.onMessage.listen((RemoteMessage message) {
  final notificationHandler = FlutterLocalNotificationsPlugin();
  
  notificationHandler.show(
    0,
    message.notification?.title,
    message.notification?.body,
    NotificationDetails(
      android: AndroidNotificationDetails(
        'lingoflux_channel',
        'LingoFlux',
        channelDescription: 'Daily vocabulary notifications',
        importance: Importance.high,
      ),
      iOS: const DarwinNotificationDetails(),
    ),
  );
});
```

---

## 🔧 Backend FCM Integration

### Update `.env`:
```bash
# Firebase
FIREBASE_PROJECT_ID=lingoflux-xxxxx
FIREBASE_PRIVATE_KEY_PATH=./firebase-service-account.json
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@lingoflux-xxxxx.iam.gserviceaccount.com
```

### Install Firebase Admin SDK:
```bash
npm install firebase-admin
```

### Create FCM Service: `/backend/src/services/fcm.js`

```javascript
const admin = require('firebase-admin');
const fs = require('fs');

// Initialize Firebase
const serviceAccount = require(process.env.FIREBASE_PRIVATE_KEY_PATH);
if (serviceAccount) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

/**
 * Send push notification to a user
 */
async function sendNotificationToUser(userId, title, body, data = {}) {
  try {
    // Get FCM token from profiles table
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('fcm_token')
      .eq('id', userId)
      .single();

    if (error || !profile?.fcm_token) {
      console.log(`No FCM token for user ${userId}`);
      return false;
    }

    const message = {
      notification: { title, body },
      data,
      token: profile.fcm_token,
    };

    const response = await admin.messaging().send(message);
    console.log('✅ Notification sent:', response);
    return true;
  } catch (err) {
    console.error('❌ Failed to send notification:', err);
    return false;
  }
}

/**
 * Send daily words notification
 */
async function sendDailyWordsNotification(userId, wordCount, language) {
  const title = `📚 ${wordCount} New Words`;
  const body = `Time to learn ${language}! You have ${wordCount} words today.`;
  
  return sendNotificationToUser(userId, title, body, {
    type: 'daily_words',
    word_count: wordCount,
    language,
  });
}

module.exports = {
  sendNotificationToUser,
  sendDailyWordsNotification,
};
```

### Update `/backend/.env`:
```bash
# Firebase Admin SDK
firebaseAdmin = require('firebase-admin');
```

---

## 🧪 Testing Notifications

### Test from Backend:
```javascript
const { sendNotificationToUser } = require('./src/services/fcm');

async function testNotification() {
  await sendNotificationToUser(
    'user-uuid-here',
    '🔔 Test Notification',
    'LingoFlux FCM is working!'
  );
}

testNotification();
```

### Test from Firebase Console:
1. Go to: https://console.firebase.google.com/project/lingoflux-xxxxx/notification
2. Click "Send your first message"
3. Enter title and body
4. Send to test device

---

## 📊 Notification Types

| Type | Title | Body | Data |
|------|-------|------|------|
| `daily_words` | 📚 X New Words | Time to learn {language}! | `{ word_count, language }` |
| `streak_reminder` | 🔥 Keep the Streak! | You haven't studied today. Stay motivated! | `{ type: 'streak_reminder' }` |
| `word_mastered` | 🎉 Word Mastered! | You've mastered "{word}"! | `{ word_id, word }` |
| `level_up` | ⬆️ Level Up! | You reached {level} in {language}! | `{ new_level, language }` |

---

## 🔍 Troubleshooting

### "No APK found" error
→ Run: `flutter pub get && flutter clean && flutter pub get`

### Notification not showing on Android
→ Check notification channel settings in device settings

### FCM token is null
→ Ensure Firebase is initialized before getToken()

### Token expires
→ Implement `onTokenRefresh` handler to update backend

---

## 🚫 Disable in Production

To disable notifications (for testing):
```dart
// In main.dart
const bool ENABLE_NOTIFICATIONS = false;
```

---

**Status:** Configuration ready, requires Firebase project setup
**Priority:** Medium (after database and basic testing)
**Estimated time:** 1-2 hours

---

_Last updated: May 2, 2026_