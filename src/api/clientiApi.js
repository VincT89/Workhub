import { clienti } from "./mock/clientiMock";

export const fakeFetchClients = async (token) => {
  await new Promise((res) => setTimeout(res, 400));
  if (!token?.startsWith("FAKE_JWT_")) throw new Error("Token non valido");
  return clienti;
};

export const fakeAddClient = async (token, nuovoCliente) => {
  await new Promise((res) => setTimeout(res, 400));
  if (!token?.startsWith("FAKE_JWT_")) throw new Error("Token non valido");
  const nuovo = { ...nuovoCliente, id: Date.now(), storicoOrdini: [] };
  clienti.push(nuovo);
  return nuovo;
};

export const fakeUpdateClient = async (token, id, dataAggiornata) => {
  await new Promise((res) => setTimeout(res, 400));
  if (!token?.startsWith("FAKE_JWT_")) throw new Error("Token non valido");
  const index = clienti.findIndex((c) => c.id === id);
  if (index === -1) throw new Error("Cliente non trovato");
  clienti[index] = { ...clienti[index], ...dataAggiornata };
  return clienti[index];
};

export const fakeDeleteClient = async (token, id) => {
  await new Promise((res) => setTimeout(res, 400));
  if (!token?.startsWith("FAKE_JWT_")) throw new Error("Token non valido");
  const index = clienti.findIndex((c) => c.id === id);
  if (index === -1) throw new Error("Cliente non trovato");
  const [eliminato] = clienti.splice(index, 1);
  return eliminato;
};
export const fakeGetClientDetails = async (token, id) => {
  await new Promise((res) => setTimeout(res, 400));
  if (!token?.startsWith("FAKE_JWT_")) throw new Error("Token non valido");
  const cliente = clienti.find((c) => c.id === id);
  if (!cliente) throw new Error("Cliente non trovato");
  return cliente;
};
