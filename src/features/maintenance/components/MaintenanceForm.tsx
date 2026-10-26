import { type FormEvent, useState } from "react";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Select } from "../../../components/ui/Select";
import { Panel } from "../../../components/ui/Panel";
import type { MaintenanceCreatePayload } from "../../../lib/api/maintenance";
import { lookupWorkshop } from "../../../lib/api/workshops";
const categories = { mechanical: "Mecânica", electrical: "Elétrica", bodywork: "Funilaria", paint: "Pintura", detailing: "Estética", tires: "Pneus", inspection: "Revisão", diagnosis: "Diagnóstico", other: "Outro" };
const systems = { engine: "Motor", transmission: "Transmissão", brakes: "Freios", suspension: "Suspensão", air_conditioning: "Ar condicionado", steering: "Direção", electrical: "Elétrica", interior: "Interior", body: "Carroceria", paint: "Pintura", detailing: "Estética", tires: "Pneus", other: "Outro" };
export function MaintenanceForm({ isSubmitting, onSubmit, initial, workshop = false }: {
  isSubmitting: boolean; onSubmit: (payload: MaintenanceCreatePayload) => void | Promise<void>;
  initial?: MaintenanceCreatePayload; workshop?: boolean;
}) {
  const [values, setValues] = useState<Record<string, string>>({
    description: initial?.description ?? "", service_date: initial?.service_date ?? "",
    category: initial?.category ?? "mechanical", vehicle_system: initial?.vehicle_system ?? "engine",
    odometer: initial ? String(initial.odometer) : "", labor_cost: initial?.labor_cost ?? "", parts_cost: initial?.parts_cost ?? "",
    entry_date: initial?.entry_date ?? "", promised_delivery_date: initial?.promised_delivery_date ?? "", actual_delivery_date: initial?.actual_delivery_date ?? "", plate: "",
  });
  const [office, setOffice] = useState<{ id: number; trade_name: string } | null>(initial?.workshop_id ? { id: initial.workshop_id, trade_name: "Oficina já informada" } : null);
  const [cnpj, setCnpj] = useState(""); const [error, setError] = useState<string | null>(null);
  const update = (field: string, value: string) => setValues(current => ({ ...current, [field]: value }));
  async function search() { try { setOffice(await lookupWorkshop(cnpj.replace(/\D/g, ""))); setError(null); } catch { setError("Oficina não encontrada. Confira o CNPJ ou cadastre uma referência."); } }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const payload: MaintenanceCreatePayload = { service_date: values.service_date, odometer: Number(values.odometer), category: values.category, vehicle_system: values.vehicle_system, description: values.description.trim(), labor_cost: Number(values.labor_cost).toFixed(2), parts_cost: Number(values.parts_cost).toFixed(2), entry_date: values.entry_date || null, promised_delivery_date: values.promised_delivery_date || null, actual_delivery_date: values.actual_delivery_date || null, status: "completed" };
    if (workshop && !initial) payload.plate = values.plate;
    else if (!workshop) payload.workshop_id = office?.id ?? null;
    void onSubmit(payload);
  }
  return <Panel title={workshop ? "Novo atendimento" : "Registrar manutenção"}><form className="stack" onSubmit={submit}>
    {workshop && !initial && <Input label="Placa do veículo" name="plate" required value={values.plate} onChange={e => update("plate", e.target.value)} />}
    <Input label="Descrição" name="description" required value={values.description} onChange={e => update("description", e.target.value)} />
    <Input label="Data do serviço" name="service_date" type="date" required value={values.service_date} onChange={e => update("service_date", e.target.value)} />
    <Input label="Quilometragem" name="odometer" type="number" min="0" step="1" required value={values.odometer} onChange={e => update("odometer", e.target.value)} />
    <Select label="Categoria" name="category" value={values.category} onChange={e => update("category", e.target.value)}>{Object.entries(categories).map(([v,l]) => <option key={v} value={v}>{l}</option>)}</Select>
    <Select label="Sistema do veículo" name="vehicle_system" value={values.vehicle_system} onChange={e => update("vehicle_system", e.target.value)}>{Object.entries(systems).map(([v,l]) => <option key={v} value={v}>{l}</option>)}</Select>
    <Input label="Mão de obra" name="labor_cost" type="number" min="0" step="0.01" required value={values.labor_cost} onChange={e => update("labor_cost", e.target.value)} />
    <Input label="Peças" name="parts_cost" type="number" min="0" step="0.01" required value={values.parts_cost} onChange={e => update("parts_cost", e.target.value)} />
    <Input label="Entrada (opcional)" name="entry_date" type="date" value={values.entry_date} onChange={e => update("entry_date", e.target.value)} />
    <Input label="Entrega prometida (opcional)" name="promised_delivery_date" type="date" value={values.promised_delivery_date} onChange={e => update("promised_delivery_date", e.target.value)} />
    <Input label="Entrega efetiva (opcional)" name="actual_delivery_date" type="date" value={values.actual_delivery_date} onChange={e => update("actual_delivery_date", e.target.value)} />
    {!workshop && <div><Input label="CNPJ da oficina (opcional)" name="cnpj" value={cnpj} onChange={e => setCnpj(e.target.value)} /><button type="button" onClick={() => void search()}>Buscar oficina</button>{office && <p>{office.trade_name} <button type="button" onClick={() => setOffice(null)}>Remover oficina</button></p>}<a href="/app/oficinas/nova?referencia=1" target="_blank" rel="noopener noreferrer">Cadastrar referência de oficina</a></div>}
    {error && <p role="alert">{error}</p>}<p>Após salvar, anexe um comprovante e envie para análise.</p>
    <Button disabled={isSubmitting} type="submit">Salvar manutenção</Button>
  </form></Panel>;
}
