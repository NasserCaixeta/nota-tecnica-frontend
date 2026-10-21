import { useCallback, useEffect, useState } from "react";
import { listParticipants, reviewParticipant, setAdminAccess } from "../../../lib/api/participants";
import type { ParticipationStatus, UserRead } from "../../../lib/api/types";
import { useSession } from "../../../lib/auth/SessionContext";

export function ParticipantQueuePage() {
  const { user } = useSession();
  const [items, setItems] = useState<UserRead[]>([]);
  const [filter, setFilter] = useState<ParticipationStatus>("pending");
  const [reasons, setReasons] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try { setItems(await listParticipants(filter)); }
    catch { setError("Não foi possível carregar os participantes."); }
    finally { setLoading(false); }
  }, [filter]);
  useEffect(() => { void load(); }, [load]);
  async function decide(item: UserRead, action: ParticipationStatus | "toggle_admin") {
    setBusy(item.id); setError(null);
    try {
      if (action === "toggle_admin") await setAdminAccess(item.id, !item.is_admin, reasons[item.id] ?? "");
      else await reviewParticipant(item.id, action, item.participation_version, reasons[item.id] ?? "");
      await load();
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Não foi possível salvar a decisão."); }
    finally { setBusy(null); }
  }
  return <section className="page-section">
    <h1>Participantes do piloto</h1>
    <label>Situação<select value={filter} onChange={event => setFilter(event.target.value as ParticipationStatus)}>
      <option value="pending">Pendentes</option><option value="approved">Aprovados</option>
      <option value="rejected">Recusados</option><option value="suspended">Suspensos</option>
    </select></label>
    {error && <p role="alert">{error} <button onClick={() => void load()}>Atualizar fila</button></p>}
    {loading ? <p role="status">Carregando participantes...</p> : items.length === 0 ? <p>Nenhum participante nesta fila.</p> : items.map(item => <article className="panel" key={item.id}>
      <h2>{item.full_name}</h2><p>{item.email} · {item.city}/{item.state}</p>
      {item.participation_reason && <p>{item.participation_reason}</p>}
      <label>Justificativa para {item.full_name}<input value={reasons[item.id] ?? ""} onChange={event => setReasons(current => ({ ...current, [item.id]: event.target.value }))} /></label>
      {([['approved', 'Aprovar'], ['rejected', 'Recusar'], ['suspended', 'Suspender']] as const).map(([decision, label]) => <button key={decision} disabled={busy !== null || item.id === user?.id || !reasons[item.id]?.trim()} onClick={() => void decide(item, decision)}>{label} {item.full_name}</button>)}
      {item.participation_status === "approved" && <button disabled={busy !== null || !reasons[item.id]?.trim()} onClick={() => void decide(item, "toggle_admin")}>{item.is_admin ? "Remover acesso administrativo" : "Conceder acesso administrativo"}</button>}
    </article>)}
  </section>;
}
