import { z } from "zod";
import { DeliveryType, IsoDateTime } from "./common";

/**
 * Локація та доставка (6) — address lookup, delivery-type resolution,
 * branches, time slots and Nova Poshta settlement/office search.
 */

// ── silpo_find_address ──────────────────────────────────────────────────────
export const FindAddressInput = z.object({
  address: z.string().min(1),
});

export const Address = z.object({
  address: z.string(),
  city: z.string(),
  street: z.string(),
  houseNumber: z.string(),
  district: z.string().nullable(),
  latitude: z.number(),
  longitude: z.number(),
});
export const FindAddressOutput = z.object({
  success: z.boolean(),
  summary: z.string().optional(),
  addresses: z.array(Address),
});

// ── silpo_get_available_delivery_types ──────────────────────────────────────
export const GetAvailableDeliveryTypesInput = z.object({
  latitude: z.number(),
  longitude: z.number(),
});

export const DeliveryOption = z.object({
  deliveryType: DeliveryType,
  branchId: z.string().nullable(),
  description: z.string(),
});
export const GetAvailableDeliveryTypesOutput = z.object({
  success: z.boolean(),
  summary: z.string().optional(),
  options: z.array(DeliveryOption),
});

// ── silpo_list_branches ─────────────────────────────────────────────────────
export const ListBranchesInput = z.object({
  hasNP: z.boolean().optional(),
  hasPickup: z.boolean().optional(),
  limit: z.number().int().min(1).max(500).optional(),
  offset: z.number().int().min(0).optional(),
});

export const Branch = z.object({
  branchId: z.string(),
  companyId: z.string(),
  externalId: z.string(),
  city: z.string(),
  address: z.string(),
  latitude: z.string(),
  longitude: z.string(),
  hasPickup: z.boolean(),
  open: z.boolean(),
});
export const ListBranchesOutput = z.object({
  success: z.boolean(),
  summary: z.string().optional(),
  branches: z.array(Branch),
  meta: z.object({ limit: z.number(), offset: z.number(), total: z.number() }),
});

// ── silpo_get_time_slots ────────────────────────────────────────────────────
export const GetTimeSlotsInput = z.object({
  branchId: z.string(),
  deliveryTypes: z.array(DeliveryType).optional(),
  start: IsoDateTime.optional(),
  end: IsoDateTime.optional(),
  limit: z.number().int().min(1).max(100).optional(),
});

export const TimeSlot = z.object({
  start: IsoDateTime,
  end: IsoDateTime,
  available: z.boolean(),
  deliveryType: DeliveryType,
  deliveryCost: z.number(),
  deliveryCostMap: z.array(
    z.object({ cost: z.number(), fromOrderCost: z.number() }),
  ),
  minOrderCost: z.number(),
  maxWeight: z.number(),
  constraints: z.object({
    isLimitedAlcohol: z.boolean(),
    isLimitedTobacco: z.boolean(),
    isLimitedCookedFood: z.boolean(),
    isLimitedOwnCooking: z.boolean(),
  }),
  fast: z.unknown().nullable(),
});
export const GetTimeSlotsOutput = z.object({
  success: z.boolean(),
  summary: z.string().optional(),
  slots: z.array(TimeSlot),
  meta: z.object({ total: z.number() }),
});

// ── silpo_find_nova_poshta_settlements ──────────────────────────────────────
export const FindNovaPoshtaSettlementsInput = z.object({
  title: z.string(),
});

export const NovaPoshtaSettlement = z.object({
  id: z.uuid(),
  title: z.string(),
  area: z.string(),
  region: z.string(),
});
export const FindNovaPoshtaSettlementsOutput = z.object({
  success: z.boolean(),
  summary: z.string().optional(),
  settlements: z.array(NovaPoshtaSettlement),
});

// ── silpo_find_nova_poshta_offices ──────────────────────────────────────────
export const FindNovaPoshtaOfficesInput = z.object({
  settlementId: z.uuid(),
  title: z.string().optional(),
});

export const NovaPoshtaOffice = z.object({
  id: z.uuid(),
  title: z.string(),
  address: z.string(),
  type: z.enum(["office", "parcelLocker"]),
  number: z.number(),
  status: z.string(),
  latitude: z.number(),
  longitude: z.number(),
});
export const FindNovaPoshtaOfficesOutput = z.object({
  success: z.boolean(),
  summary: z.string().optional(),
  offices: z.array(NovaPoshtaOffice),
  meta: z.object({ total: z.number() }),
});
