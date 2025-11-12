import { Navigate, Route, Routes } from "react-router-dom";
import AuthPage from "@/pages/auth";
import { useAuthStore } from "@/store/useAuthStore";
import DefaultLayout from "@/layouts/default";

export function AuthLayout() {
  const { access_token } = useAuthStore();

  if (access_token) {
    return <Navigate to="/" replace />;
  }

  return (
    <DefaultLayout>
      <Routes>
        <Route element={<AuthPage />} path="/auth" />
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
    </DefaultLayout>
  );
}
