import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { createGarageVehicle } from "../../../lib/api/garage";
import { GarageAddVehicleForm } from "../components/GarageAddVehicleForm";

export function AddGarageVehiclePage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(values: Record<string, unknown>) {
    setIsSubmitting(true);
    setMessage(null);
    try {
      const vehicle = await createGarageVehicle(values);
      navigate(`/app/garagem/${vehicle.vehicle_id}`);
    } catch (caught) {
      setMessage(caught instanceof Error ? caught.message : "Não foi possível adicionar o veículo.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main>
      <h1>Adicionar veículo</h1>
      {message ? <p role="alert">{message}</p> : null}
      <GarageAddVehicleForm isSubmitting={isSubmitting} onSubmit={handleSubmit} />
    </main>
  );
}
