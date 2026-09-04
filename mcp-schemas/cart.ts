import { z } from "zod";
import {
  AddressType,
  CreateCartDeliveryType,
  DeliveryType,
  Timeslot,
} from "./common";

/**
 * Кошик (8) — the central object. Bootstrap with get_my_shopping_cart →
 * get_shopping_cart_by_id, then mutate via the ✎ write tools.
 */

// ── Shared cart sub-schemas ─────────────────────────────────────────────────

/** Address as stored on the cart. Note: lat/lng are STRINGS here (not numbers). */
export const CartAddress = z.object({
  addressType: AddressType,
  latitude: z.string(),
  longitude: z.string(),
  courrierComment: z.string().nullish(),
  phone: z.string().nullish(),
  country: z.string().nullish(),
  postCode: z.string().nullish(),
  region: z.string().nullish(),
  district: z.string().nullish(),
  city: z.string().nullish(),
  street: z.string().nullish(),
  house: z.string().nullish(),
  locality: z.string().nullish(),
  polygonId: z.string().nullish(),
});

export const CartProduct = z.object({
  productId: z.uuid(),
  companyId: z.uuid().optional(),
  branchId: z.uuid().optional(),
  quantity: z.number().optional(),
  comment: z.string().nullish(),
});

export const CartShipment = z.object({
  id: z.uuid(),
  companyId: z.uuid(),
  branchId: z.uuid(),
  products: z.array(CartProduct),
});

/** A blocking/warning/info note attached to the cart calculation. */
export const CartValidation = z.object({
  level: z.enum(["error", "warning", "info"]),
  type: z.string(),
  message: z.string(),
  context: z.union([z.array(z.unknown()), z.record(z.string(), z.unknown())]),
});

export const CartCalculation = z.object({
  total: z.number(),
  totalAfterDiscounts: z.number(),
  certificatesTotal: z.number(),
  subTotal: z.number(),
  subDiscount: z.number(),
  productsTotal: z.number(),
  delivery: z.object({
    total: z.number(),
    totalWeight: z.number(),
    deliveryExpressByPromise: z
      .object({
        promiseTime: z.number(),
        isAvailable: z.boolean(),
        isTemporarilyUnavailable: z.boolean(),
        price: z.number(),
        branchId: z.uuid(),
      })
      .nullish(),
  }),
  promoCode: z.string().nullable(),
  payment: z.object({ availableTypes: z.array(z.unknown()) }),
  validations: z.array(CartValidation),
});

export const CartLoyalty = z.object({
  bonusAvailable: z.number(),
  bonusTotal: z.number(),
  bonusRequested: z.number().nullable(),
  isEnabled: z.boolean(),
});

export const Cart = z.object({
  id: z.uuid(),
  deliveryType: DeliveryType,
  timeslot: Timeslot,
  address: CartAddress,
  shipments: z.array(CartShipment),
  feedbackContacts: z.enum(["call", "doNotCall"]),
  feedbackChanges: z.enum(["approvedChanges", "disapprovedChanges"]),
  promoCode: z.string().nullable(),
  packageType: z.string(),
  paymentType: z.string(),
  certificates: z.array(z.unknown()),
  isAdultConfirmed: z.boolean(),
  calculation: CartCalculation,
});

// ── silpo_get_my_shopping_cart ──────────────────────────────────────────────
export const GetMyShoppingCartInput = z.object({});
export const GetMyShoppingCartOutput = z.object({
  success: z.boolean(),
  shoppingCartId: z.uuid().nullable(),
  exists: z.boolean(),
});

// ── silpo_create_shopping_cart (✎ write, idempotent) ────────────────────────
export const CreateShoppingCartInput = z.object({
  addressType: AddressType,
  latitude: z.number(),
  longitude: z.number(),
  deliveryType: CreateCartDeliveryType,
  branchId: z.string(),
  timeslot: Timeslot,
  city: z.string().optional(),
  street: z.string().optional(),
  house: z.string().optional(),
  district: z.string().optional(),
});
export const CreateShoppingCartOutput = z.object({
  success: z.boolean(),
  summary: z.string().optional(),
  shoppingCartId: z.uuid(),
});

