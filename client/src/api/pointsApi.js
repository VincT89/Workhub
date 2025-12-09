import { API_URL } from "../config/api";

// === FETCH ALL POS ===
export const fetchPointsOfSalesRequest = async ({ token }) => {
  const res = await fetch(`${API_URL}/pointsofsales`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();
  return { res, data };
};

// === CREATE POS ===
export const createPointOfSaleRequest = async ({ newPos, token }) => {
  const res = await fetch(`${API_URL}/pointsofsales`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(newPos),
  });

  const data = await res.json();
  return { res, data };
};

// === UPDATE POS ===
export const updatePointOfSaleRequest = async ({ id, updates, token }) => {
  const res = await fetch(`${API_URL}/pointsofsales/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updates),
  });

  const data = await res.json();
  return { res, data };
};

// === DELETE POS ===
export const deletePointOfSaleRequest = async ({ id, token }) => {
  const res = await fetch(`${API_URL}/pointsofsales/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();
  return { res, data };
};
