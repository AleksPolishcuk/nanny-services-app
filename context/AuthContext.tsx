"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { onAuthStateChanged, type User, getAuth } from "firebase/auth";
import { signIn, signUp, logout } from "@/service/firebase/auth";

const auth = getAuth();

type AuthContextValue = {
  user: User | null;
  isAuthLoading: boolean;
  signUp: (p: {
    name: string;
    email: string;
    password: string;
  }) => Promise<void>;
  signIn: (p: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setIsAuthLoading(false);
    });

    return () => unsub();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthLoading,
      signUp: async (p) => {
        await signUp(p);
      },
      signIn: async (p) => {
        await signIn(p);
      },
      logout: async () => {
        await logout();
      },
    }),
    [user, isAuthLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
