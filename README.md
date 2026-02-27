# Security+ Exam Pro v3.0

> React Native (Expo) mobile app for CompTIA Security+ SY0-701 exam preparation.

## Architecture

Built on the **2026 Modern Stack**:

| Layer | Technology |
|-------|------------|
| Framework | Expo SDK 52+ / React Native 0.76+ |
| Navigation | Expo Router v4 (file-based) |
| State | Zustand 5 + Immer |
| Storage | MMKV (sync, 30x faster than AsyncStorage) |
| UI | Custom components, LinearGradient, BlurView |
| Haptics | expo-haptics |
| Fonts | Outfit (Google Fonts) |

## Project Structure

```
/app                    # Expo Router pages
  /(tabs)/              # Bottom tab navigation
    index.tsx           # Home (Dashboard)
    stats.tsx           # Statistics & analytics
    flashcards.tsx      # Port & acronym flashcards
    achievements.tsx    # Achievement badges
  /quiz/
    [mode].tsx          # Quiz engine (practice/exam/mistakes)
    result.tsx          # Results screen
/assets/data/
  questions.json        # 640 questions (100 multi-select)
/core/                  # Business logic (UI-independent)
  types.ts              # TypeScript interfaces
  constants.ts          # Domains, achievements, theme
  algorithms.ts         # Shuffle, readiness, pass probability
  storage.ts            # MMKV adapter
/store/
  useQuizStore.ts       # Zustand store with persistence
/hooks/
  useHaptics.ts         # Haptic feedback abstraction
/components/
  /ui/NeonCard.tsx      # Glow-effect card
  /quiz/AnswerOption.tsx# Interactive answer button
```

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Add Outfit font files to assets/fonts/
#    Download from: https://fonts.google.com/specimen/Outfit
#    Need: Outfit-Regular.ttf, Outfit-Bold.ttf, Outfit-ExtraBold.ttf

# 3. Start dev server
npx expo start

# 4. Run on device
npx expo start --android
npx expo start --ios
```

## Content

- **640 questions** covering all 5 SY0-701 domains
- **100 multi-select** questions (Select 2/3)
- **28 port** flashcards
- **36 acronym** flashcards
- **12 achievements** with gamification (XP, levels, streaks)

## Key Features

- **Offline-first**: All data stored locally via MMKV
- **Pass Probability**: Weighted algorithm (readiness 50% + coverage 30% + consistency 20%)
- **Answer Randomization**: Prevents position memorization
- **Multi-select**: Checkbox-style questions with exact-match scoring
- **Exam Simulation**: 90 questions, 90 minutes, no pauses
- **Haptic Feedback**: Success/error/selection vibrations
- **Dark Mode**: Full dark theme with neon accents

## Legal

CompTIA Security+ is a registered trademark of CompTIA, Inc.
This app is not affiliated with or endorsed by CompTIA.
