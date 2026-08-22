import type { DemoUser } from '@/types';
import { demoUser } from '@/mockData';

export const authService = {
  async signIn(email: string, password: string): Promise<DemoUser> {
    // Mock implementation - always succeeds
    return {
      ...demoUser,
      email,
      id: 'mock-user-' + Math.random().toString(36).substr(2, 9),
    };
  },

  async continueAsDemo(): Promise<DemoUser> {
    return demoUser;
  },

  async signOut(): Promise<void> {
    // Mock - no-op
  },

  async resetPassword(email: string): Promise<void> {
    // Mock - no-op
  },
};
