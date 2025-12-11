import { API_URL } from "../config/api"; 

const ORDERS_URL = `${API_URL}/orders`;

/* CREATE */
export const createOrderRequest = async (orderData, token) => {
  const res = await fetch(ORDERS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : undefined,
    },
    body: JSON.stringify(orderData),
  });

  const data = await res.json().catch(() => ({}));
  return { res, data };
};

/* FETCH ALL */
export const fetchOrdersRequest = async ({ token }) => {
  const res = await fetch(ORDERS_URL, {
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : undefined,
    },
  });

  const data = await res.json().catch(() => ({}));
  return { res, data };
};

/* FETCH ONE */
export const fetchOrderByIdRequest = async (id, token) => {
  const res = await fetch(`${ORDERS_URL}/${id}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : undefined,
    },
  });

  const data = await res.json().catch(() => ({}));
  return { res, data };
};

/* UPDATE */
export const updateOrderRequest = async ({ id, data }, token) => {
  const res = await fetch(`${ORDERS_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : undefined,
    },
    body: JSON.stringify(data),
  });

  const json = await res.json().catch(() => ({}));
  return { res, data: json };
};

/* DELETE */
export const deleteOrderRequest = async (id, token) => {
  const res = await fetch(`${ORDERS_URL}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: token ? `Bearer ${token}` : undefined,
    },
  });

  const data = await res.json().catch(() => ({}));
  return { res, data };
};
