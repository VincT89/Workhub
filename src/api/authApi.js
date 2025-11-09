// src/api/authApi.js
import { personnel } from "../api/mock/personaleMock";

// LOGIN MOCK
export const fakeLogin = async (username, password) => {
  let storedUsers = JSON.parse(localStorage.getItem("users"));

  // Se non esistono utenti, inizializza dal mock
  if (!storedUsers) {
    storedUsers = [...personnel];
    localStorage.setItem("users", JSON.stringify(storedUsers));
  }

  // Cerca utente
  const user = storedUsers.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) throw new Error("Credenziali non valide");

  return {
    token: "fake-jwt-token",
    user,
  };
};

// AGGIORNA PASSWORD (mantiene il role)
export const updateUserPassword = (username, newPassword) => {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const index = users.findIndex((u) => u.username === username);

  if (index === -1) return false;

  users[index].password = newPassword;
  localStorage.setItem("users", JSON.stringify(users));
  return true;
};
