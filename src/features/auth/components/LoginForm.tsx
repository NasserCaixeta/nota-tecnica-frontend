import { type FormEvent, useState } from "react";

import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";

export type LoginFormValues = {
  email: string;
  password: string;
};

export function LoginForm({
  onSubmit,
  isSubmitting,
  error,
}: {
  onSubmit: (values: LoginFormValues) => void;
  isSubmitting: boolean;
  error: string | null;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit({ email, password });
  }

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <Input
        label="E-mail"
        name="email"
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />
      <Input
        label="Senha"
        name="password"
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />
      {error ? (
        <p className="login-form__error" role="alert">
          {error}
        </p>
      ) : null}
      <div className="login-form__actions">
        <span className="login-form__hint">Sessão protegida por token de acesso.</span>
        <Button disabled={isSubmitting} type="submit">
          Entrar
        </Button>
      </div>
    </form>
  );
}
