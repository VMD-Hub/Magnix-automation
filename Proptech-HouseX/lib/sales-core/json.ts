import type { Prisma } from "@prisma/client";
import { SalesCoreRuleError } from "./domain";

function toPrismaJsonValue(value: unknown): Prisma.InputJsonValue | null {
  if (value === null) return null;
  if (
    typeof value === "string" ||
    typeof value === "boolean"
  ) {
    return value;
  }
  if (typeof value === "number") {
    if (!Number.isFinite(value)) {
      throw new SalesCoreRuleError(
        "INVALID_JSON_METADATA",
        "JSON metadata numbers must be finite.",
      );
    }
    return value;
  }
  if (Array.isArray(value)) {
    return value.map(toPrismaJsonValue);
  }
  if (typeof value === "object") {
    const prototype = Object.getPrototypeOf(value);
    if (prototype !== Object.prototype && prototype !== null) {
      throw new SalesCoreRuleError(
        "INVALID_JSON_METADATA",
        "Metadata objects must be plain JSON objects.",
      );
    }
    return toPrismaJsonObject(
      Object.fromEntries(Object.entries(value)),
    );
  }
  throw new SalesCoreRuleError(
    "INVALID_JSON_METADATA",
    "Metadata must contain JSON-compatible values only.",
  );
}

export function toPrismaJsonObject(
  value: Record<string, unknown>,
): Prisma.InputJsonObject {
  const result: Record<string, Prisma.InputJsonValue | null> = {};
  for (const [key, nested] of Object.entries(value)) {
    result[key] = toPrismaJsonValue(nested);
  }
  return result;
}
