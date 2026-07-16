import { type FormEvent, useState } from "react";

import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Select } from "../../../components/ui/Select";
import { publicProfileOptions } from "../../../content/auth";

export function RegisterForm({
  onSubmit,
  isSubmitting,
}: {
  onSubmit: (values: Record<string, unknown>) => void;
  isSubmitting: boolean;
}) {
  const [values, setValues] = useState({
    full_name: "",
    email: "",
    password: "",
    cpf: "",
    phone: "",
    birth_date: "",
    profile_type: "customer",
    zip_code: "",
    street: "",
    number: "",
    neighborhood: "",
    city: "",
    state: "",
    complement: "",
  });

  function update(field: keyof typeof values, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit(values);
  }

  return (
    <form className="register-form" onSubmit={handleSubmit}>
      <fieldset>
        <legend className="register-form__section-label">Dados pessoais</legend>
        <div className="register-form__grid">
          <Input
            fieldClassName="register-form__full"
            label="Nome completo"
            name="full_name"
            onChange={(event) => update("full_name", event.target.value)}
            required
          />
          <Input label="CPF" name="cpf" onChange={(event) => update("cpf", event.target.value)} required />
          <Input
            label="Nascimento"
            name="birth_date"
            type="date"
            onChange={(event) => update("birth_date", event.target.value)}
          />
          <Input
            label="Telefone"
            name="phone"
            onChange={(event) => update("phone", event.target.value)}
          />
          <Select
            label="Perfil"
            name="profile_type"
            value={values.profile_type}
            onChange={(event) => update("profile_type", event.target.value)}
          >
            {publicProfileOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </div>
      </fieldset>

      <fieldset>
        <legend className="register-form__section-label">Acesso</legend>
        <div className="register-form__grid">
          <Input
            label="E-mail"
            name="email"
            type="email"
            onChange={(event) => update("email", event.target.value)}
            required
          />
          <Input
            label="Senha"
            name="password"
            type="password"
            onChange={(event) => update("password", event.target.value)}
            required
          />
        </div>
      </fieldset>

      <fieldset>
        <legend className="register-form__section-label">Endereço</legend>
        <div className="register-form__grid">
          <Input label="CEP" name="zip_code" onChange={(event) => update("zip_code", event.target.value)} />
          <Input label="Rua" name="street" onChange={(event) => update("street", event.target.value)} />
          <Input label="Número" name="number" onChange={(event) => update("number", event.target.value)} />
          <Input label="Bairro" name="neighborhood" onChange={(event) => update("neighborhood", event.target.value)} />
          <Input label="Cidade" name="city" onChange={(event) => update("city", event.target.value)} />
          <Input
            label="UF"
            name="state"
            maxLength={2}
            onChange={(event) => update("state", event.target.value.toUpperCase())}
          />
        </div>
      </fieldset>

      <div className="register-form__actions">
        <p>Ao criar a conta, você poderá adicionar veículos, documentos ou dados da oficina no painel.</p>
        <Button disabled={isSubmitting} type="submit">
          Criar conta
        </Button>
      </div>
    </form>
  );
}
