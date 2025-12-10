import { API_URL } from "../config/api";

/* ------------------- GET USER LEAVES ------------------- */
export const fetchLeaveRequest = async (token) => {
  const res = await fetch(`${API_URL}/leaves`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();
  return { res, data };
};

/* ------------------- GET USER LEAVES BY USER ID (ADMIN) ------------------- */
export const fetchLeaveByUserIdRequest = async ({ userId, token }) => {
  const res = await fetch(`${API_URL}/leaves/user/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();
  return { res, data };
};

/* ------------------- CREATE REQUEST ------------------- */
export const createLeaveRequestRequest = async ({ payload, token }) => {
  const res = await fetch(`${API_URL}/leaves/request`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  return { res, data };
};

/* ------------------- UPDATE STATUS (ADMIN) ------------------- */
export const updateLeaveStatusRequest = async ({
  requestId,
  status,
  token,
}) => {
  const res = await fetch(`${API_URL}/leaves/${requestId}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });

  const data = await res.json();
  return { res, data };
};

/* ------------------- INIT USER LEAVE (ADMIN) ------------------- */
export const initLeaveRecordRequest = async ({ userId, token }) => {
  const res = await fetch(`${API_URL}/leaves/init/${userId}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();
  return { res, data };
};
