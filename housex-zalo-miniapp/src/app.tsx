import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "@/auth-context";
import { AppShell } from "@/components/AppShell";
import { HomePage } from "@/pages/HomePage";
import { AccountPage } from "@/pages/AccountPage";
import { AgentHomePage } from "@/pages/AgentHomePage";
import { AgentCasesPage } from "@/pages/AgentCasesPage";
import { AgentCaseDetailPage } from "@/pages/AgentCaseDetailPage";
import { AgentNotificationsPage } from "@/pages/AgentNotificationsPage";
import { AgentCommissionsPage } from "@/pages/AgentCommissionsPage";
import { AgentServicesPage } from "@/pages/AgentServicesPage";
import { AgentServiceDetailPage } from "@/pages/AgentServiceDetailPage";
import { ProjectDetailPage } from "@/pages/ProjectDetailPage";
import { ConsultPage } from "@/pages/ConsultPage";
import { ToolsHubPage } from "@/pages/ToolsHubPage";
import { ToolViewerPage } from "@/pages/ToolViewerPage";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppShell />}>
            <Route index element={<HomePage />} />
            <Route path="du-an/:slug" element={<ProjectDetailPage />} />
            <Route path="tu-van" element={<ConsultPage />} />
            <Route path="cong-cu" element={<ToolsHubPage />} />
            <Route path="cong-cu/mo" element={<ToolViewerPage />} />
            <Route path="tai-khoan" element={<AccountPage />} />
            <Route path="agent" element={<AgentHomePage />} />
            <Route path="agent/dich-vu" element={<AgentServicesPage />} />
            <Route
              path="agent/dich-vu/:code"
              element={<AgentServiceDetailPage />}
            />
            <Route path="agent/ho-so" element={<AgentCasesPage />} />
            <Route path="agent/ho-so/:id" element={<AgentCaseDetailPage />} />
            <Route path="agent/thong-bao" element={<AgentNotificationsPage />} />
            <Route path="agent/hoa-hong" element={<AgentCommissionsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
