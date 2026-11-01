import { PageHeader } from "../../../components/layout/PageHeader";
import { StateBlock } from "../../../components/data-display/StateBlock";
import { Textarea } from "../../../components/ui/Textarea";
import { Button } from "../../../components/ui/Button";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listAdminServiceDisputes, reviewServiceDispute } from "../../../lib/api/admin";
import { serviceError, type DisputeRead } from "../../../lib/api/maintenance";
import { PrivateEvidence } from "../../maintenance/components/PrivateEvidence";
export function ServiceDisputesPage() {
    const [items, setItems] = useState<DisputeRead[]>([]);
    const [reasons, setReasons] = useState<Record<number, string>>({});
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [busy, setBusy] = useState(false);
    const load = useCallback(async () => { setLoading(true); try {
        setItems(await listAdminServiceDisputes());
        setError(null);
    }
    catch (e) {
        setError(serviceError(e));
    }
    finally {
        setLoading(false);
    } }, []);
    useEffect(() => { void load(); }, [load]);
    async function decide(item: DisputeRead, resolution: "request_changes" | "reject" | "resolved") {
        setBusy(true);
        setError(null);
        try {
            await reviewServiceDispute(item, resolution, reasons[item.id]);
            await load();
            setMessage("Decisão registrada; reconhecimento do cliente preservado.");
        }
        catch (e) {
            setError(serviceError(e));
        }
        finally {
            setBusy(false);
        }
    }
    return <section className="page-section"><PageHeader title="Contestações de serviços" description="Leia as manifestações e registre a decisão sem substituir o reconhecimento do cliente."/>{error && <p className="message" role="alert">{error} <Button onClick={() => void load()} variant="secondary">Atualizar versão</Button></p>}{message && <p className="message" role="status">{message}</p>}{loading ? <StateBlock kind="loading" title="Carregando..."/> : error ? null : !items.length ? <StateBlock title="Nenhuma contestação aberta." description="Novas contestações de serviços aparecerão aqui."/> : items.map(item => <article className="panel admin-card" key={item.id}><h2>Contestação do atendimento</h2><p>{item.reason}</p><Link to={`/admin/servicos/${item.record_id}`}>Conferir atendimento e versões</Link>{item.messages.map(m => <p key={m.id}>{m.body}</p>)}<PrivateEvidence documents={item.documents}/><div className="admin-decision"><Textarea value={reasons[item.id] ?? ""} onChange={e => setReasons(c => ({ ...c, [item.id]: e.target.value }))} label={<>Justificativa da decisão {item.id}</>}/><div className="action-group"><Button disabled={busy || !reasons[item.id]?.trim()} onClick={() => void decide(item, "request_changes")} variant="secondary">Solicitar correção</Button><Button disabled={busy || !reasons[item.id]?.trim()} onClick={() => void decide(item, "resolved")} variant="danger">Encerrar análise</Button><Button disabled={busy || !reasons[item.id]?.trim()} onClick={() => void decide(item, "reject")} variant="danger">Encerrar como recusado</Button></div></div></article>)}
  </section>;
}
