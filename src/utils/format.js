export function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatNumber(value) {
  return Number(value || 0).toLocaleString();
}

export function generateId(prefix) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export function formatTimelineTimestamp(iso) {
  const date = new Date(iso);
  const day = date.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
  const time = date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false });
  return `${day} ${time}`;
}

function isSameDay(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export function formatLastLogin(iso) {
  if (!iso) return "Never";
  const date = new Date(iso);
  const now = new Date();
  const time = date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: true });

  if (isSameDay(date, now)) return `Today, ${time}`;

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (isSameDay(date, yesterday)) return `Yesterday, ${time}`;

  return formatDate(iso);
}
