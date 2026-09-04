import { z } from "zod";
import { DeliveryType, IsoDateTime, Product } from "./common";

/**
 * Пошук товарів (7) — batch/browse search, product detail, similar,
 * replacements and favorites (read + write).
 */

// ── silpo_find_products_batch ───────────────────────────────────────────────
export const FindProductsBatchInput = z.object({
  branchId: z.string(),
  deliveryType: DeliveryType,
  timeslotStart: IsoDateTime,
  timeslotEnd: IsoDateTime,
  products: z.array(z.string()).max(30),
  limit: z.number().int().min(1).max(100).optional(),
});

export const ProductQueryResult = z.object({
  query: z.string(),
  totalFound: z.number(),
  products: z.array(Product),
});
export const FindProductsBatchOutput = z.object({
  success: z.boolean(),
  summary: z.string().optional(),
  queries: z.array(ProductQueryResult),
  meta: z.object({ totalQueries: z.number(), totalProducts: z.number() }),
});

// ── silpo_get_products ──────────────────────────────────────────────────────
export const GetProductsInput = z.object({
  branchId: z.string(),
  deliveryType: DeliveryType,
  timeslotStart: IsoDateTime,
  timeslotEnd: IsoDateTime,
  category: z.string().optional(),
  set: z.string().optional(),
  promotionCode: z.string().optional(),
  mustHavePromotion: z.boolean().optional(),
  inStock: z.boolean().optional(),
  fromPrice: z.number().optional(),
  toPrice: z.number().optional(),
  sortBy: z
    .enum([
      "popularity",
      "score",
      "title",
      "price",
      "promotion",
      "productsList",
      "slugsList",
      "guestRating",
      "carouselList",
    ])
    .optional(),
  sortDirection: z.enum(["asc", "desc"]).optional(),
  limit: z.number().int().min(1).max(100).optional(),
  offset: z.number().int().min(0).optional(),
});

export const GetProductsOutput = z.object({
  success: z.boolean(),
  summary: z.string().optional(),
  products: z.array(Product),
  meta: z.object({ limit: z.number(), offset: z.number(), total: z.number() }),
});

// ── silpo_get_product_details ───────────────────────────────────────────────
export const GetProductDetailsInput = z.object({
  branchId: z.string(),
  slug: z.string(),
  deliveryType: DeliveryType,
  timeslotStart: IsoDateTime,
  timeslotEnd: IsoDateTime,
});

export const ProductDetails = z.object({
  id: z.uuid(),
  name: z.string(),
  slug: z.string(),
  price: z.number(),
  oldPrice: z.number().nullish(),
  stock: z.number(),
  available: z.boolean(),
  weighted: z.boolean(),
  step: z.number(),
  ratio: z.string(),
  displayRatio: z.string(),
  url: z.string(),
  images: z.array(z.string()),
  // Free-form label → value map (country, brand, nutrition facts, …).
  attributes: z.record(z.string(), z.union([z.string(), z.number()])),
  companyId: z.uuid(),
  branchId: z.uuid(),
});
export const GetProductDetailsOutput = z.object({
  success: z.boolean(),
  summary: z.string().optional(),
  product: ProductDetails,
});

// ── silpo_get_similar_products ──────────────────────────────────────────────
export const GetSimilarProductsInput = z.object({
  branchId: z.string(),
  slug: z.string(),
  deliveryType: DeliveryType.optional(),
  limit: z.number().optional(),
  offset: z.number().optional(),
});
export const GetSimilarProductsOutput = z.object({
  success: z.boolean(),
  summary: z.string().optional(),
  products: z.array(Product),
  meta: z.object({ total: z.number() }),
});

// ── silpo_get_replacements ──────────────────────────────────────────────────
export const GetReplacementsInput = z.object({
  branchId: z.string(),
  companyId: z.string(),
  productIds: z.array(z.string()),
  deliveryType: DeliveryType,
});

/** Empty `items` is the normal outcome — means "no picking risk". */
export const ReplacementGroup = z.object({
  productId: z.string(),
  replacements: z.array(Product),
});
export const GetReplacementsOutput = z.object({
  success: z.boolean(),
  summary: z.string().optional(),
  items: z.array(ReplacementGroup),
});

// ── silpo_get_my_favorites ──────────────────────────────────────────────────
export const GetMyFavoritesInput = z.object({
  branchId: z.string(),
  deliveryType: DeliveryType,
  timeslotStart: IsoDateTime,
  limit: z.number().int().min(1).max(500).optional(),
  offset: z.number().int().min(0).optional(),
});
export const GetMyFavoritesOutput = z.object({
  success: z.boolean(),
  summary: z.string().optional(),
  products: z.array(Product),
  meta: z.object({ limit: z.number(), offset: z.number(), total: z.number() }),
});

// ── silpo_add_or_update_favorite_products (✎ write) ─────────────────────────
export const FavoriteAction = z.object({
  productId: z.uuid(),
  externalProductId: z.number().int(),
  toDelete: z.boolean(),
});
export const AddOrUpdateFavoriteProductsInput = z.object({
  actions: z.array(FavoriteAction).min(1).max(5),
});
export const AddOrUpdateFavoriteProductsOutput = z.object({
  success: z.boolean(),
  summary: z.string().optional(),
  actions: z.array(z.object({ productId: z.uuid(), toDelete: z.boolean() })),
});
