import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { requireEnv } from "@/lib/env";
import { relations } from "./schema";

const connectionString = requireEnv("DATABASE_URL");

const client = postgres(connectionString, {
  max: 10,
});

export const db = drizzle({ client, relations });
export type Database = typeof db;
