import { defineConfig } from "drizzle-kit";
import { requireEnv } from "./lib/env";

export default defineConfig({
  dialect: "postgresql",
  schema: "./db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: requireEnv("DATABASE_URL"),
  },
});
