import { StateBlock } from "../data-display/StateBlock";
import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSession } from "../../lib/auth/SessionContext";

export function AuthGuard({ children, requireApproved = true, requireAdmin = false }: {
  children: ReactNode; requireApproved?: boolean; requireAdmin?: boolean;
}) {
  const location = useLocation();
  const { user, status, error, refresh } = useSession();
  if (error) return <section className="page-section standalone-page"><StateBlock kind="error" title="Não foi possível verificar sua sessão" description={error} onRetry={()=>void refresh()}/></section>;
  if (status === "loading") return <section className="page-section standalone-page"><StateBlock kind="loading" title="Verificando sua sessão..."/></section>;
  if (!user) return <Navigate replace to="/entrar" state={{ from: location.pathname + location.search }} />;
  if (requireApproved && user.participation_status !== "approved") return <Navigate replace to="/app/participacao" />;
  if (requireAdmin && !user.is_admin) return <section className="page-section standalone-page"><h1>Acesso restrito</h1><p>Esta área requer acesso administrativo.</p></section>;
  return children;
}
