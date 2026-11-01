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
        <em>Serviços comprovados.</em>
      </h1>
      <p className="landing-hero__copy">
        Consulte históricos e compare oficinas pela avaliação dos clientes, cumprimento de prazos e volume de serviços comprovados. Cada nota informa sua amostra.
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
