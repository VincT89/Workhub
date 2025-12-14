import { API_URL } from "../config/api";

/* FETCH ALL TICKETS */
export const fetchTicketsRequest = async (token) => {
  const response = await fetch(`${API_URL}/ticketing`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await response.json();
  return { response, data };
};

/* FETCH TICKET BY ID */
export const fetchTicketByIdRequest = async ({ id, token }) => {
  const response = await fetch(`${API_URL}/ticketing/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await response.json();
  return { response, data };
};

/* CREATE TICKET */
export const createTicketRequest = async ({ payload, token }) => {
  const response = await fetch(`${API_URL}/ticketing`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  return { response, data };
};

/* UPDATE TICKET */
export const updateTicketRequest = async ({ id, payload, token }) => {
  const response = await fetch(`${API_URL}/ticketing/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  return { response, data };
};

/* DELETE TICKET */
export const deleteTicketRequest = async ({ id, token }) => {
  const response = await fetch(`${API_URL}/ticketing/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await response.json();
  return { response, data };
};