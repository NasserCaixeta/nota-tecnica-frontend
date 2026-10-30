import { apiRequest } from "./client";
import type { PublishedService } from "./maintenance";

export type PaymentConfig = { enabled: boolean; environment: "sandbox"; label: string; history_price_cents: number | null; subscription_price_cents: number | null; history_access_hours: number; garage_total_limit: number };
export type PaymentOrder = { id: string; product: "history_access" | "garage_monthly"; plate: string | null; amount_cents: number; currency: "BRL"; environment: "sandbox"; state: string; checkout_url: string | null; benefit_active: boolean; benefit_expires_at: string | null };
export type SubscriptionSummary = { capacity_limit: number; free_vehicle_id: number | null; can_start_checkout: boolean; period: { order_id: string; starts_at: string; expires_at: string } | null; subscription: { order_id: string; cancellation_status: string | null } | null };
export type PaidHistory = { plate: string; access: { source: "purchase" | "relationship"; expires_at: string | null }; records: PublishedService[] };
export const getPaymentConfig = () => apiRequest<PaymentConfig>("/payments/config", { auth: false });
export const getPaymentOrder = (id: string) => apiRequest<PaymentOrder>(`/payments/orders/${encodeURIComponent(id)}`);
export const retryPaymentOrder = (id: string) => apiRequest<PaymentOrder>(`/payments/orders/${encodeURIComponent(id)}/retry`, { method: "POST" });
export const createHistoryCheckout = (plate: string) => apiRequest<PaymentOrder>("/payments/history-checkouts", { method: "POST", body: JSON.stringify({ plate }) });
export const createSubscriptionCheckout = () => apiRequest<PaymentOrder>("/payments/subscription-checkouts", { method: "POST", body: "{}" });
export const getSubscription = () => apiRequest<SubscriptionSummary>("/payments/subscription");
export const cancelSubscription = (orderId: string) => apiRequest<{ status: string }>(`/payments/subscriptions/${encodeURIComponent(orderId)}/cancel`, { method: "POST" });
export const getPaidHistory = (plate: string) => apiRequest<PaidHistory>(`/history/vehicles/${encodeURIComponent(plate)}`);
export const testPaymentLabel = "Ambiente de testes — sem cobrança real";
export const money = (cents: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(cents / 100);
export const localDate = (date: string) => new Date(date).toLocaleString("pt-BR");
export function sandboxCheckoutUrl(value: string | null) {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    if (url.origin === "https://checkout.stripe.com" && url.pathname.startsWith("/c/pay/cs_test_") && !url.username && !url.password) return url.href;
  } catch { /* An invalid URL cannot be used for payment navigation. */ }
  return undefined;
}
