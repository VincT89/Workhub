export const ticket = [
  {
    id: 1,
    titolo: "Stampante non funziona",
    descrizione:
      "La stampante del reparto vendite non risponde ai comandi di stampa. Probabile inceppamento o driver da aggiornare.",
    reparto: "Vendite",
    stato: "Aperto",
    creatoDa: "Lucia Bianchi",
    assegnatoA: "Mario Rossi",
    dataCreazione: "2025-10-28",
    commenti: [
      {
        autore: "Mario Rossi",
        data: "2025-10-29",
        testo: "Verificato il problema. Inoltrata richiesta assistenza tecnica.",
      },
    ],
  },
  {
    id: 2,
    titolo: "Mancanza scorte nel deposito Nord",
    descrizione:
      "Il deposito Nord segnala una carenza di sedie LACK. Necessario riordino o trasferimento da altro magazzino.",
    reparto: "Magazzino",
    stato: "In progress",
    creatoDa: "Paolo Verdi",
    assegnatoA: "Lucia Bianchi",
    dataCreazione: "2025-10-30",
    commenti: [
      {
        autore: "Lucia Bianchi",
        data: "2025-10-31",
        testo: "Ordine di riapprovvigionamento creato, in attesa conferma fornitore.",
      },
    ],
  },
  {
    id: 3,
    titolo: "Errore accesso gestionale",
    descrizione:
      "Un utente non riesce ad accedere al gestionale nonostante le credenziali siano corrette.",
    reparto: "Direzione",
    stato: "Completato",
    creatoDa: "Paolo Verdi",
    assegnatoA: "Mario Rossi",
    dataCreazione: "2025-10-25",
    commenti: [
      {
        autore: "Mario Rossi",
        data: "2025-10-26",
        testo: "Bug risolto. Aggiornato il sistema di autenticazione fake.",
      },
      {
        autore: "Paolo Verdi",
        data: "2025-10-26",
        testo: "Confermo che ora riesco ad accedere correttamente.",
      },
    ],
  },
  {
    id: 4,
    titolo: "Richiesta ferie straordinarie",
    descrizione:
      "Richiesta di 2 giorni di ferie extra per motivi familiari, da parte di Paolo Verdi.",
    reparto: "Magazzino",
    stato: "Bloccato",
    creatoDa: "Paolo Verdi",
    assegnatoA: "Lucia Bianchi",
    dataCreazione: "2025-10-22",
    commenti: [
      {
        autore: "Lucia Bianchi",
        data: "2025-10-23",
        testo: "Richiesta in sospeso in attesa approvazione HR.",
      },
    ],
  },
];
