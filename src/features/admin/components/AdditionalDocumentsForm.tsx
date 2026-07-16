import { FormEvent, useState } from "react";

import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import type { ValidationDocumentType } from "../../../lib/api/types";

type AdditionalDocumentsFormProps = {
  isSubmitting: boolean;
  onSubmit: (payload: { requested_document_types: ValidationDocumentType[]; note?: string }) => void | Promise<void>;
};

const documentTypes: ValidationDocumentType[] = [
  "crlv",
  "owner_authorization",
  "relationship_proof",
  "driver_identity",
];

export function AdditionalDocumentsForm({ isSubmitting, onSubmit }: AdditionalDocumentsFormProps) {
  const [selected, setSelected] = useState<ValidationDocumentType[]>([]);
  const [note, setNote] = useState("");

  function toggle(type: ValidationDocumentType) {
    setSelected((current) => (current.includes(type) ? current.filter((item) => item !== type) : [...current, type]));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void onSubmit({ requested_document_types: selected, note });
  }

  return (
    <form className="stack" onSubmit={handleSubmit}>
      <div className="checkbox-grid">
        {documentTypes.map((type) => (
          <label key={type}>
            <input checked={selected.includes(type)} onChange={() => toggle(type)} type="checkbox" />
            {type}
          </label>
        ))}
      </div>
      <Input label="Observação" name="note" value={note} onChange={(event) => setNote(event.target.value)} />
      <Button disabled={isSubmitting || selected.length === 0} type="submit" variant="secondary">
        Solicitar documentos
      </Button>
    </form>
  );
}
