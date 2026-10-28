import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../../../lib/api/auth";

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  async function submit(event: FormEvent) {
    event.preventDefault(); setBusy(true); setError(null); setMessage(null);
    try { setMessage((await forgotPassword(email)).message); }
    catch (caught) { setError(caught instanceof Error ? caught.message : "Não foi possível solicitar recuperação."); }
    finally { setBusy(false); }
  }
  return <section className="page-section">
    <h1>Recuperar acesso</h1><p>Informe o e-mail cadastrado. O link pessoal expira em 60 minutos e funciona uma única vez.</p>
    <form className="stack" onSubmit={(event) => void submit(event)}>
      <label>E-mail<input type="email" autoComplete="email" value={email} required onChange={(event) => setEmail(event.target.value)} /></label>
      <button disabled={busy}>Solicitar recuperação</button>
    </form>
    {message && <p role="status">{message}</p>}{error && <p role="alert">{error}</p>}
    <Link to="/entrar">Voltar à entrada</Link>
  </section>;
}
