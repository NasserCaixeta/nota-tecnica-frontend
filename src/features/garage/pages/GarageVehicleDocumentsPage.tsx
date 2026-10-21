import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getGarageVehicle, submitGarageReview } from "../../../lib/api/garage";
import { uploadValidationDocument } from "../../../lib/api/documents";
import type { GarageVehicleItem, ValidationDocumentType } from "../../../lib/api/types";
import { validationDocumentLabels } from "../../../content/documents";
import { DocumentChecklist } from "../components/DocumentChecklist";

export function GarageVehicleDocumentsPage() {
  const { vehicleId } = useParams();
  const [vehicle, setVehicle] = useState<GarageVehicleItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const load = useCallback(async () => {
    setLoading(true);
    try {
      if (!vehicleId || !Number.isInteger(Number(vehicleId)) || Number(vehicleId) <= 0) throw new Error("Veículo inválido.");
      setVehicle(await getGarageVehicle(Number(vehicleId)));
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Não foi possível carregar os documentos."); }
    finally { setLoading(false); }
  }, [vehicleId]);
  useEffect(() => { void load(); }, [load]);
  async function upload(kind: ValidationDocumentType, file: File) {
    if (!vehicle) return;
    setError(null); setMessage(null);
    if (!file.size || file.size > 10 * 1024 * 1024 || !["application/pdf", "image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Envie um PDF, JPEG, PNG ou WebP de até 10 MiB."); return;
    }
    setBusy(true);
    try {
      await uploadValidationDocument({ vehicleLinkId: vehicle.vehicle_link_id, documentType: kind === "crlv" ? "crlv" : "other", validationDocumentType: kind, file });
      await load(); setMessage("Documento enviado. A aprovação será feita pela administração.");
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Não foi possível enviar o documento."); }
    finally { setBusy(false); }
  }
  async function submit() {
    if (!vehicle) return;
    setBusy(true); setError(null); setMessage(null);
    try {
      await submitGarageReview(vehicle.vehicle_link_id, vehicle.garage_status === "rejected");
      await load(); setMessage("Veículo enviado para análise.");
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Não foi possível enviar para análise."); }
    finally { setBusy(false); }
  }
  if (loading && !vehicle) return <p role="status">Carregando documentos...</p>;
  return <section className="page-section">
    <h1>Documentos de validação</h1>
    {error && <p role="alert">{error} <button onClick={() => void load()}>Atualizar</button></p>}
    {message && <p role="status">{message}</p>}
    {vehicle && <>
      <p>{vehicle.plate}</p>
      {vehicle.admin_review_note && <p>{vehicle.admin_review_note}</p>}
      {vehicle.verification_rejection_reason && <p>{vehicle.verification_rejection_reason}</p>}
      <DocumentChecklist vehicle={vehicle} />
      <p>Comprovantes pessoais ficam restritos a você e à administração. Formatos aceitos: PDF, JPEG, PNG e WebP, até 10 MiB.</p>
      {vehicle.documents.required.map(kind => <label className="stack" key={kind}>Arquivo para {validationDocumentLabels[kind]}
        <input type="file" accept="application/pdf,image/jpeg,image/png,image/webp" disabled={busy || loading || !vehicle.permissions.can_upload_documents} onChange={event => {
          const file = event.target.files?.[0]; if (file) void upload(kind, file); event.target.value = "";
        }} />
      </label>)}
      <button disabled={busy || loading || !vehicle.permissions.can_submit_review} onClick={() => void submit()}>Enviar para análise</button>
      {vehicle.garage_status === "under_review" && <p>Seu veículo está em análise.</p>}
      <Link to={`/app/garagem/${vehicle.vehicle_id}`}>Voltar ao veículo</Link>
    </>}
  </section>;
}
