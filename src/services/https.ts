import { authStore } from "@/store/useAuthStore";
import axios from "axios";

export const apiClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  withCredentials: true,
});

apiClient.interceptors.request.use(async (config) => {
  const publicPaths = ["/auth/register", "/auth/login", "/auth/refresh"];

  const isPublic = publicPaths.some((path) => config.url?.startsWith(path));

  if (!isPublic) {
    let token = authStore.getState().access_token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});
