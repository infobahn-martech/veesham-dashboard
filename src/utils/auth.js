// Demo-only authentication. No backend — credentials and session are hardcoded/local.

const STORAGE_KEY = "veesham_auth_user";

const DEMO_CREDENTIALS = {
  email: "admin@veesham.com",
  password: "admin123",
};

const DEMO_USER = {
  name: "Admin User",
  email: DEMO_CREDENTIALS.email,
  role: "Administrator",
  company: "Veesham Printing Press",
};

export function login(email, password) {
  if (email === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_USER));
    return true;
  }
  return false;
}

export function logout() {
  localStorage.removeItem(STORAGE_KEY);
}

export function getCurrentUser() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : null;
}
