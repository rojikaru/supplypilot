import { z } from "zod";
import { DeliveryType, IsoDateTime } from "./common";

/**
 * Каталог (6) — promotions, categories (popular / detail / flat / tree) and
 * curated product sets.
 */

// ── silpo_get_promotions ────────────────────────────────────────────────────
export const GetPromotionsInput = z.object({
  branchId: z.string(),
  deliveryType: DeliveryType,
  timeslotStart: IsoDateTime,
  timeslotEnd: IsoDateTime,
});

export const Promotion = z.object({
  code: z.string(),
  title: z.string(),
  productCount: z.number(),
  url: z.string(),
});
export const GetPromotionsOutput = z.object({
  success: z.boolean(),
  summary: z.string().optional(),
  promotions: z.array(Promotion),
});

// ── silpo_get_popular_categories ────────────────────────────────────────────
export const GetPopularCategoriesInput = z.object({
  branchId: z.string(),
  deliveryType: DeliveryType,
});

export const PopularCategory = z.object({
  id: z.uuid(),
  slug: z.string(),
  title: z.string(),
  url: z.string(),
});
export const GetPopularCategoriesOutput = z.object({
  success: z.boolean(),
  summary: z.string().optional(),
  categories: z.array(PopularCategory),
});

// ── silpo_get_category ──────────────────────────────────────────────────────
export const GetCategoryInput = z.object({
  branchId: z.string(),
  deliveryType: DeliveryType,
  categorySlug: z.string(),
});

/** `visible: false` means the category carries no products at this branch. */
export const CategoryDetails = z.object({
  id: z.uuid(),
  slug: z.string(),
  title: z.string(),
  url: z.string(),
  path: z.array(z.unknown()),
  priceRange: z
    .object({ from: z.number(), to: z.number() })
    .nullable(),
  children: z.array(z.unknown()).nullable(),
  visible: z.boolean(),
});
export const GetCategoryOutput = z.object({
  success: z.boolean(),
  summary: z.string().optional(),
  category: CategoryDetails,
});

// ── silpo_get_categories ────────────────────────────────────────────────────
export const GetCategoriesInput = z.object({
  branchId: z.string(),
  parentId: z.string().optional(),
  limit: z.number().int().min(1).max(1000).optional(),
  offset: z.number().int().min(0).optional(),
});

export const CategoryFlat = z.object({
  id: z.uuid(),
  slug: z.string(),
  title: z.string(),
  parentId: z.string().nullish(),
});
export const GetCategoriesOutput = z.object({
  success: z.boolean(),
  summary: z.string().optional(),
  categories: z.array(CategoryFlat),
  meta: z.object({ limit: z.number(), offset: z.number(), total: z.number() }),
});

// ── silpo_get_categories_tree ───────────────────────────────────────────────
export const GetCategoriesTreeInput = z.object({
  branchId: z.string(),
  deliveryType: DeliveryType,
  timeslotStart: IsoDateTime,
  timeslotEnd: IsoDateTime,
});

/** Recursive node: `total` (product count) is omitted on empty categories. */
export type CategoryTreeNode = {
  slug: string;
  children: CategoryTreeNode[];
  total?: number;
};
export const CategoryTreeNode: z.ZodType<CategoryTreeNode> = z.lazy(() =>
  z.object({
    slug: z.string(),
    children: z.array(CategoryTreeNode),
    total: z.number().optional(),
  }),
);
export const GetCategoriesTreeOutput = z.object({
  success: z.boolean(),
  summary: z.string().optional(),
  tree: z.array(CategoryTreeNode),
});

// ── silpo_get_product_sets ──────────────────────────────────────────────────
export const GetProductSetsInput = z.object({
  branchId: z.string(),
  deliveryType: DeliveryType.optional(),
});

export const ProductSet = z.object({
  slug: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  link: z.string(),
});
export const GetProductSetsOutput = z.object({
  success: z.boolean(),
  summary: z.string().optional(),
  sets: z.array(ProductSet),
});
