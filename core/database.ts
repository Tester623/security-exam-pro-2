// ══════════════════════════════════════════════════════
// Security+ Exam Pro — SQLite Database Service
// ══════════════════════════════════════════════════════
//
// Provides scalable question storage via expo-sqlite.
// For MVP: JSON import on first launch, then SQL queries.
// Advantage over in-memory array: complex queries like
// "10 random questions from domain 3.0 the user hasn't answered"
// run natively without JS iteration.
//
// MIGRATION PATH:
// Phase 1 (current): Import questions.json → SQLite on first run
// Phase 2 (future):  OTA content updates via remote JSON fetch
// Phase 3 (scale):   Server-side content management + delta sync

import * as SQLite from 'expo-sqlite';
import { Question } from './types';
import { KV } from './storage';

const DB_VERSION = 1;
const DB_NAME = 'secplus_v3.db';

let db: SQLite.SQLiteDatabase | null = null;

/**
 * Initialize database and create tables
 */
export async function initDatabase(): Promise<void> {
  db = await SQLite.openDatabaseAsync(DB_NAME);

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS questions (
      id TEXT PRIMARY KEY,
      question TEXT NOT NULL,
      answers TEXT NOT NULL,
      correct TEXT NOT NULL,
      explanation TEXT NOT NULL,
      domain TEXT NOT NULL,
      category TEXT NOT NULL,
      difficulty INTEGER NOT NULL DEFAULT 2,
      multi INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS user_answers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      question_id TEXT NOT NULL,
      is_correct INTEGER NOT NULL,
      answered_at INTEGER NOT NULL,
      session_id TEXT,
      FOREIGN KEY (question_id) REFERENCES questions(id)
    );

    CREATE INDEX IF NOT EXISTS idx_questions_domain ON questions(domain);
    CREATE INDEX IF NOT EXISTS idx_questions_category ON questions(category);
    CREATE INDEX IF NOT EXISTS idx_user_answers_qid ON user_answers(question_id);
    CREATE INDEX IF NOT EXISTS idx_user_answers_time ON user_answers(answered_at);
  `);
}

/**
 * Import questions from JSON into SQLite (runs once on first launch)
 */
export async function importQuestions(questions: Question[]): Promise<void> {
  if (!db) await initDatabase();

  const currentVersion = await KV.get<number>('db_version', 0);
  if (currentVersion >= DB_VERSION) return; // Already imported

  // Clear existing and bulk insert
  await db!.execAsync('DELETE FROM questions');

  // Batch insert in chunks of 50 for performance
  const BATCH_SIZE = 50;
  for (let i = 0; i < questions.length; i += BATCH_SIZE) {
    const batch = questions.slice(i, i + BATCH_SIZE);
    const placeholders = batch.map(() => '(?, ?, ?, ?, ?, ?, ?, ?, ?)').join(',');
    const values: (string | number)[] = [];

    batch.forEach((q) => {
      values.push(
        q.id,
        q.q,
        JSON.stringify(q.a),
        JSON.stringify(q.c),
        q.e,
        q.d,
        q.cat,
        q.diff || 2,
        q.multi ? 1 : 0
      );
    });

    await db!.runAsync(
      `INSERT INTO questions (id, question, answers, correct, explanation, domain, category, difficulty, multi)
       VALUES ${placeholders}`,
      values
    );
  }

  await KV.set('db_version', DB_VERSION);
}

/**
 * Get questions by filters using SQL (much faster than JS array filter)
 */
export async function getQuestions(options: {
  domain?: string;
  category?: string;
  difficulty?: number;
  excludeIds?: string[];
  limit?: number;
  random?: boolean;
  mistakeIds?: string[];
}): Promise<Question[]> {
  if (!db) await initDatabase();

  const conditions: string[] = [];
  const params: (string | number)[] = [];

  if (options.domain && options.domain !== 'all') {
    conditions.push('domain = ?');
    params.push(options.domain);
  }
  if (options.category && options.category !== 'all') {
    conditions.push('category = ?');
    params.push(options.category);
  }
  if (options.difficulty) {
    conditions.push('difficulty = ?');
    params.push(options.difficulty);
  }
  if (options.mistakeIds && options.mistakeIds.length > 0) {
    const placeholders = options.mistakeIds.map(() => '?').join(',');
    conditions.push(`id IN (${placeholders})`);
    params.push(...options.mistakeIds);
  }
  if (options.excludeIds && options.excludeIds.length > 0) {
    const placeholders = options.excludeIds.map(() => '?').join(',');
    conditions.push(`id NOT IN (${placeholders})`);
    params.push(...options.excludeIds);
  }

  let query = 'SELECT * FROM questions';
  if (conditions.length) query += ' WHERE ' + conditions.join(' AND ');
  if (options.random) query += ' ORDER BY RANDOM()';
  if (options.limit) {
    query += ' LIMIT ?';
    params.push(options.limit);
  }

  const rows = await db!.getAllAsync(query, params);

  return (rows as any[]).map((row) => ({
    id: row.id,
    q: row.question,
    a: JSON.parse(row.answers),
    c: JSON.parse(row.correct),
    e: row.explanation,
    d: row.domain,
    cat: row.category,
    diff: row.difficulty as 1 | 2 | 3,
    multi: row.multi === 1 ? true : undefined,
  }));
}

/**
 * Record a user answer for analytics
 */
export async function recordUserAnswer(
  questionId: string,
  isCorrect: boolean,
  sessionId?: string
): Promise<void> {
  if (!db) await initDatabase();

  await db!.runAsync(
    'INSERT INTO user_answers (question_id, is_correct, answered_at, session_id) VALUES (?, ?, ?, ?)',
    [questionId, isCorrect ? 1 : 0, Date.now(), sessionId || null]
  );
}

/**
 * Get questions the user frequently gets wrong (advanced analytics)
 * SQL query: questions with >50% error rate over last 30 days
 */
export async function getWeakQuestions(limit: number = 20): Promise<Question[]> {
  if (!db) await initDatabase();

  const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;

  const rows = await db!.getAllAsync(
    `SELECT q.*, 
            COUNT(ua.id) as attempts,
            SUM(CASE WHEN ua.is_correct = 0 THEN 1 ELSE 0 END) as wrong_count
     FROM questions q
     INNER JOIN user_answers ua ON q.id = ua.question_id
     WHERE ua.answered_at > ?
     GROUP BY q.id
     HAVING wrong_count > attempts / 2
     ORDER BY wrong_count DESC
     LIMIT ?`,
    [thirtyDaysAgo, limit]
  );

  return (rows as any[]).map((row) => ({
    id: row.id,
    q: row.question,
    a: JSON.parse(row.answers),
    c: JSON.parse(row.correct),
    e: row.explanation,
    d: row.domain,
    cat: row.category,
    diff: row.difficulty as 1 | 2 | 3,
    multi: row.multi === 1 ? true : undefined,
  }));
}

/**
 * Get domain-level accuracy from answer history
 */
export async function getDomainAccuracy(): Promise<Record<string, { correct: number; total: number }>> {
  if (!db) await initDatabase();

  const rows = await db!.getAllAsync(
    `SELECT q.domain,
            COUNT(ua.id) as total,
            SUM(CASE WHEN ua.is_correct = 1 THEN 1 ELSE 0 END) as correct
     FROM user_answers ua
     INNER JOIN questions q ON ua.question_id = q.id
     GROUP BY q.domain`
  );

  const result: Record<string, { correct: number; total: number }> = {};
  (rows as any[]).forEach((row) => {
    result[row.domain] = { correct: row.correct, total: row.total };
  });
  return result;
}

/**
 * Get total question count (for display without loading all into memory)
 */
export async function getQuestionCount(): Promise<number> {
  if (!db) await initDatabase();
  const row = await db!.getFirstAsync('SELECT COUNT(*) as cnt FROM questions');
  return (row as any)?.cnt || 0;
}
