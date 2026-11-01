import { PageHeader } from "../../../components/layout/PageHeader";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useSession } from "../../../lib/auth/SessionContext";
import { apiRequest } from "../../../lib/api/client";
import type { UserRead } from "../../../lib/api/types";
const labels = { pending: "Aguardando aprovação", approved: "Participação aprovada", rejected: "Solicitação recusada", suspended: "Participação suspensa" };
export function PilotStatusPage() {
    const { user, refresh, logout } = useSession();
    const [message, setMessage] = useState<string | null>(null);
    const [error,setError]=useState<string|null>(null);
    if (!user)
        return null;
    async function save(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();setError(null);setMessage(null);
        const form = new FormData(event.currentTarget);
        try {
            await apiRequest<UserRead>("/users/me", { method: "PATCH", body: JSON.stringify({
                    full_name: form.get("full_name"), phone: form.get("phone"),
                    city: form.get("city"), state: form.get("state"),
                }) });
            await refresh();
            setMessage("Perfil atualizado.");
        }
        catch {
            setError("Não foi possível atualizar o perfil.");
        }
    }
    async function resubmit() {setError(null);setMessage(null);
        try {
            await apiRequest("/users/me/resubmit-participation", { method: "POST" });
            await refresh();
            setMessage("Solicitação reenviada para análise.");
        }
        catch {
            setError("Não foi possível reenviar. Atualize a situação e tente novamente.");
        }
    }
    return <section className="page-section standalone-page">
    <PageHeader title="Participação no piloto" description="Acompanhe a análise do seu cadastro e mantenha seus dados atualizados."/><p>{labels[user.participation_status]}</p>
    {user.participation_reason && <p>{user.participation_reason}</p>}
    {user.participation_status === "approved" ? <Link to="/app/garagem">Abrir garagem</Link> : <p>Um administrador analisará seu cadastro. Você pode completar seu perfil enquanto aguarda.</p>}
    <form className="stack" onSubmit={save}>
      <Input name="full_name" defaultValue={user.full_name} required label="Nome completo"/>
      <Input name="phone" defaultValue={user.phone ?? ""} required label="Telefone"/>
      <Input name="city" defaultValue={user.city} required label="Cidade"/>
      <Input name="state" defaultValue={user.state} minLength={2} maxLength={2} required label="UF"/>
      <Button type="submit">Salvar perfil</Button>
    </form>
    {message && <p className="message" role="status">{message}</p>}{error&&<p className="message" role="alert">{error}</p>}
    {user.participation_status === "rejected" && <Button type="button" onClick={() => void resubmit()}>Reenviar solicitação</Button>}
    <Button type="button" onClick={() => void refresh()} variant="secondary">Atualizar situação</Button>
    <Button variant="ghost" type="button" onClick={logout}>Sair</Button>
  </section>;
}
