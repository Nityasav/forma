"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { AuthError, Session, User } from "@supabase/supabase-js";

import { createSupabaseBrowserClient } from "@/lib/supabase";

type SignUpParams = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

type SignInParams = {
  email: string;
  password: string;
};

type SignUpFn = (_params: SignUpParams) => Promise<AuthError | null>;
type SignInFn = (_params: SignInParams) => Promise<AuthError | null>;

type AuthContextValue = {
  supabase: ReturnType<typeof createSupabaseBrowserClient>;
  currentUser: User | null;
  session: Session | null;
  isLoading: boolean;
  error: AuthError | null;
  signUp: SignUpFn;
  signIn: SignInFn;
  signOut(): Promise<AuthError | null>;
  signInWithGoogle(): Promise<AuthError | null>;
  refreshProfile(): Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

type AuthProviderProps = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<AuthError | null>(null);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      const {
        data: { session: initialSession },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (!mounted) return;

      if (sessionError) {
        setError(sessionError);
      }

      setSession(initialSession);
      setCurrentUser(initialSession?.user ?? null);
      setIsLoading(false);
    };

    init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setCurrentUser(newSession?.user ?? null);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  const signUp = useCallback<AuthContextValue["signUp"]>(
    async ({ email, password, firstName, lastName }) => {
      setError(null);
      const redirectUrl = `${window.location.origin}/auth/callback?email=${encodeURIComponent(email)}`;
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          },
          emailRedirectTo: redirectUrl,
        },
      });

      if (signUpError) {
        setError(signUpError);
        return signUpError;
      }

      return null;
    },
    [supabase],
  );

  const signIn = useCallback<AuthContextValue["signIn"]>(
    async ({ email, password }) => {
      setError(null);
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError);
        return signInError;
      }

      return null;
    },
    [supabase],
  );

  const signOut = useCallback<AuthContextValue["signOut"]>(async () => {
    setError(null);
    const { error: signOutError } = await supabase.auth.signOut();
    if (signOutError) {
      setError(signOutError);
      return signOutError;
    }

    setSession(null);
    setCurrentUser(null);
    return null;
  }, [supabase]);

  const signInWithGoogle = useCallback<AuthContextValue["signInWithGoogle"]>(
    async () => {
      setError(null);
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          scopes: "email profile openid",
        },
      });

      if (oauthError) {
        setError(oauthError);
        return oauthError;
      }

      return null;
    },
    [supabase],
  );

  const refreshProfile = useCallback(async () => {
    const { data } = await supabase.auth.getUser();
    setCurrentUser(data.user ?? null);
  }, [supabase]);

  const value = useMemo<AuthContextValue>(
    () => ({
      supabase,
      currentUser,
      session,
      isLoading,
      error,
      signUp,
      signIn,
      signOut,
      signInWithGoogle,
      refreshProfile,
    }),
    [
      supabase,
      currentUser,
      session,
      isLoading,
      error,
      signUp,
      signIn,
      signOut,
      signInWithGoogle,
      refreshProfile,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}

