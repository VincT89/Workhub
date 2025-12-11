// CRUD fetch helpers for tickets API
// Usage: import { fetchTickets, fetchTicketById, createTicket, updateTicket, deleteTicket }

import { API_URL } from "../../config/api.js";

function getAuthHeader() {
  try {
    const raw = localStorage.getItem("auth");
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || !parsed.token) return {};
    return { Authorization: `Bearer ${parsed.token}` };
  } catch {
    return {};
  }
}

async function handleResponse(res) {
  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!res.ok) {
    const err = new Error(data?.message || res.statusText || "Request failed");
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}

export async function fetchTickets() {
  const headers = {
    "Content-Type": "application/json",
    ...getAuthHeader(),
  };

  const res = await fetch(`${API_URL}/ticketing`, { headers });
  return handleResponse(res);
}

export async function fetchTicketById(id) {
  if (!id) throw new Error("fetchTicketById requires an id");

  const headers = {
    "Content-Type": "application/json",
    ...getAuthHeader(),
  };

  const res = await fetch(`${API_URL}/ticketing/${id}`, { headers });
  return handleResponse(res);
}

export async function createTicket(payload) {
  if (!payload) throw new Error("createTicket requires a payload");

  const headers = {
    "Content-Type": "application/json",
    ...getAuthHeader(),
  };

  const res = await fetch(`${API_URL}/ticketing`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });

  return handleResponse(res);
}

export async function updateTicket(id, payload) {
  if (!id) throw new Error("updateTicket requires an id");
  if (!payload) throw new Error("updateTicket requires a payload");

  const headers = {
    "Content-Type": "application/json",
    ...getAuthHeader(),
  };

  const res = await fetch(`${API_URL}/ticketing/${id}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(payload),
  });

  return handleResponse(res);
}

export async function deleteTicket(id) {
  if (!id) throw new Error("deleteTicket requires an id");

  const headers = {
    "Content-Type": "application/json",
    ...getAuthHeader(),
  };

  const res = await fetch(`${API_URL}/ticketing/${id}`, {
    method: "DELETE",
    headers,
  });

  return handleResponse(res);
}

// End of ticketApi.js