// ══════════════════════════════════════════════════════
// Security+ Exam Pro — Zustand Quiz Store
// ══════════════════════════════════════════════════════

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { produce } from 'immer';
import { mmkvStorage } from '@/core/storage';
import { UserData, UserProfile, DEFAULT_PROFILE, TestHistoryEntry, MistakeEntry } from '@/core/types';
import {
  calculateReadiness,
  calculatePassProbability,
  calculateLevel,
} from '@/core/algorithms';
import {
  ACHIEVEMENTS,
  XP_CORRECT,
  XP_WRONG,
  XP_PER_LEVEL,
  MAX_LEVEL,
} from '@/core/constants';

// ── Default User Data ──
const DEFAULT_USER: UserData = {
  xp: 0, lv: 1, sk: 0, ls: null,
  ds: {}, cs: {}, hi: [], ac: [], mk: {},
  ta: 0, tt: 0, ps: 0, pt: 0,
  sr: false, cm: false, dt: {}, fr: 0,
  dq: null, dd: null,
  cf: [], cfc: 0,
  ws: 0, cws: 0, mrc: 0,
  no: false, eb: false, qo: false,
  mst: 0, smc: 0, lm: null, uqa: 0,
};

// ── Store Interface ──
interface QuizStoreState {
  ud: UserData;
  profile: UserProfile;
  darkMode: boolean;

  // Actions
  update: (partial: Partial<UserData>) => void;
  setProfile: (profile: UserProfile) => void;
  updateProfile: (partial: Partial<UserProfile>) => void;
  recordAnswer: (questionId: string, domain: string, category: string, isCorrect: boolean) => void;
  addMistake: (questionId: string, question: string, category: string) => void;
  removeMistake: (questionId: string) => void;
  addXP: (points: number) => void;
  updateStreak: () => void;
  setDailyQuestion: (questionId: string) => void;
  recordTestResult: (score: number, count: number, mode: string, isPerfect: boolean) => void;
  incrementFlashcards: () => void;
  addCustomFlashcard: (front: string, back: string, sourceId: string) => void;
  removeCustomFlashcard: (id: string) => void;
  trackWrongStreak: (isCorrect: boolean) => void;
  trackTimeOfDay: () => void;
  trackSessionTime: (minutes: number) => void;
  trackMode: (mode: string) => void;
  trackUniqueQuestion: (qId: string) => void;
  unlockAchievement: (id: string) => void;
  checkAchievements: () => string | null;
  toggleDarkMode: () => void;
  resetAll: () => void;

  // Computed
  getReadiness: () => number;
  getPassProbability: () => number;
  getMistakeCount: () => number;
}

