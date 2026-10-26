import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { Panel } from "../../../components/ui/Panel";
import { StatusPill } from "../../../components/ui/StatusPill";
import { StateBlock } from "../../../components/data-display/StateBlock";
import { getWorkshop, type WorkshopRead } from "../../../lib/api/workshops";

export function WorkshopProfilePage() {
  const { workshopId = "" } = useParams();
  const [workshop, setWorkshop] = useState<WorkshopRead | null>(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    getWorkshop(Number(workshopId))
      .then(setWorkshop)
      .catch(() => setWorkshop(null))
      .finally(() => setLoading(false));
  }, [workshopId]);

  if (isLoading) {
    return <StateBlock title="Carregando oficina" />;
  }

  if (!workshop) {
    return <StateBlock title="Oficina não encontrada" description="Confira o link ou volte para o ranking público." />;
  }

  return (
    <section className="page-section">
      <Panel title={workshop.trade_name} eyebrow={`${workshop.city}/${workshop.state}`}>
        <div className="stack">
          <StatusPill tone={workshop.verification_status === "verified" ? "success" : "warning"}>
            {workshop.verification_status}
          </StatusPill>
          <p className="muted">{workshop.legal_name}</p>
          <p>{workshop.specialties.join(", ") || "Especialidades não informadas"}</p>
          <p>{workshop.phone || workshop.email || "Contato não informado"}</p>
        </div>
      </Panel>
      <Link to={`/app/oficinas/reivindicar?cnpj=${encodeURIComponent(workshop.cnpj)}`}>Sou responsável por esta oficina</Link>
    </section>
  );
}
