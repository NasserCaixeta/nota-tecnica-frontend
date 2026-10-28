import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getPaymentOrder, localDate, money, retryPaymentOrder, sandboxCheckoutUrl, testPaymentLabel, type PaymentOrder } from "../../../lib/api/payments";

const pendingStates = ["created", "checkout_pending", "reconciliation_required", "checkout_failed"];
const statusLabels: Record<string, string> = { created: "Preparando checkout", checkout_pending: "Aguardando confirmação financeira", reconciliation_required: "Confirmação pendente de reconciliação", checkout_failed: "Não foi possível preparar o checkout", paid: "Pagamento confirmado pelo servidor", refunded: "Pagamento estornado", rejected: "Pagamento recusado", cancelled: "Pedido cancelado", expired: "Checkout vencido" };

export function CheckoutStatusPage() {
  const { orderId = "" } = useParams();
  const [order, setOrder] = useState<PaymentOrder | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [refresh, setRefresh] = useState(0);
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;
    let attempts = 0;
    setOrder(null);
    setError(null);
    async function update() {
      try {
        const result = await getPaymentOrder(orderId);
        if (cancelled) return;
        setOrder(result);
        setError(null);
        if (pendingStates.includes(result.state) && ++attempts < 12) timer = setTimeout(() => void update(), 5000);
      } catch (caught) { if (!cancelled) setError(caught instanceof Error ? caught.message : "Não foi possível consultar o pedido."); }
    }
    void update();
    return () => { cancelled = true; clearTimeout(timer); };
  }, [orderId, refresh]);
  async function reconcile() {
    setBusy(true);
    setError(null);
    try { setOrder(await retryPaymentOrder(orderId)); setRefresh((value) => value + 1); }
    catch (caught) { setError(caught instanceof Error ? caught.message : "Não foi possível reconciliar."); }
    finally { setBusy(false); }
  }
  const checkout = sandboxCheckoutUrl(order?.checkout_url ?? null);
  return <section className="payment-page">
    <h1>Acompanhar pedido</h1><p>{testPaymentLabel}</p>
    {error && <p role="alert">{error}</p>}
    {!order && !error && <p role="status">Consultando pedido...</p>}
    {order && <>
      <p>Produto: {order.product === "history_access" ? `Histórico de ${order.plate ?? "uma placa"} por 720 horas` : "Garagem mensal com até 5 veículos no total"}</p>
      <p>Preço de teste: {money(order.amount_cents)}</p>
      <p role="status">{statusLabels[order.state] ?? "Situação em análise"}</p>
      {order.state === "checkout_pending" && checkout && <p><a href={checkout}>Continuar no checkout de testes</a></p>}
      {order.state === "checkout_pending" && order.checkout_url && !checkout && <p role="alert">O endereço do checkout não é válido para o ambiente de testes. Requer reconciliação.</p>}
      {["created", "reconciliation_required", "checkout_failed"].includes(order.state) && <><p>Este pedido ainda não libera benefícios. A reconciliação consulta o mesmo pedido.</p><button disabled={busy} onClick={() => void reconcile()}>Reconciliar pedido</button></>}
      {order.state === "paid" && (order.benefit_active ? <>
        <p>Benefício confirmado até {order.benefit_expires_at ? localDate(order.benefit_expires_at) : "o fim do período informado pelo servidor"}.</p>
        <Link to={order.product === "history_access" && order.plate ? `/app/historico/${encodeURIComponent(order.plate)}` : "/app/assinatura"}>{order.product === "history_access" ? "Ver histórico" : "Ver assinatura"}</Link>
      </> : <p>O período deste benefício terminou ou não está disponível. Consulte seu acesso atual.</p>)}
      {["rejected", "cancelled", "expired", "refunded"].includes(order.state) && <Link to={order.product === "history_access" && order.plate ? `/app/historico/${encodeURIComponent(order.plate)}` : "/app/assinatura"}>Conferir acesso e opções de compra</Link>}
    </>}
    <p><button onClick={() => setRefresh((value) => value + 1)} disabled={busy}>Atualizar pedido</button></p>
  </section>;
}
