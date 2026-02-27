// ══════════════════════════════════════════════════════
// Security+ Exam Pro — Quiz Result Screen
// ══════════════════════════════════════════════════════

import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useQuizStore } from '@/store/useQuizStore';
import { THEME } from '@/core/constants';

export default function ResultScreen() {
  const { score, correct, total, mistakes, achievement } = useLocalSearchParams<{
    score: string; correct: string; total: string; mistakes: string; achievement: string;
  }>();
  const router = useRouter();
  const t = useQuizStore((s) => s.darkMode) ? THEME.dark : THEME.light;

  const pct = parseInt(score || '0', 10);
  const passed = pct >= 75;

  return (
    <View style={[styles.container, { backgroundColor: t.bg }]}>
      {/* Score */}
      <LinearGradient colors={t.gradientAccent as [string, string]} style={styles.scoreCircle}>
        <Text style={styles.scoreText}>{pct}%</Text>
      </LinearGradient>
      <Text style={[styles.statusText, { color: t.text }]}>
        {passed ? 'Passed!' : 'Keep Studying'}
      </Text>
      <Text style={[styles.subText, { color: t.textSub }]}>
        {correct} of {total} correct
      </Text>

      {/* Achievement toast */}
      {achievement ? (
        <View style={[styles.achCard, { backgroundColor: t.accentBg }]}>
          <Text style={[styles.achText, { color: t.accent }]}>
            🏆 Achievement Unlocked: {achievement}
          </Text>
        </View>
      ) : null}

      {/* Stats grid */}
      <View style={styles.statsGrid}>
        {[
          { l: 'Score', v: `${pct}%`, c: passed ? t.success : t.error },
          { l: 'Correct', v: correct, c: t.success },
          { l: 'Wrong', v: String(parseInt(total || '0') - parseInt(correct || '0')), c: t.error },
        ].map((s, i) => (
          <View key={i} style={[styles.statCard, { backgroundColor: t.card }]}>
            <Text style={[styles.statValue, { color: s.c }]}>{s.v}</Text>
            <Text style={[styles.statLabel, { color: t.textSub }]}>{s.l}</Text>
          </View>
        ))}
      </View>

      {/* Actions */}
      {parseInt(mistakes || '0') > 0 && (
        <Pressable
          onPress={() => router.replace({ pathname: '/quiz/[mode]', params: { mode: 'mistakes' } })}
          style={[styles.mistakeBtn, { borderColor: t.error }]}
        >
          <Text style={[styles.mistakeBtnText, { color: t.error }]}>
            Review {mistakes} Mistakes
          </Text>
        </Pressable>
      )}

      <Pressable onPress={() => router.replace('/(tabs)')} style={styles.homeBtn}>
        <LinearGradient colors={t.gradientAccent as [string, string]} style={styles.gradientBtn}>
          <Text style={styles.btnText}>Home</Text>
        </LinearGradient>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, alignItems: 'center', justifyContent: 'center' },
  scoreCircle: {
    width: 120, height: 120, borderRadius: 60,
    alignItems: 'center', justifyContent: 'center', marginBottom: 16,
  },
  scoreText: { fontSize: 36, fontFamily: 'Outfit-ExtraBold', color: '#fff' },
  statusText: { fontSize: 20, fontFamily: 'Outfit-Bold', marginBottom: 4 },
  subText: { fontSize: 14, fontFamily: 'Outfit-Regular', marginBottom: 24 },
  achCard: { borderRadius: 12, padding: 14, marginBottom: 24, width: '100%', alignItems: 'center' },
  achText: { fontSize: 13, fontFamily: 'Outfit-Bold' },
  statsGrid: { flexDirection: 'row', gap: 10, marginBottom: 24, width: '100%' },
  statCard: { flex: 1, borderRadius: 14, padding: 14, alignItems: 'center' },
  statValue: { fontSize: 22, fontFamily: 'Outfit-Bold' },
  statLabel: { fontSize: 10, fontFamily: 'Outfit-Bold', textTransform: 'uppercase', letterSpacing: 1, marginTop: 4 },
  mistakeBtn: { borderWidth: 1, borderRadius: 12, paddingVertical: 14, width: '100%', alignItems: 'center', marginBottom: 10 },
  mistakeBtnText: { fontSize: 14, fontFamily: 'Outfit-Bold' },
  homeBtn: { borderRadius: 12, overflow: 'hidden', width: '100%' },
  gradientBtn: { paddingVertical: 14, alignItems: 'center', borderRadius: 12 },
  btnText: { color: '#fff', fontSize: 14, fontFamily: 'Outfit-Bold' },
});
