import { useCallback, useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { associateServices, listDuplicateCandidates, acknowledgeMaintenance, getMaintenance, issueServiceInvitation, listServiceDocuments, listServiceDisputes, listServiceRevisions, openServiceDispute, replyServiceDispute, serviceError, serviceStatus, submitMaintenance, updateMaintenance, type MaintenanceRecord, type DisputeRead, type RevisionRead } from "../../../lib/api/maintenance";
import { uploadServiceEvidence, uploadDisputeEvidence, type DocumentRead } from "../../../lib/api/documents";
import { MaintenanceForm } from "../components/MaintenanceForm";
import { PrivateEvidence } from "../components/PrivateEvidence";
import { SessionContext } from "../../../lib/auth/SessionContext";
import { formatMoney } from "../../../lib/format/money";
export function MaintenanceDetailPage() {
  const { recordId = "" } = useParams();
  const isAdmin = useContext(SessionContext)?.user?.is_admin ?? false;
  const [record, setRecord] = useState<MaintenanceRecord | null>(null); const [documents, setDocuments] = useState<DocumentRead[]>([]);
  const [disputes, setDisputes] = useState<DisputeRead[]>([]); const [revisions, setRevisions] = useState<RevisionRead[]>([]);
  const [error, setError] = useState<string | null>(null); const [busy, setBusy] = useState(false);
  const [reason, setReason] = useState(""); const [email, setEmail] = useState(""); const [invite, setInvite] = useState("");
  const [file, setFile] = useState<File | null>(null); const [kind, setKind] = useState("invoice");
  const [candidates, setCandidates] = useState<MaintenanceRecord[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState(""); const [associationReason, setAssociationReason] = useState(""); const [associationMessage, setAssociationMessage] = useState("");
  const [editing, setEditing] = useState(false); const [responses, setResponses] = useState<Record<number, string>>({});
  const load = useCallback(async () => {
    setError(null);
    try {
      const current = await getMaintenance(recordId); setRecord(current);
      setDocuments(await listServiceDocuments(current.id));
      if (isAdmin || current.permissions.can_edit || current.permissions.can_acknowledge || current.permissions.can_dispute || current.dispute_open) {
        setCandidates(await listDuplicateCandidates(current.id));
        setDisputes(await listServiceDisputes(current.id)); setRevisions(await listServiceRevisions(current.id));
      }
    } catch (e) { setError(serviceError(e)); }
  }, [recordId, isAdmin]);
  useEffect(() => { void load(); }, [load]);
  async function act(action: () => Promise<unknown>) {
    setBusy(true); setError(null);
    try { await action(); await load(); } catch (e) { setError(serviceError(e)); } finally { setBusy(false); }
  }
  return <section className="page-section"><h1>Detalhe do serviço</h1>
    {error && <p role="alert">{error} <button onClick={() => void load()}>Atualizar dados</button></p>}
    {!record ? !error && <p role="status">Carregando...</p> : <>
      <h2>{record.description}</h2><p>{serviceStatus(record)}</p>
      <p>{record.service_date} · {record.odometer.toLocaleString("pt-BR")} km · {formatMoney(Number(record.total_cost))}</p>
      <p>{record.origin === "workshop" ? "Registrado pela oficina" : "Registrado pelo cliente"}</p>
      {record.review_reason && <p>Justificativa da análise: {record.review_reason}</p>}
      {record.superseded_by_id && <Link to={`/app/manutencoes/${record.superseded_by_id}`}>Abrir serviço consolidado</Link>}
      <PrivateEvidence documents={documents} />
      {record.permissions.can_edit && <><h3>Comprovante do atendimento</h3>
        <p>PDF ou imagem, até 10 MiB. Substituir evidência após envio cria outra versão.</p>
        <label>Tipo do comprovante<select value={kind} onChange={e => setKind(e.target.value)}><option value="invoice">Nota fiscal</option><option value="service_order">Ordem de serviço</option><option value="payment_receipt">Recibo</option></select></label>
        <label>Arquivo do comprovante<input type="file" accept="application/pdf,image/jpeg,image/png,image/webp" onChange={e => setFile(e.target.files?.[0] ?? null)} /></label>
        <button disabled={busy || !file} onClick={() => void act(async () => { await uploadServiceEvidence(record.vehicle_id, record.id, kind, file!); setFile(null); })}>Enviar comprovante</button>
        <button disabled={busy} onClick={() => setEditing(!editing)}>Corrigir serviço</button>
        {editing && <MaintenanceForm key={record.current_revision_id} initial={record} workshop={record.origin === "workshop"} isSubmitting={busy} onSubmit={async payload => { await act(() => updateMaintenance(record, payload)); setEditing(false); }} />}
      </>}
      {record.permissions.can_submit && <button disabled={busy || !documents.some(d => d.storage_verified)} onClick={() => void act(() => submitMaintenance(record))}>Enviar para análise</button>}
      {record.permissions.can_acknowledge && <button disabled={busy} onClick={() => void act(() => acknowledgeMaintenance(record))}>Confirmar serviço</button>}
      {record.permissions.can_dispute && <><label>Motivo da contestação<textarea value={reason} onChange={e => setReason(e.target.value)} /></label><button disabled={busy || !reason.trim()} onClick={() => void act(() => openServiceDispute(record, reason))}>Contestar serviço</button></>}
      {record.permissions.can_invite && <section><h3>Convidar cliente</h3><label>E-mail do cliente<input type="email" value={email} onChange={e => setEmail(e.target.value)} /></label><button disabled={busy || !email.trim()} onClick={() => void act(async () => { const result = await issueServiceInvitation(record, email); setInvite(result.url); })}>Gerar convite</button>{invite && <><p>Link privado, válido por sete dias. O cliente precisa validar o vínculo e confirmar o serviço.</p><input aria-label="Link privado do convite" readOnly value={invite} /></>}</section>}
      {!!disputes.length && <section><h3>Contestações</h3>{disputes.map(d => <article className="panel" key={d.id}><p>{d.reason} · {d.status === "open" ? "Em análise" : "Encerrada"}</p><p>{d.resolution_reason}</p>{d.messages.map(m => <p key={m.id}>{m.body}</p>)}<PrivateEvidence documents={d.documents} />{d.status === "open" && <><label>Resposta à contestação {d.id}<textarea value={responses[d.id] ?? ""} onChange={e => setResponses(c => ({ ...c, [d.id]: e.target.value }))} /></label><button disabled={busy || !responses[d.id]?.trim()} onClick={() => void act(() => replyServiceDispute(d.id, responses[d.id]))}>Enviar resposta</button><label>Evidência da contestação {d.id}<input type="file" accept="application/pdf,image/jpeg,image/png,image/webp" disabled={busy} onChange={e => { const chosen = e.target.files?.[0]; if (chosen) void act(() => uploadDisputeEvidence(d.id, chosen)); }} /></label></>}</article>)}</section>}
      {!!candidates.length && <section><h3>Possível duplicidade</h3><p>São mostrados apenas serviços que você já pode consultar. A associação será analisada pela administração.</p><label>Atendimento correspondente<select value={selectedCandidate} onChange={e => setSelectedCandidate(e.target.value)}><option value="">Selecione</option>{candidates.map(c => <option value={c.id} key={c.id}>{c.description} · {c.service_date} · {c.origin === "workshop" ? "Oficina" : "Cliente"}</option>)}</select></label><label>Por que são o mesmo atendimento?<textarea value={associationReason} onChange={e => setAssociationReason(e.target.value)} /></label><button disabled={busy || !selectedCandidate || !associationReason.trim()} onClick={() => void act(async () => { const candidate = candidates.find(c => c.id === Number(selectedCandidate)); if (candidate) { await associateServices(record, candidate, associationReason); setAssociationMessage("Sugestão enviada para análise; os serviços ainda não foram mesclados."); } })}>Sugerir associação</button>{associationMessage && <p role="status">{associationMessage}</p>}</section>}
      {!!revisions.length && <details><summary>Histórico de versões</summary>{revisions.map(r => <article key={r.id}><h3>Versão {r.revision_number}</h3><p>{r.snapshot.description} · {r.snapshot.service_date} · Mão de obra: {r.snapshot.labor_cost} · Peças: {r.snapshot.parts_cost}</p><p>{r.admin_status} · {r.customer_acknowledgement}</p></article>)}</details>}
    </>}
  </section>;
}
