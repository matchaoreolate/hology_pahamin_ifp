import { Navigate, Route, Routes } from "react-router-dom";
import { DashboardPage } from "./features/dashboard/DashboardPage";
import { LoginPage } from "./features/auth/LoginPage";
import { LandingPage } from "./features/landing/LandingPage";
import { EbookEditorPage } from "./features/ebook/EbookEditorPage";
import { LkpdEditorPage } from "./features/lkpd/LkpdEditorPage";
import { CreateProjectPage } from "./features/projects/CreateProjectPage";
import { PresentationEditorPage } from "./features/presentation/PresentationEditorPage";
import { PresentationRuntimePage } from "./features/presentation/PresentationRuntimePage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/projects/new" element={<CreateProjectPage />} />
      <Route path="/projects/:projectId/lkpd" element={<LkpdEditorPage />} />
      <Route path="/projects/:projectId/ebook" element={<EbookEditorPage />} />
      <Route path="/projects/:projectId/presentation" element={<PresentationEditorPage />} />
      <Route path="/presentation/:projectId" element={<PresentationRuntimePage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
