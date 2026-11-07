import type { PaymentGatewayAdapter } from "./types"; import { stripe } from "./adapters/stripe";
const adapters: Record<string, PaymentGatewayAdapter> = { stripe };
export const getAdapter = (id: string) => adapters[id];
const PLANNED = [{ id: "stripe", name: "Stripe" }, { id: "paypal", name: "PayPal" }, { id: "square", name: "Square" }];
export const listProviders = () => PLANNED.map(p => ({ ...p, adapterImplemented: !!adapters[p.id] }));