// ── silpo_get_shopping_cart_by_id ───────────────────────────────────────────
export const GetShoppingCartByIdInput = z.object({
  shoppingCartId: z.uuid(),
});
export const GetShoppingCartByIdOutput = z.object({
  success: z.boolean(),
  summary: z.string().optional(),
  cart: Cart,
  loyalty: CartLoyalty,
});

// ── silpo_add_or_update_cart_products (✎ write) ─────────────────────────────
export const AddCartProductInput = z.object({
  productId: z.uuid(),
  companyId: z.uuid(),
  branchId: z.uuid(),
  quantity: z.number().gt(0),
  addQuantity: z.boolean().optional(),
  comment: z.string().optional(),
});
export const AddOrUpdateCartProductsInput = z.object({
  shoppingCartId: z.uuid(),
  products: z.array(AddCartProductInput).min(1),
});
export const AddOrUpdateCartProductsOutput = z.object({
  success: z.boolean(),
  summary: z.string().optional(),
  products: z.array(z.object({ productId: z.uuid(), quantity: z.number() })),
});

// ── silpo_remove_cart_products (✎ write) ────────────────────────────────────
export const RemoveCartProductsInput = z.object({
  shoppingCartId: z.uuid(),
  products: z.array(z.object({ productId: z.uuid() })).min(1),
});
export const RemoveCartProductsOutput = z.object({
  success: z.boolean(),
  summary: z.string().optional(),
  products: z.array(z.object({ productId: z.uuid() })),
});

// ── silpo_clear_shopping_cart (✎ write) ─────────────────────────────────────
export const ClearShoppingCartInput = z.object({
  shoppingCartId: z.uuid(),
});
export const ClearShoppingCartOutput = z.object({
  success: z.boolean(),
  summary: z.string().optional(),
});

// ── silpo_update_shopping_cart (✎ write) ────────────────────────────────────
export const UpdateShoppingCartInput = z.object({
  shoppingCartId: z.uuid(),
  deliveryType: z.string(),
  timeslot: Timeslot,
  // Full address object copied verbatim from get_shopping_cart_by_id.
  address: z.record(z.string(), z.unknown()),
  shipments: z
    .array(z.object({ companyId: z.uuid(), branchId: z.uuid() }))
    .min(1),
  branchId: z.uuid().optional(),
  promoCode: z.string().nullish(),
  bonusRequested: z.number().nullish(),
  isAdultConfirmed: z.boolean().optional(),
  feedbackChanges: z.enum(["approvedChanges", "disapprovedChanges"]).optional(),
  feedbackContacts: z.enum(["call", "doNotCall"]).optional(),
});
export const UpdateShoppingCartOutput = z.object({
  success: z.boolean(),
  summary: z.string().optional(),
  shoppingCartId: z.uuid(),
});

// ── silpo_add_or_update_certificates (✎ write) ──────────────────────────────
export const CertificateRef = z.object({
  barcode: z.string(),
  pincode: z.string().optional(),
});
export const AddOrUpdateCertificatesInput = z.object({
  shoppingCartId: z.uuid(),
  certificatesToAdd: z.array(CertificateRef).max(10).optional(),
  certificatesToRemove: z.array(CertificateRef).max(10).optional(),
});
export const CertificateResult = z.object({
  barcode: z.string(),
  faceValue: z.number().nullable(),
  validations: z.array(
    z.object({
      level: z.string(),
      type: z.string(),
      message: z.string(),
      context: z.record(z.string(), z.unknown()),
    }),
  ),
});
export const AddOrUpdateCertificatesOutput = z.object({
  success: z.boolean(),
  summary: z.string().optional(),
  added: z.array(CertificateResult),
  removed: z.array(CertificateResult),
});
