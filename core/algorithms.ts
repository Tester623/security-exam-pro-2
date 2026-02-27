// ══════════════════════════════════════════════════════
// Security+ Exam Pro — Core Algorithms
// ══════════════════════════════════════════════════════

import { DOMAINS, XP_PER_LEVEL, MAX_LEVEL } from './constants';
import { DomainStats, Question, ShuffledQuestion, TestHistoryEntry } from './types';

/**
 * Fisher-Yates shuffle — cryptographically fair randomization
 */
export function shuffle<T>(arr: T[]): T[] {
  const b = [...arr];
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
}

/**
 * Shuffle answers within a question, remapping correct index(es)
 */
export function shuffleQuestion(q: Question): ShuffledQuestion {
  const indices = q.a.map((_, i) => i);
  const shuffled = shuffle(indices);
  const newAnswers = shuffled.map((i) => q.a[i]);

  if (q.multi && Array.isArray(q.c)) {
    // Multi-select: remap each correct index
    const newCorrect = q.c.map((ci) => shuffled.indexOf(ci));
    return { ...q, a: newAnswers, c: newCorrect, oid: q.id, multi: true };
  } else {
    // Single-select: remap single correct index
    const newCorrect = shuffled.indexOf(q.c as number);
    return { ...q, a: newAnswers, c: newCorrect, oid: q.id };
  }
}

/**
 * Check if answer is correct (handles both single and multi-select)
 */
export function isAnswerCorrect(
  answer: number | number[] | null,
  correct: number | number[],
  isMulti?: boolean
): boolean {
  if (answer === null) return false;
  if (isMulti && Array.isArray(correct)) {
    if (!Array.isArray(answer)) return false;
    return (
      answer.length === correct.length &&
      answer.every((a) => correct.includes(a))
    );
  }
  return answer === correct;
}

/**
 * Calculate Readiness Score (weighted by domain exam weight)
 * Replicates `rd` from prototype
 */
export function calculateReadiness(
  domainStats: Record<string, DomainStats>
): number {
  const entries = Object.entries(DOMAINS);
  if (!Object.keys(domainStats).length) return 0;

  let weightedScore = 0;
  let totalWeight = 0;

  entries.forEach(([domId, info]) => {
    const stats = domainStats[domId];
    if (stats && stats.total > 0) {
      weightedScore += (stats.correct / stats.total) * info.w;
      totalWeight += info.w;
    }
  });

  return totalWeight > 0 ? Math.round((weightedScore / totalWeight) * 100) : 0;
}

/**
 * Calculate Pass Probability
 * Formula: 50% readiness + 30% coverage + 20% consistency
 * Replicates `passPr` from prototype
 */
export function calculatePassProbability(
  domainStats: Record<string, DomainStats>,
  testHistory: TestHistoryEntry[],
  readiness: number
): number {
  const domKeys = Object.keys(DOMAINS);
  let totalQ = 0;
  Object.values(domainStats).forEach((s) => (totalQ += s.total));
  if (totalQ < 10) return 0;

  // Coverage: how many domains have been studied (5+ questions each)
  const coverage =
    domKeys.filter((d) => domainStats[d] && domainStats[d].total >= 5).length /
    domKeys.length;

  // Consistency: average of last 5 test scores
  const recent = testHistory.slice(0, 5);
  const consistency =
    recent.length >= 3
      ? recent.reduce((acc, h) => acc + h.score, 0) / (recent.length * 100)
      : readiness / 100;

  const raw = readiness * 0.5 + coverage * 30 + consistency * 20;
  return Math.min(99, Math.max(0, Math.round(raw)));
}

/**
 * Calculate level from XP
 */
export function calculateLevel(xp: number): number {
  return Math.min(MAX_LEVEL, 1 + Math.floor(xp / XP_PER_LEVEL));
}

/**
 * Format seconds as mm:ss
 */
export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}
