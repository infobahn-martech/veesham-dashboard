import { createContext, useContext } from "react";

export const JobsDataContext = createContext(null);

const STATUS_LOCKED = ["Hold", "WFA", "Reprint", "Delayed"];

// Statuses that shouldn't be silently overridden by the delivered/total quantity auto-suggestion.
export function suggestStatus(currentStatus, deliveredQty, totalQty) {
  if (STATUS_LOCKED.includes(currentStatus)) return currentStatus;
  if (totalQty > 0 && deliveredQty >= totalQty) return "Completed";
  if (deliveredQty > 0 && deliveredQty < totalQty) return "Partially Delivered";
  return currentStatus;
}

export function useJobsData() {
  const ctx = useContext(JobsDataContext);
  if (!ctx) throw new Error("useJobsData must be used within a JobsDataProvider");
  return ctx;
}
