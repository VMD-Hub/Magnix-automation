import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "@/auth-context";
import { AppShell } from "@/components/AppShell";
import { HomePage } from "@/pages/HomePage";
import { AccountPage } from "@/pages/AccountPage";
import { AgentHomePage } from "@/pages/AgentHomePage";
import { ProjectDetailPage } from "@/pages/ProjectDetailPage";
import { ConsultPage } from "@/pages/ConsultPage";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppShell />}>
            <Route index element={<HomePage />} />
            <Route path="du-an/:slug" element={<ProjectDetailPage />} />
            <Route path="tu-van" element={<ConsultPage />} />
            <Route path="tai-khoan" element={<AccountPage />} />
            <Route path="agent" element={<AgentHomePage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
