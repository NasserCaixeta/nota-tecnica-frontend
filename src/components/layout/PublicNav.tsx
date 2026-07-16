import { Link } from "react-router-dom";

import { landingNavigation } from "../../content/landing";

export function PublicNav() {
  return (
    <nav className="public-nav" aria-label="Navegação principal">
      <Link className="public-nav__brand" to="/">
        <span aria-hidden="true" /> Nota Técnica
      </Link>
      <div className="public-nav__links">
        {landingNavigation.map((item) => (
          <Link key={item.href} to={item.href}>
            {item.label}
          </Link>
        ))}
      </div>
      <div className="public-nav__auth">
        <Link className="public-nav__enter" to="/entrar">
          Entrar
        </Link>
        <Link className="public-nav__register" to="/cadastro">
          Cadastro
        </Link>
      </div>
    </nav>
  );
}
