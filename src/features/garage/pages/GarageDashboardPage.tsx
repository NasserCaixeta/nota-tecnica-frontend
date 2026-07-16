import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { StateBlock } from "../../../components/data-display/StateBlock";
import { Button } from "../../../components/ui/Button";
import { getGarageDashboard } from "../../../lib/api/garage";
import type { GarageDashboard } from "../../../lib/api/types";
import { GarageSummary } from "../components/GarageSummary";
import { GarageVehicleCard } from "../components/GarageVehicleCard";

export function GarageDashboardPage() {
  const [dashboard, setDashboard] = useState<GarageDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getGarageDashboard()
      .then(setDashboard)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p>Carregando garagem...</p>;
  }

  return (
    <main>
      <h1>Minha garagem</h1>
      <Link to="/app/garagem/novo">
        <Button>Adicionar veículo</Button>
      </Link>
      {dashboard ? (
        <>
          <GarageSummary summary={dashboard.summary} />
          {dashboard.vehicles.map((vehicle) => (
            <GarageVehicleCard key={vehicle.vehicle_link_id} vehicle={vehicle} />
          ))}
        </>
      ) : (
        <StateBlock title="Garagem vazia" message="Adicione seu primeiro veículo gratuito." />
      )}
    </main>
  );
}
