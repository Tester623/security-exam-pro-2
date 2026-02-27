// ══════════════════════════════════════════════════════
// Security+ Exam Pro — Root Layout
// ══════════════════════════════════════════════════════

import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useQuizStore } from '@/store/useQuizStore';
import { initDatabase, importQuestions, getQuestionCount } from '@/core/database';
import questionsData from '@/assets/data/questions.json';
import { Question } from '@/core/types';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    'Outfit-Regular': require('../assets/fonts/Outfit-Regular.ttf'),
    'Outfit-Bold': require('../assets/fonts/Outfit-Bold.ttf'),
    'Outfit-ExtraBold': require('../assets/fonts/Outfit-ExtraBold.ttf'),
  });
  const [dbReady, setDbReady] = useState(false);

  const darkMode = useQuizStore((s) => s.darkMode);
  const updateStreak = useQuizStore((s) => s.updateStreak);

  // Initialize database on first launch
  useEffect(() => {
    async function setup() {
      try {
        await initDatabase();
        await importQuestions(questionsData as Question[]);
        const count = await getQuestionCount();
        console.log(`[DB] ${count} questions loaded`);
      } catch (e) {
        console.warn('[DB] Init error, falling back to JSON:', e);
      }
      setDbReady(true);
    }
    setup();
  }, []);

  useEffect(() => {
    if (loaded && dbReady) SplashScreen.hideAsync();
  }, [loaded, dbReady]);

  // Update streak on app launch
  useEffect(() => {
    updateStreak();
  }, []);

  if (!loaded || !dbReady) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#0a0a12' }}>
      <StatusBar style={darkMode ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'fade',
          contentStyle: { backgroundColor: darkMode ? '#0a0a12' : '#f5f5fa' },
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="quiz/[mode]"
          options={{
            presentation: 'fullScreenModal',
            animation: 'slide_from_bottom',
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="quiz/result"
          options={{
            presentation: 'modal',
            animation: 'fade_from_bottom',
          }}
        />
      </Stack>
    </GestureHandlerRootView>
  );
}
