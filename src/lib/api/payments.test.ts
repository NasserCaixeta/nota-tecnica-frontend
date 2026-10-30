import { expect, it } from "vitest";
import { sandboxCheckoutUrl } from "./payments";

it("allows only hosted Stripe test checkout URLs", () => {
  const url = "https://checkout.stripe.com/c/pay/cs_test_example#checkout-context";
  expect(sandboxCheckoutUrl(url)).toBe(url);
});

it.each([
  "https://sandbox.asaas.com/checkoutSession/show?id=checkout",
  "https://checkout.stripe.com/c/pay/cs_live_example",
  "https://checkout.stripe.com.attacker.invalid/c/pay/cs_test_example",
  "https://user:password@checkout.stripe.com/c/pay/cs_test_example",
  "http://checkout.stripe.com/c/pay/cs_test_example",
  "javascript:alert(1)",
])("rejects unsupported checkout destination %s", url => {
  expect(sandboxCheckoutUrl(url)).toBeUndefined();
});
