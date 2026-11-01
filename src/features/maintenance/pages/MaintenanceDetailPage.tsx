import { PageHeader } from "../../../components/layout/PageHeader";
import { Textarea } from "../../../components/ui/Textarea";
import { Input } from "../../../components/ui/Input";
import { Select } from "../../../components/ui/Select";
import { Button } from "../../../components/ui/Button";
import { useCallback, useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { associateServices, listDuplicateCandidates, acknowledgeMaintenance, getMaintenance, issueServiceInvitation, listServiceDocuments, listServiceDisputes, listServiceRevisions, openServiceDispute, replyServiceDispute, serviceError, serviceStatus, submitMaintenance, updateMaintenance, type MaintenanceRecord, type PublishedService, type DisputeRead, type RevisionRead } from "../../../lib/api/maintenance";
import { uploadServiceEvidence, uploadDisputeEvidence, type DocumentRead } from "../../../lib/api/documents";
import { MaintenanceForm } from "../components/MaintenanceForm";
import { PrivateEvidence } from "../components/PrivateEvidence";
import { SessionContext } from "../../../lib/auth/SessionContext";
import { ServiceReviewForm } from "../components/ServiceReviewForm";
import { formatMoney } from "../../../lib/format/money";
export function MaintenanceDetailPage() {
    const { recordId = "" } = useParams();
    const isAdmin = useContext(SessionContext)?.user?.is_admin ?? false;
    const [publishedView, setPublishedView] = useState<PublishedService | null>(null);
    const [record, setRecord] = useState<MaintenanceRecord | null>(null);
    const [documents, setDocuments] = useState<DocumentRead[]>([]);
    const [disputes, setDisputes] = useState<DisputeRead[]>([]);
    const [revisions, setRevisions] = useState<RevisionRead[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [busy, setBusy] = useState(false);
    const [reason, setReason] = useState("");
    const [email, setEmail] = useState("");
    const [invite, setInvite] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [kind, setKind] = useState("invoice");
    const [candidates, setCandidates] = useState<MaintenanceRecord[]>([]);
    const [selectedCandidate, setSelectedCandidate] = useState("");
    const [associationReason, setAssociationReason] = useState("");
    const [associationMessage, setAssociationMessage] = useState("");
    const [editing, setEditing] = useState(false);
    const [responses, setResponses] = useState<Record<number, string>>({});
    const load = useCallback(async () => {
        setError(null);
        try {
            const current = await getMaintenance(recordId);
            if (current.visibility === "published") {
                setPublishedView(current);
                setRecord(null);
                return;
            }
            setPublishedView(null);
            setRecord(current);
            setDocuments(await listServiceDocuments(current.id));
            if (isAdmin || current.permissions.can_edit || current.permissions.can_acknowledge || current.permissions.can_dispute || current.dispute_open) {
                setCandidates(await listDuplicateCandidates(current.id));
                setDisputes(await listServiceDisputes(current.id));
                setRevisions(await listServiceRevisions(current.id));
            }
        }
        catch (e) {
            setError(serviceError(e));
        }
    }, [recordId, isAdmin]);
    useEffect(() => { void load(); }, [load]);
    async function act(action: () => Promise<unknown>) {
        setBusy(true);
        setError(null);
        try {
            await action();
            await load();
        }
        catch (e) {
            setError(serviceError(e));
        }
        finally {
            setBusy(false);
        }
    }
    return <section className="page-section"><PageHeader title="Detalhe do serviço" description="Confira o atendimento, seus comprovantes e o histórico de decisões."/>
    {error && <p className="message" role="alert">{error} <Button onClick={() => void load()} variant="secondary">Atualizar dados</Button></p>}
    {publishedView && <article className="panel stack"><h2>{publishedView.public_description}</h2><p>Histórico publicado</p><p>{publishedView.service_date} · {publishedView.odometer.toLocaleString("pt-BR")} km</p><p>Categoria: {publishedView.category} · Sistema: {publishedView.vehicle_system}</p><p>Oficina: {publishedView.workshop?.trade_name ?? "Não informada"}</p><p>Mão de obra: {formatMoney(Number(publishedView.labor_cost))} · Peças: {formatMoney(Number(publishedView.parts_cost))} · Total: {formatMoney(Number(publishedView.total_cost))}</p></article>}
    {!record ? !error && !publishedView && <p role="status">Carregando...</p> : <>
      <h2>{record.description}</h2><p>{serviceStatus(record)}</p>
      <p>{record.service_date} · {record.odometer.toLocaleString("pt-BR")} km · {formatMoney(Number(record.total_cost))}</p>
      <p>{record.origin === "workshop" ? "Registrado pela oficina" : "Registrado pelo cliente"}</p>
      {record.review_reason && <p>Justificativa da análise: {record.review_reason}</p>}
      {record.superseded_by_id && <Link to={`/app/manutencoes/${record.superseded_by_id}`}>Abrir serviço consolidado</Link>}
      <PrivateEvidence documents={documents}/>
      {record.permissions.can_edit && <><h3>Comprovante do atendimento</h3>
        <p>PDF ou imagem, até 10 MiB. Substituir evidência após envio cria outra versão.</p>
        <Select value={kind} onChange={e => setKind(e.target.value)} label="Tipo do comprovante"><option value="invoice">Nota fiscal</option><option value="service_order">Ordem de serviço</option><option value="payment_receipt">Recibo</option></Select>
        <Input type="file" accept="application/pdf,image/jpeg,image/png,image/webp" onChange={e => setFile(e.target.files?.[0] ?? null)} label="Arquivo do comprovante"/>
        <Button disabled={busy || !file} onClick={() => void act(async () => { await uploadServiceEvidence(record.vehicle_id, record.id, kind, file!); setFile(null); })}>Enviar comprovante</Button>
        <Button disabled={busy} onClick={() => setEditing(!editing)} variant="secondary">Corrigir serviço</Button>
        {editing && <MaintenanceForm key={record.current_revision_id} initial={record} workshop={record.origin === "workshop"} isSubmitting={busy} onSubmit={async (payload) => { await act(() => updateMaintenance(record, payload)); setEditing(false); }}/>}
      </>}
      {record.permissions.can_submit && <Button disabled={busy} onClick={() => void act(() => submitMaintenance(record))}>Enviar para análise</Button>}
      {record.permissions.can_acknowledge && <Button disabled={busy} onClick={() => void act(() => acknowledgeMaintenance(record))}>Confirmar serviço</Button>}
      {record.permissions.can_dispute && <><Textarea value={reason} onChange={e => setReason(e.target.value)} label="Motivo da contestação"/><Button disabled={busy || !reason.trim()} onClick={() => void act(() => openServiceDispute(record, reason))} variant="danger">Contestar serviço</Button></>}
      {record.permissions.can_invite && <section className="panel stack"><h3>Convidar cliente</h3><Input type="email" value={email} onChange={e => setEmail(e.target.value)} label="E-mail do cliente"/><Button disabled={busy || !email.trim()} onClick={() => void act(async () => { const result = await issueServiceInvitation(record, email); setInvite(result.url); })} variant="secondary">Gerar convite</Button>{invite && <><p>Link privado, válido por sete dias. O cliente precisa validar o vínculo e confirmar o serviço.</p><Input aria-label="Link privado do convite" readOnly value={invite}/></>}</section>}
      {!!disputes.length && <section className="panel stack"><h3>Contestações</h3>{disputes.map(d => <article className="panel" key={d.id}><p>{d.reason} · {d.status === "open" ? "Em análise" : "Encerrada"}</p><p>{d.resolution_reason}</p>{d.messages.map(m => <p key={m.id}>{m.body}</p>)}<PrivateEvidence documents={d.documents}/>{d.status === "open" && <><Textarea value={responses[d.id] ?? ""} onChange={e => setResponses(c => ({ ...c, [d.id]: e.target.value }))} label={<>Resposta à contestação {d.id}</>}/><Button disabled={busy || !responses[d.id]?.trim()} onClick={() => void act(() => replyServiceDispute(d.id, responses[d.id]))}>Enviar resposta</Button><Input type="file" accept="application/pdf,image/jpeg,image/png,image/webp" disabled={busy} onChange={e => { const chosen = e.target.files?.[0]; if (chosen)
            void act(() => uploadDisputeEvidence(d.id, chosen)); }} label={<>Evidência da contestação {d.id}</>}/></>}</article>)}</section>}
      {!!candidates.length && <section className="panel stack"><h3>Possível duplicidade</h3><p>São mostrados apenas serviços que você já pode consultar. A associação será analisada pela administração.</p><Select value={selectedCandidate} onChange={e => setSelectedCandidate(e.target.value)} label="Atendimento correspondente"><option value="">Selecione</option>{candidates.map(c => <option value={c.id} key={c.id}>{c.description} · {c.service_date} · {c.origin === "workshop" ? "Oficina" : "Cliente"}</option>)}</Select><Textarea value={associationReason} onChange={e => setAssociationReason(e.target.value)} label="Por que são o mesmo atendimento?"/><Button disabled={busy || !selectedCandidate || !associationReason.trim()} onClick={() => void act(async () => { const candidate = candidates.find(c => c.id === Number(selectedCandidate)); if (candidate) {
            await associateServices(record, candidate, associationReason);
            setAssociationMessage("Sugestão enviada para análise; os serviços ainda não foram mesclados.");
        } })}>Sugerir associação</Button>{associationMessage && <p role="status">{associationMessage}</p>}</section>}
      {record.permissions.can_review && <ServiceReviewForm key={record.current_revision_id} record={record}/>}
      {!!revisions.length && <details className="panel stack"><summary>Histórico de versões</summary>{revisions.map(r => <article key={r.id}><h3>Versão {r.revision_number}</h3><p>{r.snapshot.description} · {r.snapshot.service_date} · Mão de obra: {r.snapshot.labor_cost} · Peças: {r.snapshot.parts_cost}</p><p>{r.admin_status} · {r.customer_acknowledgement}</p></article>)}</details>}
    </>}
  </section>;
}
