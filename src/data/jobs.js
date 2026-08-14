// Realistic mock data for a printing/production job-priority board.
// Delivery dates are generated relative to "today" so filters (e.g. Due Today) stay meaningful.

const today = new Date();

function offsetDate(days) {
  const d = new Date(today);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export const STATUSES = [
  "Pending",
  "In Progress",
  "Partially Delivered",
  "Completed",
  "Delayed",
  "Hold",
  "WFA",
  "Reprint",
];

export const jobs = [
  { id: 1, jobNo: "JB-2401", salesperson: "Ranjith Kumar", client: "Al Futtaim Group", item: "Corporate Brochures", totalQty: 5000, deliveredQty: 5000, balanceQty: 0, deliveryDate: offsetDate(-3), status: "Completed" },
  { id: 2, jobNo: "JB-2402", salesperson: "Fathima Nasrin", client: "Emirates NBD", item: "Cheque Books", totalQty: 20000, deliveredQty: 12000, balanceQty: 8000, deliveryDate: offsetDate(0), status: "In Progress" },
  { id: 3, jobNo: "JB-2403", salesperson: "Suresh Pillai", client: "Nakheel Properties", item: "Site Signage Panels", totalQty: 120, deliveredQty: 0, balanceQty: 120, deliveryDate: offsetDate(2), status: "Pending" },
  { id: 4, jobNo: "JB-2404", salesperson: "Ranjith Kumar", client: "Chalhoub Group", item: "Perfume Packaging Boxes", totalQty: 15000, deliveredQty: 15000, balanceQty: 0, deliveryDate: offsetDate(-1), status: "Completed" },
  { id: 5, jobNo: "JB-2405", salesperson: "Divya Menon", client: "DP World", item: "Annual Report", totalQty: 800, deliveredQty: 0, balanceQty: 800, deliveryDate: offsetDate(-2), status: "Delayed" },
  { id: 6, jobNo: "JB-2406", salesperson: "Ahmed Al Bloushi", client: "Majid Al Futtaim", item: "Mall Directory Wayfinding", totalQty: 40, deliveredQty: 40, balanceQty: 0, deliveryDate: offsetDate(-5), status: "Completed" },
  { id: 7, jobNo: "JB-2407", salesperson: "Fathima Nasrin", client: "Landmark Group", item: "Retail Price Tags", totalQty: 50000, deliveredQty: 30000, balanceQty: 20000, deliveryDate: offsetDate(0), status: "Partially Delivered" },
  { id: 8, jobNo: "JB-2408", salesperson: "Suresh Pillai", client: "Dubai Municipality", item: "Public Notice Boards", totalQty: 60, deliveredQty: 0, balanceQty: 60, deliveryDate: offsetDate(1), status: "WFA" },
  { id: 9, jobNo: "JB-2409", salesperson: "Divya Menon", client: "Etisalat", item: "SIM Card Packaging", totalQty: 100000, deliveredQty: 40000, balanceQty: 60000, deliveryDate: offsetDate(3), status: "In Progress" },
  { id: 10, jobNo: "JB-2410", salesperson: "Ahmed Al Bloushi", client: "Al Ain Farms", item: "Product Labels - Juice Range", totalQty: 200000, deliveredQty: 200000, balanceQty: 0, deliveryDate: offsetDate(-4), status: "Completed" },
  { id: 11, jobNo: "JB-2411", salesperson: "Ranjith Kumar", client: "Emaar Properties", item: "Sales Gallery Brochures", totalQty: 3000, deliveredQty: 1500, balanceQty: 1500, deliveryDate: offsetDate(0), status: "Hold" },
  { id: 12, jobNo: "JB-2412", salesperson: "Fathima Nasrin", client: "ADNOC Distribution", item: "Loyalty Card Sets", totalQty: 25000, deliveredQty: 0, balanceQty: 25000, deliveryDate: offsetDate(4), status: "Pending" },
  { id: 13, jobNo: "JB-2413", salesperson: "Divya Menon", client: "Jumeirah Group", item: "In-Room Guest Directory", totalQty: 900, deliveredQty: 900, balanceQty: 0, deliveryDate: offsetDate(0), status: "Completed" },
  { id: 14, jobNo: "JB-2414", salesperson: "Suresh Pillai", client: "Al Ghurair Group", item: "Warehouse Safety Signage", totalQty: 150, deliveredQty: 60, balanceQty: 90, deliveryDate: offsetDate(-1), status: "Delayed" },
  { id: 15, jobNo: "JB-2415", salesperson: "Ahmed Al Bloushi", client: "Carrefour UAE", item: "Promotional Shelf Talkers", totalQty: 8000, deliveredQty: 8000, balanceQty: 0, deliveryDate: offsetDate(-2), status: "Reprint" },
  { id: 16, jobNo: "JB-2416", salesperson: "Ranjith Kumar", client: "GEMS Education", item: "Student Handbooks", totalQty: 4500, deliveredQty: 4500, balanceQty: 0, deliveryDate: offsetDate(1), status: "Completed" },
  { id: 17, jobNo: "JB-2417", salesperson: "Divya Menon", client: "Union Coop", item: "Weekly Offers Catalogue", totalQty: 30000, deliveredQty: 10000, balanceQty: 20000, deliveryDate: offsetDate(0), status: "In Progress" },
  { id: 18, jobNo: "JB-2418", salesperson: "Fathima Nasrin", client: "RTA Dubai", item: "Metro Route Maps", totalQty: 10000, deliveredQty: 0, balanceQty: 10000, deliveryDate: offsetDate(2), status: "WFA" },
  { id: 19, jobNo: "JB-2419", salesperson: "Ahmed Al Bloushi", client: "Dubai Duty Free", item: "Gift Set Packaging", totalQty: 12000, deliveredQty: 0, balanceQty: 12000, deliveryDate: offsetDate(-1), status: "Hold" },
  { id: 20, jobNo: "JB-2420", salesperson: "Suresh Pillai", client: "Alec Engineering", item: "Project Handover Folders", totalQty: 200, deliveredQty: 200, balanceQty: 0, deliveryDate: offsetDate(5), status: "Completed" },
];
