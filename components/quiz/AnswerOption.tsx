// ══════════════════════════════════════════════════════
// Security+ Exam Pro — AnswerOption Component
// Interactive answer button with state-based styling
// ══════════════════════════════════════════════════════

import React from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';

interface AnswerOptionProps {
  index: number;
  text: string;
  selected: boolean;
  isCorrect: boolean;
  showResult: boolean;
  isMulti: boolean;
  disabled: boolean;
  theme: {
    card: string;
    text: string;
    textSub: string;
    accent: string;
    accentBg: string;
    success: string;
    successBg: string;
    error: string;
    errorBg: string;
  };
  onPress: () => void;
}

export const AnswerOption: React.FC<AnswerOptionProps> = ({
  index, text, selected, isCorrect, showResult,
  isMulti, disabled, theme, onPress,
}) => {
  let bgColor = theme.card;
  let borderColor = 'transparent';
  let textColor = theme.text;
  let indicatorBg = 'rgba(128,128,128,0.12)';
  let indicatorColor = theme.textSub;
  let indicatorText = String.fromCharCode(65 + index);

  if (showResult && isCorrect) {
    bgColor = theme.successBg;
    borderColor = theme.success;
    textColor = theme.success;
    indicatorBg = theme.success;
    indicatorColor = '#fff';
    indicatorText = '\u2713';
  } else if (showResult && selected && !isCorrect) {
    bgColor = theme.errorBg;
    borderColor = theme.error;
    textColor = theme.error;
    indicatorBg = theme.error;
    indicatorColor = '#fff';
    indicatorText = '\u2717';
  } else if (selected) {
    bgColor = theme.accentBg;
    borderColor = theme.accent;
    textColor = theme.accent;
    indicatorBg = theme.accent;
    indicatorColor = '#fff';
    indicatorText = isMulti ? '\u25CF' : String.fromCharCode(65 + index);
  }

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[styles.container, { backgroundColor: bgColor, borderColor }]}
    >
      <View style={[styles.indicator, { backgroundColor: indicatorBg }]}>
        <Text style={[styles.indicatorText, { color: indicatorColor }]}>
          {indicatorText}
        </Text>
      </View>
      <Text style={[styles.answerText, { color: textColor }]}>{text}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 14,
    marginBottom: 8,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  indicator: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicatorText: {
    fontSize: 12,
    fontFamily: 'Outfit-Bold',
  },
  answerText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 22,
    fontFamily: 'Outfit-Regular',
  },
});
