import { API_URL } from "../config/api";

/* CREATE (auth/register) */
export const createUserRequest = async ({ newUser, token }) => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(newUser),
  });

  const data = await response.json();
  return { response, data };
};

/* GET ALL USERS */
export const fetchUsersRequest = async (token) => {
  const response = await fetch(`${API_URL}/users`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await response.json();
  return { response, data };
};

/* GET USER BY ID */
export const fetchUserByIdRequest = async ({ id, token }) => {
  const response = await fetch(`${API_URL}/users/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await response.json();
  return { response, data };
};

/* UPDATE USER */
export const updateUserRequest = async ({ id, updates, token }) => {
  const response = await fetch(`${API_URL}/users/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updates),
  });

  const data = await response.json();
  return { response, data };
};

/* DELETE USER */
export const deleteUserRequest = async ({ id, token }) => {
  const response = await fetch(`${API_URL}/users/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await response.json();
  return { response, data };
};
