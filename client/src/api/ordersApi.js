import { API_URL } from "../config/api"; // es: http://localhost:3030/api/v1

const ORDERS_URL = `${API_URL}/orders`;

/* ===========================
   CREATE ORDER
=========================== */
export const createOrderRequest = async ({ orderData, token }) => {
  const res = await fetch(ORDERS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(orderData),
  });

  const data = await res.json();
  return { res, data };
};

/* ===========================
   FETCH ALL ORDERS
=========================== */
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

/* ===========================
   FETCH ONE ORDER
=========================== */
export const fetchOrderByIdRequest = async ({ id, token }) => {
  const res = await fetch(`${ORDERS_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();
  return { res, data };
};

/* ===========================
   UPDATE ORDER
=========================== */
export const updateOrderRequest = async ({ id, data, token }) => {
  const res = await fetch(`${ORDERS_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const json = await res.json();
  return { res, data: json };
};

/* ===========================
   DELETE ORDER
=========================== */
export const deleteOrderRequest = async ({ id, token }) => {
  const res = await fetch(`${ORDERS_URL}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json().catch(() => ({}));
  return { res, data };
};
