import { API_URL } from "../config/api";

/* ------------------- GET ALL ------------------- */
export const fetchAllShiftsRequest = async ({ token }) => {
  const res = await fetch(`${API_URL}/shifts`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  return { res, data };
};

/* ------------------- GET BY USER ------------------- */
export const fetchUserShiftsRequest = async ({ userId, token }) => {
  const res = await fetch(`${API_URL}/shifts/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  return { res, data };
};

/* ------------------- UPDATE SINGLE DAY/PERIOD ------------------- */
export const updateShiftRequest = async ({ id, day, period, value, token }) => {
  const body = { day, period, value };

  const res = await fetch(`${API_URL}/shifts/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  return { res, data };
};

/* ------------------- DELETE SHIFT DOC ------------------- */
export const deleteShiftRequest = async ({ id, token }) => {
  const res = await fetch(`${API_URL}/shifts/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();
  return { res, data };
};
