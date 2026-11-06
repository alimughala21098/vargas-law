export type Environment = "test" | "live";
export type PaymentStatus = "pending" | "succeeded" | "failed" | "refunded" | "partially_refunded" | "canceled";

export interface CreateCheckoutInput {
  transactionId: string; amountMinor: number; currency: string;
  description: string; customerEmail?: string; successUrl: string; cancelUrl: string;
  idempotencyKey: string;
}
export interface CheckoutSession { providerRef: string; redirectUrl: string }
export interface VerifiedEvent {
  eventId: string; type: string; providerRef?: string;
  status?: PaymentStatus; amountMinor?: number; receivedAt: Date;
}
export interface ConnectionTestResult { ok: boolean; environment: Environment; message: string; testedAt: Date }

/** Every provider implements this. Invoices, portal, booking and reporting only ever see this interface. */
export interface PaymentGatewayAdapter {
  id: string;                       // "stripe" | "paypal" | "square" | ...
  displayName: string;
  credentialFields: { key: string; label: string; secret: boolean }[];
  supportsRefunds: boolean;
  supportedCurrencies: string[];
  testConnection(creds: Record<string,string>, env: Environment): Promise<ConnectionTestResult>;
  createCheckout(creds: Record<string,string>, input: CreateCheckoutInput): Promise<CheckoutSession>;
  /** Must verify the provider signature and throw if invalid. Never trust an unsigned payload. */
  verifyWebhook(rawBody: string, headers: Headers, creds: Record<string,string>): Promise<VerifiedEvent>;
  refund?(creds: Record<string,string>, providerRef: string, amountMinor?: number, reason?: string): Promise<{ providerRefundId: string }>;
}
