import { apiClient } from "@/services/https";
import { Lang } from "@/types/langs/model";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type LangState = {
  langs: Lang[];
  activeLang: Lang;
  isLoading: boolean;

  setLangs: (langs: Lang[]) => void;
  setACtiveLang: (lang: Lang) => void;
  fetchLangs: () => Promise<void>;
};

export const useLangsStore = create<LangState>()(
  persist(
    (set, get) => ({
      langs: [],
      activeLang: {} as Lang,
      isLoading: true,

      setLangs: (langs) => {
        return set({
          langs,
          isLoading: false,
        });
      },

      setACtiveLang: (lang) =>
        set({
          activeLang: lang,
        }),

      fetchLangs: async () => {
        set({ isLoading: true });

        try {
          const { data } = await apiClient.get<Lang[]>("/languages");

          data.forEach((item) => {
            item.alphabet.sort((a, b) => a.order - b.order);
          });

          get().setLangs(data);
        } catch (error) {
          console.log(error);
          set({ isLoading: false });
        }
      },
    }),
    {
      name: "langs-storage",
      partialize: (state) => ({
        activeLang: state.activeLang,
      }),
    }
  )
);

export const langsStore = useLangsStore;
