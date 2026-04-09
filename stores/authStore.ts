import { create } from 'zustand';
import { User, UserRole } from '@/lib/types';
import { mockUser } from '@/lib/mockData';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  activeRole: UserRole;
  login: () => void;
  logout: () => void;
  switchRole: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  activeRole: 'sender',
  login: () => set({ user: mockUser, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),
  switchRole: () => {
    const current = get().activeRole;
    set({ activeRole: current === 'sender' ? 'courier' : 'sender' });
  },
}));
