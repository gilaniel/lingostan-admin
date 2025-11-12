import { apiClient } from "@/services/https";
import { User } from "@/types/user/model";
import { create } from "zustand";

type AuthState = {
  access_token: string;
  isLoading: boolean;
  user: User;

  setAccessToken: (token: string) => void;
  fetchProfile: () => Promise<void>;
  resetUser: () => void;
  refresh: (update?: boolean) => void;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  access_token: "",
  isLoading: true,
  user: {} as User,

  setAccessToken: (token) =>
    set({
      access_token: token,
    }),

  fetchProfile: async () => {
    const { data } = await apiClient.get<User>("/users/profile");

    set({ isLoading: false, user: data });
  },

  resetUser: () =>
    set({
      user: {} as User,
      access_token: "",
    }),

  refresh: async (update) => {
    try {
      const { data } = await apiClient.post<{ access_token: string }>(
        "/auth/refresh"
      );

      if (data.access_token) {
        get().setAccessToken(data.access_token);

        if (!update) {
          get().fetchProfile();
        }
      }
    } catch (error) {
      console.log(error);
      set({ isLoading: false });
    }
  },
}));

export const authStore = useAuthStore;
