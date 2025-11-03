import { magazzino } from "./mock/magazzinoMock";

//  Ottieni tutti i depositi con i prodotti
export const fakeFetchMagazzino = async (token) => {
  await new Promise((res) => setTimeout(res, 400));
  if (!token?.startsWith("FAKE_JWT_")) throw new Error("Token non valido");
  return magazzino;
};

//  Aggiungi un nuovo prodotto in un deposito
export const fakeAddProdotto = async (token, depositoId, nuovoProdotto) => {
  await new Promise((res) => setTimeout(res, 400));
  if (!token?.startsWith("FAKE_JWT_")) throw new Error("Token non valido");

  const deposito = magazzino.find((d) => d.depositoId === depositoId);
  if (!deposito) throw new Error("Deposito non trovato");

  const nuovo = {
    ...nuovoProdotto,
    id: "P" + Date.now(),
  };
  deposito.prodotti.push(nuovo);
  return nuovo;
};

//  Aggiorna le informazioni di un prodotto
export const fakeUpdateProdotto = async (token, depositoId, prodottoId, dataAggiornata) => {
  await new Promise((res) => setTimeout(res, 400));
  if (!token?.startsWith("FAKE_JWT_")) throw new Error("Token non valido");

  const deposito = magazzino.find((d) => d.depositoId === depositoId);
  if (!deposito) throw new Error("Deposito non trovato");

  const index = deposito.prodotti.findIndex((p) => p.id === prodottoId);
  if (index === -1) throw new Error("Prodotto non trovato");

  deposito.prodotti[index] = { ...deposito.prodotti[index], ...dataAggiornata };
  return deposito.prodotti[index];
};

//  Elimina un prodotto
export const fakeDeleteProdotto = async (token, depositoId, prodottoId) => {
  await new Promise((res) => setTimeout(res, 400));
  if (!token?.startsWith("FAKE_JWT_")) throw new Error("Token non valido");

  const deposito = magazzino.find((d) => d.depositoId === depositoId);
  if (!deposito) throw new Error("Deposito non trovato");

  const index = deposito.prodotti.findIndex((p) => p.id === prodottoId);
  if (index === -1) throw new Error("Prodotto non trovato");

  const [rimosso] = deposito.prodotti.splice(index, 1);
  return rimosso;
};

//  Funzione “Ordina da altro deposito”
export const fakeOrdinaDaAltroDeposito = async (token, sorgenteId, destinazioneId, prodottoId, quantita) => {
  await new Promise((res) => setTimeout(res, 600));
  if (!token?.startsWith("FAKE_JWT_")) throw new Error("Token non valido");

  const sorgente = magazzino.find((d) => d.depositoId === sorgenteId);
  const destinazione = magazzino.find((d) => d.depositoId === destinazioneId);
  if (!sorgente || !destinazione) throw new Error("Deposito non trovato");

  const prodottoSorgente = sorgente.prodotti.find((p) => p.id === prodottoId);
  if (!prodottoSorgente) throw new Error("Prodotto non trovato nel deposito sorgente");

  if (prodottoSorgente.quantita < quantita)
    throw new Error("Quantità non disponibile nel deposito sorgente");

  // Aggiorna quantità
  prodottoSorgente.quantita -= quantita;

  const prodottoDestinazione = destinazione.prodotti.find((p) => p.id === prodottoId);
  if (prodottoDestinazione) {
    prodottoDestinazione.quantita += quantita;
  } else {
    destinazione.prodotti.push({
      ...prodottoSorgente,
      quantita,
    });
  }

  return {
    messaggio: `Ordine di ${quantita} unità completato da ${sorgente.nomeDeposito} a ${destinazione.nomeDeposito}`,
  };
};
