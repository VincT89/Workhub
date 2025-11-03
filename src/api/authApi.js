import { personale } from "./mock/personaleMock";

export const fakeLogin = async (username, password) => {
  await new Promise(res => setTimeout(res, 400));
  const user = personale.find(u => u.username === username && u.password === password);
  if (!user) throw new Error("Credenziali non valide");
  return { token: "FAKE_JWT_" + user.ruolo.toUpperCase(), user };
};
