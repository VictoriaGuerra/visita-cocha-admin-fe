import { API_URL } from "../config/api.js";

export async function getTransportRoutes() {
  const res = await fetch(`${API_URL}/transport-routes`);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Error fetching transport routes: ${res.status} ${text}`);
  }
  return res.json();
}

export async function createTransportRoute(formData) {
  const res = await fetch(`${API_URL}/transport-routes`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Error creating transport route: ${res.status} ${text}`);
  }
  return res.json();
}

export async function deleteTransportRoute(id) {
  const res = await fetch(`${API_URL}/transport-routes/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Error deleting transport route: ${res.status} ${text}`);
  }
  if (res.status === 204) return null;
  return res.json();
}
