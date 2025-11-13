import { Navigate, Route, Routes } from "react-router-dom";
import { LoaderCircle } from "lucide-react";

import DefaultLayout from "./layouts/default";

import LanguagesPage from "@/pages/languages";
import ExercisesPage from "@/pages/exercises";
import ModulesRoute from "@/pages/modules";
import LessonsRoute from "@/pages/lessons";
import { useEffect } from "react";
import { useAuthStore } from "./store/useAuthStore";
import { AuthLayout } from "./components/authLayout";
import { useLangsStore } from "./store/useLangsStore";

function App() {
  const { refresh, isLoading, access_token } = useAuthStore();
  const { fetchLangs } = useLangsStore();

  useEffect(() => {
    refresh();
    setInterval(() => refresh(true), 10 * 60 * 1000);
  }, []);

  useEffect(() => {
    if (access_token) {
      fetchLangs();
    }
  }, [access_token]);

  if (isLoading) {
    return (
      <div className="size-full flex items-center justify-center pt-10">
        <LoaderCircle className="animate-spin" />
      </div>
    );
  }

  if (!access_token) {
    return <AuthLayout />;
  }

  return (
    <DefaultLayout>
      <Routes>
        <Route element={<LanguagesPage />} path="/languages" />
        <Route element={<ModulesRoute />} path="/modules" />
        <Route element={<LessonsRoute />} path="/lessons" />
        <Route element={<ExercisesPage />} path="/exercises" />
        <Route path="*" element={<Navigate to="/languages" replace />} />
      </Routes>
    </DefaultLayout>
  );
}

export default App;
