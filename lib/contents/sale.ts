export const PAYMENT_METHODS = [
  "Cash",
  "Bank Transfer",
  "QR Payment",
  "Card",
  "E-Wallet",
] as const;

export const PAYMENT_TYPES = [
  "Paid",
  "Unpaid",
  "Partial",
  "Refunded",
] as const;

export const PROCESS_STATUS = [
  "draft",
  "pending",
  "processing",
  "completed",
  "cancelled",
] as const;

export type PaymentMethod = (typeof PAYMENT_METHODS)[number];
export type PaymentType = (typeof PAYMENT_TYPES)[number];
export type ProcessStatus = (typeof PROCESS_STATUS)[number];
