// ══════════════════════════════════════════════════════
// Security+ Exam Pro — Tab Layout (Bottom Navigation)
// ══════════════════════════════════════════════════════

import { Tabs } from 'expo-router';
import { View, StyleSheet, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useQuizStore } from '@/store/useQuizStore';
import { THEME } from '@/core/constants';

export default function TabLayout() {
  const darkMode = useQuizStore((s) => s.darkMode);
  const t = darkMode ? THEME.dark : THEME.light;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: Platform.OS === 'ios' ? 20 : 10,
          left: 20,
          right: 20,
          borderRadius: 28,
          height: 64,
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          elevation: 0,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.5,
          shadowRadius: 20,
        },
        tabBarBackground: () => (
          <BlurView
            intensity={80}
            tint="dark"
            style={StyleSheet.absoluteFill}
          />
        ),
        tabBarActiveTintColor: t.neon,
        tabBarInactiveTintColor: t.textSub,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.tabIcon}>
              <Ionicons
                name={focused ? 'home' : 'home-outline'}
                size={22}
                color={color}
              />
              {focused && <View style={[styles.glowDot, { backgroundColor: t.neon }]} />}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: 'Stats',
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.tabIcon}>
              <Ionicons
                name={focused ? 'stats-chart' : 'stats-chart-outline'}
                size={22}
                color={color}
              />
              {focused && <View style={[styles.glowDot, { backgroundColor: t.neon }]} />}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="flashcards"
        options={{
          title: 'Cards',
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.tabIcon}>
              <Ionicons
                name={focused ? 'albums' : 'albums-outline'}
                size={22}
                color={color}
              />
              {focused && <View style={[styles.glowDot, { backgroundColor: t.neon }]} />}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="achievements"
        options={{
          title: 'Awards',
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.tabIcon}>
              <Ionicons
                name={focused ? 'trophy' : 'trophy-outline'}
                size={22}
                color={color}
              />
              {focused && <View style={[styles.glowDot, { backgroundColor: t.neon }]} />}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.tabIcon}>
              <Ionicons
                name={focused ? 'settings' : 'settings-outline'}
                size={22}
                color={color}
              />
              {focused && <View style={[styles.glowDot, { backgroundColor: t.neon }]} />}
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 6,
  },
  glowDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 4,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 6,
  },
});
