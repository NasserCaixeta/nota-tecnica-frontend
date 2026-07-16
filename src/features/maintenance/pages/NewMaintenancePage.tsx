import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { MaintenanceForm } from "../components/MaintenanceForm";
import { createVehicleMaintenance, type MaintenanceCreatePayload } from "../../../lib/api/maintenance";

export function NewMaintenancePage() {
  const navigate = useNavigate();
  const { vehicleId = "" } = useParams();
  const [isSubmitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(payload: MaintenanceCreatePayload) {
    setSubmitting(true);
    setError(null);

    try {
      await createVehicleMaintenance(vehicleId, payload);
      navigate(`/app/garagem/${vehicleId}`);
    } catch {
      setError("Não foi possível registrar a manutenção.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="page-section">
      <MaintenanceForm isSubmitting={isSubmitting} onSubmit={handleSubmit} />
      {error ? <p className="form-error">{error}</p> : null}
    </section>
  );
}
