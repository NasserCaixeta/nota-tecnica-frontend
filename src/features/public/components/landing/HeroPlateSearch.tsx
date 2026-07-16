import { Link } from "react-router-dom";

export function HeroPlateSearch() {
  return (
    <section className="landing-hero">
      <p className="landing-kicker">Ranking automotivo</p>
      <h1>
        Oficinas ranqueadas
        <br />
        por dados.
        <br />
        <em>Não por estrelas.</em>
      </h1>
      <p className="landing-hero__copy">
        Consulte históricos pela página dedicada e encontre oficinas avaliadas por preço, prazo e taxa de retrabalho.
      </p>
      <div className="landing-hero__actions">
        <Link className="landing-button landing-button--primary" to="/consultar">
          Ir para consulta por placa
        </Link>
        <Link className="landing-button landing-button--ghost" to="/oficinas">
          Ver ranking de oficinas
        </Link>
      </div>
    </section>
  );
}
