/**
 * Single source of truth for bidding rules — mirrored in scripts/create-tables-v4.sql's
 * place_bid() function so client validation and the DB's server-side check never disagree.
 */
export const BID_INCREMENT = 1000
export const STARTING_BID = 10000

export const TABLE_ZONES = {
  DJ_BOOTH: "DJ Booth",
  LEVEL_01: "Level 01",
  DANCE_FLOOR: "Dance Floor",
  FLOOR_SIDE: "Floor Side",
  FRONT_ROW: "Front Row",
  BALCONY: "Balcony",
  KEY_CLUB: "Xclusive Lounge",
  RESERVED: "Reserved",
} as const

export type TableZone = keyof typeof TABLE_ZONES

export const ZONE_STYLES: Record<TableZone, { ring: string; badge: string; glow: string }> = {
  DJ_BOOTH: { ring: "ring-mirzapur-gold", badge: "bg-mirzapur-gold text-mirzapur-blood", glow: "shadow-mirzapur-gold/40" },
  LEVEL_01: { ring: "ring-mirzapur-crimson", badge: "bg-mirzapur-crimson text-mirzapur-bone", glow: "shadow-mirzapur-crimson/40" },
  DANCE_FLOOR: { ring: "ring-mirzapur-maroon", badge: "bg-mirzapur-maroon text-mirzapur-gold", glow: "shadow-mirzapur-maroon/40" },
  FLOOR_SIDE: { ring: "ring-mirzapur-gunmetal", badge: "bg-mirzapur-gunmetal text-mirzapur-gold", glow: "shadow-black/40" },
  FRONT_ROW: { ring: "ring-mirzapur-blood", badge: "bg-mirzapur-blood text-mirzapur-bone", glow: "shadow-mirzapur-blood/40" },
  BALCONY: { ring: "ring-mirzapur-bronze", badge: "bg-mirzapur-bronze text-mirzapur-blood", glow: "shadow-mirzapur-bronze/40" },
  KEY_CLUB: { ring: "ring-mirzapur-gold", badge: "bg-black text-mirzapur-gold border border-mirzapur-gold", glow: "shadow-mirzapur-gold/50" },
  RESERVED: { ring: "ring-mirzapur-gunmetal", badge: "bg-mirzapur-gunmetal text-mirzapur-bone", glow: "shadow-black/40" },
}

/** Poster layout, in on-screen order. `zone` drives styling; `sort_order` is written to the DB. */
export interface LayoutTable {
  id: string
  zone: TableZone
}

function range(prefix: string, start: number, end: number): LayoutTable[] {
  const out: LayoutTable[] = []
  for (let i = start; i <= end; i++) out.push({ id: `${prefix}${i}`, zone: prefix in ZONE_PREFIX_MAP ? ZONE_PREFIX_MAP[prefix] : "RESERVED" })
  return out
}

const ZONE_PREFIX_MAP: Record<string, TableZone> = {
  XC: "DJ_BOOTH",
  E: "LEVEL_01",
  D: "DANCE_FLOOR",
  F: "FLOOR_SIDE",
  A: "FRONT_ROW",
  B: "BALCONY",
  KC: "KEY_CLUB",
  T: "RESERVED",
}

export const LAYOUT_TABLES: LayoutTable[] = [
  ...range("XC", 1, 6),
  ...range("E", 1, 3),
  { id: "T1", zone: "RESERVED" },
  ...range("D", 1, 10),
  ...range("F", 1, 5),
  ...range("A", 1, 6),
  ...range("B", 1, 3),
  ...range("KC", 1, 2),
  { id: "T2", zone: "RESERVED" },
  { id: "T3", zone: "RESERVED" },
]

/**
 * Only these tables are open for bidding — everything else in the poster layout is a
 * landmark/inactive tile. Values are each table's starting (and reset) bid in ₹.
 */
export const TABLE_PRICES: Record<string, number> = {
  XC1: 100_000,
  XC2: 100_000,
  XC3: 100_000,
  XC4: 100_000,
  XC5: 100_000,
  XC6: 100_000,
  A1: 100_000,
  A2: 100_000,
  A3: 100_000,
  A4: 80_000,
  A5: 80_000,
  A6: 80_000,
}

export const BIDDABLE_TABLE_IDS = Object.keys(TABLE_PRICES)
