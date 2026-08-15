// Realistic mock data for the item/product master used when creating jobs.

export const CATEGORIES = [
  "Commercial Print",
  "Packaging",
  "Labels",
  "Signage",
  "Stationery",
  "Promotional",
];

export const ITEM_STATUSES = ["Active", "Inactive"];

export const items = [
  { id: 1, itemCode: "ITM-001", itemName: "Corporate Brochures", category: "Commercial Print", description: "Tri-fold and bi-fold brochures, gloss/matte finish, various stock weights.", status: "Active", createdDate: "2025-11-02", updatedDate: "2026-06-14" },
  { id: 2, itemCode: "ITM-002", itemName: "Business Cards", category: "Stationery", description: "Standard and premium business cards with spot UV/foil options.", status: "Active", createdDate: "2025-11-02", updatedDate: "2026-05-20" },
  { id: 3, itemCode: "ITM-003", itemName: "Perfume Packaging Boxes", category: "Packaging", description: "Rigid luxury boxes with magnetic closure for fragrance retail.", status: "Active", createdDate: "2025-11-10", updatedDate: "2026-07-01" },
  { id: 4, itemCode: "ITM-004", itemName: "Paper Bags", category: "Packaging", description: "Kraft and laminated paper carry bags with rope or ribbon handles.", status: "Active", createdDate: "2025-11-12", updatedDate: "2026-04-18" },
  { id: 5, itemCode: "ITM-005", itemName: "Product Labels", category: "Labels", description: "Self-adhesive product labels, roll or sheet format, matte/gloss laminate.", status: "Active", createdDate: "2025-11-15", updatedDate: "2026-07-22" },
  { id: 6, itemCode: "ITM-006", itemName: "Retail Price Tags", category: "Labels", description: "Die-cut price tags with barcode and hole punch for garment tagging.", status: "Active", createdDate: "2025-11-18", updatedDate: "2026-06-30" },
  { id: 7, itemCode: "ITM-007", itemName: "Cheque Books", category: "Stationery", description: "Security-printed cheque books with micro-text and UV features.", status: "Active", createdDate: "2025-11-20", updatedDate: "2026-08-01" },
  { id: 8, itemCode: "ITM-008", itemName: "Signage Panels", category: "Signage", description: "Rigid ACP/Foamex panels for indoor and outdoor wayfinding.", status: "Active", createdDate: "2025-11-25", updatedDate: "2026-05-05" },
  { id: 9, itemCode: "ITM-009", itemName: "Annual Reports", category: "Commercial Print", description: "Perfect-bound annual reports, premium text stock with case-bound cover option.", status: "Active", createdDate: "2025-12-01", updatedDate: "2026-03-12" },
  { id: 10, itemCode: "ITM-010", itemName: "Loyalty Card Sets", category: "Promotional", description: "PVC loyalty and membership cards with magnetic stripe or QR code.", status: "Active", createdDate: "2025-12-05", updatedDate: "2026-07-10" },
  { id: 11, itemCode: "ITM-011", itemName: "Site Signage Panels", category: "Signage", description: "Large-format construction site hoarding and safety signage.", status: "Active", createdDate: "2025-12-08", updatedDate: "2026-06-02" },
  { id: 12, itemCode: "ITM-012", itemName: "SIM Card Packaging", category: "Packaging", description: "Blister-pack ready SIM card carriers with tear-off activation panel.", status: "Active", createdDate: "2025-12-14", updatedDate: "2026-07-28" },
  { id: 13, itemCode: "ITM-013", itemName: "Weekly Offers Catalogue", category: "Promotional", description: "Tabloid-format promotional catalogues, web-offset print run.", status: "Inactive", createdDate: "2025-10-20", updatedDate: "2026-02-11" },
  { id: 14, itemCode: "ITM-014", itemName: "Metro Route Maps", category: "Commercial Print", description: "Fold-out transit route maps, laminated for durability.", status: "Active", createdDate: "2025-12-18", updatedDate: "2026-06-25" },
  { id: 15, itemCode: "ITM-015", itemName: "Gift Set Packaging", category: "Packaging", description: "Rigid gift boxes with custom inserts for duty-free retail sets.", status: "Inactive", createdDate: "2025-10-28", updatedDate: "2026-01-30" },
];
