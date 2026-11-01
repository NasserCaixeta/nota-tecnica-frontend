import { Outlet } from "react-router-dom";
import { WorkspaceShell } from "./WorkspaceShell";
const navigation=[{to:"/admin/participantes",label:"Participantes"},{to:"/admin/oficinas",label:"Oficinas"},{to:"/admin/validacoes",label:"Validações"},{to:"/admin/servicos",label:"Serviços"},{to:"/admin/contestacoes",label:"Contestações"},{to:"/admin/avaliacoes",label:"Comentários de avaliações"},{to:"/admin/associacoes",label:"Associações"},{to:"/admin/solicitacoes-conta",label:"Solicitações de conta"},{to:"/app/garagem",label:"Minha garagem"}];
export function AdminShell(){return <WorkspaceShell context="admin" navigation={navigation}><Outlet/></WorkspaceShell>;}
