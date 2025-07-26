"use client";

import { createContext, useState, useEffect, ReactNode } from "react";
import {
  User,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import type { LoginCredentials, SignUpCredentials } from "@/types";
import { generateAndStoreKey, clearStoredKey } from "@/lib/crypto";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<any>;
  signup: (credentials: SignUpCredentials) => Promise<any>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    const userCredential = await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
    // Generate and store the key on login to be used for decryption
    await generateAndStoreKey(credentials.password);
    return userCredential;
  };

  const signup = async (credentials: SignUpCredentials) => {
    const userCredential = await createUserWithEmailAndPassword(auth, credentials.email, credentials.password);
    // Generate and store the key on signup
    await generateAndStoreKey(credentials.password);
    return userCredential;
  };

  const logout = async () => {
    await signOut(auth);
    // Clear the key from storage on logout
    clearStoredKey();
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};
