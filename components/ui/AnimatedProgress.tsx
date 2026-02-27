// ══════════════════════════════════════════════════════
// Animated Progress Bar with Reanimated
// ══════════════════════════════════════════════════════

import { View, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';

interface AnimatedProgressProps {
  progress: number; // 0-100
  height?: number;
  colors?: string[];
  bgColor?: string;
  delay?: number;
}

export function AnimatedProgress({
  progress,
  height = 6,
  colors = ['#6366f1', '#8b5cf6'],
  bgColor = 'rgba(255,255,255,0.04)',
  delay = 0,
}: AnimatedProgressProps) {
  const width = useSharedValue(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      width.value = withSpring(Math.min(100, Math.max(0, progress)), {
        damping: 15,
        stiffness: 80,
      });
    }, delay);
    return () => clearTimeout(timeout);
  }, [progress, delay]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${width.value}%`,
  }));

  return (
    <View style={[styles.track, { height, backgroundColor: bgColor, borderRadius: height / 2 }]}>
      <Animated.View style={[styles.fill, { height, borderRadius: height / 2 }, animatedStyle]}>
        <LinearGradient
          colors={colors as [string, string]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[StyleSheet.absoluteFill, { borderRadius: height / 2 }]}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  track: { width: '100%', overflow: 'hidden' },
  fill: { overflow: 'hidden' },
});
