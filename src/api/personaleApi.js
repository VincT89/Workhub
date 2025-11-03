import { personale } from "./mock/personaleMock";

export const fakeFetchPersonale = async (token) => {
  await new Promise((res) => setTimeout(res, 400));
  if (!token?.startsWith("FAKE_JWT_")) throw new Error("Token non valido");
  return personale;
};

export const fakeAddPersonale = async (token, nuovo) => {
  await new Promise((res) => setTimeout(res, 400));
  if (!token?.startsWith("FAKE_JWT_")) throw new Error("Token non valido");

  const nuovoDip = { ...nuovo, id: Date.now() };
  personale.push(nuovoDip);
  return nuovoDip;
};

export const fakeUpdatePersonale = async (token, id, aggiornato) => {
  await new Promise((res) => setTimeout(res, 400));
  if (!token?.startsWith("FAKE_JWT_")) throw new Error("Token non valido");

  const index = personale.findIndex((p) => p.id === id);
  if (index === -1) throw new Error("Dipendente non trovato");

  personale[index] = { ...personale[index], ...aggiornato };
  return personale[index];
};

export const fakeDeletePersonale = async (token, id) => {
  await new Promise((res) => setTimeout(res, 400));
  if (!token?.startsWith("FAKE_JWT_")) throw new Error("Token non valido");

  const index = personale.findIndex((p) => p.id === id);
  if (index === -1) throw new Error("Dipendente non trovato");

  const [rimosso] = personale.splice(index, 1);
  return rimosso;
};

// 🔹 Richiesta ferie da parte dell’utente
export const fakeRichiediFerie = async (token, id, giorniRichiesti) => {
  await new Promise((res) => setTimeout(res, 400));
  if (!token?.startsWith("FAKE_JWT_")) throw new Error("Token non valido");

  const user = personale.find((p) => p.id === id);
  if (!user) throw new Error("Dipendente non trovato");

  const ferieResidue = user.ferieTotali - user.ferieUsate;
  if (giorniRichiesti > ferieResidue)
    throw new Error("Non hai abbastanza ferie residue");

  user.ferieUsate += giorniRichiesti;

  return {
    messaggio: `Richiesta di ${giorniRichiesti} giorni approvata automaticamente.`,
    user,
  };
};

// 🔹 Supervisore approva o rifiuta richiesta ferie
export const fakeApprovaFerie = async (token, id, giorni, approvata = true) => {
  await new Promise((res) => setTimeout(res, 400));
  if (!token?.startsWith("FAKE_JWT_")) throw new Error("Token non valido");

  const user = personale.find((p) => p.id === id);
  if (!user) throw new Error("Dipendente non trovato");

  if (approvata) {
    user.ferieUsate += giorni;
    return { messaggio: `Ferie di ${user.nome} approvate.`, user };
  } else {
    return { messaggio: `Richiesta ferie di ${user.nome} rifiutata.`, user };
  }
};
