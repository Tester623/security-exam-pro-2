// ══════════════════════════════════════════════════════
// Security+ Exam Pro — Quiz Screen [mode].tsx
// ══════════════════════════════════════════════════════

import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useQuizStore } from '@/store/useQuizStore';
import { THEME, DOMAINS, EXAM_TIMER_MINUTES } from '@/core/constants';
import { shuffle, shuffleQuestion, isAnswerCorrect, formatTime } from '@/core/algorithms';
import { useHaptics } from '@/hooks/useHaptics';
import { Question, ShuffledQuestion } from '@/core/types';
import questionsData from '@/assets/data/questions.json';

const ALL_Q = questionsData as Question[];

export default function QuizScreen() {
  const { mode, count, timer, cat, dom, diff } = useLocalSearchParams<{
    mode: string; count?: string; timer?: string;
    cat?: string; dom?: string; diff?: string;
  }>();
  const router = useRouter();
  const haptics = useHaptics();
  const store = useQuizStore();
  const t = store.darkMode ? THEME.dark : THEME.light;
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const isExam = mode === 'exam';
  const qCount = parseInt(count || (isExam ? '90' : '25'), 10);

  // ── Build question pool ──
  const questions = useMemo(() => {
    let pool = [...ALL_Q];

    // Filter by category
    if (cat && cat !== 'all') pool = pool.filter((q) => q.cat === cat);
    // Filter by domain
    if (dom && dom !== 'all') pool = pool.filter((q) => q.d === dom);
    // Filter by difficulty
    if (diff && diff !== 'all') pool = pool.filter((q) => q.diff === Number(diff));
    // Mistakes mode
    if (mode === 'mistakes') {
      const mistakeIds = Object.keys(store.ud.mk);
      pool = pool.filter((q) => mistakeIds.includes(q.id));
    }

    // Shuffle pool and answers
    pool = shuffle(pool).slice(0, qCount);
    return pool.map(shuffleQuestion);
  }, [mode, qCount, cat, dom, diff]);

  // ── Quiz State ──
  const [ci, setCi] = useState(0); // current index
  const [answers, setAnswers] = useState<(number | number[] | null)[]>(
    () => Array(questions.length).fill(null)
  );
  const [answered, setAnswered] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [timerSec, setTimerSec] = useState(isExam ? EXAM_TIMER_MINUTES * 60 : 0);
  const [newMistakes, setNewMistakes] = useState<string[]>([]);

  const q = questions[ci];
  const progress = ((ci + 1) / questions.length) * 100;
  const currentAnswer = answers[ci];

  // ── Timer ──
  useEffect(() => {
    if (isExam) {
      timerRef.current = setInterval(() => {
        setTimerSec((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            finishQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }
  }, [isExam]);

  // ── Single-select answer ──
  const selectAnswer = useCallback((idx: number) => {
    if (!q) return;

    // Multi-select: toggle
    if (q.multi) {
      if (answered) return;
      const prev = Array.isArray(currentAnswer) ? [...currentAnswer] : [];
      const si = prev.indexOf(idx);
      if (si >= 0) prev.splice(si, 1); else prev.push(idx);
      const na = [...answers]; na[ci] = prev;
      setAnswers(na);
      haptics.selection();
      return;
    }

    // Single-select
    if (answered) return;
    const na = [...answers]; na[ci] = idx;
    setAnswers(na);

    const isC = isAnswerCorrect(idx, q.c, q.multi);
    processAnswer(isC);
  }, [q, ci, answered, currentAnswer, answers]);

  // ── Confirm multi-select ──
  const confirmMulti = useCallback(() => {
    if (!q || !Array.isArray(currentAnswer) || !currentAnswer.length) return;
    const isC = isAnswerCorrect(currentAnswer, q.c, true);
    processAnswer(isC);
  }, [q, currentAnswer]);

  // ── Process answer result ──
  const processAnswer = (isC: boolean) => {
    setAnswered(true);
    if (isC) {
      haptics.success();
      setCorrect((prev) => prev + 1);
      if (store.ud.mk[q.oid]) store.removeMistake(q.oid);
    } else {
      haptics.error();
      store.addMistake(q.oid, q.q, q.cat);
      setNewMistakes((prev) => [...prev, q.oid]);
    }

    if (!isExam) {
      store.recordAnswer(q.oid, q.d, q.cat, isC);
    }
  };

  // ── Next question ──
  const nextQuestion = () => {
    if (ci + 1 >= questions.length) {
      finishQuiz();
      return;
    }
    setCi((prev) => prev + 1);
    setAnswered(false);
  };

  // ── Finish quiz ──
  const finishQuiz = () => {
    if (timerRef.current) clearInterval(timerRef.current);

    let finalCorrect = correct;

    // In exam mode, score all at once
    if (isExam) {
      finalCorrect = 0;
      questions.forEach((qq, i) => {
        const isC = isAnswerCorrect(answers[i], qq.c, qq.multi);
        if (isC) finalCorrect++;
        store.recordAnswer(qq.oid, qq.d, qq.cat, isC);
        if (!isC) store.addMistake(qq.oid, qq.q, qq.cat);
      });
    }

    const pct = Math.round((finalCorrect / questions.length) * 100);
    store.recordTestResult(pct, questions.length, mode!, pct === 100);
    store.addXP(pct >= 75 ? 25 : 5);

    const achName = store.checkAchievements();

    router.replace({
      pathname: '/quiz/result',
      params: {
        score: String(pct),
        correct: String(finalCorrect),
        total: String(questions.length),
        mistakes: String(newMistakes.length),
        achievement: achName || '',
      },
    });
  };

  if (!q) return null;

  // ── Answer display logic ──
  const showResult = answered && !isExam;

  return (
    <ScrollView style={[styles.container, { backgroundColor: t.bg }]} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => { if (timerRef.current) clearInterval(timerRef.current); router.back(); }}>
          <Text style={[styles.closeBtn, { color: t.textSub }]}>✕</Text>
        </Pressable>
        <Text style={[styles.counter, { color: t.text }]}>{ci + 1} / {questions.length}</Text>
        {isExam ? (
          <Text style={[styles.timer, { color: timerSec < 300 ? t.error : t.neon }]}>
            {formatTime(timerSec)}
          </Text>
        ) : <View style={{ width: 40 }} />}
      </View>

      {/* Progress bar */}
      <View style={[styles.progressBg, { backgroundColor: t.border }]}>
        <LinearGradient colors={t.gradientAccent as [string, string]} style={[styles.progressFill, { width: `${progress}%` }]} />
      </View>

      {/* Domain badge */}
      <View style={styles.badges}>
        <View style={[styles.badge, { backgroundColor: t.accentBg }]}>
          <Text style={[styles.badgeText, { color: t.accent }]}>{q.d} {DOMAINS[q.d]?.n}</Text>
        </View>
        {q.diff && (
          <View style={[styles.badge, { backgroundColor: q.diff === 3 ? t.errorBg : q.diff === 2 ? t.warningBg : t.successBg }]}>
            <Text style={[styles.badgeText, { color: q.diff === 3 ? t.error : q.diff === 2 ? t.warning : t.success }]}>
              {['Easy', 'Medium', 'Hard'][q.diff - 1]}
            </Text>
          </View>
        )}
      </View>

      {/* Question */}
      <View style={[styles.questionCard, { backgroundColor: t.card }]}>
        <Text style={[styles.questionText, { color: t.text }]}>{q.q}</Text>
        {q.multi && (
          <View style={[styles.multiBadge, { backgroundColor: t.neonBg }]}>
            <Text style={[styles.multiBadgeText, { color: t.neon }]}>
              SELECT {(q.c as number[]).length} ANSWERS
            </Text>
          </View>
        )}
      </View>

      {/* Answers */}
      {q.a.map((a, i) => {
        const isMulti = q.multi;
        const sel = isMulti
          ? (Array.isArray(currentAnswer) && currentAnswer.includes(i))
          : currentAnswer === i;
        const isC = isMulti ? (q.c as number[]).includes(i) : i === q.c;

        let bgColor = t.card;
        let borderColor = 'transparent';
        let textColor = t.text;

        if (isExam && sel) {
          bgColor = t.accentBg; borderColor = t.accent; textColor = t.accent;
        } else if (showResult && isC) {
          bgColor = t.successBg; borderColor = t.success; textColor = t.success;
        } else if (showResult && sel && !isC) {
          bgColor = t.errorBg; borderColor = t.error; textColor = t.error;
        } else if (!showResult && sel && isMulti) {
          bgColor = t.accentBg; borderColor = t.accent; textColor = t.accent;
        }

        let indicatorBg = 'rgba(128,128,128,0.12)';
        let indicatorColor = t.textSub;
        let indicatorText = String.fromCharCode(65 + i);

        if (showResult && isC) { indicatorBg = t.success; indicatorColor = '#fff'; indicatorText = '✓'; }
        else if (showResult && sel && !isC) { indicatorBg = t.error; indicatorColor = '#fff'; indicatorText = '✗'; }
        else if (sel) { indicatorBg = t.accent; indicatorColor = '#fff'; indicatorText = isMulti ? '●' : String.fromCharCode(65 + i); }

        return (
          <Pressable
            key={i}
            onPress={() => selectAnswer(i)}
            disabled={answered && !isExam}
            style={[styles.answerBtn, { backgroundColor: bgColor, borderColor }]}
          >
            <View style={[styles.indicator, { backgroundColor: indicatorBg }]}>
              <Text style={[styles.indicatorText, { color: indicatorColor }]}>{indicatorText}</Text>
            </View>
            <Text style={[styles.answerText, { color: textColor }]}>{a}</Text>
          </Pressable>
        );
      })}

      {/* Multi confirm */}
      {q.multi && !answered && (
        <Pressable
          onPress={confirmMulti}
          disabled={!Array.isArray(currentAnswer) || !currentAnswer.length}
          style={[styles.confirmBtn, { opacity: (Array.isArray(currentAnswer) && currentAnswer.length) ? 1 : 0.4 }]}
        >
          <LinearGradient colors={t.gradientAccent as [string, string]} style={styles.gradientBtn}>
            <Text style={styles.btnText}>Confirm Selection</Text>
          </LinearGradient>
        </Pressable>
      )}

      {/* Explanation */}
      {showResult && (
        <View style={[styles.explanation, { backgroundColor: t.warningBg, borderLeftColor: t.warning }]}>
          <Text style={[styles.expLabel, { color: t.warning }]}>EXPLANATION</Text>
          <Text style={[styles.expText, { color: t.text }]}>{q.e}</Text>
        </View>
      )}

      {/* Next / Submit */}
      {(answered || isExam) && (
        <Pressable onPress={nextQuestion} style={styles.nextBtn}>
          <LinearGradient colors={t.gradientAccent as [string, string]} style={styles.gradientBtn}>
            <Text style={styles.btnText}>
              {ci + 1 >= questions.length ? (isExam ? 'Finish Exam' : 'See Results') : 'Next'}
            </Text>
          </LinearGradient>
        </Pressable>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  closeBtn: { fontSize: 20, padding: 4 },
  counter: { fontSize: 13, fontFamily: 'Outfit-Bold' },
  timer: { fontSize: 14, fontFamily: 'Outfit-Bold' },
  progressBg: { height: 3, borderRadius: 6, marginBottom: 16, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 6 },
  badges: { flexDirection: 'row', gap: 6, marginBottom: 12, flexWrap: 'wrap' },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  badgeText: { fontSize: 10, fontFamily: 'Outfit-Bold' },
  questionCard: { borderRadius: 16, padding: 18, marginBottom: 14 },
  questionText: { fontSize: 15, lineHeight: 24, fontFamily: 'Outfit-Regular' },
  multiBadge: { marginTop: 10, paddingHorizontal: 12, paddingVertical: 5, borderRadius: 8, alignSelf: 'flex-start' },
  multiBadgeText: { fontSize: 11, fontFamily: 'Outfit-Bold', letterSpacing: 0.5 },
  answerBtn: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 12,
    padding: 14, marginBottom: 8, borderRadius: 14, borderWidth: 1.5,
  },
  indicator: {
    width: 28, height: 28, borderRadius: 8,
    alignItems: 'center', justifyContent: 'center',
  },
  indicatorText: { fontSize: 12, fontFamily: 'Outfit-Bold' },
  answerText: { flex: 1, fontSize: 14, lineHeight: 22, fontFamily: 'Outfit-Regular' },
  explanation: { borderRadius: 14, padding: 16, marginBottom: 12, borderLeftWidth: 3 },
  expLabel: { fontSize: 10, fontFamily: 'Outfit-Bold', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 6 },
  expText: { fontSize: 13, lineHeight: 20, fontFamily: 'Outfit-Regular' },
  confirmBtn: { borderRadius: 12, overflow: 'hidden', marginBottom: 10 },
  nextBtn: { borderRadius: 12, overflow: 'hidden' },
  gradientBtn: { paddingVertical: 14, alignItems: 'center', borderRadius: 12 },
  btnText: { color: '#fff', fontSize: 14, fontFamily: 'Outfit-Bold' },
});
