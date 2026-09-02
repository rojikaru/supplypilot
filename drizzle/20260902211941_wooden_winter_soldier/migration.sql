CREATE TYPE "approval_status" AS ENUM('pending', 'approved', 'rejected');--> statement-breakpoint
CREATE TYPE "criticality" AS ENUM('low', 'medium', 'high', 'critical');--> statement-breakpoint
CREATE TYPE "plan_status" AS ENUM('draft', 'pending_approval', 'approved', 'rejected', 'executed');--> statement-breakpoint
CREATE TYPE "safety_stock_mode" AS ENUM('min_qty', 'days_coverage', 'service_level');--> statement-breakpoint
CREATE TYPE "severity" AS ENUM('info', 'low', 'medium', 'high', 'critical');--> statement-breakpoint
CREATE TABLE "approval" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7(),
	"plan_id" uuid NOT NULL,
	"actor" text NOT NULL,
	"status" "approval_status" DEFAULT 'pending'::"approval_status" NOT NULL,
	"timestamp" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "audit_event" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7(),
	"actor" text NOT NULL,
	"action" text NOT NULL,
	"reason" text,
	"before" jsonb,
	"after" jsonb,
	"timestamp" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "business_order" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7(),
	"business_id" uuid NOT NULL,
	"type" text NOT NULL,
	"date" timestamp with time zone NOT NULL,
	"payload" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "business" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7(),
	"name" text NOT NULL,
	"type" text NOT NULL,
	"timezone" text DEFAULT 'UTC' NOT NULL,
	"default_location_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "exception" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7(),
	"line_id" uuid,
	"type" text NOT NULL,
	"severity" "severity" DEFAULT 'medium'::"severity" NOT NULL,
	"options" jsonb,
	"resolution" jsonb,
	"resolved" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "inventory_item" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7(),
	"location_id" uuid NOT NULL,
	"resource_id" uuid NOT NULL,
	"on_hand" numeric(14,4) DEFAULT '0' NOT NULL,
	"reserved" numeric(14,4) DEFAULT '0' NOT NULL,
	"incoming" numeric(14,4) DEFAULT '0' NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "location" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7(),
	"business_id" uuid NOT NULL,
	"name" text NOT NULL,
	"address" text,
	"lat" double precision,
	"lng" double precision,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "operational_input" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7(),
	"business_id" uuid NOT NULL,
	"type" text NOT NULL,
	"source_file" text,
	"raw_text" text,
	"parsed_json" jsonb,
	"date" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "procurement_line" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7(),
	"plan_id" uuid NOT NULL,
	"resource_id" uuid NOT NULL,
	"required_qty" numeric(14,4) NOT NULL,
	"stock_qty" numeric(14,4) DEFAULT '0' NOT NULL,
	"safety_qty" numeric(14,4) DEFAULT '0' NOT NULL,
	"net_qty" numeric(14,4) NOT NULL,
	"selected_sku" uuid
);
--> statement-breakpoint
CREATE TABLE "procurement_plan" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7(),
	"business_id" uuid NOT NULL,
	"horizon" text NOT NULL,
	"status" "plan_status" DEFAULT 'draft'::"plan_status" NOT NULL,
	"total_estimated_cost" numeric(14,2),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product_candidate" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7(),
	"resource_id" uuid,
	"silpo_id" text,
	"silpo_sku" text,
	"title" text NOT NULL,
	"package_qty" numeric(14,4),
	"unit" text,
	"price" numeric(14,2),
	"attributes" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "recipe_item" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7(),
	"recipe_id" uuid NOT NULL,
	"resource_id" uuid NOT NULL,
	"quantity" numeric(14,4) NOT NULL,
	"unit" text NOT NULL,
	"substitute_policy" jsonb
);
--> statement-breakpoint
CREATE TABLE "recipe" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7(),
	"name" text NOT NULL,
	"output_unit" text NOT NULL,
	"output_quantity" numeric(14,4) DEFAULT '1' NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "resource" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7(),
	"canonical_name" text NOT NULL,
	"category" text,
	"base_unit" text NOT NULL,
	"criticality" "criticality" DEFAULT 'medium'::"criticality" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "safety_stock_policy" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7(),
	"resource_id" uuid NOT NULL,
	"mode" "safety_stock_mode" NOT NULL,
	"days_coverage" integer,
	"service_level" numeric(5,4),
	"min_qty" numeric(14,4)
);
--> statement-breakpoint
ALTER TABLE "approval" ADD CONSTRAINT "approval_plan_id_procurement_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "procurement_plan"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "business_order" ADD CONSTRAINT "business_order_business_id_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "exception" ADD CONSTRAINT "exception_line_id_procurement_line_id_fkey" FOREIGN KEY ("line_id") REFERENCES "procurement_line"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "inventory_item" ADD CONSTRAINT "inventory_item_location_id_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "location"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "inventory_item" ADD CONSTRAINT "inventory_item_resource_id_resource_id_fkey" FOREIGN KEY ("resource_id") REFERENCES "resource"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "location" ADD CONSTRAINT "location_business_id_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "operational_input" ADD CONSTRAINT "operational_input_business_id_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "procurement_line" ADD CONSTRAINT "procurement_line_plan_id_procurement_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "procurement_plan"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "procurement_line" ADD CONSTRAINT "procurement_line_resource_id_resource_id_fkey" FOREIGN KEY ("resource_id") REFERENCES "resource"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "procurement_line" ADD CONSTRAINT "procurement_line_selected_sku_product_candidate_id_fkey" FOREIGN KEY ("selected_sku") REFERENCES "product_candidate"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "procurement_plan" ADD CONSTRAINT "procurement_plan_business_id_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "product_candidate" ADD CONSTRAINT "product_candidate_resource_id_resource_id_fkey" FOREIGN KEY ("resource_id") REFERENCES "resource"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "recipe_item" ADD CONSTRAINT "recipe_item_recipe_id_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "recipe"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "recipe_item" ADD CONSTRAINT "recipe_item_resource_id_resource_id_fkey" FOREIGN KEY ("resource_id") REFERENCES "resource"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "safety_stock_policy" ADD CONSTRAINT "safety_stock_policy_resource_id_resource_id_fkey" FOREIGN KEY ("resource_id") REFERENCES "resource"("id") ON DELETE CASCADE;