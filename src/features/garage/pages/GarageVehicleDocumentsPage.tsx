import { useState } from "react";

import { StateBlock } from "../../../components/data-display/StateBlock";
import { Button } from "../../../components/ui/Button";

export function GarageVehicleDocumentsPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <main>
      <h1>Documentos de validação</h1>
      <StateBlock
        title="Upload por vínculo"
        message="Envie os documentos exigidos para liberar a revisão do veículo."
      />
      <Button onClick={() => setSubmitted(true)}>Marcar revisão como preparada</Button>
      {submitted ? <p>Fluxo preparado para integração de upload R2.</p> : null}
    </main>
  );
}
