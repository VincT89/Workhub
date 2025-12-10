// src/store/feature/itemsAPI.js

import { BASE_URL } from "../../config/api.js";

export async function fetchItems() {
  const token = JSON.parse(localStorage.getItem("auth")).token; // il token salvato al login
console.log("token", token)
  const res = await fetch(`${BASE_URL}/items`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // token JWT necessario
    },
  });

  if (!res.ok) {
    throw new Error("Errore nel fetch degli items");
  }

  return res.json();
}