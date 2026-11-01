import { PageHeader } from "../../../components/layout/PageHeader";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
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
    useEffect(() => { if (location.hash)
        navigate(location.pathname, { replace: true }); }, [location.hash, location.pathname, navigate]);
    async function submit(event: FormEvent) {
        event.preventDefault();
        setError(null);
        if (password !== confirmation) {
            setError("As senhas precisam ser iguais.");
            return;
        }
        setBusy(true);
        try {
            const response = await resetPassword(token, password);
            clearStoredToken();
            setMessage(response.message);
            setPassword("");
            setConfirmation("");
        }
        catch (caught) {
            setError(caught instanceof Error ? caught.message : "Não foi possível alterar a senha.");
        }
        finally {
            setBusy(false);
        }
    }
    return <section className="page-section standalone-page recovery-page">
    <PageHeader title="Escolher nova senha" description="Defina uma senha para voltar a acessar sua conta."/>
    {!token ? <p className="message" role="alert">Abra o link pessoal recebido por e-mail. Se expirou, solicite outro.</p> : !message && <form className="stack" onSubmit={(event) => void submit(event)}>
      <Input type="password" autoComplete="new-password" minLength={8} maxLength={128} required value={password} onChange={(event) => setPassword(event.target.value)} label="Nova senha"/>
      <Input type="password" autoComplete="new-password" minLength={8} maxLength={128} required value={confirmation} onChange={(event) => setConfirmation(event.target.value)} label="Confirme a nova senha"/>
      <Button disabled={busy}>Alterar senha</Button>
    </form>}
    {message && <p className="message" role="status">{message}</p>}{error && <p className="message" role="alert">{error}</p>}
    <p><Link to="/entrar">Entrar com a nova senha</Link></p><Link to="/esqueci-senha">Solicitar outro link de recuperação</Link>
  </section>;
}
