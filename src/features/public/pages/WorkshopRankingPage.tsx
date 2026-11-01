import { PageHeader } from "../../../components/layout/PageHeader";
import { Button } from "../../../components/ui/Button";
import { Select } from "../../../components/ui/Select";
import { Input } from "../../../components/ui/Input";
import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { getWorkshopRanking, type WorkshopRankingResponse } from "../../../lib/api/ranking";
import { WorkshopRankingList } from "../../workshops/components/WorkshopRankingList";
export function WorkshopRankingPage() {
    const [data, setData] = useState<WorkshopRankingResponse | null>(null);
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [category, setCategory] = useState("");
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const request = useRef(0);
    const load = useCallback(async () => { const id = ++request.current; setLoading(true); setData(null); setError(null); try {
        const response = await getWorkshopRanking(new URLSearchParams(query));
        if (id === request.current)
            setData(response);
    }
    catch {
        if (id === request.current)
            setError("Não foi possível carregar o ranking. Tente novamente.");
    }
    finally {
        if (id === request.current)
            setLoading(false);
    } }, [query]);
    useEffect(() => { void load(); }, [load]);
    function filter(e: FormEvent) { e.preventDefault(); const p = new URLSearchParams(); if (city.trim())
        p.set("city", city.trim()); if (state.trim())
        p.set("state", state.trim().toUpperCase()); if (category)
        p.set("category", category); if (p.toString() === query)
        void load();
    else
        setQuery(p.toString()); }
    return <main className="page-section standalone-page"><PageHeader title="Ranking de oficinas" description="Compare oficinas por avaliação, prazo e serviços comprovados, considerando a amostra."/><form className="stack" onSubmit={filter}><Input value={city} onChange={e => setCity(e.target.value)} label="Cidade"/><Input maxLength={2} value={state} onChange={e => setState(e.target.value)} label="UF"/><Select value={category} onChange={e => setCategory(e.target.value)} label="Categoria"><option value="">Todas</option>{Object.entries({ mechanical: "Mecânica", electrical: "Elétrica", bodywork: "Funilaria", paint: "Pintura", detailing: "Estética", tires: "Pneus", inspection: "Revisão", diagnosis: "Diagnóstico", other: "Outro" }).map(([v, l]) => <option key={v} value={v}>{l}</option>)}</Select><Button type="submit">Aplicar filtros</Button></form>
    {error && <p className="message" role="alert">{error} <Button onClick={() => void load()} variant="secondary">Tentar novamente</Button></p>}{loading ? <p role="status">Carregando ranking...</p> : data && <><p>{data.score_explanation}</p><p>Fórmula: {data.score_version}. As amostras correspondem aos filtros aplicados.</p><h2>Oficinas com amostra suficiente</h2><WorkshopRankingList items={data.items}/>{!!data.unranked_items.length && <><h2>Oficinas fora da classificação principal</h2><WorkshopRankingList items={data.unranked_items}/></>}</>}
  </main>;
}
