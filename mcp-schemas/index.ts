/**
 * Zod schemas for the Silpo MCP (https://mcp.silpo.ua/mcp), grouped exactly as
 * the official docs group its 40 tools. Each tool exposes a `<Name>Input` and
 * `<Name>Output` schema; inputs mirror the advertised JSON Schema, outputs were
 * inferred from live tools/call responses.
 *
 * Groups:
 *  - common            shared primitives (DeliveryType, Product, Timeslot, …)
 *  - location-delivery Локація та доставка (6)
 *  - products          Пошук товарів (7)
 *  - catalog           Каталог (6)
 *  - cart              Кошик (8)
 *  - orders            Замовлення (2)
 *  - profile           Профіль (4)
 *  - loyalty           Лояльність та акції (7)
 */

export * from "./common";
export * as location from "./location-delivery";
export * as products from "./products";
export * as catalog from "./catalog";
export * as cart from "./cart";
export * as orders from "./orders";
export * as profile from "./profile";
export * as loyalty from "./loyalty";
