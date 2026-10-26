import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { createWorkshop, type WorkshopPayload } from "../../../lib/api/workshops";
import { WorkshopForm } from "../components/WorkshopForm";

export function NewWorkshopPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const reference = params.get("referencia") === "1";
  const [isSubmitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(payload: WorkshopPayload) {
    setSubmitting(true);
    setError(null);

    try {
      await createWorkshop(payload);
      navigate("/app/oficinas");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Não foi possível cadastrar a oficina. Confira CNPJ e endereço.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="page-section">
      <p>{reference ? "Cadastre o estabelecimento como referência para o atendimento. Isso não concede gestão da oficina." : "Após o cadastro, envie os documentos de representação. A gestão será liberada depois da aprovação."}</p>
      <WorkshopForm source={reference ? "user_submitted" : "owner_claimed"} isSubmitting={isSubmitting} onSubmit={handleSubmit} />
      {error ? <p className="form-error">{error}</p> : null}
    </section>
  );
}
