import { useState } from "react";
import { getDocumentDownload, type DocumentRead } from "../../../lib/api/documents";
import { reviewDocument } from "../../../lib/api/admin";
import { serviceError } from "../../../lib/api/maintenance";
export function PrivateEvidence({ documents, review = false, reason = "", onChange }: {
  documents: DocumentRead[]; review?: boolean; reason?: string; onChange?: () => Promise<void>;
}) {
  const [links, setLinks] = useState<Record<number, string>>({});
  const [error, setError] = useState<string | null>(null); const [busy, setBusy] = useState(false);
  async function download(id: number) { try { const result = await getDocumentDownload(id); setLinks(current => ({ ...current, [id]: result.url })); } catch (e) { setError(serviceError(e)); } }
  async function decide(document: DocumentRead, approved: boolean) {
    setBusy(true); setError(null);
    try { await reviewDocument(document.id, { expected_version: document.review_version, review_status: approved ? "approved" : "rejected", ...(approved ? {} : { rejection_reason: reason }) }); await onChange?.(); }
    catch (e) { setError(serviceError(e)); } finally { setBusy(false); }
  }
  return <section><h3>Comprovantes privados</h3><p>Somente o remetente e a administração podem abrir estes arquivos.</p>
    {error && <p role="alert">{error}</p>}
    {!documents.length && <p>Nenhum comprovante seu nesta versão.</p>}
    {documents.map(d => <article key={d.id} className="stack"><p>{d.file_name} · {d.review_status}{d.rejection_reason && ` · ${d.rejection_reason}`}</p>
      <button disabled={!d.storage_verified || busy} onClick={() => void download(d.id)}>Preparar {d.file_name}</button>
      {links[d.id] && <a href={links[d.id]} target="_blank" rel="noopener noreferrer">Abrir {d.file_name} (link por 5 minutos)</a>}
      {review && <div><button disabled={busy || !d.storage_verified || d.review_status === "approved"} onClick={() => void decide(d, true)}>Aprovar comprovante</button> <button disabled={busy || !d.storage_verified || !reason.trim()} onClick={() => void decide(d, false)}>Recusar comprovante</button></div>}
    </article>)}
  </section>;
}
