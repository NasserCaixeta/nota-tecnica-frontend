import { type FormEvent, useState } from "react";

import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Select } from "../../../components/ui/Select";
import { normalizePlateInput } from "../../../lib/format/plate";

export function GarageAddVehicleForm({
  onSubmit,
  isSubmitting,
}: {
  onSubmit: (values: Record<string, unknown>) => void;
  isSubmitting: boolean;
}) {
  const [values, setValues] = useState({
    plate: "",
    brand: "",
    model: "",
    model_year: "2020",
    color: "",
    vehicle_type: "car",
    chassis: "",
    renavam: "",
    fuel_type: "",
    engine: "",
    transmission: "",
    relationship_type: "owner",
  });

  function update(field: keyof typeof values, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit({ ...values, model_year: Number(values.model_year) });
  }

  return (
    <form onSubmit={handleSubmit}>
      <Input label="Placa" name="plate" value={values.plate} onChange={(event) => update("plate", normalizePlateInput(event.target.value))} />
      <Input label="Marca" name="brand" onChange={(event) => update("brand", event.target.value)} />
      <Input label="Modelo" name="model" onChange={(event) => update("model", event.target.value)} />
      <Input label="Ano modelo" name="model_year" type="number" value={values.model_year} onChange={(event) => update("model_year", event.target.value)} />
      <Input label="Cor" name="color" onChange={(event) => update("color", event.target.value)} />
      <Input label="Chassi" name="chassis" onChange={(event) => update("chassis", event.target.value)} />
      <Input label="Renavam" name="renavam" onChange={(event) => update("renavam", event.target.value)} />
      <Input label="Combustível" name="fuel_type" onChange={(event) => update("fuel_type", event.target.value)} />
      <Input label="Motor" name="engine" onChange={(event) => update("engine", event.target.value)} />
      <Input label="Câmbio" name="transmission" onChange={(event) => update("transmission", event.target.value)} />
      <Select label="Relação" name="relationship_type" value={values.relationship_type} onChange={(event) => update("relationship_type", event.target.value)}>
        <option value="owner">Proprietário</option>
        <option value="spouse">Cônjuge</option>
        <option value="family">Família</option>
        <option value="company_representative">Representante de empresa</option>
        <option value="fleet_responsible">Responsável de frota</option>
        <option value="recent_buyer">Comprou recentemente</option>
        <option value="authorized_driver">Condutor autorizado</option>
        <option value="other">Outro</option>
      </Select>
      <Button disabled={isSubmitting} type="submit">
        Adicionar veículo
      </Button>
    </form>
  );
}
