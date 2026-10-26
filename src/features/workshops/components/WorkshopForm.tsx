import { FormEvent, useState } from "react";

import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Panel } from "../../../components/ui/Panel";
import type { WorkshopPayload } from "../../../lib/api/workshops";

type WorkshopFormProps = {
  isSubmitting: boolean;
  onSubmit: (payload: WorkshopPayload) => void | Promise<void>;
};

const initialPayload: WorkshopPayload = {
  source: "owner_claimed",
  zip_code: "", street: "", number: "", neighborhood: "", complement: "",
  legal_name: "",
  trade_name: "",
  cnpj: "",
  phone: "",
  email: "",
  city: "",
  state: "",
  specialties: [],
};

export function WorkshopForm({ isSubmitting, onSubmit }: WorkshopFormProps) {
  const [payload, setPayload] = useState(initialPayload);
  const [specialties, setSpecialties] = useState("");

  function updateField(field: keyof WorkshopPayload, value: string) {
    setPayload((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void onSubmit({
      ...payload,
      specialties: specialties
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    });
  }

  return (
    <Panel title="Cadastrar oficina" eyebrow="Rede técnica">
      <form className="stack" onSubmit={handleSubmit}>
        <Input
          label="Razão social"
          name="legal_name"
          value={payload.legal_name}
          onChange={(event) => updateField("legal_name", event.target.value)}
          required
        />
        <Input
          label="Nome fantasia"
          name="trade_name"
          value={payload.trade_name}
          onChange={(event) => updateField("trade_name", event.target.value)}
          required
        />
        <Input
          label="CNPJ"
          name="cnpj"
          value={payload.cnpj}
          onChange={(event) => updateField("cnpj", event.target.value)}
          required
        />
        <Input
          label="Telefone"
          name="phone" required
          value={payload.phone}
          onChange={(event) => updateField("phone", event.target.value)}
        />
        <Input
          label="E-mail"
          name="email" required
          type="email"
          value={payload.email}
          onChange={(event) => updateField("email", event.target.value)}
        />
        <Input label="CEP" name="zip_code" value={payload.zip_code} required onChange={event => updateField("zip_code", event.target.value)} />
        <Input label="Rua" name="street" value={payload.street} required onChange={event => updateField("street", event.target.value)} />
        <Input label="Número" name="number" value={payload.number} required onChange={event => updateField("number", event.target.value)} />
        <Input label="Bairro" name="neighborhood" value={payload.neighborhood} required onChange={event => updateField("neighborhood", event.target.value)} />
        <Input
          label="Cidade"
          name="city"
          value={payload.city}
          onChange={(event) => updateField("city", event.target.value)}
          required
        />
        <Input
          label="UF"
          name="state"
          maxLength={2}
          value={payload.state}
          onChange={(event) => updateField("state", event.target.value.toUpperCase())}
          required
        />
        <Input
          label="Especialidades"
          name="specialties" required
          value={specialties}
          onChange={(event) => setSpecialties(event.target.value)}
        />
        <Button disabled={isSubmitting} type="submit">
          Salvar oficina
        </Button>
      </form>
    </Panel>
  );
}
