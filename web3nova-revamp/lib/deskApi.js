const API = process.env.NEXT_PUBLIC_API_URL || "";
const TOKEN_KEY = "desk_token";
const TOKEN_EXPIRY_KEY = "desk_token_expiry";

export function saveToken(token, expiresInSeconds) {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(
    TOKEN_EXPIRY_KEY,
    String(Date.now() + expiresInSeconds * 1000)
  );
}

export function clearToken() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(TOKEN_EXPIRY_KEY);
}

export function getToken() {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem(TOKEN_KEY);
  const expiry = Number(localStorage.getItem(TOKEN_EXPIRY_KEY) || 0);
  if (!token || Date.now() > expiry) {
    clearToken();
    return null;
  }
  return token;
}

export async function login(email, password) {
  const r = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(data.error || "login failed");
  saveToken(data.token, data.expiresIn);
  return data;
}

export async function deskFetch(path, options = {}) {
  const token = getToken();
  if (!token) throw new Error("not authenticated");
  const r = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
    },
  });
  if (r.status === 401) {
    clearToken();
    throw new Error("session expired");
  }
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(data.error || `request failed (${r.status})`);
  return data;
}
