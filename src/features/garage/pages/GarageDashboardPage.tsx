import { ButtonLink } from "../../../components/ui/ButtonLink";
import { PageHeader } from "../../../components/layout/PageHeader";
import { useEffect, useState } from "react";
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
        getGarageDashboard().then((result) => { if (active)
            setDashboard(result); })
            .catch((caught: unknown) => { if (active)
            setError(caught instanceof Error ? caught.message : "Não foi possível consultar a garagem."); })
            .finally(() => { if (active)
            setLoading(false); });
        return () => { active = false; };
    }, []);
    async function selectFree(vehicleId: number) {
        setBusy(true);
        setError(null);
        try {
            setDashboard(await selectFreeGarageVehicle(vehicleId));
        }
        catch (caught) {
            setError(caught instanceof Error ? caught.message : "Não foi possível alterar o veículo gratuito.");
        }
        finally {
            setBusy(false);
        }
    }
    if (loading)
        return <p>Carregando garagem...</p>;
    return <section className="page-section">
    <PageHeader title="Minha garagem" description="Seus veículos, documentos e histórico em um só lugar."/>
    {error && <p className="message" role="alert">{error}</p>}
    <div className="action-group"><ButtonLink to="/app/garagem/novo">Adicionar veículo</ButtonLink><ButtonLink to="/app/assinatura" variant="secondary">Gerenciar assinatura</ButtonLink></div>
    <p>Uma vaga gratuita ou até cinco veículos no total com assinatura. Os adicionais continuam legíveis após o vencimento.</p>
    
    {dashboard && <GarageSummary summary={dashboard.summary}/>}
    {dashboard?.vehicles.map((vehicle) => <section className="garage-vehicle" key={vehicle.vehicle_link_id} aria-label={`Veículo ${vehicle.plate}`}>
      <GarageVehicleCard vehicle={vehicle}/>
      <p>{vehicle.commercial_access === "free" ? "Veículo gratuito" : vehicle.commercial_access === "subscription" ? "Vaga da assinatura" : "Disponível para leitura"}</p>
      {vehicle.garage_status === "active" && vehicle.commercial_access !== "free" && <Button disabled={busy} onClick={() => void selectFree(vehicle.vehicle_id)}>Usar {vehicle.plate} como gratuito</Button>}
    </section>)}
    {!error && dashboard?.vehicles.length === 0 && <StateBlock title="Garagem vazia" message="Adicione seu primeiro veículo gratuito."/>}
  </section>;
}
