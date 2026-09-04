import { z } from "zod";
import { IsoDateTime } from "./common";

/**
 * Профіль (4) — profile, saved delivery addresses, family and food
 * restrictions. All four take no arguments.
 */

const NoInput = z.object({});

// ── silpo_get_my_profile ────────────────────────────────────────────────────
export const GetMyProfileInput = NoInput;
export const GetMyProfileOutput = z.object({
  success: z.boolean(),
  profile: z.object({
    id: z.uuid(),
    firstName: z.string().nullable(),
    lastName: z.string().nullable(),
    middleName: z.string().nullable(),
    phone: z.string(),
    email: z.string().nullable(),
    birthday: z.string().nullable(),
    gender: z.enum(["notSpecified", "male", "female"]),
    status: z.string(),
  }),
});

// ── silpo_get_my_delivery_addresses ─────────────────────────────────────────
export const GetMyDeliveryAddressesInput = NoInput;
/** Empty for this account — items kept permissive until a sample is seen. */
export const GetMyDeliveryAddressesOutput = z.object({
  success: z.boolean(),
  summary: z.string().optional(),
  addresses: z.array(z.unknown()),
});

// ── silpo_get_my_family ─────────────────────────────────────────────────────
export const FamilyMember = z.object({
  profileId: z.uuid(),
  name: z.string(),
  phone: z.string(),
  image: z.string().nullable(),
  profileCreatedAt: IsoDateTime, // no offset — approximate local date
  itsMe: z.boolean(),
});
export const GetMyFamilyInput = NoInput;
export const GetMyFamilyOutput = z.object({
  success: z.boolean(),
  summary: z.string().optional(),
  name: z.string(),
  members: z.array(FamilyMember),
  children: z.array(z.unknown()),
  pets: z.array(z.unknown()),
});

// ── silpo_get_my_food_restrictions ──────────────────────────────────────────
export const GetMyFoodRestrictionsInput = NoInput;
export const GetMyFoodRestrictionsOutput = z.object({
  success: z.boolean(),
  summary: z.string().optional(),
  restrictions: z.array(z.unknown()),
});
