import { FormEvent, useState } from "react";

import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Panel } from "../../../components/ui/Panel";
import type { MaintenanceCreatePayload } from "../../../lib/api/maintenance";

type MaintenanceFormProps = {
  isSubmitting: boolean;
  onSubmit: (payload: MaintenanceCreatePayload) => void | Promise<void>;
};

export function MaintenanceForm({ isSubmitting, onSubmit }: MaintenanceFormProps) {
  const [payload, setPayload] = useState<MaintenanceCreatePayload>({
    title: "",
    performed_at: "",
  });

  function updateField(field: keyof MaintenanceCreatePayload, value: string) {
    setPayload((current) => ({
      ...current,
      [field]: ["odometer", "labor_cost", "parts_cost"].includes(field) && value ? Number(value) : value,
    }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void onSubmit(payload);
  }

  return (
    <Panel title="Registrar manutenção" eyebrow="Histórico técnico">
      <form className="stack" onSubmit={handleSubmit}>
        <Input
          label="Serviço"
          name="title"
          value={payload.title}
          onChange={(event) => updateField("title", event.target.value)}
          required
        />
        <Input
          label="Data"
          name="performed_at"
          type="date"
          value={payload.performed_at}
          onChange={(event) => updateField("performed_at", event.target.value)}
          required
        />
        <Input
          label="Quilometragem"
          name="odometer"
          type="number"
          onChange={(event) => updateField("odometer", event.target.value)}
        />
        <Input
          label="Mão de obra"
          name="labor_cost"
          type="number"
          step="0.01"
          onChange={(event) => updateField("labor_cost", event.target.value)}
        />
        <Input
          label="Peças"
          name="parts_cost"
          type="number"
          step="0.01"
          onChange={(event) => updateField("parts_cost", event.target.value)}
        />
        <Input
          label="Descrição"
          name="description"
          onChange={(event) => updateField("description", event.target.value)}
        />
        <Button disabled={isSubmitting} type="submit">
          Salvar manutenção
        </Button>
      </form>
    </Panel>
  );
}
