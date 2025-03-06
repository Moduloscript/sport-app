import { create } from "zustand";
import { createClient } from "@/lib/supabase/client";
import { Session, User, Provider } from "@supabase/supabase-js";

type AuthStore = {
  session: Session | null;
  loading: boolean;
  error: string | null;
  user: User | null;
  rememberMe: boolean;
  isEmailVerified: boolean;
  emailVerificationSent: boolean;
  lastVerificationCheck: number | null;
  oAuthProviders: string[];
  oAuthLoading: boolean;
  sessionExpiresAt: number | null;
  isSessionExpired: boolean;
  setSession: (session: Session | null) => void;
  checkSessionExpiration: () => void;
  refreshSessionIfNeeded: () => Promise<void>;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  refreshSession: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  checkEmailVerification: () => Promise<{ isVerified: boolean; lastChecked: number }>;
  verifyEmail: () => Promise<boolean>;
  resendVerificationEmail: () => Promise<{ success: boolean; error?: string }>;
  getOAuthProviders: () => Promise<void>;
  handleOAuthCallback: (provider: Provider) => Promise<void>;
};

const supabase = createClient();

export const useAuthStore = create<AuthStore>((set, get) => ({
  session: null,
  loading: false,
  error: null,
  user: null,
  rememberMe: false,
  isEmailVerified: false,
  emailVerificationSent: false,
  lastVerificationCheck: null,
  oAuthProviders: [],
  oAuthLoading: false,
  sessionExpiresAt: null,
  isSessionExpired: false,

  setSession: (session) => {
    set({
      session,
      sessionExpiresAt: session?.expires_at ? session.expires_at * 1000 : null,
      isSessionExpired: false,
    });
    if (session) {
      get().checkSessionExpiration();
    }
  },

  login: async (email, password, rememberMe = false) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      set({
        session: data.session,
        user: data.user,
        rememberMe,
      });

      if (rememberMe) {
        localStorage.setItem("rememberMe", "true");
      } else {
        localStorage.removeItem("rememberMe");
      }
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error(String(error));
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },

  logout: async () => {
    set({ loading: true });
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      set({ 
        session: null,
        isEmailVerified: false,
        emailVerificationSent: false,
        lastVerificationCheck: null
      });
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error(String(error));
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },

  checkAuth: async () => {
    set({ loading: true });
    try {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        const { data: userData } = await supabase.auth.getUser();
        set({
          session: data.session,
          user: userData.user,
          sessionExpiresAt: data.session.expires_at
            ? data.session.expires_at * 1000
            : null,
          isSessionExpired: false,
        });
        get().checkSessionExpiration();
      }
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error(String(error));
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },

  checkSessionExpiration: () => {
    const { sessionExpiresAt } = get();
    if (!sessionExpiresAt) return;

    const checkInterval = setInterval(() => {
      const now = Date.now();
      const expiresIn = sessionExpiresAt - now;

      if (expiresIn <= 0) {
        set({ isSessionExpired: true });
        clearInterval(checkInterval);
      }
    }, 1000);
  },

  refreshSessionIfNeeded: async () => {
    const { sessionExpiresAt } = get();
    if (!sessionExpiresAt) return;

    const now = Date.now();
    const expiresIn = sessionExpiresAt - now;

    // Refresh session if it expires in less than 5 minutes
    if (expiresIn < 5 * 60 * 1000) {
      try {
        await get().refreshSession();
      } catch (error) {
        console.error("Failed to refresh session:", error);
      }
    }
  },

  refreshSession: async () => {
    set({ loading: true });
    try {
      const { data, error } = await supabase.auth.refreshSession();
      if (error) throw error;
      set({ session: data.session });
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error(String(error));
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },

  resetPassword: async (email: string) => {
    set({ loading: true });
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error(String(error));
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },

  updateProfile: async (updates: Partial<User>) => {
    set({ loading: true });
    try {
      const { data, error } = await supabase.auth.updateUser(updates);
      if (error) throw error;
      set({ user: data.user });
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error(String(error));
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },

  checkEmailVerification: async () => {
    set({ loading: true });
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error) throw error;
      
      const isVerified = data.user?.email_confirmed_at !== null;
      const lastChecked = Date.now();
      
      set({ 
        isEmailVerified: isVerified,
        user: data.user,
        lastVerificationCheck: lastChecked
      });
      
      return { isVerified, lastChecked };
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error(String(error));
      set({ error: err.message });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  verifyEmail: async () => {
    set({ loading: true });
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error) throw error;
      
      const isVerified = data.user?.email_confirmed_at !== null;
      if (isVerified) {
        set({ 
          isEmailVerified: true,
          user: data.user,
          lastVerificationCheck: Date.now()
        });
      }
      return isVerified;
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error(String(error));
      set({ error: err.message });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  resendVerificationEmail: async () => {
    set({ loading: true, emailVerificationSent: false });
    try {
      const email = useAuthStore.getState().user?.email;
      if (!email) {
        throw new Error('No email address found for the user');
      }
      
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      });
      
      if (error) throw error;
      set({ emailVerificationSent: true });
      return { success: true };
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error(String(error));
      set({ error: err.message });
      return { success: false, error: err.message };
    } finally {
      set({ loading: false });
    }
  },

  getOAuthProviders: async () => {
    set({ oAuthLoading: true });
    try {
      // Supabase doesn't provide a direct method to get providers
      // We'll use a predefined list of common providers
      set({ oAuthProviders: ["google", "github", "facebook", "twitter"] });
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error(String(error));
      set({ error: err.message });
    } finally {
      set({ oAuthLoading: false });
    }
  },

  handleOAuthCallback: async (provider: Provider) => {
    set({ loading: true });
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;

      // Get the session after OAuth redirect
      const { data: sessionData } = await supabase.auth.getSession();
      set({ session: sessionData.session });
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error(String(error));
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },
}));
