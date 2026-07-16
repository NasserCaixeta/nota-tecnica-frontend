import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

import { getStoredToken } from "../../lib/auth/token-storage";

export function AuthGuard({ children }: { children: ReactNode }) {
  if (!getStoredToken()) {
    return <Navigate replace to="/entrar" />;
  }

  return children;
}
