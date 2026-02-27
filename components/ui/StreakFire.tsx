// ══════════════════════════════════════════════════════
// Animated Streak Fire effect
// ══════════════════════════════════════════════════════

import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { useEffect } from 'react';

interface StreakFireProps {
  streak: number;
  size?: number;
}

export function StreakFire({ streak, size = 36 }: StreakFireProps) {
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.15, { duration: 600, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 600, easing: Easing.inOut(Easing.ease) })
      ),
      -1, true
    );
    rotation.value = withRepeat(
      withSequence(
        withTiming(-3, { duration: 400 }),
        withTiming(3, { duration: 800 }),
        withTiming(0, { duration: 400 })
      ),
      -1, true
    );
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotation.value}deg` },
    ],
  }));

  if (streak < 1) return null;

  return (
    <View style={styles.wrap}>
      <Animated.Text style={[styles.fire, { fontSize: size }, animStyle]}>
        🔥
      </Animated.Text>
      <Text style={[styles.count, { fontSize: size * 0.4 }]}>{streak}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center' },
  fire: { lineHeight: 44 },
  count: { fontFamily: 'Outfit-ExtraBold', color: '#fbbf24', marginTop: -4 },
});