export const useQuizStore = create<QuizStoreState>()(
  persist(
    (set, get) => ({
      ud: { ...DEFAULT_USER },
      profile: { ...DEFAULT_PROFILE },
      darkMode: true,

      update: (partial) =>
        set(
          produce((state: QuizStoreState) => {
            Object.assign(state.ud, partial);
          })
        ),

      setProfile: (profile) => set({ profile }),

      updateProfile: (partial) =>
        set(
          produce((state: QuizStoreState) => {
            Object.assign(state.profile, partial);
          })
        ),

      recordAnswer: (qId, domain, category, isCorrect) =>
        set(
          produce((state: QuizStoreState) => {
            // Domain stats
            if (!state.ud.ds[domain]) state.ud.ds[domain] = { correct: 0, total: 0 };
            state.ud.ds[domain].total++;
            if (isCorrect) state.ud.ds[domain].correct++;

            // Category stats
            if (!state.ud.cs[category]) state.ud.cs[category] = { correct: 0, total: 0 };
            state.ud.cs[category].total++;
            if (isCorrect) state.ud.cs[category].correct++;

            // Total answered
            state.ud.ta++;

            // Domain touched
            state.ud.dt[domain] = 1;

            // XP
            const pts = isCorrect ? XP_CORRECT : XP_WRONG;
            state.ud.xp += pts;
            state.ud.lv = calculateLevel(state.ud.xp);

            // Mistakes
            if (isCorrect) {
              if (state.ud.mk[qId]) delete state.ud.mk[qId];
            } else {
              // Will be set by addMistake separately if needed
            }
          })
        ),

      addMistake: (qId, question, category) =>
        set(
          produce((state: QuizStoreState) => {
            state.ud.mk[qId] = { q: question, cat: category, ts: Date.now() };
          })
        ),

      removeMistake: (qId) =>
        set(
          produce((state: QuizStoreState) => {
            delete state.ud.mk[qId];
          })
        ),

      addXP: (points) =>
        set(
          produce((state: QuizStoreState) => {
            state.ud.xp += points;
            state.ud.lv = calculateLevel(state.ud.xp);
          })
        ),

      updateStreak: () =>
        set(
          produce((state: QuizStoreState) => {
            const today = new Date().toDateString();
            if (state.ud.ls) {
              const lastDate = new Date(state.ud.ls);
              const diff = Math.floor(
                (new Date(today).getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
              );
              if (diff === 1) {
                state.ud.sk++;
              } else if (diff > 1) {
                state.ud.sk = 0;
              }
            }
            state.ud.ls = today;
          })
        ),

      setDailyQuestion: (questionId) =>
        set(
          produce((state: QuizStoreState) => {
            state.ud.dq = questionId;
            state.ud.dd = new Date().toDateString();
          })
        ),

      recordTestResult: (score, count, mode, isPerfect) =>
        set(
          produce((state: QuizStoreState) => {
            const entry: TestHistoryEntry = {
              date: new Date().toISOString(),
              score,
              questionsCount: count,
              mode,
            };
            state.ud.hi = [entry, ...state.ud.hi.slice(0, 29)];
            state.ud.tt++;
            if (score >= 75) state.ud.ps++;
            if (isPerfect) state.ud.pt++;
          })
        ),

      incrementFlashcards: () =>
        set(
          produce((state: QuizStoreState) => {
            state.ud.fr++;
          })
        ),

      addCustomFlashcard: (front, back, sourceId) =>
        set(
          produce((state: QuizStoreState) => {
            const id = `cf_${Date.now()}`;
            state.ud.cf.push({ id, front, back, source: sourceId, created: Date.now() });
            state.ud.cfc = (state.ud.cfc || 0) + 1;
          })
        ),

      removeCustomFlashcard: (id) =>
        set(
          produce((state: QuizStoreState) => {
            state.ud.cf = state.ud.cf.filter(c => c.id !== id);
          })
        ),

      trackWrongStreak: (isCorrect) =>
        set(
          produce((state: QuizStoreState) => {
            if (isCorrect) {
              state.ud.cws = 0;
            } else {
              state.ud.cws = (state.ud.cws || 0) + 1;
              if (state.ud.cws > (state.ud.ws || 0)) {
                state.ud.ws = state.ud.cws;
              }
            }
          })
        ),

      trackTimeOfDay: () =>
        set(
          produce((state: QuizStoreState) => {
            const h = new Date().getHours();
            if (h >= 2 && h < 5) state.ud.no = true;
            if (h < 6) state.ud.eb = true;
          })
        ),

      trackSessionTime: (minutes) =>
        set(
          produce((state: QuizStoreState) => {
            if (minutes > (state.ud.mst || 0)) state.ud.mst = minutes;
          })
        ),

      trackMode: (mode) =>
        set(
          produce((state: QuizStoreState) => {
            if (state.ud.lm === mode) {
              state.ud.smc = (state.ud.smc || 0) + 1;
            } else {
              state.ud.smc = 1;
              state.ud.lm = mode;
            }
          })
        ),

      trackUniqueQuestion: (qId) =>
        set(
          produce((state: QuizStoreState) => {
            // Using a simple counter - in production, use a Set stored separately
            state.ud.uqa = (state.ud.uqa || 0) + 1;
          })
        ),

      unlockAchievement: (id) =>
        set(
          produce((state: QuizStoreState) => {
            if (!state.ud.ac.includes(id)) {
              state.ud.ac.push(id);
            }
          })
        ),

      checkAchievements: () => {
        const state = get();
        const ud = state.ud;
        let newUnlock: string | null = null;
        ACHIEVEMENTS.forEach((ach) => {
          if (!ud.ac.includes(ach.id) && ach.ck(ud)) {
            state.unlockAchievement(ach.id);
            newUnlock = ach.n;
          }
        });
        return newUnlock;
      },

      toggleDarkMode: () => set((s) => ({ darkMode: !s.darkMode })),

      resetAll: () =>
        set({
          ud: { ...DEFAULT_USER },
          profile: { ...DEFAULT_PROFILE },
          darkMode: true,
        }),

      // ── Computed ──
      getReadiness: () => calculateReadiness(get().ud.ds),

      getPassProbability: () => {
        const { ud } = get();
        const rd = calculateReadiness(ud.ds);
        return calculatePassProbability(ud.ds, ud.hi, rd);
      },

      getMistakeCount: () => Object.keys(get().ud.mk).length,
    }),
    {
      name: 'quiz-store-v3',
      storage: createJSONStorage(() => mmkvStorage),
    }
  )
);
