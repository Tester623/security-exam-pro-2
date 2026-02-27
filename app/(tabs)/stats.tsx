// ══════════════════════════════════════════════════════
// Security+ Exam Pro — Stats Screen
// ══════════════════════════════════════════════════════

import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useQuizStore } from '@/store/useQuizStore';
import { THEME, DOMAINS } from '@/core/constants';

export default function StatsScreen() {
  const { ud, darkMode, getReadiness, getPassProbability } = useQuizStore();
  const t = darkMode ? THEME.dark : THEME.light;
  const rd = getReadiness();
  const pp = getPassProbability();

  return (
    <ScrollView style={[styles.container, { backgroundColor: t.bg }]} contentContainerStyle={{ paddingBottom: 120 }}>
      <Text style={[styles.title, { color: t.text }]}>Statistics</Text>

      {/* Pass Probability */}
      <View style={[styles.card, { backgroundColor: t.card, borderLeftColor: t.neon, borderLeftWidth: 3 }]}>
        <Text style={[styles.label, { color: t.neon }]}>PASS PROBABILITY</Text>
        <Text style={[styles.bigNum, { color: pp >= 70 ? t.success : pp >= 40 ? t.warning : t.error }]}>{pp}%</Text>
        <Text style={[styles.sub, { color: t.textSub }]}>
          Based on readiness ({rd}%), domain coverage, and recent scores
        </Text>
      </View>

      {/* Summary Grid */}
      <View style={styles.grid}>
        {[
          { l: 'Total Q', v: ud.ta },
          { l: 'Tests', v: ud.tt },
          { l: 'Passed', v: ud.ps },
        ].map((s, i) => (
          <View key={i} style={[styles.gridCard, { backgroundColor: t.card }]}>
            <Text style={[styles.gridValue, { color: t.accent }]}>{s.v}</Text>
            <Text style={[styles.gridLabel, { color: t.textSub }]}>{s.l}</Text>
          </View>
        ))}
      </View>

      {/* Domain Performance */}
      <Text style={[styles.label, { color: t.textSub, marginLeft: 4 }]}>DOMAIN PERFORMANCE</Text>
      {Object.entries(DOMAINS).map(([d, info]) => {
        const s = ud.ds[d];
        const pct = s && s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0;
        return (
          <View key={d} style={[styles.card, { backgroundColor: t.card }]}>
            <View style={styles.domRow}>
              <Text style={[styles.domName, { color: t.text }]}>{d} {info.n}</Text>
              <Text style={[styles.domPct, { color: pct >= 75 ? t.success : pct >= 50 ? t.warning : pct > 0 ? t.error : t.textSub }]}>
                {pct}%
              </Text>
            </View>
            <View style={[styles.barBg, { backgroundColor: t.border }]}>
              <View style={[styles.barFill, {
                width: `${pct}%`,
                backgroundColor: pct >= 75 ? t.success : pct >= 50 ? t.warning : t.error,
              }]} />
            </View>
            <Text style={[styles.domSub, { color: t.textSub }]}>
              {s ? `${s.correct}/${s.total} correct` : 'Not started'} • Weight: {info.w}%
            </Text>
          </View>
        );
      })}

      {/* Recent Tests */}
      <Text style={[styles.label, { color: t.textSub, marginTop: 16, marginLeft: 4 }]}>RECENT TESTS</Text>
      {(ud.hi || []).slice(0, 10).map((h, i) => (
        <View key={i} style={[styles.historyRow, { backgroundColor: t.card }]}>
          <Text style={[styles.histDate, { color: t.textSub }]}>{new Date(h.date).toLocaleDateString()}</Text>
          <Text style={[styles.histScore, { color: h.score >= 75 ? t.success : t.error }]}>
            {h.score}% ({h.questionsCount}q)
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontFamily: 'Outfit-ExtraBold', marginBottom: 18 },
  card: { borderRadius: 16, padding: 16, marginBottom: 10 },
  label: { fontSize: 10, fontFamily: 'Outfit-Bold', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8 },
  bigNum: { fontSize: 40, fontFamily: 'Outfit-ExtraBold' },
  sub: { fontSize: 11, fontFamily: 'Outfit-Regular', marginTop: 4 },
  grid: { flexDirection: 'row', gap: 10, marginBottom: 18 },
  gridCard: { flex: 1, borderRadius: 14, padding: 14, alignItems: 'center' },
  gridValue: { fontSize: 22, fontFamily: 'Outfit-Bold' },
  gridLabel: { fontSize: 9, fontFamily: 'Outfit-Bold', textTransform: 'uppercase', letterSpacing: 1, marginTop: 4 },
  domRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  domName: { fontSize: 12, fontFamily: 'Outfit-Bold' },
  domPct: { fontSize: 12, fontFamily: 'Outfit-Bold' },
  barBg: { height: 5, borderRadius: 6, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 6 },
  domSub: { fontSize: 10, fontFamily: 'Outfit-Regular', marginTop: 6 },
  historyRow: { flexDirection: 'row', justifyContent: 'space-between', padding: 12, borderRadius: 12, marginBottom: 6 },
  histDate: { fontSize: 12, fontFamily: 'Outfit-Regular' },
  histScore: { fontSize: 12, fontFamily: 'Outfit-Bold' },
});
