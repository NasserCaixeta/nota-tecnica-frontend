import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import { Panel } from "../../../components/ui/Panel";
import { StateBlock } from "../../../components/data-display/StateBlock";
import {
  listPendingGarageValidations,
  requestAdditionalDocuments,
  reviewGarageVehicleLink,
  type AdminGarageVehicleLinkRead,
} from "../../../lib/api/admin";
import { AdditionalDocumentsForm } from "../components/AdditionalDocumentsForm";
import { AdminReviewPanel } from "../components/AdminReviewPanel";

export function AdminValidationDetailPage() {
  const { vehicleLinkId = "" } = useParams();
  const numericId = Number(vehicleLinkId);
  const [items, setItems] = useState<AdminGarageVehicleLinkRead[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [isSubmitting, setSubmitting] = useState(false);

  useEffect(() => {
    listPendingGarageValidations()
      .then(setItems)
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  const item = useMemo(() => items.find((entry) => entry.vehicle_link_id === numericId) ?? null, [items, numericId]);

  async function withSubmit(action: () => Promise<AdminGarageVehicleLinkRead>) {
    setSubmitting(true);
    try {
      const updated = await action();
      setItems((current) => current.map((entry) => (entry.vehicle_link_id === updated.vehicle_link_id ? updated : entry)));
    } finally {
      setSubmitting(false);
    }
  }

  if (isLoading) {
    return <StateBlock title="Carregando validação" />;
  }

  if (!item) {
    return <StateBlock title="Validação não encontrada" description="A fila pode ter sido atualizada." />;
  }

  return (
    <section className="page-section">
      <AdminReviewPanel
        isSubmitting={isSubmitting}
        item={item}
        onApprove={() => withSubmit(() => reviewGarageVehicleLink(item.vehicle_link_id, { verification_status: "verified" }))}
        onReject={(reason) =>
          withSubmit(() =>
            reviewGarageVehicleLink(item.vehicle_link_id, {
              verification_status: "rejected",
              verification_rejection_reason: reason,
            }),
          )
        }
      />
      <Panel title="Documentos adicionais">
        <AdditionalDocumentsForm
          isSubmitting={isSubmitting}
          onSubmit={(payload) => withSubmit(() => requestAdditionalDocuments(item.vehicle_link_id, payload))}
        />
      </Panel>
    </section>
  );
}
