import { authService, type User } from '@/lib/auth/service';
import { create } from '@/store';

interface AuthState {
  user: User | null;
  loading: boolean;
}

interface AuthActions {
  login: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

type AuthStore = AuthState & AuthActions;

const authStore = create<AuthState, AuthStore>('auth-store', (initial) => (set) => ({
  user: initial.user ?? null,
  loading: initial.loading ?? false,

  login: async (email: string) => {
    set({ loading: true });
    try {
      const res = await authService.login(email);
      set({ user: res.user ?? null, loading: false });
    } catch {
      set({ loading: false });
    }
  },

  logout: async () => {
    set({ loading: true });
    try {
      await authService.logout();
      set({ user: null, loading: false });
    } catch {
      set({ loading: false });
    }
  },

  checkAuth: async () => {
    set({ loading: true });
    try {
      const res = await authService.getUser();
      set({ user: res.user ?? null, loading: false });
    } catch {
      set({ user: null, loading: false });
    }
  },
}));

export const { Provider: AuthProvider, useStore: useAuthStore } = authStore;
