// Reusable role structure for the demo. No permissions engine yet — just a
// clear, central place to add role-gated behavior later.

export const ROLES = [
  { value: "Administrator", description: "Full system access" },
  { value: "Management", description: "Dashboard and operational visibility" },
  { value: "Production Manager", description: "Manage production/jobs" },
  { value: "Production Staff", description: "Update jobs/statuses" },
  { value: "Sales", description: "View customer/job information" },
  { value: "Viewer", description: "Read-only access" },
];

export function getRoleDescription(role) {
  return ROLES.find((r) => r.value === role)?.description || "";
}
