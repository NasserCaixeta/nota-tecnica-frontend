import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { StateBlock } from "../../../components/data-display/StateBlock";
import { Button } from "../../../components/ui/Button";
import { getGarageDashboard, selectFreeGarageVehicle } from "../../../lib/api/garage";
import type { GarageDashboard } from "../../../lib/api/types";
import { GarageSummary } from "../components/GarageSummary";
import { GarageVehicleCard } from "../components/GarageVehicleCard";

export function GarageDashboardPage() {
  const [dashboard, setDashboard] = useState<GarageDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    let active = true;
    getGarageDashboard().then((result) => { if (active) setDashboard(result); })
      .catch((caught: unknown) => { if (active) setError(caught instanceof Error ? caught.message : "Não foi possível consultar a garagem."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);
  async function selectFree(vehicleId: number) {
    setBusy(true); setError(null);
    try { setDashboard(await selectFreeGarageVehicle(vehicleId)); }
    catch (caught) { setError(caught instanceof Error ? caught.message : "Não foi possível alterar o veículo gratuito."); }
    finally { setBusy(false); }
  }
  if (loading) return <p>Carregando garagem...</p>;
  return <section>
    <h1>Minha garagem</h1>
    {error && <p role="alert">{error}</p>}
    <p><Link to="/app/garagem/novo"><Button>Adicionar veículo</Button></Link></p>
    <p>Uma vaga gratuita ou até cinco veículos no total com assinatura. Os adicionais continuam legíveis após o vencimento.</p>
    <p><Link to="/app/assinatura">Gerenciar assinatura</Link></p>
    {dashboard && <GarageSummary summary={dashboard.summary} />}
    {dashboard?.vehicles.map((vehicle) => <section key={vehicle.vehicle_link_id} aria-label={`Veículo ${vehicle.plate}`}>
      <GarageVehicleCard vehicle={vehicle} />
      <p>{vehicle.commercial_access === "free" ? "Veículo gratuito" : vehicle.commercial_access === "subscription" ? "Vaga da assinatura" : "Disponível para leitura"}</p>
      {vehicle.garage_status === "active" && vehicle.commercial_access !== "free" && <button disabled={busy} onClick={() => void selectFree(vehicle.vehicle_id)}>Usar {vehicle.plate} como gratuito</button>}
    </section>)}
    {!error && dashboard?.vehicles.length === 0 && <StateBlock title="Garagem vazia" message="Adicione seu primeiro veículo gratuito." />}
  </section>;
}
