// ══════════════════════════════════════════════════════
// Security+ Exam Pro — Home Screen (Dashboard)
// ══════════════════════════════════════════════════════

import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { useMemo } from 'react';
import { useQuizStore } from '@/store/useQuizStore';
import { THEME, XP_PER_LEVEL, DOMAINS } from '@/core/constants';
import { TITLES } from '@/core/types';
import { AnimatedProgress } from '@/components/ui/AnimatedProgress';
import { StreakFire } from '@/components/ui/StreakFire';
import { useHaptics } from '@/hooks/useHaptics';
import questions from '@/assets/data/questions.json';
import { Question } from '@/core/types';

const Q = questions as Question[];

export default function HomeScreen() {
  const router = useRouter();
  const haptics = useHaptics();
  const { ud, profile, darkMode, getReadiness, getPassProbability, getMistakeCount, setDailyQuestion } =
    useQuizStore();
  const t = darkMode ? THEME.dark : THEME.light;

  const rd = getReadiness();
  const passPr = getPassProbability();
  const mc = getMistakeCount();

  // Daily question
  const dQ = useMemo(() => {
    const today = new Date().toDateString();
    if (ud.dd !== today) {
      const randomQ = Q[Math.floor(Math.random() * Q.length)];
      setDailyQuestion(randomQ.id);
      return randomQ;
    }
    return Q.find((q) => q.id === ud.dq) ?? null;
  }, [ud.dd, ud.dq]);

  const startQuiz = (mode: string, params?: Record<string, string>) => {
    haptics.medium();
    router.push({
      pathname: '/quiz/[mode]',
      params: { mode, ...params },
    });
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: t.bg }]}
      contentContainerStyle={{ paddingBottom: 120 }}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Header Card ── */}
      <LinearGradient
        colors={t.gradientHeader as [string, string]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerCard}
      >
        <Text style={styles.headerSub}>CompTIA Security+ SY0-701</Text>
        <Text style={styles.headerTitle}>Exam Prep</Text>

        <View style={styles.statsRow}>
          {[
            { l: 'Readiness', v: `${rd}%`, c: rd >= 75 ? t.success : rd >= 50 ? t.warning : t.error },
            { l: 'Pass Prob.', v: `${passPr}%`, c: passPr >= 70 ? t.success : passPr >= 40 ? t.warning : t.error },
            { l: 'Streak', v: `${ud.sk}d`, c: '#fff' },
            { l: 'Level', v: `${ud.lv}`, c: t.neon },
          ].map((stat, i) => (
            <View key={i} style={styles.statBox}>
              <Text style={styles.statLabel}>{stat.l}</Text>
              <Text style={[styles.statValue, { color: stat.c }]}>{stat.v}</Text>
            </View>
          ))}
        </View>

        {/* XP Bar */}
        <View style={styles.xpBarBg}>
          <View style={[styles.xpBarFill, { width: `${(ud.xp % XP_PER_LEVEL) / 2}%` }]} />
        </View>
        <Text style={styles.xpText}>
          {ud.xp % XP_PER_LEVEL}/{XP_PER_LEVEL} XP to Level {ud.lv + 1}
        </Text>
      </LinearGradient>

      {/* ── Daily Question ── */}
      {dQ && (
        <View style={[styles.card, { backgroundColor: t.card, borderLeftColor: t.neon, borderLeftWidth: 3 }]}>
          <Text style={[styles.sectionTitle, { color: t.neon }]}>DAILY QUESTION</Text>
          <Text style={[styles.dailyText, { color: t.text }]} numberOfLines={3}>
            {dQ.q}
          </Text>
          <Pressable
            onPress={() => startQuiz('practice', { count: '1' })}
            style={({ pressed }) => [styles.primaryBtn, { opacity: pressed ? 0.8 : 1 }]}
          >
            <LinearGradient colors={t.gradientAccent as [string, string]} style={styles.gradientBtn}>
              <Text style={styles.btnText}>Answer</Text>
            </LinearGradient>
          </Pressable>
        </View>
      )}

      {/* ── Quick Start ── */}
      <Text style={[styles.sectionTitle, { color: t.textSub, marginLeft: 4 }]}>QUICK START</Text>
      <View style={styles.quickGrid}>
        {[
          { n: 'Practice', sub: '25 random questions', mode: 'practice', params: { count: '25' } },
          { n: 'Full Exam', sub: '90 min, 90 questions', mode: 'exam', params: { count: '90', timer: '90' } },
          { n: 'Quick 10', sub: 'Fast round', mode: 'practice', params: { count: '10' } },
          { n: 'Marathon', sub: `All ${Q.length} questions`, mode: 'practice', params: { count: String(Q.length) } },
        ].map((item, i) => (
          <Pressable
            key={i}
            onPress={() => startQuiz(item.mode, item.params)}
            style={({ pressed }) => [
              styles.quickCard,
              { backgroundColor: t.card, opacity: pressed ? 0.85 : 1 },
            ]}
          >
            <Text style={[styles.quickTitle, { color: t.text }]}>{item.n}</Text>
            <Text style={[styles.quickSub, { color: t.textSub }]}>{item.sub}</Text>
          </Pressable>
        ))}
      </View>

      {/* ── Mistakes ── */}
      {mc > 0 && (
        <Pressable
          onPress={() => startQuiz('mistakes', { count: String(mc) })}
          style={[styles.mistakeBtn, { borderColor: t.error }]}
        >
          <Text style={[styles.mistakeBtnText, { color: t.error }]}>
            Review {mc} Mistakes
          </Text>
        </Pressable>
      )}

      {/* ── Info ── */}
      <Text style={[styles.infoText, { color: t.textSub }]}>
        {Q.length} Questions • 5 Domains • 28 Ports • 36 Acronyms
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  headerCard: {
    borderRadius: 20,
    padding: 22,
    marginBottom: 18,
    overflow: 'hidden',
  },
  headerSub: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.4)',
    textTransform: 'uppercase',
    letterSpacing: 3,
    fontFamily: 'Outfit-Bold',
  },
  headerTitle: {
    fontSize: 26,
    color: '#fff',
    fontFamily: 'Outfit-ExtraBold',
    marginTop: 2,
    letterSpacing: -0.5,
  },
  statsRow: { flexDirection: 'row', gap: 8, marginTop: 16 },
  statBox: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 12,
    padding: 10,
  },
  statLabel: {
    fontSize: 9,
    color: 'rgba(255,255,255,0.4)',
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontFamily: 'Outfit-Bold',
  },
  statValue: {
    fontSize: 18,
    fontFamily: 'Outfit-Bold',
    marginTop: 2,
  },
  xpBarBg: {
    marginTop: 12,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 8,
    height: 4,
    overflow: 'hidden',
  },
  xpBarFill: { height: '100%', borderRadius: 8, backgroundColor: '#818cf8' },
  xpText: {
    fontSize: 9,
    color: 'rgba(255,255,255,0.3)',
    marginTop: 4,
    fontFamily: 'Outfit-Regular',
  },
  card: {
    borderRadius: 16,
    padding: 18,
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 10,
    fontFamily: 'Outfit-Bold',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 10,
  },
  dailyText: {
    fontSize: 13,
    lineHeight: 20,
    fontFamily: 'Outfit-Regular',
    marginBottom: 12,
  },
  primaryBtn: { borderRadius: 12, overflow: 'hidden' },
  gradientBtn: {
    paddingVertical: 13,
    alignItems: 'center',
    borderRadius: 12,
  },
  btnText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Outfit-Bold',
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 18,
  },
  quickCard: {
    width: '48%',
    borderRadius: 14,
    padding: 16,
  },
  quickTitle: { fontSize: 14, fontFamily: 'Outfit-Bold' },
  quickSub: { fontSize: 11, fontFamily: 'Outfit-Regular', marginTop: 2 },
  mistakeBtn: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
    marginBottom: 18,
  },
  mistakeBtnText: { fontSize: 14, fontFamily: 'Outfit-Bold' },
  infoText: { textAlign: 'center', fontSize: 10, fontFamily: 'Outfit-Regular', padding: 8 },
});
