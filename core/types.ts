// ══════════════════════════════════════════════════════
// Security+ Exam Pro — Type Definitions
// v4.0 — Auth, Profile, Animations
// ══════════════════════════════════════════════════════

export interface DomainInfo {
  n: string;
  w: number;
}

export interface DomainStats {
  correct: number;
  total: number;
}

export interface CategoryStats {
  correct: number;
  total: number;
}

export interface MistakeEntry {
  q: string;
  cat: string;
  count: number;
}

export interface TestHistoryEntry {
  date: string;
  score: number;
  mode: string;
  questionsCount: number;
}

export interface Question {
  id: string;
  q: string;
  a: string[];
  c: number | number[];
  e: string;
  d: string;
  cat: string;
  diff?: 1 | 2 | 3;
  multi?: boolean;
}

export interface ShuffledQuestion extends Omit<Question, 'c'> {
  c: number | number[];
  originalC: number | number[];
}

export interface Achievement {
  id: string;
  n: string;
  d: string;
  icon: string;
  ck: (state: UserData) => boolean;
}

export interface Flashcard {
  f: string;
  b: string;
}

export interface CustomFlashcard {
  id: string;
  front: string;
  back: string;
  source: string;
  created: number;
}

// ── Auth & Profile ──

export type AuthProvider = 'google' | 'apple' | 'github' | 'guest';

export interface UserProfile {
  uid: string;
  nickname: string;
  avatarUri: string | null;
  avatarColor: string;
  title: string;
  provider: AuthProvider;
  email: string | null;
  createdAt: number;
}

export const AVATAR_COLORS = [
  '#6366f1', '#8b5cf6', '#a855f7', '#ec4899',
  '#f43f5e', '#ef4444', '#f97316', '#eab308',
  '#22c55e', '#14b8a6', '#06b6d4', '#3b82f6',
];

export const TITLES: Record<string, { name: string; req: string }> = {
  rookie: { name: 'Rookie', req: 'Default' },
  student: { name: 'Student', req: 'Answer 100 questions' },
  analyst: { name: 'Security Analyst', req: 'Pass 5 tests' },
  specialist: { name: 'Cyber Specialist', req: 'Level 5+' },
  expert: { name: 'Security Expert', req: '80%+ all domains' },
  master: { name: 'Sec+ Master', req: 'Level 10+' },
  legend: { name: 'Cybersecurity Legend', req: 'All achievements' },
  nightowl: { name: 'Night Owl', req: 'Study at 3 AM' },
  speedster: { name: 'Speedster', req: 'Speed Demon achievement' },
  survivor: { name: 'Survivor', req: '10 wrong in a row and keep going' },
};

export const DEFAULT_PROFILE: UserProfile = {
  uid: '',
  nickname: 'Student',
  avatarUri: null,
  avatarColor: '#6366f1',
  title: 'rookie',
  provider: 'guest',
  email: null,
  createdAt: Date.now(),
};

// ── User Data (progress) ──

export interface UserData {
  xp: number;
  lv: number;
  sk: number;
  ls: string | null;
  ds: Record<string, DomainStats>;
  cs: Record<string, CategoryStats>;
  hi: TestHistoryEntry[];
  ac: string[];
  mk: Record<string, MistakeEntry>;
  ta: number;
  tt: number;
  ps: number;
  pt: number;
  sr: boolean;
  cm: boolean;
  dt: Record<string, number>;
  fr: number;
  dq: string | null;
  dd: string | null;
  cf: CustomFlashcard[];
  cfc: number;
  ws: number;
  cws: number;
  mrc: number;
  no: boolean;
  eb: boolean;
  qo: boolean;
  mst: number;
  smc: number;
  lm: string | null;
  uqa: number;
}

export interface QuizConfig {
  count: number;
  mode: 'random' | 'sequential';
  timer: number;
  cat: string;
  tm: 'normal' | 'exam' | 'mistakes';
  dom: string;
  diff: string;
}

export interface QuizState {
  q: ShuffledQuestion[];
  ci: number;
  an: (number | number[] | null)[];
  co: number;
}
