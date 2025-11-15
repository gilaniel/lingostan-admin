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
  isSaving: boolean;
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
  delete: (id: number) => Promise<any>;
};

export const useExerciseStore = create<Excercise>((set, get) => ({
  data: [],
  isLoading: true,
  isSaving: false,
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
    {
      name: "Найди пару",
      key: ExerciseType.MATCHING,
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
    set({
      isSaving: true,
    });

    const url = `/learning/exercises${params.id ? `/${params.id}` : ""}`;

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
      const type = get().activeType.key || undefined;

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

  delete: async (id) => {
    await apiClient.delete(`/learning/exercises/${id}`);

    await get().fetchData();
  },
}));
