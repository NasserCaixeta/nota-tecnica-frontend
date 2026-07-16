import { Panel } from "../ui/Panel";

type PlannedStateProps = {
  title: string;
  description?: string;
};

export function PlannedState({ title, description }: PlannedStateProps) {
  return (
    <Panel title={title} eyebrow="Planejado">
      <p>{description ?? "Este recurso ainda não está disponível nesta versão."}</p>
    </Panel>
  );
}
