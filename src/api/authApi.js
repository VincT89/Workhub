import { personale } from "./mock/personaleMock";

export const fakeLogin = async (username, password) => {
  await new Promise((res) => setTimeout(res, 400)); // Simula una chiamata API

  // Trova l'utente fake
  const user = personale.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    throw new Error("Credenziali non valide");
  }

  
  const role = user.ruolo?.toLowerCase() || "user";

  // Ritorna un oggetto coerente con l'authSlice
  return {
    token: "FAKE_JWT_" + role.toUpperCase(),
    user: {
      id: user.id,
      nome: user.nome,
      cognome: user.cognome,
      ruolo: role, 
    },
  };
};
