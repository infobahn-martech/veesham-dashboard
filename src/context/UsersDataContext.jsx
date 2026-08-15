import { useEffect, useState } from "react";
import { users as seedUsers } from "../data/users";
import { generateId } from "../utils/format";
import { UsersDataContext } from "./usersData";

const USERS_KEY = "veesham_users";

function nowIso() {
  return new Date().toISOString();
}

function loadInitialUsers() {
  try {
    const stored = localStorage.getItem(USERS_KEY);
    if (stored) return JSON.parse(stored);
  } catch {
    // fall through to seed data
  }
  return seedUsers;
}

export function UsersDataProvider({ children }) {
  const [users, setUsers] = useState(loadInitialUsers);

  useEffect(() => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }, [users]);

  function addUser(userInput) {
    const today = new Date().toISOString().slice(0, 10);
    const user = {
      id: generateId("usr"),
      ...userInput,
      lastLogin: null,
      createdDate: today,
      updatedDate: today,
      activity: [{ ts: nowIso(), message: "Account created" }],
    };
    setUsers((prev) => [user, ...prev]);
    return user;
  }

  function updateUser(id, patch) {
    setUsers((prev) =>
      prev.map((user) => {
        if (user.id !== id) return user;
        const activity = [...user.activity];
        if (patch.status && patch.status !== user.status) {
          activity.push({ ts: nowIso(), message: `Status changed to ${patch.status}` });
        }
        if (patch.role && patch.role !== user.role) {
          activity.push({ ts: nowIso(), message: `Role changed to ${patch.role}` });
        }
        return { ...user, ...patch, updatedDate: new Date().toISOString().slice(0, 10), activity };
      })
    );
  }

  function setUserStatus(id, status) {
    updateUser(id, { status });
  }

  return (
    <UsersDataContext.Provider value={{ users, addUser, updateUser, setUserStatus }}>
      {children}
    </UsersDataContext.Provider>
  );
}
