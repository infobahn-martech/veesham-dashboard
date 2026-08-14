import "./StatusBadge.css";

const STATUS_STYLES = {
  Pending: "neutral",
  "In Progress": "info",
  "Partially Delivered": "purple",
  Completed: "success",
  Delayed: "danger",
  Hold: "warning",
  WFA: "warning",
  Reprint: "danger",
};

function StatusBadge({ status }) {
  const variant = STATUS_STYLES[status] || "neutral";
  return <span className={`status-badge status-badge--${variant}`}>{status}</span>;
}

export default StatusBadge;
