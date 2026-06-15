import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  age: number;
  gender: string;
  bio: string;
  photoUrl: string;
}

interface AppState {
  profiles: User[];
  setProfiles: (profiles: User[]) => void;
  removeTopProfile: () => void;
  showMatchOverlay: boolean;
  matchedUser: User | null;
  triggerMatch: (user: User) => void;
  closeMatchOverlay: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  profiles: [],
  setProfiles: (profiles) => set({ profiles }),
  removeTopProfile: () => set((state) => ({ profiles: state.profiles.slice(1) })),
  showMatchOverlay: false,
  matchedUser: null,
  triggerMatch: (user) => set({ showMatchOverlay: true, matchedUser: user }),
  closeMatchOverlay: () => set({ showMatchOverlay: false, matchedUser: null }),
}));
