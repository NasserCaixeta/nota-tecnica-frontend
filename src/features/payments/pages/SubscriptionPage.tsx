import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { cancelSubscription, createSubscriptionCheckout, getPaymentConfig, getSubscription, localDate, money, testPaymentLabel, type PaymentConfig, type SubscriptionSummary } from "../../../lib/api/payments";

export function SubscriptionPage() {
  const navigate = useNavigate();
  const [config, setConfig] = useState<PaymentConfig | null>(null);
  const [summary, setSummary] = useState<SubscriptionSummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const reload = useCallback(async () => {
    const [configuration, subscription] = await Promise.all([getPaymentConfig(), getSubscription()]);
    setConfig(configuration); setSummary(subscription);
  }, []);
  useEffect(() => { let active = true; void reload().catch((caught: unknown) => { if (active) setError(caught instanceof Error ? caught.message : "Não foi possível consultar a assinatura."); }); return () => { active = false; }; }, [reload]);
  async function purchase() {
    setBusy(true); setError(null);
    try { const order = await createSubscriptionCheckout(); navigate(`/app/compras/${order.id}`); }
    catch (caught) { setError(caught instanceof Error ? caught.message : "Não foi possível iniciar o checkout."); }
    finally { setBusy(false); }
  }
  async function cancel() {
    if (!summary?.subscription) return;
    setBusy(true); setError(null);
    try { await cancelSubscription(summary.subscription.order_id); await reload(); }
    catch (caught) { setError(caught instanceof Error ? caught.message : "Não foi possível cancelar a renovação."); }
    finally { setBusy(false); }
  }
  return <section className="payment-page">
    <h1>Assinatura da garagem</h1><p>{testPaymentLabel}</p>
    <p>Uma assinatura mensal permite até 5 veículos no total. Sem assinatura, uma vaga é gratuita.</p>
    <p>Vínculos e comprovantes continuam sujeitos à aprovação. A assinatura libera capacidade comercial.</p>
    {error && <p role="alert">{error}</p>}
    {!summary && !error && <p>Consultando assinatura...</p>}
    {summary && <>
      <p>Capacidade atual: {summary.capacity_limit} {summary.capacity_limit === 1 ? "veículo" : "veículos"}.</p>
      {summary.period && <p>Período confirmado até {localDate(summary.period.expires_at)}. O cancelamento preserva este período.</p>}
      {summary.subscription?.cancellation_status === "confirmed" ? <p role="status">Renovação cancelada. Os dados da garagem permanecem disponíveis.</p> : summary.subscription && <>
        {summary.subscription.cancellation_status === "reconciliation_required" && <p role="alert">Cancelamento pendente de reconciliação. A renovação ainda não foi confirmada como cancelada.</p>}
        <button onClick={() => void cancel()} disabled={busy}>Cancelar renovação</button>
      </>}
      {summary.can_start_checkout && <>
        {config?.subscription_price_cents != null && <p>Preço de teste: {money(config.subscription_price_cents)} por mês.</p>}
        {config?.enabled ? <button disabled={busy || config.subscription_price_cents == null} onClick={() => void purchase()}>Iniciar assinatura de testes</button> : <p>Checkout de testes indisponível: configuração pendente.</p>}
      </>}
      <p>Após vencer, os adicionais ficam disponíveis para leitura e você pode escolher o veículo gratuito.</p>
      <Link to="/app/garagem">Gerenciar garagem e veículo gratuito</Link>
    </>}
    {error && <button disabled={busy} onClick={() => { setError(null); void reload().catch((caught: unknown) => setError(caught instanceof Error ? caught.message : "Falha ao atualizar.")); }}>Tentar novamente</button>}
  </section>;
}
