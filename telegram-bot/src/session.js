// In-memory session store for multi-step /add flow
const sessions = new Map();

export function getSession(userId) {
  return sessions.get(userId) ?? null;
}

export function setSession(userId, data) {
  sessions.set(userId, data);
}

export function clearSession(userId) {
  sessions.delete(userId);
}
