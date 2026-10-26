import { Link, Outlet } from "react-router-dom";

import "./Shell.css";
import { useSession } from "../../lib/auth/SessionContext";

export function AppShell() {
  const { user, logout } = useSession();
  return (
    <div className="shell shell--app">
      <aside className="shell__sidebar">
        <Link className="shell__brand" to="/app/garagem">
          <span>■</span> Nota Técnica
        </Link>
        <nav className="shell__side-nav" aria-label="Navegação do app">
          <Link to="/app/garagem">Garagem</Link>
          <Link to="/app/servicos-pendentes">Serviços pendentes</Link>
          <Link to="/app/oficinas">Oficinas</Link>
          <Link to="/app/participacao">Minha conta</Link>
          {user?.is_admin && <Link to="/admin/participantes">Administração</Link>}
          <button type="button" onClick={logout}>Sair</button>
        </nav>
      </aside>
      <main className="shell__main">
        <Outlet />
      </main>
    </div>
  );
}
