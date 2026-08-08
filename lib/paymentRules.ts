import { getEstimatedShippingCost } from '@/lib/shippingUtils';

/** Peste acest total (lei) rambursul nu apare în checkout. */
export const MAX_RAMBURS_LIMIT = 500;
export const FREE_SHIPPING_THRESHOLD = 500;

export const BANK_TRANSFER_BENEFICIARY = "CULOAREA DIN VIATA SA SRL";
export const BANK_TRANSFER_IBAN = "RO75BREL0002005430850100";
export const BANK_TRANSFER_BANK_NAME = "LIBRA BANK";

export function computeCheckoutTotal(orderData: {
  items?: Array<{ unitAmount?: number; price?: number; quantity?: number }>;
  address?: { country?: string };
  discountAmount?: number;
}): number {
  const items = orderData.items || [];
  const subtotal = items.reduce(
    (s, it) =>
      s + (Number(it.unitAmount ?? it.price ?? 0) * Number(it.quantity ?? 1)),
    0
  );
  const shipping =
    subtotal >= FREE_SHIPPING_THRESHOLD
      ? 0
      : getEstimatedShippingCost(orderData.address?.country || 'RO', items);
  const discount = Number(orderData.discountAmount || 0);
  return Math.max(0, subtotal + shipping - discount);
}

export function validateCheckoutPaymentMethod(
  paymentMethod: string,
  total: number,
  country?: string
): string | null {
  if (paymentMethod === 'cash_on_delivery') {
    if (total > MAX_RAMBURS_LIMIT) {
      return 'Metoda de plată selectată nu este disponibilă pentru această comandă.';
    }
    if (country && country !== 'RO') {
      return 'Rambursul la curier este disponibil doar în România.';
    }
  }
  return null;
}
