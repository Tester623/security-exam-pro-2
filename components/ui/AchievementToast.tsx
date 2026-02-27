// ══════════════════════════════════════════════════════
// Achievement Unlocked Toast Popup
// ══════════════════════════════════════════════════════

import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  SlideInUp,
  SlideOutUp,
  ZoomIn,
  FadeIn,
} from 'react-native-reanimated';
import { useEffect, useState } from 'react';
import { ACHIEVEMENTS, THEME } from '@/core/constants';

interface AchievementToastProps {
  achievementId: string | null;
  darkMode: boolean;
  onDismiss: () => void;
}

export function AchievementToast({ achievementId, darkMode, onDismiss }: AchievementToastProps) {
  const [visible, setVisible] = useState(false);
  const t = darkMode ? THEME.dark : THEME.light;
  const ach = ACHIEVEMENTS.find(a => a.id === achievementId);

  useEffect(() => {
    if (achievementId && ach) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        onDismiss();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [achievementId]);

  if (!visible || !ach) return null;

  return (
    <Animated.View
      entering={SlideInUp.duration(400).springify()}
      exiting={SlideOutUp.duration(300)}
      style={[styles.toast, { backgroundColor: t.card, borderColor: t.accent }]}
    >
      <Animated.Text entering={ZoomIn.duration(500).delay(200)} style={styles.icon}>
        {ach.icon}
      </Animated.Text>
      <Animated.View entering={FadeIn.duration(400).delay(300)}>
        <Text style={[styles.label, { color: t.accent }]}>ACHIEVEMENT UNLOCKED</Text>
        <Text style={[styles.name, { color: t.text }]}>{ach.n}</Text>
        <Text style={[styles.desc, { color: t.textSub }]}>{ach.d}</Text>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: 'absolute', top: 60, left: 20, right: 20,
    flexDirection: 'row', alignItems: 'center', gap: 14,
    borderRadius: 16, borderWidth: 1, padding: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 16, elevation: 10,
    zIndex: 1000,
  },
  icon: { fontSize: 32 },
  label: { fontSize: 9, fontFamily: 'Outfit-Bold', letterSpacing: 2, marginBottom: 2 },
  name: { fontSize: 15, fontFamily: 'Outfit-ExtraBold' },
  desc: { fontSize: 11, fontFamily: 'Outfit-Regular', marginTop: 2 },
});
