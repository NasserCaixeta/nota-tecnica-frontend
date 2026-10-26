import { ServiceReviewsPage } from "../features/admin/pages/ServiceReviewsPage";
import { ServiceAssociationsPage } from "../features/admin/pages/ServiceAssociationsPage";
import { MaintenanceDetailPage } from "../features/maintenance/pages/MaintenanceDetailPage";
import { ServiceInvitationPage } from "../features/maintenance/pages/ServiceInvitationPage";
import { PendingServicesPage } from "../features/maintenance/pages/PendingServicesPage";
import { WorkshopServicesPage } from "../features/workshops/pages/WorkshopServicesPage";
import { MaintenanceReviewPage } from "../features/admin/pages/MaintenanceReviewPage";
import { ServiceDisputesPage } from "../features/admin/pages/ServiceDisputesPage";
import { WorkshopClaimPage } from "../features/workshops/pages/WorkshopClaimPage";
import { WorkshopClaimsPage } from "../features/admin/pages/WorkshopClaimsPage";
import { Navigate, Outlet, type RouteObject } from "react-router-dom";
import { SessionProvider } from "../lib/auth/SessionProvider";
import { PilotStatusPage } from "../features/auth/pages/PilotStatusPage";
import { ParticipantQueuePage } from "../features/admin/pages/ParticipantQueuePage";

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
import { WorkshopProfilePage } from "../features/workshops/pages/WorkshopProfilePage";
import { WorkshopRankingPage } from "../features/public/pages/WorkshopRankingPage";
import { ManagedWorkshopsPage } from "../features/workshops/pages/ManagedWorkshopsPage";
import { NewWorkshopPage } from "../features/workshops/pages/NewWorkshopPage";

const routeDefinitions: RouteObject[] = [
  { path: "/convite-servico", element: <ServiceInvitationPage /> },
  { path: "/app/participacao", element: <AuthGuard requireApproved={false}><PilotStatusPage /></AuthGuard> },
  { path: "*", element: <section><h1>Página não encontrada</h1></section> },
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
      { index: true, element: <Navigate replace to="garagem" /> },
      { path: "servicos-pendentes", element: <PendingServicesPage /> },
      { path: "manutencoes/:recordId", element: <MaintenanceDetailPage /> },
      { path: "oficinas/:workshopId/servicos", element: <WorkshopServicesPage /> },
      { path: "garagem", element: <GarageDashboardPage /> },
      { path: "garagem/novo", element: <AddGarageVehiclePage /> },
      { path: "garagem/:vehicleId", element: <GarageVehicleDetailPage /> },
      { path: "garagem/:vehicleId/documentos", element: <GarageVehicleDocumentsPage /> },
      { path: "garagem/:vehicleId/manutencoes/nova", element: <NewMaintenancePage /> },
      { path: "oficinas", element: <ManagedWorkshopsPage /> },
      { path: "oficinas/nova", element: <NewWorkshopPage /> },
      { path: "oficinas/reivindicar", element: <WorkshopClaimPage /> },
    ],
  },
  {
    path: "/admin",
    element: (
      <AuthGuard requireAdmin>
        <AdminShell />
      </AuthGuard>
    ),
    children: [
      { index: true, element: <Navigate replace to="participantes" /> },
      { path: "servicos", element: <MaintenanceReviewPage /> },
      { path: "servicos/:recordId", element: <MaintenanceReviewPage /> },
      { path: "avaliacoes", element: <ServiceReviewsPage /> },
      { path: "associacoes", element: <ServiceAssociationsPage /> },
      { path: "contestacoes", element: <ServiceDisputesPage /> },
      { path: "participantes", element: <ParticipantQueuePage /> },
      { path: "oficinas", element: <WorkshopClaimsPage /> },
      { path: "validacoes", element: <AdminValidationQueuePage /> },
      { path: "validacoes/:vehicleLinkId", element: <AdminValidationDetailPage /> },
    ],
  },
];

export const routes: RouteObject[] = [{ element: <SessionProvider><Outlet /></SessionProvider>, children: routeDefinitions }];
