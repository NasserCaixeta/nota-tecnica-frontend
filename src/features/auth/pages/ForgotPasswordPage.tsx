import { PageHeader } from "../../../components/layout/PageHeader";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../../../lib/api/auth";
export function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [busy, setBusy] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    async function submit(event: FormEvent) {
        event.preventDefault();
        setBusy(true);
        setError(null);
        setMessage(null);
        try {
            setMessage((await forgotPassword(email)).message);
        }
        catch (caught) {
            setError(caught instanceof Error ? caught.message : "Não foi possível solicitar recuperação.");
        }
        finally {
            setBusy(false);
        }
    }
    return <section className="page-section standalone-page recovery-page">
    <PageHeader title="Recuperar acesso" description="Solicite um link pessoal para recuperar sua conta."/><p>Informe o e-mail cadastrado. O link pessoal expira em 60 minutos e funciona uma única vez.</p>
    <form className="stack" onSubmit={(event) => void submit(event)}>
      <Input type="email" autoComplete="email" value={email} required onChange={(event) => setEmail(event.target.value)} label="E-mail"/>
      <Button disabled={busy} variant="secondary">Solicitar recuperação</Button>
    </form>
    {message && <p className="message" role="status">{message}</p>}{error && <p className="message" role="alert">{error}</p>}
    <Link to="/entrar">Voltar à entrada</Link>
  </section>;
}
