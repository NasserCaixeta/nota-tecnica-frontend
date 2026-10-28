import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

import { loginBenefits } from "../../../content/auth";
import { getCurrentUser, login } from "../../../lib/api/auth";
import { setStoredToken } from "../../../lib/auth/token-storage";
import { LoginForm, type LoginFormValues } from "../components/LoginForm";
import "./LoginPage.css";

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(values: LoginFormValues) {
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await login(values);
      setStoredToken(response.access_token);
      const user = await getCurrentUser();
      let invitationPending = false;
      try { invitationPending = Boolean(window.sessionStorage.getItem("nota-tecnica.invitation.pending")); } catch { /* Login remains available without browser storage. */ }
      const from: unknown = location.state?.from;
      const destination = typeof from === "string" && from.startsWith("/app/") && !from.includes("\\") ? from : "/app/garagem";
      navigate(invitationPending ? "/convite-servico" : user.participation_status === "approved" ? destination : "/app/participacao");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Não foi possível entrar.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-page__intro" aria-labelledby="login-title">
        <p className="login-page__label">Acesso Nota Técnica</p>
        <h1 id="login-title">Entrar na conta</h1>
        <p>
          Continue de onde parou: garagem, documentos, consulta por placa e perfil de oficina em uma área única.
        </p>
        <div className="login-benefits">
          {loginBenefits.map((benefit, index) => (
            <article className="login-benefit" key={benefit.title}>
              <span className="login-benefit__number">{String(index + 1).padStart(2, "0")}</span>
              <div>
                <h2>{benefit.title}</h2>
                <p>{benefit.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="login-panel" aria-label="Formulário de login">
        <div className="login-panel__header">
          <h2>Credenciais</h2>
          <p>Use o e-mail cadastrado para acessar sua garagem ou área da oficina.</p>
        </div>
        <LoginForm error={error} isSubmitting={isSubmitting} onSubmit={handleSubmit} />
        <p className="login-panel__footer">
          Ainda não tem conta? <Link to="/cadastro">Criar cadastro</Link>
        </p>
      </section>
    </main>
  );
}
