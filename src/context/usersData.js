import { createContext, useContext } from "react";

export const UsersDataContext = createContext(null);

export function useUsersData() {
  const ctx = useContext(UsersDataContext);
  if (!ctx) throw new Error("useUsersData must be used within a UsersDataProvider");
  return ctx;
}
