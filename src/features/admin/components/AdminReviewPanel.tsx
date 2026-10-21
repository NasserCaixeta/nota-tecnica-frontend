import { FormEvent, useState } from "react";

import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Panel } from "../../../components/ui/Panel";
import type { AdminGarageVehicleLinkRead } from "../../../lib/api/admin";

type AdminReviewPanelProps = {
  item: AdminGarageVehicleLinkRead;
  isSubmitting: boolean;
  onApprove: () => void | Promise<void>;
  onReject: (reason: string) => void | Promise<void>;
};

export function AdminReviewPanel({ item, isSubmitting, onApprove, onReject }: AdminReviewPanelProps) {
  const [reason, setReason] = useState("");

  function handleReject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void onReject(reason);
  }

  return (
    <Panel title={`Revisar ${item.plate}`} eyebrow="Validação">
      <div className="stack">
        <p className="muted">Documentos enviados: {item.uploaded_documents.join(", ") || "nenhum"}</p>
        <p className="muted">Documentos faltantes: {item.missing_documents.join(", ") || "nenhum"}</p>
        <Button disabled={isSubmitting || item.garage_status !== "under_review" || item.required_documents.some(kind => !item.approved_documents.includes(kind))} onClick={onApprove} type="button">
          Aprovar
        </Button>
        <form className="stack" onSubmit={handleReject}>
          <Input
            label="Motivo da rejeição"
            name="verification_rejection_reason"
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            required
          />
          <Button disabled={isSubmitting || reason.trim().length === 0} type="submit" variant="danger">
            Rejeitar
          </Button>
        </form>
      </div>
    </Panel>
  );
}
