// ══════════════════════════════════════════════════════
// Security+ Exam Pro — Profile Screen
// Edit nickname, avatar, title, view stats
// ══════════════════════════════════════════════════════

import { View, Text, TextInput, Pressable, ScrollView, Alert, StyleSheet, Platform } from 'react-native';
import { useState, useCallback } from 'react';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp, ZoomIn } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useQuizStore } from '@/store/useQuizStore';
import { THEME } from '@/core/constants';
import { AVATAR_COLORS, TITLES } from '@/core/types';
import { useHaptics } from '@/hooks/useHaptics';

export default function ProfileScreen() {
  const { ud, profile, darkMode, updateProfile } = useQuizStore();
  const t = darkMode ? THEME.dark : THEME.light;
  const haptics = useHaptics();

  const [editing, setEditing] = useState(false);
  const [nick, setNick] = useState(profile.nickname);
  const [color, setColor] = useState(profile.avatarColor);
  const [title, setTitle] = useState(profile.title);

  const handleSave = useCallback(() => {
    if (nick.trim().length < 1) {
      Alert.alert('Invalid', 'Nickname must be at least 1 character');
      return;
    }
    updateProfile({
      nickname: nick.trim().substring(0, 20),
      avatarColor: color,
      title,
    });
    haptics.success();
    setEditing(false);
  }, [nick, color, title]);

  // Available titles based on progress
  const unlockedTitles = Object.entries(TITLES).filter(([key]) => {
    switch (key) {
      case 'rookie': return true;
      case 'student': return ud.ta >= 100;
      case 'analyst': return ud.ps >= 5;
      case 'specialist': return ud.lv >= 5;
      case 'expert': return !!ud.ac.find(a => a === 'dm80');
      case 'master': return ud.lv >= 10;
      case 'legend': return ud.ac.length >= 25;
      case 'nightowl': return ud.no;
      case 'speedster': return ud.sr;
      case 'survivor': return (ud.ws || 0) >= 10;
      default: return false;
    }
  });

  const initial = profile.nickname.charAt(0).toUpperCase();

  return (
    <ScrollView style={[styles.container, { backgroundColor: t.bg }]} contentContainerStyle={{ paddingBottom: 100 }}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={t.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: t.text }]}>Profile</Text>
        {!editing ? (
          <Pressable onPress={() => setEditing(true)}>
            <Ionicons name="create-outline" size={20} color={t.accent} />
          </Pressable>
        ) : (
          <Pressable onPress={handleSave}>
            <Text style={[styles.saveBtn, { color: t.accent }]}>Save</Text>
          </Pressable>
        )}
      </View>

      {/* Avatar Card */}
      <Animated.View entering={FadeInDown.duration(400).delay(100)}>
        <LinearGradient
          colors={t.gradientHeader as [string, string]}
          style={styles.avatarCard}
        >
          <Animated.View
            entering={ZoomIn.duration(500).delay(200)}
            style={[styles.avatarCircle, { backgroundColor: color + '30', borderColor: color }]}
          >
            <Text style={[styles.avatarInitial, { color }]}>{initial}</Text>
          </Animated.View>

          <Text style={styles.nickname}>{profile.nickname}</Text>
          <View style={[styles.titleBadge, { backgroundColor: t.accent + '25' }]}>
            <Text style={[styles.titleText, { color: t.accent }]}>
              {TITLES[profile.title]?.name || 'Rookie'}
            </Text>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{ud.lv}</Text>
              <Text style={styles.statLabel}>Level</Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: 'rgba(255,255,255,0.1)' }]} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{ud.xp}</Text>
              <Text style={styles.statLabel}>XP</Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: 'rgba(255,255,255,0.1)' }]} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{ud.sk}</Text>
              <Text style={styles.statLabel}>Streak</Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: 'rgba(255,255,255,0.1)' }]} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{ud.ac.length}</Text>
              <Text style={styles.statLabel}>Badges</Text>
            </View>
          </View>
        </LinearGradient>
      </Animated.View>

      {/* Edit Section */}
      {editing && (
        <Animated.View entering={FadeInDown.duration(300)}>
          {/* Nickname */}
          <Text style={[styles.sectionLabel, { color: t.textSub }]}>NICKNAME</Text>
          <View style={[styles.inputWrap, { backgroundColor: t.card, borderColor: t.border }]}>
            <Ionicons name="person-outline" size={16} color={t.textSub} />
            <TextInput
              value={nick}
              onChangeText={(v) => setNick(v.substring(0, 20))}
              placeholder="Your name..."
              placeholderTextColor={t.textSub}
              style={[styles.input, { color: t.text }]}
              maxLength={20}
              autoCapitalize="words"
            />
            <Text style={[styles.charCount, { color: t.textSub }]}>{nick.length}/20</Text>
          </View>

          {/* Avatar Color */}
          <Text style={[styles.sectionLabel, { color: t.textSub }]}>AVATAR COLOR</Text>
          <View style={styles.colorGrid}>
            {AVATAR_COLORS.map((c) => (
              <Pressable
                key={c}
                onPress={() => { setColor(c); haptics.selection(); }}
                style={[
                  styles.colorDot,
                  { backgroundColor: c },
                  color === c && styles.colorDotActive,
                ]}
              >
                {color === c && <Ionicons name="checkmark" size={14} color="#fff" />}
              </Pressable>
            ))}
          </View>

          {/* Title */}
          <Text style={[styles.sectionLabel, { color: t.textSub }]}>TITLE</Text>
          <View style={[styles.titlesWrap, { backgroundColor: t.card }]}>
            {unlockedTitles.map(([key, info]) => (
              <Pressable
                key={key}
                onPress={() => { setTitle(key); haptics.light(); }}
                style={[
                  styles.titleOption,
                  title === key && { backgroundColor: t.accentBg, borderColor: t.accent, borderWidth: 1 },
                ]}
              >
                <Text style={[
                  styles.titleOptionText,
                  { color: title === key ? t.accent : t.text },
                ]}>{info.name}</Text>
                <Text style={[styles.titleReq, { color: t.textSub }]}>{info.req}</Text>
              </Pressable>
            ))}
            {Object.keys(TITLES).length - unlockedTitles.length > 0 && (
              <Text style={[styles.lockedNote, { color: t.textSub }]}>
                🔒 {Object.keys(TITLES).length - unlockedTitles.length} more titles locked
              </Text>
            )}
          </View>
        </Animated.View>
      )}

      {/* Stats Grid */}
      {!editing && (
        <Animated.View entering={FadeInUp.duration(300).delay(300)}>
          <Text style={[styles.sectionLabel, { color: t.textSub }]}>STATISTICS</Text>
          <View style={styles.statsGrid}>
            {[
              { icon: '📝', label: 'Questions', value: ud.ta },
              { icon: '🎯', label: 'Tests Done', value: ud.tt },
              { icon: '✅', label: 'Tests Passed', value: ud.ps },
              { icon: '💎', label: 'Perfect Scores', value: ud.pt },
              { icon: '🃏', label: 'Cards Reviewed', value: ud.fr },
              { icon: '✍️', label: 'Custom Cards', value: ud.cf.length },
              { icon: '🔥', label: 'Best Streak', value: `${ud.sk}d` },
              { icon: '💀', label: 'Worst Streak', value: `${ud.ws || 0} wrong` },
            ].map((s, i) => (
              <Animated.View
                key={i}
                entering={FadeInDown.duration(300).delay(350 + i * 50)}
                style={[styles.statCard, { backgroundColor: t.card }]}
              >
                <Text style={{ fontSize: 20 }}>{s.icon}</Text>
                <Text style={[styles.statCardValue, { color: t.text }]}>{s.value}</Text>
                <Text style={[styles.statCardLabel, { color: t.textSub }]}>{s.label}</Text>
              </Animated.View>
            ))}
          </View>

          {/* Auth info */}
          <View style={[styles.authInfo, { backgroundColor: t.card }]}>
            <Ionicons
              name={profile.provider === 'google' ? 'logo-google' : profile.provider === 'apple' ? 'logo-apple' : profile.provider === 'github' ? 'logo-github' : 'person-outline'}
              size={16}
              color={t.textSub}
            />
            <Text style={[styles.authText, { color: t.textSub }]}>
              {profile.provider === 'guest' ? 'Guest Account' : `Signed in via ${profile.provider}`}
              {profile.email ? ` • ${profile.email}` : ''}
            </Text>
          </View>
        </Animated.View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 },
  headerTitle: { fontSize: 18, fontFamily: 'Outfit-Bold' },
  saveBtn: { fontSize: 15, fontFamily: 'Outfit-Bold' },
  avatarCard: { borderRadius: 20, padding: 24, alignItems: 'center', marginBottom: 20 },
  avatarCircle: { width: 72, height: 72, borderRadius: 36, borderWidth: 2, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  avatarInitial: { fontSize: 28, fontFamily: 'Outfit-ExtraBold' },
  nickname: { fontSize: 20, fontFamily: 'Outfit-ExtraBold', color: '#fff', marginBottom: 6 },
  titleBadge: { paddingHorizontal: 14, paddingVertical: 4, borderRadius: 20, marginBottom: 16 },
  titleText: { fontSize: 11, fontFamily: 'Outfit-Bold' },
  statsRow: { flexDirection: 'row', alignItems: 'center' },
  statItem: { alignItems: 'center', paddingHorizontal: 14 },
  statValue: { fontSize: 18, fontFamily: 'Outfit-ExtraBold', color: '#fff' },
  statLabel: { fontSize: 10, fontFamily: 'Outfit-Regular', color: 'rgba(255,255,255,0.5)', marginTop: 2 },
  statDivider: { width: 1, height: 28 },
  sectionLabel: { fontSize: 10, fontFamily: 'Outfit-Bold', letterSpacing: 2, marginBottom: 8, marginTop: 12, marginLeft: 4 },
  inputWrap: { flexDirection: 'row', alignItems: 'center', borderRadius: 14, borderWidth: 1, paddingHorizontal: 14, paddingVertical: Platform.OS === 'ios' ? 14 : 8, marginBottom: 12, gap: 10 },
  input: { flex: 1, fontSize: 15, fontFamily: 'Outfit-Regular' },
  charCount: { fontSize: 10, fontFamily: 'Outfit-Regular' },
  colorGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 12 },
  colorDot: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  colorDotActive: { borderWidth: 2, borderColor: '#fff' },
  titlesWrap: { borderRadius: 14, padding: 4, marginBottom: 12, overflow: 'hidden' },
  titleOption: { paddingVertical: 12, paddingHorizontal: 14, borderRadius: 10, marginBottom: 2 },
  titleOptionText: { fontSize: 14, fontFamily: 'Outfit-Bold' },
  titleReq: { fontSize: 10, fontFamily: 'Outfit-Regular', marginTop: 2 },
  lockedNote: { fontSize: 11, fontFamily: 'Outfit-Regular', textAlign: 'center', padding: 10 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  statCard: { width: '48%', borderRadius: 14, padding: 14, alignItems: 'center', gap: 4 },
  statCardValue: { fontSize: 18, fontFamily: 'Outfit-ExtraBold' },
  statCardLabel: { fontSize: 10, fontFamily: 'Outfit-Regular' },
  authInfo: { flexDirection: 'row', alignItems: 'center', gap: 8, borderRadius: 12, padding: 14, marginTop: 12 },
  authText: { fontSize: 11, fontFamily: 'Outfit-Regular', flex: 1 },
});
