import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSession } from "../../lib/auth/SessionContext";

export function AuthGuard({ children, requireApproved = true, requireAdmin = false }: {
  children: ReactNode; requireApproved?: boolean; requireAdmin?: boolean;
}) {
  const location = useLocation();
  const { user, status, error, refresh } = useSession();
  if (error) return <section role="alert"><p>{error}</p><button onClick={() => void refresh()}>Tentar novamente</button></section>;
  if (status === "loading") return <p role="status">Verificando sua sessão...</p>;
  if (!user) return <Navigate replace to="/entrar" state={{ from: location.pathname + location.search }} />;
  if (requireApproved && user.participation_status !== "approved") return <Navigate replace to="/app/participacao" />;
  if (requireAdmin && !user.is_admin) return <section><h1>Acesso restrito</h1><p>Esta área requer acesso administrativo.</p></section>;
  return children;
}
