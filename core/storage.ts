// ══════════════════════════════════════════════════════
// Security+ Exam Pro — AsyncStorage Layer
// (swap back to MMKV for production builds)
// ══════════════════════════════════════════════════════

import AsyncStorage from '@react-native-async-storage/async-storage';
import { StateStorage } from 'zustand/middleware';

// Zustand-compatible adapter
export const mmkvStorage: StateStorage = {
  setItem: async (name: string, value: string) => {
    await AsyncStorage.setItem(name, value);
  },
  getItem: async (name: string) => {
    return (await AsyncStorage.getItem(name)) ?? null;
  },
  removeItem: async (name: string) => {
    await AsyncStorage.removeItem(name);
  },
};

// Direct helpers for non-Zustand usage
export const KV = {
  get: async <T>(key: string, defaultValue: T): Promise<T> => {
    try {
      const raw = await AsyncStorage.getItem(`sp_${key}`);
      return raw ? JSON.parse(raw) : defaultValue;
    } catch {
      return defaultValue;
    }
  },
  set: async <T>(key: string, value: T): Promise<void> => {
    try {
      await AsyncStorage.setItem(`sp_${key}`, JSON.stringify(value));
    } catch {}
  },
  clear: async (): Promise<void> => {
    await AsyncStorage.clear();
  },
};
