import { StateBlock } from "../../../components/data-display/StateBlock";

export function WorkshopProfilePage() {
  return (
    <main>
      <h1>Perfil da oficina</h1>
      <StateBlock
        title="Perfil em formação"
        message="A API atual expõe dados básicos. Avaliações e comparativos entram em versão futura."
      />
    </main>
  );
}
