// ══════════════════════════════════════════════════════
// Security+ Exam Pro — QuestionCard Component
// Animated card with answer selection and result reveal
// Supports both single-select and multi-select questions
// ══════════════════════════════════════════════════════

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

interface QuestionCardProps {
  questionText: string;
  isMulti: boolean;
  correctCount: number;
  domain: string;
  domainName: string;
  difficulty: number;
  isPrevMistake: boolean;
  theme: {
    card: string;
    text: string;
    textSub: string;
    accent: string;
    accentBg: string;
    neon: string;
    neonBg: string;
    success: string;
    successBg: string;
    error: string;
    errorBg: string;
    warning: string;
    warningBg: string;
  };
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  questionText,
  isMulti,
  correctCount,
  domain,
  domainName,
  difficulty,
  isPrevMistake,
  theme,
}) => {
  const diffColors = [
    { bg: theme.successBg, fg: theme.success, label: 'Easy' },
    { bg: theme.warningBg, fg: theme.warning, label: 'Medium' },
    { bg: theme.errorBg, fg: theme.error, label: 'Hard' },
  ];
  const dc = diffColors[(difficulty || 2) - 1];

  return (
    <Animated.View
      entering={FadeIn.duration(200)}
      style={[styles.card, { backgroundColor: theme.card }]}
    >
      {/* Badges row */}
      <View style={styles.badges}>
        <View style={[styles.badge, { backgroundColor: theme.accentBg }]}>
          <Text style={[styles.badgeText, { color: theme.accent }]}>
            {domain} {domainName}
          </Text>
        </View>
        {dc && (
          <View style={[styles.badge, { backgroundColor: dc.bg }]}>
            <Text style={[styles.badgeText, { color: dc.fg }]}>{dc.label}</Text>
          </View>
        )}
        {isPrevMistake && (
          <View style={[styles.badge, { backgroundColor: theme.errorBg }]}>
            <Text style={[styles.badgeText, { color: theme.error }]}>
              Prev. mistake
            </Text>
          </View>
        )}
      </View>

      {/* Question text */}
      <Text style={[styles.questionText, { color: theme.text }]}>
        {questionText}
      </Text>

      {/* Multi-select indicator */}
      {isMulti && (
        <View style={[styles.multiTag, { backgroundColor: theme.neonBg }]}>
          <Text style={[styles.multiTagText, { color: theme.neon }]}>
            SELECT {correctCount} ANSWERS
          </Text>
        </View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 10,
    fontFamily: 'Outfit-Bold',
  },
  questionText: {
    fontSize: 15,
    lineHeight: 24,
    fontFamily: 'Outfit-Regular',
  },
  multiTag: {
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  multiTagText: {
    fontSize: 11,
    fontFamily: 'Outfit-Bold',
    letterSpacing: 0.5,
  },
});
