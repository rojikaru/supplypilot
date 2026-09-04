import { z } from "zod";

/**
 * Shared primitives used across every Silpo MCP tool group.
 *
 * Schemas are split into two kinds per tool:
 *  - `*Input`  — arguments accepted by the tool (mirrors the JSON Schema the
 *                server advertises via tools/list).
 *  - `*Output` — the shape the tool returns (inferred from live responses).
 *
 * All timestamps come back as ISO-8601 strings. Most are UTC (`Z` / `+00:00`),
 * but a few (offline orders, family, certificates) omit the offset — treat
 * those as approximate local dates. We keep them as plain strings rather than
 * coercing to Date so nothing is silently misinterpreted.
 */

/** Every delivery type the catalog/search tools accept. */
export const DeliveryType = z.enum([
  "Unknown",
  "SelfPickup",
  "DeliveryHome",
  "DeliveryFlat",
  "DeliveryOffice",
  "DeliveryGlovo",
  "DeliveryExpress",
  "DeliveryExpressFood",
  "JustIn",
  "LongDelivery",
  "JustInPost",
  "NovaPoshta",
  "DeliveryExpressByPromise",
  "WideAssortDelivery",
  "B2B",
  "PreOrder",
]);
export type DeliveryType = z.infer<typeof DeliveryType>;

/** The narrower set create_shopping_cart accepts. */
export const CreateCartDeliveryType = z.enum([
  "SelfPickup",
  "DeliveryHome",
  "LongDelivery",
  "DeliveryExpressByPromise",
  "WideAssortDelivery",
  "B2B",
  "PreOrder",
  "NovaPoshta",
]);
export type CreateCartDeliveryType = z.infer<typeof CreateCartDeliveryType>;

/** Address kinds accepted by create/update cart. */
export const AddressType = z.enum([
  "house",
  "flat",
  "office",
  "point",
  "self-pickup",
  "nova-poshta",
]);
export type AddressType = z.infer<typeof AddressType>;

/** ISO-8601 datetime string (offset may or may not be present — see file note). */
export const IsoDateTime = z.string();

/** Delivery timeslot boundary pair. */
export const Timeslot = z.object({
  start: IsoDateTime,
  end: IsoDateTime,
});
export type Timeslot = z.infer<typeof Timeslot>;

/**
 * The "cart context" tuple that every 🔒 cart tool needs. Sourced from
 * get_shopping_cart_by_id (branchId/deliveryType/timeslot). Provided as a
 * building block — individual tools inline the exact subset they require.
 */
export const CartContext = z.object({
  branchId: z.string(),
  deliveryType: DeliveryType,
  timeslotStart: IsoDateTime,
  timeslotEnd: IsoDateTime,
});
export type CartContext = z.infer<typeof CartContext>;

/**
 * A catalog product as returned by get_products, find_products_batch,
 * get_similar_products, get_my_favorites and (nested) offline orders.
 * Unresolvable favorites come back with price/stock 0 and no branchId.
 */
export const Product = z.object({
  id: z.uuid(),
  name: z.string(),
  slug: z.string(),
  price: z.number(),
  oldPrice: z.number().nullish(),
  stock: z.number(),
  available: z.boolean(),
  image: z.string().nullish(),
  weighted: z.boolean(),
  step: z.number(),
  displayRatio: z.string().nullish(),
  specialPrices: z.unknown().nullish(),
  companyId: z.uuid().nullish(),
  branchId: z.uuid().nullish(),
  externalProductId: z.number().optional(),
});
export type Product = z.infer<typeof Product>;

/** Standard `{ limit, offset, total }` pagination block many list tools return. */
export const PaginationMeta = z.object({
  limit: z.number().optional(),
  offset: z.number().optional(),
  total: z.number(),
});
export type PaginationMeta = z.infer<typeof PaginationMeta>;

/** Envelope flag present on every successful response. */
export const SuccessFlag = z.object({
  success: z.boolean(),
  summary: z.string().optional(),
});
