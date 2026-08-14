// Single source of truth for status → color across the pie chart, legend, and StatusBadge.

export const STATUS_STYLES = {
  Completed: { color: "#1e8a5f", bg: "rgba(30, 138, 95, 0.12)" },
  "In Progress": { color: "#0e93a1", bg: "rgba(14, 147, 161, 0.12)" },
  Pending: { color: "#64748b", bg: "rgba(100, 116, 139, 0.12)" },
  Delayed: { color: "#d1495b", bg: "rgba(209, 73, 91, 0.12)" },
  "Partially Delivered": { color: "#7c5cbf", bg: "rgba(124, 92, 191, 0.12)" },
  WFA: { color: "#b5720a", bg: "rgba(181, 114, 10, 0.12)" },
  Hold: { color: "#55708a", bg: "rgba(85, 112, 138, 0.12)" },
  Reprint: { color: "#c3467c", bg: "rgba(195, 70, 124, 0.12)" },
};

export const DEFAULT_STATUS_STYLE = { color: "#64748b", bg: "rgba(100, 116, 139, 0.12)" };
