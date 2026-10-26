import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getMaintenanceReview, listMaintenanceReviews, reviewMaintenance, type MaintenanceReviewDetail } from "../../../lib/api/admin";
import { serviceError, serviceStatus, type MaintenanceRecord } from "../../../lib/api/maintenance";
import { PrivateEvidence } from "../../maintenance/components/PrivateEvidence";
export function MaintenanceReviewPage() {
  const { recordId } = useParams(); const [items, setItems] = useState<MaintenanceRecord[]>([]); const [record, setRecord] = useState<MaintenanceReviewDetail | null>(null); const [reason, setReason] = useState(""); const [publicDescription, setPublicDescription] = useState(""); const [error, setError] = useState<string | null>(null); const [message, setMessage] = useState(""); const [loading, setLoading] = useState(true); const [busy, setBusy] = useState(false);
  const load = useCallback(async () => { setLoading(true); try { if (recordId) setRecord(await getMaintenanceReview(recordId)); else setItems(await listMaintenanceReviews()); setError(null); } catch (e) { setError(serviceError(e)); } finally { setLoading(false); } }, [recordId]);
  useEffect(() => { void load(); }, [load]);
  async function decide(decision: "approved" | "rejected" | "changes_requested") {
    if (!record) return; setBusy(true); setError(null); setMessage("");
    try { await reviewMaintenance(record, decision, reason, publicDescription); await load(); setMessage(decision === "approved" ? "Análise aprovada." : "Decisão registrada."); } catch (e) { setError(serviceError(e)); } finally { setBusy(false); }
  }
  return <section className="page-section"><h1>Análise de serviços</h1>{error && <p role="alert">{error} <button onClick={() => void load()}>Atualizar versão</button></p>}{message && <p role="status">{message}</p>}
    {loading ? <p role="status">Carregando...</p> : recordId && record ? <>
      <h2>{record.description}</h2><p>{serviceStatus(record)}</p><p>Data: {record.service_date} · {record.odometer} km · Mão de obra: {record.labor_cost} · Peças: {record.parts_cost}</p><Link to={`/app/manutencoes/${record.id}`}>Abrir histórico privado de versões e contestações</Link>
      <label>Justificativa<textarea value={reason} onChange={e => setReason(e.target.value)} /></label>
      <PrivateEvidence documents={record.documents} review reason={reason} onChange={load} />
      <label>Descrição pública revisada<textarea value={publicDescription} onChange={e => setPublicDescription(e.target.value)} /></label><p>Remova nomes, contatos, documentos pessoais e demais dados privados.</p>
      <button disabled={busy || !reason.trim() || !publicDescription.trim() || !record.documents.some(d => d.storage_verified && d.review_status === "approved")} onClick={() => void decide("approved")}>Aprovar serviço</button>
      <button disabled={busy || !reason.trim()} onClick={() => void decide("changes_requested")}>Solicitar correção</button>
      <button disabled={busy || !reason.trim()} onClick={() => void decide("rejected")}>Recusar serviço</button>
    </> : !items.length ? <p>Nenhum serviço aguardando análise.</p> : items.map(item => <p key={item.id}><Link to={`/admin/servicos/${item.id}`}>{item.description}</Link> · {serviceStatus(item)}</p>)}
  </section>;
}
