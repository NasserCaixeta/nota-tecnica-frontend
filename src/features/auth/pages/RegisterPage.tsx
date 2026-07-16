import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { registerBenefits } from "../../../content/auth";
import { registerUser } from "../../../lib/api/auth";
import { RegisterForm } from "../components/RegisterForm";
import "./RegisterPage.css";

export function RegisterPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(values: Record<string, unknown>) {
    setIsSubmitting(true);
    setError(null);
    try {
      await registerUser(values);
      navigate("/entrar");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Não foi possível criar a conta.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="register-page">
      <section className="register-page__intro" aria-labelledby="register-title">
        <p className="register-page__label">Conta Nota Técnica</p>
        <h1 id="register-title">Criar conta</h1>
        <p>
          Comece com um cadastro único para consultar histórico, validar sua garagem ou preparar o perfil público da
          sua oficina.
        </p>
        <div className="register-benefits">
          {registerBenefits.map((benefit, index) => (
            <article className="register-benefit" key={benefit.title}>
              <span className="register-benefit__number">{String(index + 1).padStart(2, "0")}</span>
              <div>
                <h2>{benefit.title}</h2>
                <p>{benefit.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="register-panel" aria-label="Formulário de cadastro">
        <div className="register-panel__header">
          <div>
            <h2>Dados da conta</h2>
            <p>Informe os dados básicos. A validação de veículo ou oficina acontece depois.</p>
          </div>
          <p className="register-page__login">
            Já tem conta? <Link to="/entrar">Entrar</Link>
          </p>
        </div>
        {error ? (
          <p className="register-page__error" role="alert">
            {error}
          </p>
        ) : null}
        <RegisterForm isSubmitting={isSubmitting} onSubmit={handleSubmit} />
      </section>
    </main>
  );
}
