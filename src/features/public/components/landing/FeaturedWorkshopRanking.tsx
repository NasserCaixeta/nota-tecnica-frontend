import { Link } from "react-router-dom";

import { featuredWorkshops } from "../../../../content/landing";

export function FeaturedWorkshopRanking() {
  return (
    <section className="landing-section" id="ranking">
      <div className="landing-section__heading">
        <div>
          <p className="landing-section__label">Oficinas em destaque</p>
          <h2>Ranqueadas por performance real.</h2>
        </div>
        <Link to="/oficinas">Ver ranking completo</Link>
      </div>
      <div className="workshop-ranking">
        {featuredWorkshops.map((workshop) => (
          <article className="workshop-ranking__item" key={workshop.name}>
            <div className="workshop-ranking__main">
              <h3>{workshop.name}</h3>
              <p>
                {workshop.city}
                <span>{workshop.services} serviços</span>
              </p>
              <div className="workshop-ranking__tags">
                {workshop.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </div>
            <dl className="workshop-ranking__metrics">
              <div>
                <dt>Prazo</dt>
                <dd>{workshop.onTimeRate}</dd>
              </div>
              <div>
                <dt>Retrabalho</dt>
                <dd>{workshop.reworkRate}</dd>
              </div>
            </dl>
            <strong className="workshop-ranking__score">{workshop.score}</strong>
          </article>
        ))}
      </div>
    </section>
  );
}
