import { Link, Outlet } from "react-router-dom";

import "./Shell.css";

export function AppShell() {
  return (
    <div className="shell shell--app">
      <aside className="shell__sidebar">
        <Link className="shell__brand" to="/app/garagem">
          <span>■</span> Nota Técnica
        </Link>
        <nav className="shell__side-nav" aria-label="Navegação do app">
          <Link to="/app/garagem">Garagem</Link>
          <Link to="/app/oficinas/minhas">Oficinas</Link>
        </nav>
      </aside>
      <main className="shell__main">
        <Outlet />
      </main>
    </div>
  );
}
