import { defineRelations, sql } from "drizzle-orm";
import {
  boolean,
  doublePrecision,
  integer,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const criticalityEnum = pgEnum("criticality", [
  "low",
  "medium",
  "high",
  "critical",
]);

export const safetyStockModeEnum = pgEnum("safety_stock_mode", [
  "min_qty",
  "days_coverage",
  "service_level",
]);

export const planStatusEnum = pgEnum("plan_status", [
  "draft",
  "pending_approval",
  "approved",
  "rejected",
  "executed",
]);

export const approvalStatusEnum = pgEnum("approval_status", [
  "pending",
  "approved",
  "rejected",
]);

export const severityEnum = pgEnum("severity", [
  "info",
  "low",
  "medium",
  "high",
  "critical",
]);

export const businesses = pgTable("business", {
  id: uuid("id")
    .primaryKey()
    .default(sql`uuidv7()`),
  name: text("name").notNull(),
  type: text("type").notNull(),
  timezone: text("timezone").notNull().default("UTC"),
  // Set after locations exist; FK added lazily to avoid a circular dependency.
  defaultLocationId: uuid("default_location_id"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const locations = pgTable("location", {
  id: uuid("id")
    .primaryKey()
    .default(sql`uuidv7()`),
  businessId: uuid("business_id")
    .notNull()
    .references(() => businesses.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  address: text("address"),
  lat: doublePrecision("lat"),
  lng: doublePrecision("lng"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const operationalInputs = pgTable("operational_input", {
  id: uuid("id")
    .primaryKey()
    .default(sql`uuidv7()`),
  businessId: uuid("business_id")
    .notNull()
    .references(() => businesses.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  sourceFile: text("source_file"),
  rawText: text("raw_text"),
  parsedJson: jsonb("parsed_json"),
  date: timestamp("date", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const businessOrders = pgTable("business_order", {
  id: uuid("id")
    .primaryKey()
    .default(sql`uuidv7()`),
  businessId: uuid("business_id")
    .notNull()
    .references(() => businesses.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  date: timestamp("date", { withTimezone: true }).notNull(),
  payload: jsonb("payload"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const resources = pgTable("resource", {
  id: uuid("id")
    .primaryKey()
    .default(sql`uuidv7()`),
  canonicalName: text("canonical_name").notNull(),
  category: text("category"),
  baseUnit: text("base_unit").notNull(),
  criticality: criticalityEnum("criticality").notNull().default("medium"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const recipes = pgTable("recipe", {
  id: uuid("id")
    .primaryKey()
    .default(sql`uuidv7()`),
  name: text("name").notNull(),
  outputUnit: text("output_unit").notNull(),
  outputQuantity: numeric("output_quantity", { precision: 14, scale: 4 })
    .notNull()
    .default("1"),
  version: integer("version").notNull().default(1),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const recipeItems = pgTable("recipe_item", {
  id: uuid("id")
    .primaryKey()
    .default(sql`uuidv7()`),
  recipeId: uuid("recipe_id")
    .notNull()
    .references(() => recipes.id, { onDelete: "cascade" }),
  resourceId: uuid("resource_id")
    .notNull()
    .references(() => resources.id, { onDelete: "restrict" }),
  quantity: numeric("quantity", { precision: 14, scale: 4 }).notNull(),
  unit: text("unit").notNull(),
  substitutePolicy: jsonb("substitute_policy"),
});

export const inventoryItems = pgTable("inventory_item", {
  id: uuid("id")
    .primaryKey()
    .default(sql`uuidv7()`),
  locationId: uuid("location_id")
    .notNull()
    .references(() => locations.id, { onDelete: "cascade" }),
  resourceId: uuid("resource_id")
    .notNull()
    .references(() => resources.id, { onDelete: "restrict" }),
  onHand: numeric("on_hand", { precision: 14, scale: 4 })
    .notNull()
    .default("0"),
  reserved: numeric("reserved", { precision: 14, scale: 4 })
    .notNull()
    .default("0"),
  incoming: numeric("incoming", { precision: 14, scale: 4 })
    .notNull()
    .default("0"),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const safetyStockPolicies = pgTable("safety_stock_policy", {
  id: uuid("id")
    .primaryKey()
    .default(sql`uuidv7()`),
  resourceId: uuid("resource_id")
    .notNull()
    .references(() => resources.id, { onDelete: "cascade" }),
  mode: safetyStockModeEnum("mode").notNull(),
  daysCoverage: integer("days_coverage"),
  serviceLevel: numeric("service_level", { precision: 5, scale: 4 }),
  minQty: numeric("min_qty", { precision: 14, scale: 4 }),
});

export const procurementPlans = pgTable("procurement_plan", {
  id: uuid("id")
    .primaryKey()
    .default(sql`uuidv7()`),
  businessId: uuid("business_id")
    .notNull()
    .references(() => businesses.id, { onDelete: "cascade" }),
  horizon: text("horizon").notNull(),
  status: planStatusEnum("status").notNull().default("draft"),
  totalEstimatedCost: numeric("total_estimated_cost", {
    precision: 14,
    scale: 2,
  }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const productCandidates = pgTable("product_candidate", {
  id: uuid("id")
    .primaryKey()
    .default(sql`uuidv7()`),
  resourceId: uuid("resource_id").references(() => resources.id, {
    onDelete: "set null",
  }),
  silpoId: text("silpo_id"),
  silpoSku: text("silpo_sku"),
  title: text("title").notNull(),
  packageQty: numeric("package_qty", { precision: 14, scale: 4 }),
  unit: text("unit"),
  price: numeric("price", { precision: 14, scale: 2 }),
  attributes: jsonb("attributes"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const procurementLines = pgTable("procurement_line", {
  id: uuid("id")
    .primaryKey()
    .default(sql`uuidv7()`),
  planId: uuid("plan_id")
    .notNull()
    .references(() => procurementPlans.id, { onDelete: "cascade" }),
  resourceId: uuid("resource_id")
    .notNull()
    .references(() => resources.id, { onDelete: "restrict" }),
  requiredQty: numeric("required_qty", { precision: 14, scale: 4 }).notNull(),
  stockQty: numeric("stock_qty", { precision: 14, scale: 4 })
    .notNull()
    .default("0"),
  safetyQty: numeric("safety_qty", { precision: 14, scale: 4 })
    .notNull()
    .default("0"),
  netQty: numeric("net_qty", { precision: 14, scale: 4 }).notNull(),
  selectedSku: uuid("selected_sku").references(() => productCandidates.id, {
    onDelete: "set null",
  }),
});

export const exceptions = pgTable("exception", {
  id: uuid("id")
    .primaryKey()
    .default(sql`uuidv7()`),
  lineId: uuid("line_id").references(() => procurementLines.id, {
    onDelete: "cascade",
  }),
  type: text("type").notNull(),
  severity: severityEnum("severity").notNull().default("medium"),
  options: jsonb("options"),
  resolution: jsonb("resolution"),
  resolved: boolean("resolved").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const approvals = pgTable("approval", {
  id: uuid("id")
    .primaryKey()
    .default(sql`uuidv7()`),
  planId: uuid("plan_id")
    .notNull()
    .references(() => procurementPlans.id, { onDelete: "cascade" }),
  actor: text("actor").notNull(),
  status: approvalStatusEnum("status").notNull().default("pending"),
  timestamp: timestamp("timestamp", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const auditEvents = pgTable("audit_event", {
  id: uuid("id")
    .primaryKey()
    .default(sql`uuidv7()`),
  actor: text("actor").notNull(),
  action: text("action").notNull(),
  reason: text("reason"),
  before: jsonb("before"),
  after: jsonb("after"),
  timestamp: timestamp("timestamp", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const tables = {
  businesses,
  locations,
  operationalInputs,
  businessOrders,
  resources,
  recipes,
  recipeItems,
  inventoryItems,
  safetyStockPolicies,
  procurementPlans,
  productCandidates,
  procurementLines,
  exceptions,
  approvals,
  auditEvents,
};

export const relations = defineRelations(tables, (r) => ({
  businesses: {
    locations: r.many.locations(),
    defaultLocation: r.one.locations({
      from: r.businesses.defaultLocationId,
      to: r.locations.id,
    }),
    operationalInputs: r.many.operationalInputs(),
    businessOrders: r.many.businessOrders(),
    procurementPlans: r.many.procurementPlans(),
  },
  locations: {
    business: r.one.businesses({
      from: r.locations.businessId,
      to: r.businesses.id,
    }),
    inventoryItems: r.many.inventoryItems(),
  },
  operationalInputs: {
    business: r.one.businesses({
      from: r.operationalInputs.businessId,
      to: r.businesses.id,
    }),
  },
  businessOrders: {
    business: r.one.businesses({
      from: r.businessOrders.businessId,
      to: r.businesses.id,
    }),
  },
  resources: {
    recipeItems: r.many.recipeItems(),
    inventoryItems: r.many.inventoryItems(),
    safetyStockPolicies: r.many.safetyStockPolicies(),
    productCandidates: r.many.productCandidates(),
    procurementLines: r.many.procurementLines(),
  },
  recipes: {
    items: r.many.recipeItems(),
  },
  recipeItems: {
    recipe: r.one.recipes({
      from: r.recipeItems.recipeId,
      to: r.recipes.id,
    }),
    resource: r.one.resources({
      from: r.recipeItems.resourceId,
      to: r.resources.id,
    }),
  },
  inventoryItems: {
    location: r.one.locations({
      from: r.inventoryItems.locationId,
      to: r.locations.id,
    }),
    resource: r.one.resources({
      from: r.inventoryItems.resourceId,
      to: r.resources.id,
    }),
  },
  safetyStockPolicies: {
    resource: r.one.resources({
      from: r.safetyStockPolicies.resourceId,
      to: r.resources.id,
    }),
  },
  procurementPlans: {
    business: r.one.businesses({
      from: r.procurementPlans.businessId,
      to: r.businesses.id,
    }),
    lines: r.many.procurementLines(),
    approvals: r.many.approvals(),
  },
  productCandidates: {
    resource: r.one.resources({
      from: r.productCandidates.resourceId,
      to: r.resources.id,
    }),
  },
  procurementLines: {
    plan: r.one.procurementPlans({
      from: r.procurementLines.planId,
      to: r.procurementPlans.id,
    }),
    resource: r.one.resources({
      from: r.procurementLines.resourceId,
      to: r.resources.id,
    }),
    selectedCandidate: r.one.productCandidates({
      from: r.procurementLines.selectedSku,
      to: r.productCandidates.id,
    }),
    exceptions: r.many.exceptions(),
  },
  exceptions: {
    line: r.one.procurementLines({
      from: r.exceptions.lineId,
      to: r.procurementLines.id,
    }),
  },
  approvals: {
    plan: r.one.procurementPlans({
      from: r.approvals.planId,
      to: r.procurementPlans.id,
    }),
  },
  auditEvents: {},
}));
