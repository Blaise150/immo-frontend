// frontend/lib/api.js
export const API_BASE = "http://127.0.0.1:8000"; // ton backend Django

export async function fetchProperties() {
  const res = await fetch(`${API_BASE}/properties/`);
  if (!res.ok) {
    throw new Error("Erreur lors de la récupération des biens");
  }
  return res.json();
}

export async function fetchUsers() {
  const res = await fetch(`${API_BASE}/users/`);
  if (!res.ok) {
    throw new Error("Erreur lors de la récupération des utilisateurs");
  }
  return res.json();
}
