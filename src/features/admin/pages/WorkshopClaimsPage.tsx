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
    try { setClaims(await listPendingWorkshopClaims()); }
    catch { setError("Não foi possível carregar as solicitações de oficina."); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { void load(); }, [load]);
  async function act(action: () => Promise<unknown>) {
    setBusy(true); setError(null);
    try { await action(); await load(); }
    catch (caught) { setError(caught instanceof Error ? caught.message : "Não foi possível salvar a análise."); }
    finally { setBusy(false); }
  }
  async function download(id: number) {
    try { const result = await getDocumentDownload(id); setLinks(current => ({ ...current, [id]: result.url })); }
    catch { setError("Não foi possível preparar o arquivo para leitura."); }
  }
  return <section className="page-section"><h1>Representação de oficinas</h1>
    {error && <p role="alert">{error} <button onClick={() => void load()}>Atualizar fila</button></p>}
    {loading ? <p role="status">Carregando...</p> : claims.length === 0 ? <p>Nenhuma solicitação pendente.</p> : claims.map(claim => <article className="panel" key={claim.id}>
      <h2>{claim.trade_name}</h2><p>{claim.cnpj} · {claim.user_full_name}</p>
      <label>Justificativa da análise de {claim.trade_name}<input value={reasons[claim.id] ?? ""} onChange={event => setReasons(current => ({ ...current, [claim.id]: event.target.value }))} /></label>
      {claim.documents.map(document => <div className="stack" key={document.id}>
        <p>{document.validation_document_type ? validationDocumentLabels[document.validation_document_type] : document.file_name} · {document.review_status}</p>
        <button disabled={busy || !document.storage_verified} onClick={() => void download(document.id)}>Preparar visualização de {document.file_name}</button>
        {links[document.id] && <a href={links[document.id]} target="_blank" rel="noopener noreferrer">Abrir arquivo (válido por 5 minutos)</a>}
        <button disabled={busy || !document.storage_verified || document.review_status === "approved"} onClick={() => void act(() => reviewDocument(document.id, { review_status: "approved", expected_version: document.review_version }))}>Aprovar documento {document.file_name}</button>
        <button disabled={busy || !reasons[claim.id]?.trim()} onClick={() => void act(() => reviewDocument(document.id, { review_status: "rejected", expected_version: document.review_version, rejection_reason: reasons[claim.id] }))}>Recusar documento {document.file_name}</button>
      </div>)}
      <button disabled={busy || !reasons[claim.id]?.trim() || !required.every(kind => claim.documents.some(document => document.validation_document_type === kind && document.storage_verified && document.review_status === "approved"))} onClick={() => void act(() => reviewWorkshopClaim(claim, "verified", reasons[claim.id]))}>Aprovar representação</button>
      <button disabled={busy || !reasons[claim.id]?.trim()} onClick={() => void act(() => reviewWorkshopClaim(claim, "rejected", reasons[claim.id]))}>Recusar representação</button>
    </article>)}
  </section>;
}
