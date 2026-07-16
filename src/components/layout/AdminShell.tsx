import { Link, Outlet } from "react-router-dom";

import "./Shell.css";

export function AdminShell() {
  return (
    <div className="shell shell--app">
      <aside className="shell__sidebar">
        <Link className="shell__brand" to="/admin/validacoes">
          <span>■</span> Admin
        </Link>
        <nav className="shell__side-nav" aria-label="Navegação admin">
          <Link to="/admin/validacoes">Validações</Link>
        </nav>
      </aside>
      <main className="shell__main">
        <Outlet />
      </main>
    </div>
  );
}
