import { PageHeader } from "../../../components/layout/PageHeader";
import { StateBlock } from "../../../components/data-display/StateBlock";
import { Textarea } from "../../../components/ui/Textarea";
import { Button } from "../../../components/ui/Button";
import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getMaintenanceReview, listMaintenanceReviews, reviewMaintenance, type MaintenanceReviewDetail } from "../../../lib/api/admin";
import { serviceError, serviceStatus, type MaintenanceRecord } from "../../../lib/api/maintenance";
import { PrivateEvidence } from "../../maintenance/components/PrivateEvidence";
export function MaintenanceReviewPage() {
    const { recordId } = useParams();
    const [items, setItems] = useState<MaintenanceRecord[]>([]);
    const [record, setRecord] = useState<MaintenanceReviewDetail | null>(null);
    const [reason, setReason] = useState("");
    const [publicDescription, setPublicDescription] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [busy, setBusy] = useState(false);
    const load = useCallback(async () => { setLoading(true); try {
        if (recordId)
            setRecord(await getMaintenanceReview(recordId));
        else
            setItems(await listMaintenanceReviews());
        setError(null);
    }
    catch (e) {
        setError(serviceError(e));
    }
    finally {
        setLoading(false);
    } }, [recordId]);
    useEffect(() => { void load(); }, [load]);
    async function decide(decision: "approved" | "rejected" | "changes_requested") {
        if (!record)
            return;
        setBusy(true);
        setError(null);
        setMessage("");
        try {
            await reviewMaintenance(record, decision, reason, publicDescription);
            await load();
            setMessage(decision === "approved" ? "Análise aprovada." : "Decisão registrada.");
        }
        catch (e) {
            setError(serviceError(e));
        }
        finally {
            setBusy(false);
        }
    }
    return <section className="page-section"><PageHeader title="Análise de serviços" description="Confira o atendimento, os comprovantes e a descrição pública antes de decidir."/>{error && <p className="message" role="alert">{error} <Button onClick={() => void load()} variant="secondary">Atualizar versão</Button></p>}{message && <p className="message" role="status">{message}</p>}
    {loading ? <StateBlock kind="loading" title="Carregando..."/> : recordId && record ? <>
      <div className="panel stack"><h2>{record.description}</h2><p>{serviceStatus(record)}</p><p>Data: {record.service_date} · {record.odometer} km · Mão de obra: {record.labor_cost} · Peças: {record.parts_cost}</p><Link to={`/app/manutencoes/${record.id}`}>Abrir histórico privado de versões e contestações</Link></div><div className="panel stack">
      <Textarea value={reason} onChange={e => setReason(e.target.value)} label="Justificativa"/>
      <PrivateEvidence documents={record.documents} review reason={reason} onChange={load}/>
      <Textarea value={publicDescription} onChange={e => setPublicDescription(e.target.value)} label="Descrição pública revisada"/><p>Remova nomes, contatos, documentos pessoais e demais dados privados.</p>
      <Button disabled={busy || !reason.trim() || !publicDescription.trim() || !record.documents.some(d => d.storage_verified && d.review_status === "approved")} onClick={() => void decide("approved")}>Aprovar serviço</Button>
      <Button disabled={busy || !reason.trim()} onClick={() => void decide("changes_requested")} variant="secondary">Solicitar correção</Button>
      <Button disabled={busy || !reason.trim()} onClick={() => void decide("rejected")} variant="danger">Recusar serviço</Button></div>
    </> : error ? null : !items.length ? <StateBlock title="Nenhum serviço aguardando análise." description="Os atendimentos enviados para moderação aparecerão nesta fila."/> : items.map(item => <article className="panel data-row" key={item.id}><Link to={`/admin/servicos/${item.id}`}>{item.description}</Link> · {serviceStatus(item)}</article>)}
  </section>;
}
