// ══════════════════════════════════════════════════════
// Security+ Exam Pro — Authentication Service
// Supports: Google, Apple, GitHub, Guest
// Uses expo-auth-session for OAuth 2.0 PKCE flows
// ══════════════════════════════════════════════════════

import * as AuthSession from 'expo-auth-session';
import * as Crypto from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';
import { AuthProvider, UserProfile, DEFAULT_PROFILE } from './types';

// ── Config (replace with your OAuth client IDs) ──
const AUTH_CONFIG = {
  google: {
    clientId: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
    scopes: ['openid', 'profile', 'email'],
  },
  apple: {
    // Apple Sign In uses native module via expo-apple-authentication
  },
  github: {
    clientId: 'YOUR_GITHUB_CLIENT_ID',
    scopes: ['user:email'],
  },
};

const TOKEN_KEY = 'auth_token';
const PROFILE_KEY = 'user_profile';

// ── Token Storage (Secure) ──
export async function saveToken(token: string): Promise<void> {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
}

export async function getToken(): Promise<string | null> {
  return SecureStore.getItemAsync(TOKEN_KEY);
}

export async function clearToken(): Promise<void> {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
  await SecureStore.deleteItemAsync(PROFILE_KEY);
}

// ── Profile Storage ──
export async function saveProfile(profile: UserProfile): Promise<void> {
  await SecureStore.setItemAsync(PROFILE_KEY, JSON.stringify(profile));
}

export async function getStoredProfile(): Promise<UserProfile | null> {
  const raw = await SecureStore.getItemAsync(PROFILE_KEY);
  return raw ? JSON.parse(raw) : null;
}

// ── Guest Login ──
export async function loginAsGuest(): Promise<UserProfile> {
  const uid = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    `guest_${Date.now()}_${Math.random()}`
  );
  const profile: UserProfile = {
    ...DEFAULT_PROFILE,
    uid: uid.substring(0, 16),
    provider: 'guest',
    createdAt: Date.now(),
  };
  await saveProfile(profile);
  return profile;
}

// ── Google Sign In ──
export function useGoogleAuth() {
  const discovery = AuthSession.useAutoDiscovery('https://accounts.google.com');
  const redirectUri = AuthSession.makeRedirectUri({ scheme: 'secplusexam' });

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: AUTH_CONFIG.google.clientId,
      scopes: AUTH_CONFIG.google.scopes,
      redirectUri,
      responseType: AuthSession.ResponseType.Code,
      usePKCE: true,
    },
    discovery
  );

  return { request, response, promptAsync, redirectUri };
}

// ── GitHub Sign In ──
export function useGitHubAuth() {
  const redirectUri = AuthSession.makeRedirectUri({ scheme: 'secplusexam' });

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: AUTH_CONFIG.github.clientId,
      scopes: AUTH_CONFIG.github.scopes,
      redirectUri,
      responseType: AuthSession.ResponseType.Code,
    },
    {
      authorizationEndpoint: 'https://github.com/login/oauth/authorize',
      tokenEndpoint: 'https://github.com/login/oauth/access_token',
    }
  );

  return { request, response, promptAsync };
}

// ── Parse OAuth response into profile ──
export function parseGoogleProfile(idToken: string): Partial<UserProfile> {
  try {
    const payload = JSON.parse(atob(idToken.split('.')[1]));
    return {
      uid: payload.sub,
      nickname: payload.name || payload.given_name || 'User',
      email: payload.email,
      avatarUri: payload.picture || null,
      provider: 'google',
    };
  } catch {
    return { provider: 'google' };
  }
}

// ── Check if user has existing session ──
export async function hasExistingSession(): Promise<boolean> {
  const profile = await getStoredProfile();
  return profile !== null;
}

// ── Logout ──
export async function logout(): Promise<void> {
  await clearToken();
}
