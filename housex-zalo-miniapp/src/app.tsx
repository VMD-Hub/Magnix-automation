import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "@/auth-context";
import { AppShell } from "@/components/AppShell";
import { AccountPage } from "@/pages/AccountPage";
import { AgentHomePage } from "@/pages/AgentHomePage";
import { AgentCasesPage } from "@/pages/AgentCasesPage";
import { AgentCaseDetailPage } from "@/pages/AgentCaseDetailPage";
import { AgentNotificationsPage } from "@/pages/AgentNotificationsPage";
import { AgentCommissionsPage } from "@/pages/AgentCommissionsPage";
import { AgentServicesPage } from "@/pages/AgentServicesPage";
import { AgentServiceDetailPage } from "@/pages/AgentServiceDetailPage";
import { ExploreHubPage } from "@/pages/ExploreHubPage";
import { HomeGatePage } from "@/pages/HomeGatePage";
import { LaneHomePage } from "@/pages/LaneHomePage";
import { ProjectDetailPage } from "@/pages/ProjectDetailPage";
import { ConsultPage } from "@/pages/ConsultPage";
import { StartPage } from "@/pages/StartPage";
import { ToolsHubPage } from "@/pages/ToolsHubPage";
import { ServicesHubPage } from "@/pages/ServicesHubPage";
import { ToolViewerPage } from "@/pages/ToolViewerPage";
import { WebViewPage } from "@/pages/WebViewPage";

/** HashRouter — ổn định trên Zalo Mini App (CDN path không phải domain thật). */
export default function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <Routes>
          <Route path="/start" element={<StartPage />} />
          <Route element={<AppShell />}>
            <Route index element={<HomeGatePage />} />
            <Route path="noxh" element={<LaneHomePage lane="noxh" />} />
            <Route path="cctm" element={<LaneHomePage lane="cctm" />} />
            <Route path="kham-pha" element={<ExploreHubPage />} />
            <Route path="du-an/:slug" element={<ProjectDetailPage />} />
            <Route path="tu-van" element={<ConsultPage />} />
            <Route path="dich-vu" element={<ServicesHubPage />} />
            <Route path="cong-cu" element={<ToolsHubPage />} />
            <Route path="cong-cu/mo" element={<ToolViewerPage />} />
            <Route path="mo" element={<WebViewPage />} />
            <Route path="mo/*" element={<WebViewPage />} />
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
      </HashRouter>
    </AuthProvider>
  );
}
