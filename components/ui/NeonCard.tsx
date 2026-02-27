// ══════════════════════════════════════════════════════
// Security+ Exam Pro — NeonCard Component
// Soft-glow card with customizable neon accent
// For Skia upgrade: replace shadow with Canvas + RoundedRect + Shadow
// ══════════════════════════════════════════════════════

import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';

interface NeonCardProps {
  children: React.ReactNode;
  color?: string;
  backgroundColor?: string;
  style?: StyleProp<ViewStyle>;
}

export const NeonCard: React.FC<NeonCardProps> = ({
  children,
  color = '#22d3ee',
  backgroundColor = '#12121f',
  style,
}) => {
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor,
          shadowColor: color,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.3,
          shadowRadius: 12,
          // Android elevation + colored shadow workaround
          elevation: 8,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
});
