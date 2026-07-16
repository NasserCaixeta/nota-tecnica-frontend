import { Panel } from "../ui/Panel";

type StateBlockProps = {
  title: string;
  message?: string;
  description?: string;
};

export function StateBlock({ title, message, description }: StateBlockProps) {
  return (
    <Panel title={title}>
      {message || description ? <p>{message ?? description}</p> : null}
    </Panel>
  );
}
