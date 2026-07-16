import type { RouteObject } from "react-router-dom";

import { AdminShell } from "../components/layout/AdminShell";
import { AppShell } from "../components/layout/AppShell";
import { AuthGuard } from "../components/layout/AuthGuard";
import { PublicShell } from "../components/layout/PublicShell";
import { LoginPage } from "../features/auth/pages/LoginPage";
import { RegisterPage } from "../features/auth/pages/RegisterPage";
import { AdminValidationDetailPage } from "../features/admin/pages/AdminValidationDetailPage";
import { AdminValidationQueuePage } from "../features/admin/pages/AdminValidationQueuePage";
import { AddGarageVehiclePage } from "../features/garage/pages/AddGarageVehiclePage";
import { GarageDashboardPage } from "../features/garage/pages/GarageDashboardPage";
import { GarageVehicleDetailPage } from "../features/garage/pages/GarageVehicleDetailPage";
import { GarageVehicleDocumentsPage } from "../features/garage/pages/GarageVehicleDocumentsPage";
import { NewMaintenancePage } from "../features/maintenance/pages/NewMaintenancePage";
import { LandingPage } from "../features/public/pages/LandingPage";
import { PlateSearchPage } from "../features/public/pages/PlateSearchPage";
import { WorkshopProfilePage } from "../features/public/pages/WorkshopProfilePage";
import { WorkshopRankingPage } from "../features/public/pages/WorkshopRankingPage";
import { ManagedWorkshopsPage } from "../features/workshops/pages/ManagedWorkshopsPage";
import { NewWorkshopPage } from "../features/workshops/pages/NewWorkshopPage";

export const routes: RouteObject[] = [
  {
    element: <PublicShell />,
    children: [
      { path: "/", element: <LandingPage /> },
      { path: "/consultar", element: <PlateSearchPage /> },
      { path: "/oficinas", element: <WorkshopRankingPage /> },
      { path: "/oficinas/:workshopId", element: <WorkshopProfilePage /> },
      { path: "/entrar", element: <LoginPage /> },
      { path: "/cadastro", element: <RegisterPage /> },
    ],
  },
  {
    path: "/app",
    element: (
      <AuthGuard>
        <AppShell />
      </AuthGuard>
    ),
    children: [
      { path: "garagem", element: <GarageDashboardPage /> },
      { path: "garagem/novo", element: <AddGarageVehiclePage /> },
      { path: "garagem/:vehicleId", element: <GarageVehicleDetailPage /> },
      { path: "garagem/:vehicleId/documentos", element: <GarageVehicleDocumentsPage /> },
      { path: "garagem/:vehicleId/manutencoes/nova", element: <NewMaintenancePage /> },
      { path: "oficinas", element: <ManagedWorkshopsPage /> },
      { path: "oficinas/nova", element: <NewWorkshopPage /> },
    ],
  },
  {
    path: "/admin",
    element: (
      <AuthGuard>
        <AdminShell />
      </AuthGuard>
    ),
    children: [
      { path: "validacoes", element: <AdminValidationQueuePage /> },
      { path: "validacoes/:vehicleLinkId", element: <AdminValidationDetailPage /> },
    ],
  },
];
