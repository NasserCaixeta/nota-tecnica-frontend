import { type FormEvent, useState } from "react";

import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { normalizePlateInput } from "../../../lib/format/plate";

export function PlateSearchForm({ onSearch }: { onSearch: (plate: string) => void }) {
  const [plate, setPlate] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (plate.length === 7) {
      onSearch(plate);
    }
  }

  return (
    <form className="plate-search-form" onSubmit={handleSubmit}>
      <div className="plate-search-form__row">
        <Input
          label="Placa do veículo"
          name="plate"
          placeholder="ABC1D23"
          value={plate}
          onChange={(event) => setPlate(normalizePlateInput(event.target.value))}
        />
        <Button disabled={plate.length !== 7} type="submit">
          Consultar
        </Button>
      </div>
      <div className="plate-search-form__meta" aria-label="Formato aceito">
        <span>Mercosul: ABC1D23</span>
        <span>Antigo: ABC1234</span>
      </div>
    </form>
  );
}
