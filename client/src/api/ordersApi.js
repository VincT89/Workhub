import { API_URL } from "../config/api";  // http://localhost:3030/api/v1

const ORDERS_URL = `${API_URL}/orders`;

/* CREATE */
export const createOrderRequest = async (orderData) => {
  const res = await fetch(ORDERS_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(orderData),
  });
  const data = await res.json();
  return { res, data };
};

/* FETCH ALL */
export const fetchOrdersRequest = async ({ token }) => {
  const res = await fetch(ORDERS_URL, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();
  return { res, data };
};

/* FETCH ONE */
export const fetchOrderByIdRequest = async (id) => {
  const res = await fetch(`${ORDERS_URL}/${id}`);
  const data = await res.json();
  return { res, data };
};

/* UPDATE */
export const updateOrderRequest = async ({ id, data }) => {
  const res = await fetch(`${ORDERS_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  return { res, data: json };
};

/* DELETE */
export const deleteOrderRequest = async (id) => {
  const res = await fetch(`${ORDERS_URL}/${id}`, { method: "DELETE" });
  const data = await res.json().catch(() => ({}));
  return { res, data };
};