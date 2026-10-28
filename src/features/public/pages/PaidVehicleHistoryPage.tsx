import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ApiError } from "../../../lib/api/client";
import { createHistoryCheckout, getPaidHistory, getPaymentConfig, localDate, money, testPaymentLabel, type PaidHistory, type PaymentConfig } from "../../../lib/api/payments";

export function PaidVehicleHistoryPage() {
  const { plate = "" } = useParams();
  const navigate = useNavigate();
  const generation = useRef(0);
  const [history, setHistory] = useState<PaidHistory | null>(null);
  const [config, setConfig] = useState<PaymentConfig | null>(null);
  const [blocked, setBlocked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const load = useCallback(async () => {
    const request = ++generation.current;
    setHistory(null); setBlocked(false); setLoading(true); setError(null);
    async function showPurchase() {
      if (request !== generation.current) return;
      setBlocked(true);
      try { const result = await getPaymentConfig(); if (request === generation.current) setConfig(result); }
      catch { if (request === generation.current) setError("Não foi possível consultar as opções de compra. Tente atualizar."); }
    }
    try {
      const result = await getPaidHistory(plate);
      if (request !== generation.current) return;
      if (result.access.source === "purchase" && result.access.expires_at && new Date(result.access.expires_at).getTime() <= Date.now()) await showPurchase();
      else setHistory(result);
    } catch (caught) {
      if (request !== generation.current) return;
      if (caught instanceof ApiError && caught.status === 403) await showPurchase();
      else setError(caught instanceof Error ? caught.message : "Não foi possível consultar o histórico.");
    } finally { if (request === generation.current) setLoading(false); }
  }, [plate]);
  useEffect(() => {
    void load();
    const onFocus = () => { void load(); };
    window.addEventListener("focus", onFocus);
    const invalidate = () => { ++generation.current; };
    return () => { invalidate(); window.removeEventListener("focus", onFocus); };
  }, [load]);
  useEffect(() => {
    const expiry = history?.access.expires_at;
    if (!expiry) return;
    const delay = new Date(expiry).getTime() - Date.now();
    const timer = setTimeout(() => { setHistory(null); void load(); }, Math.min(Math.max(delay, 0), 2147000000));
    return () => clearTimeout(timer);
  }, [history, load]);
  async function purchase() {
    setBusy(true); setError(null);
    try { const order = await createHistoryCheckout(plate); navigate(`/app/compras/${order.id}`); }
    catch (caught) { setError(caught instanceof Error ? caught.message : "Não foi possível iniciar a compra."); }
    finally { setBusy(false); }
  }
  return <section className="payment-page">
    <h1>Histórico de {plate}</h1>
    {loading && <p role="status">Verificando acesso e histórico...</p>}
    {error && <p role="alert">{error}</p>}
    {blocked && !loading && <>
      <p>Você precisa de vínculo validado ou de uma compra vigente para consultar o histórico completo desta placa.</p>
      <p>{testPaymentLabel}</p><p>Acesso por 720 horas (30 dias) a partir da confirmação financeira. Novos serviços elegíveis aparecem durante a validade.</p>
      {config?.history_price_cents != null && <p>Preço de teste: {money(config.history_price_cents)}.</p>}
      {config?.enabled ? <button disabled={busy || config.history_price_cents == null} onClick={() => void purchase()}>Comprar acesso de testes por 30 dias</button> : <p>Checkout de testes indisponível: configuração pendente.</p>}
    </>}
    {history && <>
      <p>{history.access.source === "relationship" ? "Acesso pelo seu vínculo validado com o veículo." : `Acesso comprado até ${history.access.expires_at ? localDate(history.access.expires_at) : "o vencimento informado pelo servidor"}.`}</p>
      {history.records.length === 0 && <p>Não há serviços elegíveis para exibição neste momento.</p>}
      {history.records.map((record) => <article key={record.id}>
        <h2>{record.public_description}</h2><p>{record.service_date} · {record.odometer} km</p>
        <p>{record.workshop?.trade_name ?? "Oficina não informada"}</p><p>Total registrado: {money(Math.round(Number(record.total_cost) * 100))}</p>
      </article>)}
    </>}
    <p><button onClick={() => void load()} disabled={busy || loading}>Atualizar acesso e histórico</button></p><Link to="/consultar">Voltar à consulta por placa</Link>
  </section>;
}
