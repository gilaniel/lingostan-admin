import { apiClient } from "@/services/https";
import { VocabularyItem } from "@/types/vocabulary/model";
import { create } from "zustand";

type Vocabulary = {
  data: VocabularyItem[];

  fetchData: (langId: number) => void;
  save: (langId: number, item: VocabularyItem) => Promise<void>;
  delete: (langId: number, word: string) => Promise<void>;
};

export const useVocabularyStore = create<Vocabulary>((set, get) => ({
  data: [],

  fetchData: async (langId) => {
    const { data } = await apiClient.get<VocabularyItem[]>(
      `/languages/${langId}/vocabulary`
    );

    set({
      data: data.sort((a, b) => a.word.localeCompare(b.word)),
    });
  },

  save: async (langId, item) => {
    await apiClient.post(`/languages/${langId}/vocabulary`, item);

    get().fetchData(langId);
  },

  delete: async (langId, word) => {
    await apiClient.delete(`/languages/${langId}/vocabulary`, {
      data: { word },
    });

    get().fetchData(langId);
  },
}));
