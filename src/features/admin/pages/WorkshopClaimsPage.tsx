import { documentReviewLabels } from "../../../content/status-labels";
import { PageHeader } from "../../../components/layout/PageHeader";
import { StateBlock } from "../../../components/data-display/StateBlock";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import { useCallback, useEffect, useState } from "react";
import { listPendingWorkshopClaims, reviewWorkshopClaim, type WorkshopClaimRead } from "../../../lib/api/workshops";
import { reviewDocument } from "../../../lib/api/admin";
import { getDocumentDownload } from "../../../lib/api/documents";
import { validationDocumentLabels } from "../../../content/documents";
const required = ["company_contract_or_power_of_attorney", "representative_identity"];
export function WorkshopClaimsPage() {
    const [claims, setClaims] = useState<WorkshopClaimRead[]>([]);
    const [reasons, setReasons] = useState<Record<number, string>>({});
    const [links, setLinks] = useState<Record<number, string>>({});
    const [loading, setLoading] = useState(true);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const load = useCallback(async () => {
        setLoading(true);
        try {
            setClaims(await listPendingWorkshopClaims());
            setError(null);
        }
        catch {
            setError("Não foi possível carregar as solicitações de oficina.");
        }
        finally {
            setLoading(false);
        }
    }, []);
    useEffect(() => { void load(); }, [load]);
    async function act(action: () => Promise<unknown>) {
        setBusy(true);
        setError(null);
        try {
            await action();
            await load();
        }
        catch (caught) {
            setError(caught instanceof Error ? caught.message : "Não foi possível salvar a análise.");
        }
        finally {
            setBusy(false);
        }
    }
    async function download(id: number) {
        try {
            const result = await getDocumentDownload(id);
            setLinks(current => ({ ...current, [id]: result.url }));
        }
        catch {
            setError("Não foi possível preparar o arquivo para leitura.");
        }
    }
    return <section className="page-section"><PageHeader title="Representação de oficinas" description="Confira a documentação e a representação antes de liberar a operação da oficina."/>
    {error && <p role="alert">{error} <Button onClick={() => void load()} variant="secondary">Atualizar fila</Button></p>}
    {loading ? <StateBlock kind="loading" title="Carregando solicitações..."/> : error ? null : claims.length === 0 ? <StateBlock title="Nenhuma solicitação pendente." description="Novos pedidos de representação serão exibidos nesta fila."/> : claims.map(claim => <article className="panel admin-card" key={claim.id}>
      <header className="admin-card__heading"><div><h2>{claim.trade_name}</h2><p className="admin-card__meta">CNPJ {claim.cnpj} · Responsável: {claim.user_full_name}</p></div></header>
      <Input value={reasons[claim.id] ?? ""} onChange={event => setReasons(current => ({ ...current, [claim.id]: event.target.value }))} label={<>Justificativa da análise de {claim.trade_name}</>}/>
      {claim.documents.map(document => <div className="admin-document" key={document.id}>
        <p>{document.validation_document_type ? validationDocumentLabels[document.validation_document_type] : document.file_name} · {documentReviewLabels[document.review_status]}</p>
        <Button disabled={busy || !document.storage_verified} onClick={() => void download(document.id)} variant="secondary">Preparar visualização de {document.file_name}</Button>
        {links[document.id] && <a href={links[document.id]} target="_blank" rel="noopener noreferrer">Abrir arquivo (válido por 5 minutos)</a>}
        <Button disabled={busy || !document.storage_verified || document.review_status === "approved"} onClick={() => void act(() => reviewDocument(document.id, { review_status: "approved", expected_version: document.review_version }))}>Aprovar documento {document.file_name}</Button>
        <Button disabled={busy || !reasons[claim.id]?.trim()} onClick={() => void act(() => reviewDocument(document.id, { review_status: "rejected", expected_version: document.review_version, rejection_reason: reasons[claim.id] }))} variant="danger">Recusar documento {document.file_name}</Button>
      </div>)}
      <Button disabled={busy || !reasons[claim.id]?.trim() || !required.every(kind => claim.documents.some(document => document.validation_document_type === kind && document.storage_verified && document.review_status === "approved"))} onClick={() => void act(() => reviewWorkshopClaim(claim, "verified", reasons[claim.id]))}>Aprovar representação</Button>
      <Button disabled={busy || !reasons[claim.id]?.trim()} onClick={() => void act(() => reviewWorkshopClaim(claim, "rejected", reasons[claim.id]))} variant="danger">Recusar representação</Button>
    </article>)}
  </section>;
}
