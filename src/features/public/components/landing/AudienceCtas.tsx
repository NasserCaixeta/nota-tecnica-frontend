import { Link } from "react-router-dom";

export function AudienceCtas() {
  return (
    <section className="landing-ctas">
      <article>
        <p className="landing-section__label">Para donos e compradores</p>
        <h2>Antes de comprar um usado, veja o que já foi feito no carro.</h2>
        <p>Histórico vinculado à placa. Sem depender do vendedor.</p>
        <Link className="landing-button landing-button--primary" to="/consultar">
          Consultar placa
        </Link>
      </article>
      <article>
        <p className="landing-section__label">Para oficinas</p>
        <h2>Seja ranqueado por quem realmente entrega.</h2>
        <p>Cadastre sua oficina e apareça para clientes que buscam por dados, não por indicação.</p>
        <Link className="landing-button landing-button--ghost" to="/cadastro">
          Cadastrar minha oficina
        </Link>
      </article>
    </section>
  );
}
