import { apiClient } from "@/services/https";

import { create } from "zustand";
import { langsStore } from "./useLangsStore";
import { LessonsItem } from "@/types/lessons/model";

type Lessons = {
  data: LessonsItem[];
  isLoading: boolean;
  isSaving: boolean;
  activeLesson: LessonsItem;

  setData: (data: LessonsItem[]) => void;
  setLesson: (lesson: LessonsItem) => void;

  saveLesson: (params: LessonsItem) => Promise<boolean>;
  fetchData: () => Promise<LessonsItem[]>;
  deleteLesson: (id: number) => Promise<any>;
};

export const useLessonsStore = create<Lessons>((set, get) => ({
  data: [],
  isLoading: true,
  isSaving: false,
  activeLesson: {} as LessonsItem,

  setData: (data) =>
    set({
      data,
    }),

  setLesson: (lesson) =>
    set({
      activeLesson: lesson,
    }),

  saveLesson: async (params) => {
    set({
      isSaving: true,
    });

    const url = `/learning/lessons${params.id ? `/${params.id}` : ""}`;

    await apiClient(url, {
      method: params.id ? "patch" : "put",
      data: params,
    });

    await get().fetchData();

    set({
      isSaving: false,
    });

    return true;
  },

  fetchData: async () => {
    set({ isLoading: true });

    try {
      const activeLang = langsStore.getState().activeLang;

      const params = {
        languageId: activeLang.id,
      } as any;

      const { data } = await apiClient.get<LessonsItem[]>("/learning/lessons", {
        params,
      });

      get().setData(data);

      return data;
    } catch (e) {
      console.log(e);

      return [];
    } finally {
      set({ isLoading: false });
    }
  },

  deleteLesson: async (id) => {
    await apiClient.delete(`/learning/lessons/${id}`);
    await get().fetchData();
  },
}));
