import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService, type User } from '../api/auth';
import type { LoginFormData, RegisterFormData } from '../schemas/auth-schemas';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  login: (data: LoginFormData) => Promise<void>;
  register: (data: Omit<RegisterFormData, 'confirmPassword'>) => Promise<void>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
  clearError: () => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
}

type AuthStore = AuthState & AuthActions;

/**
 * Store de autenticação usando Zustand
 */
export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Estado inicial
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      /**
       * Realiza login do usuário
       */
      login: async (data: LoginFormData) => {
        set({ isLoading: true, error: null });

        try {
          const response = await authService.login(data);
          
          // Salva tokens no localStorage
          localStorage.setItem('accessToken', response.accessToken);
          localStorage.setItem('refreshToken', response.refreshToken);
          
          set({
            user: response.user,
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Erro ao fazer login';
          set({
            isLoading: false,
            error: errorMessage,
          });
          throw error;
        }
      },

      /**
       * Registra novo usuário
       */
      register: async (data: Omit<RegisterFormData, 'confirmPassword'>) => {
        set({ isLoading: true, error: null });

        try {
          const response = await authService.register(data);
          
          // Salva tokens no localStorage
          localStorage.setItem('accessToken', response.accessToken);
          localStorage.setItem('refreshToken', response.refreshToken);
          
          set({
            user: response.user,
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Erro ao registrar usuário';
          set({
            isLoading: false,
            error: errorMessage,
          });
          throw error;
        }
      },

      /**
       * Realiza logout do usuário
       */
      logout: async () => {
        try {
          await authService.logout();
        } catch (error) {
          console.error('Erro ao fazer logout:', error);
        } finally {
          // Limpa tokens do localStorage
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            error: null,
          });
        }
      },

      /**
       * Carrega dados do usuário autenticado
       */
      loadUser: async () => {
        const accessToken = localStorage.getItem('accessToken');
        
        if (!accessToken) {
          set({ isAuthenticated: false, user: null });
          return;
        }

        set({ isLoading: true });

        try {
          const user = await authService.getProfile();
          
          set({
            user,
            accessToken,
            refreshToken: localStorage.getItem('refreshToken'),
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          // Se falhar ao carregar usuário, limpa autenticação
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },

      /**
       * Limpa mensagem de erro
       */
      clearError: () => {
        set({ error: null });
      },

      /**
       * Define tokens de autenticação
       */
      setTokens: (accessToken: string, refreshToken: string) => {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        
        set({
          accessToken,
          refreshToken,
        });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
