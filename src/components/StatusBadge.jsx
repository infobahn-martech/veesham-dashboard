import { STATUS_STYLES, DEFAULT_STATUS_STYLE } from "../data/statusStyles";
import "./StatusBadge.css";

function StatusBadge({ status }) {
  const { color, bg } = STATUS_STYLES[status] || DEFAULT_STATUS_STYLE;
  return (
    <span className="status-badge" style={{ color, background: bg }}>
      {status}
    </span>
  );
}

export default StatusBadge;
