import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { Button } from "../../../components/ui/Button";
import { Panel } from "../../../components/ui/Panel";
import { StatusPill } from "../../../components/ui/StatusPill";
import { PlannedState } from "../../../components/data-display/PlannedState";
import { StateBlock } from "../../../components/data-display/StateBlock";
import { listManagedWorkshops, type WorkshopRead } from "../../../lib/api/workshops";

export function ManagedWorkshopsPage() {
  const [workshops, setWorkshops] = useState<WorkshopRead[]>([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    listManagedWorkshops()
      .then(setWorkshops)
      .catch(() => setWorkshops([]))
      .finally(() => setLoading(false));
  }, []);

  if (isLoading) {
    return <StateBlock title="Carregando oficinas" />;
  }

  return (
    <section className="page-section">
      <div className="section-header">
        <div>
          <p className="eyebrow">Oficinas</p>
          <h1>Oficinas gerenciadas</h1>
        </div>
        <Link to="/app/oficinas/nova">
          <Button>Cadastrar oficina</Button>
        </Link>
      </div>
      <Panel title="Perfis">
        {workshops.length === 0 ? (
          <StateBlock title="Nenhuma oficina cadastrada" description="Cadastre uma oficina para iniciar a validação." />
        ) : (
          <div className="stack">
            {workshops.map((workshop) => (
              <article className="data-row" key={workshop.id}>
                <div>
                  <strong>{workshop.trade_name}</strong>
                  <p className="muted">
                    {workshop.city}/{workshop.state} - {workshop.cnpj}
                  </p>
                </div>
                <StatusPill tone={workshop.verification_status === "verified" ? "success" : "warning"}>
                  {workshop.verification_status}
                </StatusPill>
              </article>
            ))}
          </div>
        )}
      </Panel>
      <PlannedState
        title="Métricas e avaliações planejadas"
        description="Dashboard operacional, avaliações e reivindicação pública entram quando os endpoints forem expostos."
      />
    </section>
  );
}
