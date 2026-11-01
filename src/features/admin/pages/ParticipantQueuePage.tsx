import { StatusPill } from "../../../components/ui/StatusPill";
import { participationStatusLabels } from "../../../content/status-labels";
import { PageHeader } from "../../../components/layout/PageHeader";
import { StateBlock } from "../../../components/data-display/StateBlock";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import { Select } from "../../../components/ui/Select";
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
        setLoading(true);
        setError(null);
        try {
            setItems(await listParticipants(filter));
        }
        catch {
            setError("Não foi possível carregar os participantes.");
        }
        finally {
            setLoading(false);
        }
    }, [filter]);
    useEffect(() => { void load(); }, [load]);
    async function decide(item: UserRead, action: ParticipationStatus | "toggle_admin") {
        setBusy(item.id);
        setError(null);
        try {
            if (action === "toggle_admin")
                await setAdminAccess(item.id, !item.is_admin, reasons[item.id] ?? "");
            else
                await reviewParticipant(item.id, action, item.participation_version, reasons[item.id] ?? "");
            await load();
        }
        catch (caught) {
            setError(caught instanceof Error ? caught.message : "Não foi possível salvar a decisão.");
        }
        finally {
            setBusy(null);
        }
    }
    return <section className="page-section">
    <PageHeader title="Participantes do piloto" description="Analise cadastros, acompanhe a participação e gerencie os acessos administrativos."/>
    <div className="admin-toolbar"><Select value={filter} onChange={event => setFilter(event.target.value as ParticipationStatus)} label="Situação">
      <option value="pending">Pendentes</option><option value="approved">Aprovados</option>
      <option value="rejected">Recusados</option><option value="suspended">Suspensos</option>
    </Select><span className="admin-toolbar__count">{loading?"Consultando fila…":`${items.length} participante(s) carregado(s)`}</span></div>
    {error && <p role="alert">{error} <Button onClick={() => void load()} variant="secondary">Atualizar fila</Button></p>}
    {loading ? <StateBlock kind="loading" title="Carregando participantes..."/> : error ? null : items.length === 0 ? <StateBlock title="Nenhum participante nesta fila." description="Os cadastros desta situação aparecerão aqui para análise."/> : items.map(item => <article className="panel admin-card" key={item.id}>
      <header className="admin-card__heading"><div><h2>{item.full_name}</h2><p className="admin-card__meta">{item.email} · {item.city}/{item.state}</p></div><StatusPill tone={item.participation_status==="approved"?"success":item.participation_status==="pending"?"warning":"danger"}>{participationStatusLabels[item.participation_status]}</StatusPill></header>
      {item.participation_reason && <p>{item.participation_reason}</p>}
      <Input value={reasons[item.id] ?? ""} onChange={event => setReasons(current => ({ ...current, [item.id]: event.target.value }))} label={<>Justificativa para {item.full_name}</>}/>
      <div className="action-group">{([['approved', 'Aprovar'], ['rejected', 'Recusar'], ['suspended', 'Suspender']] as const).map(([decision, label]) => <Button key={decision} variant={decision==="approved"?"primary":"danger"} aria-label={`${label} ${item.full_name}`} disabled={busy !== null || item.id === user?.id || !reasons[item.id]?.trim()} onClick={() => void decide(item, decision)}>{label}</Button>)}</div>
      {item.participation_status === "approved" && <Button disabled={busy !== null || !reasons[item.id]?.trim()} onClick={() => void decide(item, "toggle_admin")} variant={item.is_admin?"danger":"secondary"}>{item.is_admin ? "Remover acesso administrativo" : "Conceder acesso administrativo"}</Button>}
    </article>)}
  </section>;
}
