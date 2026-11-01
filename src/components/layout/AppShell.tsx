import { Outlet } from "react-router-dom";
import { useSession } from "../../lib/auth/SessionContext";
import { WorkspaceShell } from "./WorkspaceShell";
export function AppShell(){const {user}=useSession();const navigation=[{to:"/app/garagem",label:"Garagem"},{to:"/app/notificacoes",label:"Pendências"},{to:"/app/assinatura",label:"Assinatura"},{to:"/app/servicos-pendentes",label:"Serviços pendentes"},{to:"/app/oficinas",label:"Oficinas"},...(user?.is_admin?[{to:"/admin/participantes",label:"Administração"}]:[])];return <WorkspaceShell context="app" navigation={navigation}><Outlet/></WorkspaceShell>;}
