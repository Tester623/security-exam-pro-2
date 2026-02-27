// ══════════════════════════════════════════════════════
// Security+ Exam Pro — Achievements Screen
// ══════════════════════════════════════════════════════

import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useQuizStore } from '@/store/useQuizStore';
import { THEME, ACHIEVEMENTS } from '@/core/constants';
import { Ionicons } from '@expo/vector-icons';

export default function AchievementsScreen() {
  const { ud, darkMode } = useQuizStore();
  const t = darkMode ? THEME.dark : THEME.light;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: t.bg }]}
      contentContainerStyle={{ paddingBottom: 120 }}
    >
      <Text style={[styles.title, { color: t.text }]}>Achievements</Text>
      <Text style={[styles.subtitle, { color: t.textSub }]}>
        {ud.ac.length}/{ACHIEVEMENTS.length} unlocked
      </Text>

      {ACHIEVEMENTS.map((ach) => {
        const unlocked = ud.ac.includes(ach.id);
        return (
          <View
            key={ach.id}
            style={[
              styles.achCard,
              {
                backgroundColor: t.card,
                opacity: unlocked ? 1 : 0.4,
              },
            ]}
          >
            <View
              style={[
                styles.achIcon,
                {
                  backgroundColor: unlocked ? t.accentBg : 'rgba(128,128,128,0.08)',
                },
              ]}
            >
              <Text style={{ fontSize: 20 }}>{ach.icon || (unlocked ? '⭐' : '🔒')}</Text>
            </View>
            <View style={styles.achInfo}>
              <Text
                style={[
                  styles.achName,
                  { color: unlocked ? t.text : t.textSub },
                ]}
              >
                {ach.n}
              </Text>
              <Text style={[styles.achDesc, { color: t.textSub }]}>
                {ach.d}
              </Text>
            </View>
            {unlocked && (
              <Text style={[styles.achDone, { color: t.success }]}>Done</Text>
            )}
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontFamily: 'Outfit-ExtraBold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    fontFamily: 'Outfit-Regular',
    marginBottom: 20,
  },
  achCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 14,
    marginBottom: 8,
    gap: 14,
  },
  achIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  achInfo: {
    flex: 1,
  },
  achName: {
    fontSize: 14,
    fontFamily: 'Outfit-Bold',
  },
  achDesc: {
    fontSize: 11,
    fontFamily: 'Outfit-Regular',
    marginTop: 2,
  },
  achDone: {
    fontSize: 11,
    fontFamily: 'Outfit-Bold',
  },
});
