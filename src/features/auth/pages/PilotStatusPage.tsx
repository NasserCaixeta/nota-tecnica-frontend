import { useState } from "react";
import { Link } from "react-router-dom";
import { useSession } from "../../../lib/auth/SessionContext";
import { apiRequest } from "../../../lib/api/client";
import type { UserRead } from "../../../lib/api/types";
const labels = { pending: "Aguardando aprovação", approved: "Participação aprovada", rejected: "Solicitação recusada", suspended: "Participação suspensa" };
export function PilotStatusPage() {
  const { user, refresh, logout } = useSession();
  const [message, setMessage] = useState<string | null>(null);
  if (!user) return null;
  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    try {
      await apiRequest<UserRead>("/users/me", { method: "PATCH", body: JSON.stringify({
        full_name: form.get("full_name"), phone: form.get("phone"),
        city: form.get("city"), state: form.get("state"),
      }) });
      await refresh(); setMessage("Perfil atualizado.");
    } catch { setMessage("Não foi possível atualizar o perfil."); }
  }
  async function resubmit() {
    try {
      await apiRequest("/users/me/resubmit-participation", { method: "POST" });
      await refresh(); setMessage("Solicitação reenviada para análise.");
    } catch { setMessage("Não foi possível reenviar. Atualize a situação e tente novamente."); }
  }
  return <section className="page-section">
    <h1>Participação no piloto</h1><p>{labels[user.participation_status]}</p>
    {user.participation_reason && <p>{user.participation_reason}</p>}
    {user.participation_status === "approved" ? <Link to="/app/garagem">Abrir garagem</Link> : <p>Um administrador analisará seu cadastro. Você pode completar seu perfil enquanto aguarda.</p>}
    <form className="stack" onSubmit={save}>
      <label>Nome completo<input name="full_name" defaultValue={user.full_name} required /></label>
      <label>Telefone<input name="phone" defaultValue={user.phone ?? ""} required /></label>
      <label>Cidade<input name="city" defaultValue={user.city} required /></label>
      <label>UF<input name="state" defaultValue={user.state} minLength={2} maxLength={2} required /></label>
      <button type="submit">Salvar perfil</button>
    </form>
    {message && <p role="status">{message}</p>}
    {user.participation_status === "rejected" && <button type="button" onClick={() => void resubmit()}>Reenviar solicitação</button>}
    <button type="button" onClick={() => void refresh()}>Atualizar situação</button>
    <button type="button" onClick={logout}>Sair</button>
  </section>;
}
