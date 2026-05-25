import { Routes, Route } from "react-router";
import { Root } from "./Root";
import { Home } from "./pages/Home";
import { Projects } from "./pages/Projects";
import { Team } from "./pages/Team";
import { AdminLogin } from "./pages/admin/AdminLogin";
import { AdminRoot } from "./pages/admin/AdminRoot";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { AdminProjects } from "./pages/admin/AdminProjects";
import { AdminProjectForm } from "./pages/admin/AdminProjectForm";
import { AdminTeam } from "./pages/admin/AdminTeam";
import { AdminHomeConfig } from "./pages/admin/AdminHomeConfig";
import { AdminContent } from "./pages/admin/AdminContent";
import { AdminAwards } from "./pages/admin/AdminAwards";
import { ProjectDetail } from "./pages/ProjectDetail";
import { Studio } from "./pages/Studio";
import { DataProvider } from "./data/store";

export function App() {
  return (
    <DataProvider>
      <Routes>
        <Route path="/" element={<Root />}>
          <Route index element={<Home />} />
          <Route path="projects" element={<Projects />} />
          <Route path="projects/:slug" element={<ProjectDetail />} />
          <Route path="team" element={<Team />} />
          <Route path="studio" element={<Studio />} />
        </Route>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminRoot />}>
          <Route index element={<AdminDashboard />} />
          <Route path="projects" element={<AdminProjects />} />
          <Route path="projects/new" element={<AdminProjectForm />} />
          <Route path="projects/:id" element={<AdminProjectForm />} />
          <Route path="team" element={<AdminTeam />} />
          <Route path="home" element={<AdminHomeConfig />} />
          <Route path="content" element={<AdminContent />} />
          <Route path="awards" element={<AdminAwards />} />
        </Route>
      </Routes>
    </DataProvider>
  );
}
