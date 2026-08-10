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

/** Comandă minimă pentru tricouri: 5 buc. total, combinate pe orice mărimi/modele. */
export const MIN_TRICOURI_QUANTITY = 5;

export function validateMinTricouQuantity(
  items?: Array<{ quantity?: number; metadata?: { productType?: string } }>
): string | null {
  const tricouQty = (items || [])
    .filter((it) => it.metadata?.productType === 'tricouri')
    .reduce((sum, it) => sum + Number(it.quantity || 0), 0);

  if (tricouQty > 0 && tricouQty < MIN_TRICOURI_QUANTITY) {
    return `Comanda minimă pentru tricouri este de ${MIN_TRICOURI_QUANTITY} bucăți (poți combina mărimi diferite). Ai ${tricouQty} ${tricouQty === 1 ? 'bucată' : 'bucăți'} în coș.`;
  }
  return null;
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
