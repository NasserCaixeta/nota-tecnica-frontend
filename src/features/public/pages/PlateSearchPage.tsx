import { useState } from "react";

import { getVehicleHistoryPreview, type VehicleHistoryPreview } from "../../../lib/api/public";
import { HistoryPreviewPanel } from "../components/HistoryPreviewPanel";
import { PlateSearchForm } from "../components/PlateSearchForm";
import "./PlateSearchPage.css";

const previewFeatures = [
  {
    number: "01",
    title: "Volume de registros",
    text: "Veja quantas manutenções estão vinculadas ao veículo antes de avançar.",
  },
  {
    number: "02",
    title: "Oficinas envolvidas",
    text: "Entenda se o histórico vem de uma oficina única ou de vários prestadores.",
  },
  {
    number: "03",
    title: "Completude do histórico",
    text: "Confira se a base disponível é baixa, média ou alta para aquela placa.",
  },
];

export function PlateSearchPage() {
  const [preview, setPreview] = useState<VehicleHistoryPreview | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSearch(plate: string) {
    setLoading(true);
    setError(null);
    try {
      setPreview(await getVehicleHistoryPreview(plate));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Não foi possível consultar a placa.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="plate-page">
      <section className="plate-page__intro" aria-labelledby="plate-search-title">
        <p className="plate-page__label">Consulta pública</p>
        <h1 id="plate-search-title">Consultar histórico por placa</h1>
        <p className="plate-page__copy">
          Use a placa para conferir uma prévia técnica do histórico disponível. A consulta mostra volume, período,
          oficinas envolvidas e completude sem expor dados sensíveis.
        </p>
        <div className="plate-search-card">
          <h2>Buscar veículo</h2>
          <PlateSearchForm onSearch={handleSearch} />
          <p className="plate-page__hint">Prévia gratuita. O histórico completo depende da disponibilidade de registros.</p>
        </div>
      </section>

      <section className="plate-page__result" aria-label="Resultado da consulta">
        {loading ? <p className="plate-page__status">Consultando base de histórico...</p> : null}
        {error ? (
          <p className="plate-page__status plate-page__status--error" role="alert">
            {error}
          </p>
        ) : null}
        <HistoryPreviewPanel preview={preview} />
      </section>

      <section className="plate-page__features" aria-labelledby="plate-features-title">
        <p className="plate-page__label">Prévia gratuita</p>
        <h2 id="plate-features-title">O que a consulta mostra</h2>
        <div className="plate-page__feature-grid">
          {previewFeatures.map((feature) => (
            <article className="plate-page__feature" key={feature.number}>
              <p className="plate-page__feature-number">{feature.number}</p>
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
