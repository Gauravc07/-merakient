// Current event, shown on the home page and in the bidding stories. Images live in public/images/.
// The table-bidding window, table count and prices are NOT here — they come live from the
// bidding tables (set them with scripts/sql/03-set-bidding-window.sql).
export const CURRENT_EVENT = {
  title: "The Prince of Mirzapur",
  edition: "The Bidding Edition",
  venue: "Xclusive Superclub, Pune",
  // The party itself (YYYY-MM-DD). Separate from the bidding window, which usually ends before it.
  eventDate: "2026-09-27",
  dj: "DJ Naairo",
  tagline: "Bid for the throne. Only one table gets the crown tonight.",
  teaserLine: ["Bole the na,", "amar hai hum!"],
  // Full-screen hero background — use a wide, high-resolution image (1920px+ wide) you have
  // the rights to. It's cropped to fill the screen and darkened behind the headline.
  heroBackground: "/images/xclusive-bidding-edition.jpg",
  eventPoster: "/images/xclusive-bidding-edition.jpg",
}
