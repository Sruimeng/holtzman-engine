/**
 * Auth Service - Magic Link Authentication
 * Based on: llmdoc/reference/frontend-integration.md
 *
 * Base URL: https://auth.sruim.xin
 * All requests must include credentials: 'include' for cookie handling
 */

const AUTH_BASE = 'https://auth.sruim.xin';
const IS_DEV = import.meta.env.DEV;

export interface User {
  id: number;
  email: string;
  created_at: string;
}

// Mock user for development
const MOCK_USER: User = {
  id: 1,
  email: 'dev@localhost',
  created_at: new Date().toISOString(),
};

interface LoginParams {
  email: string;
  redirect_uri?: string;
  product?: 'ephemera' | 'maxell' | null;
}

async function request<T>(path: string, options?: RequestInit): Promise<T | null> {
  try {
    const res = await fetch(`${AUTH_BASE}${path}`, {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export const authService = {
  /**
   * Request login - sends Magic Link email
   * POST /auth/login
   */
  login: async ({ email, redirect_uri, product }: LoginParams): Promise<boolean> => {
    if (IS_DEV) {
      console.log('[DEV] Mock login for:', email);
      return true;
    }

    try {
      const res = await fetch(`${AUTH_BASE}/auth/login`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          redirect_uri: redirect_uri || window.location.href,
          product: product || null,
        }),
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  /**
   * Get current user
   * GET /auth/me
   */
  getUser: async (): Promise<User | null> => {
    if (IS_DEV) return MOCK_USER;
    return request<User>('/auth/me');
  },

  /**
   * Logout
   * POST /auth/logout
   */
  logout: async (): Promise<boolean> => {
    if (IS_DEV) return true;

    try {
      const res = await fetch(`${AUTH_BASE}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      return res.ok;
    } catch {
      return false;
    }
  },
};
