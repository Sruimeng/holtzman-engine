import { authService, type User } from '@/lib/auth/service';
import { create } from '@/store';

interface AuthState {
  user: User | null;
  loading: boolean;
  emailSent: boolean;
}

interface AuthActions {
  login: (email: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  resetEmailSent: () => void;
}

type AuthStore = AuthState & AuthActions;

const authStore = create<AuthState, AuthStore>('auth-store', (initial) => (set) => ({
  user: initial.user ?? null,
  loading: initial.loading ?? false,
  emailSent: false,

  /**
   * Request login - sends Magic Link email
   * Returns true if email was sent successfully
   */
  login: async (email: string) => {
    set({ loading: true, emailSent: false });
    const success = await authService.login({ email });
    set({ loading: false, emailSent: success });
    return success;
  },

  logout: async () => {
    set({ loading: true });
    await authService.logout();
    set({ user: null, loading: false });
  },

  checkAuth: async () => {
    set({ loading: true });
    const user = await authService.getUser();
    set({ user, loading: false });
  },

  resetEmailSent: () => set({ emailSent: false }),
}));

export const { Provider: AuthProvider, useStore: useAuthStore } = authStore;
