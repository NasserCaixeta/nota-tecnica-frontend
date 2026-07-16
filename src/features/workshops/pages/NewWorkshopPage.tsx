import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { createWorkshop, type WorkshopPayload } from "../../../lib/api/workshops";
import { WorkshopForm } from "../components/WorkshopForm";

export function NewWorkshopPage() {
  const navigate = useNavigate();
  const [isSubmitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(payload: WorkshopPayload) {
    setSubmitting(true);
    setError(null);

    try {
      await createWorkshop(payload);
      navigate("/app/oficinas");
    } catch {
      setError("Não foi possível cadastrar a oficina.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="page-section">
      <WorkshopForm isSubmitting={isSubmitting} onSubmit={handleSubmit} />
      {error ? <p className="form-error">{error}</p> : null}
    </section>
  );
}
