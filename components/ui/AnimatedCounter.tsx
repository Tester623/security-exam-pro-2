// ══════════════════════════════════════════════════════
// Animated Number Counter (count-up effect)
// ══════════════════════════════════════════════════════

import { Text, TextStyle } from 'react-native';
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withTiming,
  useDerivedValue,
} from 'react-native-reanimated';
import { useEffect } from 'react';

const AnimText = Animated.createAnimatedComponent(Text);

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  suffix?: string;
  style?: TextStyle;
  delay?: number;
}

export function AnimatedCounter({
  value,
  duration = 800,
  suffix = '',
  style,
  delay = 0,
}: AnimatedCounterProps) {
  const animValue = useSharedValue(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      animValue.value = withTiming(value, { duration });
    }, delay);
    return () => clearTimeout(timeout);
  }, [value, delay]);

  // Since Animated.Text doesn't support animatedProps for text content
  // in the standard way, we use a simpler approach with useState
  const [display, setDisplay] = require('react').useState(0);
  
  require('react').useEffect(() => {
    let start = 0;
    const increment = value / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setDisplay(value);
        clearInterval(timer);
      } else {
        setDisplay(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [value, duration]);

  return (
    <Text style={style}>
      {display}{suffix}
    </Text>
  );
}
