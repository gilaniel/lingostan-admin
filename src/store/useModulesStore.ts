import { apiClient } from "@/services/https";

import { create } from "zustand";
import { langsStore } from "./useLangsStore";
import { ModulesItem } from "@/types/modules/model";

type Modules = {
  data: ModulesItem[];
  isLoading: boolean;
  isSaving: boolean;
  activeModule: ModulesItem;

  setData: (data: ModulesItem[]) => void;
  setModule: (module: ModulesItem) => void;

  saveModule: (params: ModulesItem) => Promise<boolean>;
  fetchData: () => Promise<ModulesItem[]>;
  delete: (id: number) => Promise<boolean>;
};

export const useModulesStore = create<Modules>((set, get) => ({
  data: [],
  isLoading: true,
  isSaving: false,
  activeModule: {} as ModulesItem,

  setData: (data) =>
    set({
      data,
    }),

  setModule: (module) =>
    set({
      activeModule: module,
    }),

  saveModule: async (params) => {
    set({
      isSaving: true,
    });

    const url = `/learning/modules${params.id ? `/${params.id}` : ""}`;

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

      const { data } = await apiClient.get<ModulesItem[]>("/learning/modules", {
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

  delete: async (id) => {
    await apiClient.delete(`/learning/modules/${id}`);

    return true;
  },
}));
