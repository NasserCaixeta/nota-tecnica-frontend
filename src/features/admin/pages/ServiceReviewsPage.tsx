import { PageHeader } from "../../../components/layout/PageHeader";
import { StateBlock } from "../../../components/data-display/StateBlock";
import { Textarea } from "../../../components/ui/Textarea";
import { Button } from "../../../components/ui/Button";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../../../lib/api/client";
import { serviceError } from "../../../lib/api/maintenance";
type Review = {
    id: number;
    record_id: number;
    stars: number;
    comment: string;
    comment_hidden: boolean;
    review_version: number;
};
export function ServiceReviewsPage() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [reasons, setReasons] = useState<Record<number, string>>({});
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [busy, setBusy] = useState(false);
    const load = useCallback(async () => { setLoading(true); setError(null); try {
        setReviews(await apiRequest<Review[]>("/admin/service-reviews"));
    }
    catch (e) {
        setError(serviceError(e));
    }
    finally {
        setLoading(false);
    } }, []);
    useEffect(() => { void load(); }, [load]);
    async function moderate(review: Review) {
        setBusy(true);
        setError(null);
        try {
            await apiRequest(`/admin/service-reviews/${review.id}`, { method: "PATCH", body: JSON.stringify({ expected_version: review.review_version, comment_hidden: !review.comment_hidden, reason: reasons[review.id] }) });
            await load();
        }
        catch (e) {
            setError(serviceError(e));
        }
        finally {
            setBusy(false);
        }
    }
    return <section className="page-section"><PageHeader title="Comentários de avaliações" description="Revise a exibição dos comentários, preservando as estrelas escolhidas pelo cliente."/><p>A moderação altera a exibição do comentário, preservando as estrelas escolhidas pelo cliente.</p>{error && <p className="message" role="alert">{error} <Button onClick={() => void load()} variant="secondary">Atualizar</Button></p>}{loading ? <StateBlock kind="loading" title="Carregando..."/> : error ? null : !reviews.length ? <StateBlock title="Nenhum comentário para análise." description="Comentários enviados pelos clientes serão exibidos nesta fila."/> : reviews.map(r => <article className="panel admin-card" key={r.id}><Link to={`/admin/servicos/${r.record_id}`}>Abrir atendimento</Link><p>{r.stars} estrelas · {r.comment_hidden ? "Comentário oculto" : "Comentário visível"}</p><p>{r.comment}</p><Textarea value={reasons[r.id] ?? ""} onChange={e => setReasons(c => ({ ...c, [r.id]: e.target.value }))} label={<>Justificativa para o comentário {r.id}</>}/><Button disabled={busy || !reasons[r.id]?.trim()} onClick={() => void moderate(r)}>{r.comment_hidden ? "Liberar comentário" : "Ocultar comentário"}</Button></article>)}</section>;
}
