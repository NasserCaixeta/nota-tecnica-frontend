import { PageHeader } from "../../../components/layout/PageHeader";
import { StateBlock } from "../../../components/data-display/StateBlock";
import { Textarea } from "../../../components/ui/Textarea";
import { Select } from "../../../components/ui/Select";
import { Button } from "../../../components/ui/Button";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../../../lib/api/client";
import { associateServices, serviceError, type MaintenanceRecord } from "../../../lib/api/maintenance";
type Proposal = {
    id: number;
    reason: string;
    record: MaintenanceRecord;
    other_record: MaintenanceRecord;
};
export function ServiceAssociationsPage() {
    const [items, setItems] = useState<Proposal[]>([]);
    const [reasons, setReasons] = useState<Record<number, string>>({});
    const [primary, setPrimary] = useState<Record<number, string>>({});
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [busy, setBusy] = useState(false);
    const load = useCallback(async () => { setLoading(true); try {
        setItems(await apiRequest<Proposal[]>("/admin/service-associations"));
        setError(null);
    }
    catch (e) {
        setError(serviceError(e));
    }
    finally {
        setLoading(false);
    } }, []);
    useEffect(() => { void load(); }, [load]);
    async function resolve(item: Proposal) { setBusy(true); try {
        const reverse = primary[item.id] === "second";
        await associateServices(reverse ? item.other_record : item.record, reverse ? item.record : item.other_record, reasons[item.id]);
        await load();
        setMessage("Associação registrada. A versão consolidada precisa de comprovante, análise e reconhecimento aplicáveis.");
    }
    catch (e) {
        setError(serviceError(e));
    }
    finally {
        setBusy(false);
    } }
    return <section className="page-section"><PageHeader title="Associações de atendimentos" description="Compare os dois registros e indique qual será o atendimento principal."/>{error && <p className="message" role="alert">{error} <Button onClick={() => void load()} variant="secondary">Atualizar versões</Button></p>}{message && <p className="message" role="status">{message}</p>}{loading ? <StateBlock kind="loading" title="Carregando..."/> : error ? null : items.length === 0 ? <StateBlock title="Nenhuma associação pendente." description="Sugestões de duplicidade aparecerão aqui para comparação."/> : items.map(item => <article className="panel admin-card" key={item.id}><p>{item.reason}</p><div className="admin-comparison"><article><h3>Primeiro atendimento</h3><p> <Link to={`/admin/servicos/${item.record.id}`}>{item.record.description}</Link> · {item.record.service_date}</p></article><article><h3>Segundo atendimento</h3><p> <Link to={`/admin/servicos/${item.other_record.id}`}>{item.other_record.description}</Link> · {item.other_record.service_date}</p></article></div><Select value={primary[item.id] ?? "first"} onChange={e => setPrimary(c => ({ ...c, [item.id]: e.target.value }))} label="Atendimento que permanecerá principal"><option value="first">Primeiro atendimento</option><option value="second">Segundo atendimento</option></Select><Textarea value={reasons[item.id] ?? ""} onChange={e => setReasons(c => ({ ...c, [item.id]: e.target.value }))} label={<>Justificativa da associação {item.id}</>}/><Button disabled={busy || !reasons[item.id]?.trim()} onClick={() => void resolve(item)}>Consolidar atendimentos</Button></article>)}</section>;
}
