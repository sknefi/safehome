import { create } from "zustand";
import { User } from "../components/assets";

interface UserStore {
  userData: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  updateUserData: (newUserData: User | null) => void;
  updateAccessToken: (newToken: string | null) => void;
  updateRefreshToken: (newToken: string | null) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  userData: null,
  accessToken: null,
  refreshToken: null,
  updateUserData: (newUserData) => set({ userData: newUserData }),
  updateAccessToken: (newToken) => set({ accessToken: newToken }),
  updateRefreshToken: (newToken) => set({ refreshToken: newToken }),
}));
