import assert from "node:assert";

export const requireEnv = (key: string): string => {
  const value = process.env[key];
  assert.ok(value, `Environment variable ${key} is required but not set.`);
  return value;
};
