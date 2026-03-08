import { create } from "zustand";

interface AuthState {
  email: string;
  isAuthenticated: boolean;
  accessToken: string | null;
  login: (email: string, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  email: "",
  isAuthenticated: false,
  accessToken: null,
  login: (email: string, token: string) =>
    set({ email, accessToken: token, isAuthenticated: true }),
  logout: () => set({ email: "", isAuthenticated: false, accessToken: null }),
}));
