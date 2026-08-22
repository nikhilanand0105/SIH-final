import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { signInWithEmailAndPassword, signOut as firebaseSignOut, sendPasswordResetEmail, onAuthStateChanged, User } from 'firebase/auth';
import { authService } from '@/services/mockServices';
import type { DemoUser } from '@/types';
import { auth } from '@/config/firebaseConfig';

interface AuthContextValue {
  user: DemoUser | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  continueAsDemo: () => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const USER_KEY = '@documind/demo-user';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<DemoUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: User | null) => {
      if (firebaseUser) {
        setUser({
          id: firebaseUser.uid,
          name: firebaseUser.displayName || 'User',
          email: firebaseUser.email || '',
          role: 'Admin',
          avatar: undefined,
        });
        setIsLoading(false);
      } else {
        // Fallback to check async storage for demo user
        AsyncStorage.getItem(USER_KEY)
          .then((stored) => {
            if (stored) setUser(JSON.parse(stored) as DemoUser);
            else setUser(null);
          })
          .finally(() => setIsLoading(false));
      }
    });
    return unsubscribe;
  }, []);

  const saveUser = async (nextUser: DemoUser) => {
    setUser(nextUser);
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(nextUser));
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      signIn: async (email, password) => {
        try {
          // Attempt Firebase login first
          const cred = await signInWithEmailAndPassword(auth, email, password);
          setUser({
            id: cred.user.uid,
            name: cred.user.displayName || 'User',
            email: cred.user.email || '',
            role: 'Admin',
          });
        } catch (e) {
          console.log('Firebase login failed, trying mock fallback:', e);
          saveUser(await authService.signIn(email, password));
        }
      },
      continueAsDemo: async () => saveUser(await authService.continueAsDemo()),
      signOut: async () => {
        try {
          await firebaseSignOut(auth);
        } catch (e) {
          console.log('Firebase logout error:', e);
        }
        await authService.signOut();
        setUser(null);
        await AsyncStorage.removeItem(USER_KEY);
      },
      resetPassword: async (email) => {
        try {
          await sendPasswordResetEmail(auth, email);
        } catch (e) {
          console.log('Firebase reset failed, trying mock:', e);
          await authService.resetPassword(email);
        }
      },
    }),
    [isLoading, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}