import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Panel } from "../../../components/ui/Panel";
import { StateBlock } from "../../../components/data-display/StateBlock";
import { getGarageValidation, requestAdditionalDocuments, reviewDocument, reviewGarageVehicleLink, type AdminGarageVehicleLinkRead } from "../../../lib/api/admin";
import { getDocumentDownload, type DocumentRead } from "../../../lib/api/documents";
import { validationDocumentLabels } from "../../../content/documents";
import { AdditionalDocumentsForm } from "../components/AdditionalDocumentsForm";
import { AdminReviewPanel } from "../components/AdminReviewPanel";

export function AdminValidationDetailPage() {
  const { vehicleLinkId = "" } = useParams();
  const [item, setItem] = useState<AdminGarageVehicleLinkRead | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [reasons, setReasons] = useState<Record<number, string>>({});
  const [links, setLinks] = useState<Record<number, { url: string; expires_at: string }>>({});
  const load = useCallback(async () => {
    setLoading(true);
    try { setItem(await getGarageValidation(Number(vehicleLinkId))); }
    catch (caught) { setError(caught instanceof Error ? caught.message : "Não foi possível carregar a análise."); }
    finally { setLoading(false); }
  }, [vehicleLinkId]);
  useEffect(() => { void load(); }, [load]);
  async function act(action: () => Promise<unknown>, success: string) {
    setBusy(true); setError(null); setMessage(null);
    try { await action(); await load(); setMessage(success); }
    catch (caught) { setError(caught instanceof Error ? caught.message : "Não foi possível salvar a análise."); }
    finally { setBusy(false); }
  }
  async function prepareDownload(document: DocumentRead) {
    setError(null);
    try { const link = await getDocumentDownload(document.id); setLinks(current => ({ ...current, [document.id]: link })); }
    catch (caught) { setError(caught instanceof Error ? caught.message : "Não foi possível abrir o documento."); }
  }
  if (loading && !item) return <StateBlock title="Carregando validação" />;
  return <section className="page-section">
    {error && <p role="alert">{error} <button onClick={() => void load()}>Atualizar análise</button></p>}
    {message && <p role="status">{message}</p>}
    {item && <>
      <p>{item.user_full_name}</p>
      <Panel title="Comprovantes para análise">
        {item.documents.map(document => {
          const label = document.validation_document_type ? validationDocumentLabels[document.validation_document_type] : document.file_name;
          return <article className="stack" key={document.id}>
            <h3>{label}</h3><p>{document.file_name} · {document.review_status}</p>
            <button disabled={!document.storage_verified || busy} onClick={() => void prepareDownload(document)}>Preparar visualização de {label}</button>
            {links[document.id] && <a href={links[document.id].url} target="_blank" rel="noopener noreferrer">Abrir arquivo (link válido por 5 minutos)</a>}
            {document.rejection_reason && <p>{document.rejection_reason}</p>}
            <button disabled={busy || !document.storage_verified || document.review_status === "approved"} onClick={() => void act(() => reviewDocument(document.id, { review_status: "approved", expected_version: document.review_version }), "Documento aprovado.")}>Aprovar documento {label}</button>
            <label>Motivo para rejeitar {label}<input value={reasons[document.id] ?? ""} onChange={event => setReasons(current => ({ ...current, [document.id]: event.target.value }))} /></label>
            <button disabled={busy || !reasons[document.id]?.trim()} onClick={() => void act(() => reviewDocument(document.id, { review_status: "rejected", expected_version: document.review_version, rejection_reason: reasons[document.id] }), "Documento recusado.")}>Recusar documento {label}</button>
          </article>;
        })}
      </Panel>
      <AdminReviewPanel isSubmitting={busy || loading} item={item}
        onApprove={() => act(() => reviewGarageVehicleLink(item.vehicle_link_id, { verification_status: "verified", expected_version: item.review_version }), "Vínculo aprovado.")}
        onReject={reason => act(() => reviewGarageVehicleLink(item.vehicle_link_id, { verification_status: "rejected", verification_rejection_reason: reason, expected_version: item.review_version }), "Vínculo recusado.")} />
      <Panel title="Documentos adicionais"><AdditionalDocumentsForm isSubmitting={busy || loading} onSubmit={payload => act(() => requestAdditionalDocuments(item.vehicle_link_id, { ...payload, expected_version: item.review_version }), "Documentos adicionais solicitados.")} /></Panel>
    </>}
  </section>;
}
