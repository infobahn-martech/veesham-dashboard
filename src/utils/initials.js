export function getInitials(name) {
  if (!name) return "";
  const words = name.trim().split(/\s+/);
  return words.length > 1
    ? `${words[0][0]}${words[1][0]}`.toUpperCase()
    : words[0].slice(0, 2).toUpperCase();
}
