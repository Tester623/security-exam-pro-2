// ══════════════════════════════════════════════════════
// Security+ Exam Pro — Settings Screen
// ══════════════════════════════════════════════════════

import { View, Text, ScrollView, Pressable, Alert, Linking, StyleSheet } from 'react-native';
import { useQuizStore } from '@/store/useQuizStore';
import { THEME } from '@/core/constants';
import { Ionicons } from '@expo/vector-icons';

export default function SettingsScreen() {
  const { ud, darkMode, toggleDarkMode, resetAll } = useQuizStore();
  const t = darkMode ? THEME.dark : THEME.light;

  const handleReset = () => {
    Alert.alert(
      'Reset All Progress',
      'This will erase all your stats, achievements, and quiz history. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => resetAll(),
        },
      ]
    );
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: t.bg }]}
      contentContainerStyle={{ paddingBottom: 120 }}
    >
      <Text style={[styles.title, { color: t.text }]}>Settings</Text>

      {/* ── Appearance ── */}
      <Text style={[styles.sectionLabel, { color: t.textSub }]}>APPEARANCE</Text>

      <View style={[styles.card, { backgroundColor: t.card }]}>
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Ionicons
              name={darkMode ? 'moon' : 'sunny'}
              size={18}
              color={t.accent}
              style={{ marginRight: 12 }}
            />
            <Text style={[styles.settingLabel, { color: t.text }]}>Dark Mode</Text>
          </View>
          <Pressable
            onPress={toggleDarkMode}
            style={[
              styles.toggle,
              { backgroundColor: darkMode ? t.accent : 'rgba(128,128,128,0.3)' },
            ]}
          >
            <View
              style={[
                styles.toggleDot,
                { left: darkMode ? 24 : 3 },
              ]}
            />
          </Pressable>
        </View>
      </View>

      {/* ── Account Stats ── */}
      <Text style={[styles.sectionLabel, { color: t.textSub }]}>YOUR PROGRESS</Text>

      <View style={[styles.card, { backgroundColor: t.card }]}>
        {[
          { icon: 'flame-outline', label: 'Current Streak', value: `${ud.sk} days` },
          { icon: 'star-outline', label: 'Level', value: `${ud.lv} (${ud.xp} XP)` },
          { icon: 'checkmark-done-outline', label: 'Questions Answered', value: `${ud.ta}` },
          { icon: 'trophy-outline', label: 'Tests Completed', value: `${ud.tt}` },
          { icon: 'ribbon-outline', label: 'Achievements', value: `${ud.ac.length}/12` },
          { icon: 'alert-circle-outline', label: 'Mistakes to Review', value: `${Object.keys(ud.mk).length}` },
        ].map((item, i) => (
          <View
            key={i}
            style={[
              styles.statRow,
              i < 5 && { borderBottomWidth: 1, borderBottomColor: t.border },
            ]}
          >
            <View style={styles.statInfo}>
              <Ionicons name={item.icon as any} size={16} color={t.textSub} style={{ marginRight: 10 }} />
              <Text style={[styles.statLabel, { color: t.text }]}>{item.label}</Text>
            </View>
            <Text style={[styles.statValue, { color: t.accent }]}>{item.value}</Text>
          </View>
        ))}
      </View>

      {/* ── Data ── */}
      <Text style={[styles.sectionLabel, { color: t.textSub }]}>DATA</Text>

      <Pressable
        onPress={handleReset}
        style={[styles.dangerBtn, { borderColor: t.error }]}
      >
        <Ionicons name="trash-outline" size={16} color={t.error} style={{ marginRight: 8 }} />
        <Text style={[styles.dangerBtnText, { color: t.error }]}>Reset All Data</Text>
      </Pressable>

      {/* ── About ── */}
      <Text style={[styles.sectionLabel, { color: t.textSub }]}>ABOUT</Text>

      <View style={[styles.card, { backgroundColor: t.card }]}>
        <View style={styles.aboutRow}>
          <Text style={[styles.aboutLabel, { color: t.textSub }]}>Version</Text>
          <Text style={[styles.aboutValue, { color: t.text }]}>3.0.0</Text>
        </View>
        <View style={[styles.aboutRow, { borderBottomWidth: 0 }]}>
          <Text style={[styles.aboutLabel, { color: t.textSub }]}>Content</Text>
          <Text style={[styles.aboutValue, { color: t.text }]}>640 Questions • SY0-701</Text>
        </View>
      </View>

      {/* ── Disclaimer ── */}
      <View style={styles.disclaimer}>
        <Text style={[styles.disclaimerText, { color: t.textSub }]}>
          Security+ Exam Pro v3.0
        </Text>
        <Text style={[styles.disclaimerText, { color: t.textSub, marginTop: 6 }]}>
          CompTIA Security+ is a registered trademark of CompTIA, Inc.{'\n'}
          This app is not affiliated with or endorsed by CompTIA.
        </Text>
      </View>
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
    marginBottom: 18,
  },
  sectionLabel: {
    fontSize: 10,
    fontFamily: 'Outfit-Bold',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 8,
    marginLeft: 4,
    marginTop: 8,
  },
  card: {
    borderRadius: 16,
    padding: 4,
    marginBottom: 16,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: 15,
    fontFamily: 'Outfit-Bold',
  },
  toggle: {
    width: 48,
    height: 28,
    borderRadius: 14,
    position: 'relative',
  },
  toggleDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#fff',
    position: 'absolute',
    top: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  statInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 14,
    fontFamily: 'Outfit-Regular',
  },
  statValue: {
    fontSize: 14,
    fontFamily: 'Outfit-Bold',
  },
  dangerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 14,
    marginBottom: 16,
  },
  dangerBtnText: {
    fontSize: 14,
    fontFamily: 'Outfit-Bold',
  },
  aboutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.04)',
  },
  aboutLabel: {
    fontSize: 13,
    fontFamily: 'Outfit-Regular',
  },
  aboutValue: {
    fontSize: 13,
    fontFamily: 'Outfit-Bold',
  },
  disclaimer: {
    alignItems: 'center',
    marginTop: 16,
    paddingHorizontal: 20,
  },
  disclaimerText: {
    fontSize: 10,
    fontFamily: 'Outfit-Regular',
    textAlign: 'center',
    lineHeight: 16,
  },
});
