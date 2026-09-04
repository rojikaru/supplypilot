import { z } from "zod";
import { IsoDateTime } from "./common";

/**
 * Лояльність та акції (7) — loyalty card, coupons, personal promos, promo
 * codes, gift certificates and premium subscription.
 */

// ── silpo_get_loyalty_info ──────────────────────────────────────────────────
export const GetLoyaltyInfoInput = z.object({});
export const GetLoyaltyInfoOutput = z.object({
  success: z.boolean(),
  loyalty: z.object({
    card: z.object({
      barcode: z.string(),
      typeName: z.string(),
      memberId: z.number(),
    }),
    balance: z.object({
      total: z.number(),
      currency: z.string(),
      accounts: z.array(
        z.object({ type: z.string(), amount: z.number() }),
      ),
    }),
  }),
});

// ── silpo_get_my_coupons ────────────────────────────────────────────────────
export const Coupon = z.object({
  id: z.number(),
  active: z.boolean(),
  useWay: z.string(),
  beginDate: z.string(),
  endDate: z.string(),
  endDateTime: z.string().nullable(),
  description: z.string(),
  limitText: z.string().nullish(),
  warningText: z.string().nullable(),
  image: z.string().nullish(),
  promoId: z.number(),
  rewardText: z.string(),
  rewardValue: z.number().nullable(),
  rewardUnit: z.string().nullable(),
  rewardSign: z.string().nullable(),
  rewardLimit: z.number().nullable(),
});
export const GetMyCouponsInput = z.object({});
export const GetMyCouponsOutput = z.object({
  success: z.boolean(),
  summary: z.string().optional(),
  coupons: z.array(Coupon),
});

// ── silpo_get_coupon_details ────────────────────────────────────────────────
export const GetCouponDetailsInput = z.object({
  businessCouponId: z.number(),
});
export const CouponDetails = Coupon.extend({
  state: z.string(),
  usedCount: z.number(),
});
export const GetCouponDetailsOutput = z.object({
  success: z.boolean(),
  summary: z.string().optional(),
  coupon: CouponDetails,
});

// ── silpo_get_my_promos ─────────────────────────────────────────────────────
export const Promo = z.object({
  promoId: z.number(),
  selected: z.boolean(),
  beginDate: z.string(),
  endDate: z.string(),
  description: z.string(),
  rewardText: z.string(),
  rewardValue: z.number().nullable(),
  limitText: z.string().nullish(),
  warningText: z.string().nullable(),
  addressListText: z.string().nullish(),
  image: z.string().nullish(),
});
export const GetMyPromosInput = z.object({});
export const GetMyPromosOutput = z.object({
  success: z.boolean(),
  summary: z.string().optional(),
  promos: z.array(Promo),
  meta: z.object({
    total: z.number(),
    minSelect: z.number(),
    maxSelect: z.number(),
  }),
});

// ── silpo_get_promo_codes ───────────────────────────────────────────────────
export const PromoCode = z.object({
  code: z.string(),
  description: z.string().nullish(),
});
export const GetPromoCodesInput = z.object({});
export const GetPromoCodesOutput = z.object({
  success: z.boolean(),
  summary: z.string().optional(),
  // Empty for this account; PromoCode is a best-effort shape.
  promoCodes: z.array(PromoCode),
  meta: z.object({ total: z.number() }),
});

// ── silpo_get_my_certificates ───────────────────────────────────────────────
export const GetMyCertificatesInput = z.object({
  limit: z.number().int().min(1).max(100).optional(),
  offset: z.number().int().min(0).optional(),
});
/**
 * The endpoint returned 500 during probing, so this reflects the documented
 * fields (barcode, pincode, value, expiry) rather than an observed payload.
 */
export const Certificate = z.object({
  barcode: z.string(),
  pincode: z.string().nullish(),
  value: z.number(),
  createdAt: IsoDateTime, // no offset — approximate local date
  expireDate: IsoDateTime, // no offset — approximate local date
});
export const GetMyCertificatesOutput = z.object({
  success: z.boolean(),
  summary: z.string().optional(),
  certificates: z.array(Certificate),
  meta: z.object({ total: z.number() }).optional(),
});

// ── silpo_get_my_premium_subscription ───────────────────────────────────────
export const GetMyPremiumSubscriptionInput = z.object({});
/**
 * When inactive: `webLink`/`mobileLink` (subscribe). When active: share links
 * plus feature/balance cards. All content fields are optional so one schema
 * covers both states.
 */
export const GetMyPremiumSubscriptionOutput = z.object({
  success: z.boolean(),
  summary: z.string().optional(),
  webLink: z.string().optional(),
  mobileLink: z.string().optional(),
  shareWebLink: z.string().optional(),
  shareMobileLink: z.string().optional(),
  createdAt: IsoDateTime.optional(),
  dateFrom: IsoDateTime.optional(),
  dateTo: IsoDateTime.optional(),
  features: z.array(z.unknown()).optional(),
  balances: z.array(z.unknown()).optional(),
});
