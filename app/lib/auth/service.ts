const BASE_URL = 'https://auth.sruim.xin';
const IS_DEV = import.meta.env.DEV;

interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthResponse {
  success: boolean;
  user?: User;
  error?: string;
}

// Mock user for development
const MOCK_USER: User = {
  id: 'dev-user-001',
  email: 'dev@localhost',
  name: 'Developer',
};

const request = async <T>(path: string, options?: RequestInit): Promise<T> => {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!res.ok) throw new Error(`Auth request failed: ${res.status}`);
  return res.json();
};

export const authService = {
  login: async (email: string, product = 'nexus-boardroom'): Promise<AuthResponse> => {
    if (IS_DEV) return { success: true, user: { ...MOCK_USER, email } };
    return request<AuthResponse>('/login', {
      method: 'POST',
      body: JSON.stringify({ email, product }),
    });
  },

  getUser: async (): Promise<AuthResponse> => {
    if (IS_DEV) return { success: true, user: MOCK_USER };
    return request<AuthResponse>('/me');
  },

  logout: async (): Promise<AuthResponse> => {
    if (IS_DEV) return { success: true };
    return request<AuthResponse>('/logout', { method: 'POST' });
  },
};

export type { AuthResponse, User };
