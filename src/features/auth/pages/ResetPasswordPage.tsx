import { useEffect, useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { resetPassword } from "../../../lib/api/auth";
import { clearStoredToken } from "../../../lib/auth/token-storage";

export function ResetPasswordPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [token] = useState(() => location.hash.slice(1));
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => { if (location.hash) navigate(location.pathname, { replace: true }); }, [location.hash, location.pathname, navigate]);
  async function submit(event: FormEvent) {
    event.preventDefault(); setError(null);
    if (password !== confirmation) { setError("As senhas precisam ser iguais."); return; }
    setBusy(true);
    try { const response = await resetPassword(token, password); clearStoredToken(); setMessage(response.message); setPassword(""); setConfirmation(""); }
    catch (caught) { setError(caught instanceof Error ? caught.message : "Não foi possível alterar a senha."); }
    finally { setBusy(false); }
  }
  return <section className="page-section">
    <h1>Escolher nova senha</h1>
    {!token ? <p role="alert">Abra o link pessoal recebido por e-mail. Se expirou, solicite outro.</p> : !message && <form className="stack" onSubmit={(event) => void submit(event)}>
      <label>Nova senha<input type="password" autoComplete="new-password" minLength={8} maxLength={128} required value={password} onChange={(event) => setPassword(event.target.value)} /></label>
      <label>Confirme a nova senha<input type="password" autoComplete="new-password" minLength={8} maxLength={128} required value={confirmation} onChange={(event) => setConfirmation(event.target.value)} /></label>
      <button disabled={busy}>Alterar senha</button>
    </form>}
    {message && <p role="status">{message}</p>}{error && <p role="alert">{error}</p>}
    <p><Link to="/entrar">Entrar com a nova senha</Link></p><Link to="/esqueci-senha">Solicitar outro link de recuperação</Link>
  </section>;
}
