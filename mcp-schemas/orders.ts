import { z } from "zod";
import { DeliveryType, IsoDateTime, Product } from "./common";

/**
 * Замовлення (2) — online (silpo.ua / app) and offline (in-store receipts)
 * order history.
 */

// ── silpo_get_my_online_orders ──────────────────────────────────────────────
export const GetMyOnlineOrdersInput = z.object({
  limit: z.number().int().min(1).max(50).optional(),
  offset: z.number().int().min(0).optional(),
});

/**
 * Shape inferred from an empty history for this account. The `orders` items are
 * kept permissive (`unknown`) since no populated sample was observed — tighten
 * once a real online order is available.
 */
export const GetMyOnlineOrdersOutput = z.object({
  success: z.boolean(),
  summary: z.string().optional(),
  orders: z.array(z.unknown()),
  meta: z.object({ limit: z.number(), offset: z.number(), total: z.number() }),
});

// ── silpo_get_my_offline_orders ─────────────────────────────────────────────
export const GetMyOfflineOrdersInput = z.object({
  branchId: z.string(),
  deliveryType: DeliveryType,
  timeslotStart: IsoDateTime,
  timeslotEnd: IsoDateTime,
  dateStart: IsoDateTime.optional(),
  dateEnd: IsoDateTime.optional(),
  limit: z.number().int().min(1).max(10).optional(),
  offset: z.number().int().min(0).optional(),
});

/** A promotion/coupon that paid out on a receipt (join via promoId). */
export const OrderReward = z.object({
  rewardGroupCodeName: z.string(),
  applyText: z.string(),
  valueText: z.string(),
  applyRewardAmount: z.number(),
  promoId: z.number(),
});

/** A single receipt line. `catalogProduct` is null when not reorderable. */
export const OfflineOrderProduct = z.object({
  lagerId: z.number(),
  name: z.string(),
  unit: z.string(),
  quantity: z.number(),
  price: z.number(),
  image: z.string().nullish(),
  catalogProduct: Product.nullable(),
});

export const OfflineOrder = z.object({
  filId: z.number(),
  filialName: z.string(),
  cityName: z.string(),
  createdAt: IsoDateTime, // no offset — treat as approximate local date
  sumReg: z.number(),
  accruedBalaBonusesSum: z.number(),
  sumDiscount: z.number(),
  receiptUrl: z.string(),
  chequeMagicName: z.string().nullish(),
  chequePrediction: z.string().nullish(),
  rewards: z.array(OrderReward),
  products: z.array(OfflineOrderProduct),
});
export const GetMyOfflineOrdersOutput = z.object({
  success: z.boolean(),
  summary: z.string().optional(),
  orders: z.array(OfflineOrder),
  meta: z.object({ limit: z.number(), offset: z.number(), total: z.number() }),
});
