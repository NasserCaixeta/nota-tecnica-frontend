import { landingSteps } from "../../../../content/landing";

export function HowItWorksSection() {
  return (
    <section className="landing-section" id="como-funciona">
      <p className="landing-section__label">Como funciona</p>
      <h2>Três passos.</h2>
      <div className="landing-steps">
        {landingSteps.map((step) => (
          <article className="landing-step" key={step.number}>
            <p className="landing-step__number">{step.number}</p>
            <h3>{step.title}</h3>
            <p>{step.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
