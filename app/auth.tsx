// ══════════════════════════════════════════════════════
// Security+ Exam Pro — Auth / Onboarding Screen
// ══════════════════════════════════════════════════════

import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp, ZoomIn, SlideInRight } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useQuizStore } from '@/store/useQuizStore';
import { THEME } from '@/core/constants';
import { loginAsGuest } from '@/core/auth';
import { useHaptics } from '@/hooks/useHaptics';

export default function AuthScreen() {
  const { setProfile, darkMode } = useQuizStore();
  const t = darkMode ? THEME.dark : THEME.light;
  const haptics = useHaptics();

  const handleGuest = async () => {
    haptics.success();
    const p = await loginAsGuest();
    setProfile(p);
    router.replace('/(tabs)');
  };

  const handleSocial = (provider: string) => {
    haptics.light();
    // TODO: implement OAuth flows
    // For now, create guest with provider label
    handleGuest();
  };

  return (
    <LinearGradient colors={['#0a0a12', '#1a1040', '#0a0a12']} style={styles.container}>
      {/* Logo / Hero */}
      <Animated.View entering={ZoomIn.duration(600)} style={styles.hero}>
        <View style={styles.logoCircle}>
          <Ionicons name="shield-checkmark" size={44} color="#818cf8" />
        </View>
      </Animated.View>

      <Animated.Text entering={FadeInDown.duration(500).delay(200)} style={styles.title}>
        Security+ Exam Pro
      </Animated.Text>
      <Animated.Text entering={FadeInDown.duration(500).delay(350)} style={styles.subtitle}>
        Master CompTIA SY0-701 with 784 practice questions, adaptive learning, and real exam simulation.
      </Animated.Text>

      {/* Feature pills */}
      <Animated.View entering={FadeInDown.duration(400).delay(500)} style={styles.features}>
        {['784 Questions', 'Offline Mode', 'Smart Analytics'].map((f, i) => (
          <Animated.View
            key={f}
            entering={SlideInRight.duration(300).delay(600 + i * 100)}
            style={styles.featurePill}
          >
            <Text style={styles.featureText}>{f}</Text>
          </Animated.View>
        ))}
      </Animated.View>

      {/* Auth Buttons */}
      <View style={styles.authButtons}>
        {/* Google */}
        <Animated.View entering={FadeInUp.duration(400).delay(800)}>
          <Pressable onPress={() => handleSocial('google')} style={[styles.authBtn, styles.googleBtn]}>
            <Ionicons name="logo-google" size={18} color="#fff" />
            <Text style={styles.authBtnText}>Continue with Google</Text>
          </Pressable>
        </Animated.View>

        {/* Apple (iOS only) */}
        {Platform.OS === 'ios' && (
          <Animated.View entering={FadeInUp.duration(400).delay(900)}>
            <Pressable onPress={() => handleSocial('apple')} style={[styles.authBtn, styles.appleBtn]}>
              <Ionicons name="logo-apple" size={18} color="#fff" />
              <Text style={styles.authBtnText}>Continue with Apple</Text>
            </Pressable>
          </Animated.View>
        )}

        {/* GitHub */}
        <Animated.View entering={FadeInUp.duration(400).delay(1000)}>
          <Pressable onPress={() => handleSocial('github')} style={[styles.authBtn, styles.githubBtn]}>
            <Ionicons name="logo-github" size={18} color="#fff" />
            <Text style={styles.authBtnText}>Continue with GitHub</Text>
          </Pressable>
        </Animated.View>

        {/* Divider */}
        <Animated.View entering={FadeInUp.duration(300).delay(1100)} style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.dividerLine} />
        </Animated.View>

        {/* Guest */}
        <Animated.View entering={FadeInUp.duration(400).delay(1200)}>
          <Pressable onPress={handleGuest} style={[styles.authBtn, styles.guestBtn]}>
            <Ionicons name="person-outline" size={18} color="rgba(255,255,255,0.7)" />
            <Text style={[styles.authBtnText, { color: 'rgba(255,255,255,0.7)' }]}>
              Continue as Guest
            </Text>
          </Pressable>
        </Animated.View>
      </View>

      {/* Disclaimer */}
      <Animated.Text entering={FadeInUp.duration(300).delay(1400)} style={styles.disclaimer}>
        CompTIA Security+ is a registered trademark of CompTIA, Inc.{'\n'}
        This app is not affiliated with or endorsed by CompTIA.
      </Animated.Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  hero: { marginBottom: 20 },
  logoCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(129,140,248,0.1)', borderWidth: 1, borderColor: 'rgba(129,140,248,0.2)', alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 26, fontFamily: 'Outfit-ExtraBold', color: '#fff', marginBottom: 8 },
  subtitle: { fontSize: 13, fontFamily: 'Outfit-Regular', color: 'rgba(255,255,255,0.5)', textAlign: 'center', lineHeight: 20, marginBottom: 16, maxWidth: 300 },
  features: { flexDirection: 'row', gap: 8, marginBottom: 32 },
  featurePill: { backgroundColor: 'rgba(129,140,248,0.1)', borderColor: 'rgba(129,140,248,0.2)', borderWidth: 1, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6 },
  featureText: { fontSize: 11, fontFamily: 'Outfit-Bold', color: '#818cf8' },
  authButtons: { width: '100%', maxWidth: 320 },
  authBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, borderRadius: 14, paddingVertical: 15, marginBottom: 10 },
  authBtnText: { fontSize: 14, fontFamily: 'Outfit-Bold', color: '#fff' },
  googleBtn: { backgroundColor: '#4285F4' },
  appleBtn: { backgroundColor: '#000' },
  githubBtn: { backgroundColor: '#24292e' },
  guestBtn: { backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: 6 },
  dividerLine: { flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.08)' },
  dividerText: { fontSize: 11, fontFamily: 'Outfit-Regular', color: 'rgba(255,255,255,0.3)', paddingHorizontal: 12 },
  disclaimer: { fontSize: 9, fontFamily: 'Outfit-Regular', color: 'rgba(255,255,255,0.2)', textAlign: 'center', marginTop: 24, lineHeight: 14 },
});
