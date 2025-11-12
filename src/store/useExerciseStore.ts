import { apiClient } from "@/services/https";
import {
  CreateExercise,
  ExerciseItem,
  ExerciseType,
} from "@/types/exercises/model";
import { create } from "zustand";
import { langsStore } from "./useLangsStore";

type ExerciseTypeItem = {
  name: string;
  key: ExerciseType;
};

type Excercise = {
  data: ExerciseItem[];
  isLoading: boolean;
  activeExercise: ExerciseItem;
  types: ExerciseTypeItem[];
  activeType: ExerciseTypeItem;

  setData: (data: ExerciseItem[]) => void;
  setExercise: (exercise: ExerciseItem) => void;
  setActiveType: (type: ExerciseTypeItem) => void;
  saveExercise: <T extends ExerciseType>(
    params: CreateExercise<T>
  ) => Promise<boolean>;
  fetchData: () => Promise<ExerciseItem[]>;
};

export const useExerciseStore = create<Excercise>((set, get) => ({
  data: [],
  isLoading: true,
  activeExercise: {} as ExerciseItem,
  activeType: {} as ExerciseTypeItem,
  types: [
    {
      name: "Знакомство",
      key: ExerciseType.LISTENING,
    },
    {
      name: "Выбери слово",
      key: ExerciseType.MULTIPLE_CHOICE,
    },
  ],

  setData: (data) =>
    set({
      data,
    }),

  setExercise: (exercise) =>
    set({
      activeExercise: exercise,
    }),

  setActiveType: (type) =>
    set({
      activeType: type,
    }),

  saveExercise: async (params) => {
    await apiClient.put("/learning/exercises", params);

    await get().fetchData();

    return true;
  },

  fetchData: async () => {
    set({ isLoading: true });

    try {
      const activeLang = langsStore.getState().activeLang;
      const type = get().activeType.key;

      if (!type) return [];

      const params = {
        languageId: activeLang.id,
        type,
      } as any;

      const { data } = await apiClient.get<ExerciseItem[]>(
        "/learning/exercises",
        {
          params,
        }
      );

      get().setData(data);

      return data;
    } catch (e) {
      console.log(e);

      return [];
    } finally {
      set({ isLoading: false });
    }
  },
}));
