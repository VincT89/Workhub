// src/mocks/personalMock.js
export const personnel = [
  {
    id: 1,
    username: "admin",
    password: "admin123",

    // DATI AZIENDALI
    nome: "Jennifer Bianchi",
    ruolo: "Responsabile reparto",   // reparto aziendale
    matricola: "ADD-0001",
    email: "jennifer.bianchi@example.com",

    // RUOLO DI ACCESSO (permessi)
    role: "admin",
  },

  {
    id: 2,
    username: "user",
    password: "user123",

    nome: "Luca Rossi",
    ruolo: "Sviluppatore",
    matricola: "ADD-0002",
    email: "luca.rossi@example.com",

    role: "user",
  },

  {
    id: 3,
    username: "user",
    password: "user123",

    nome: "Maria Verdi",
    ruolo: "Designer",
    matricola: "ADD-0003",
    email: "maria.verdi@example.com",

    role: "supervisor",
  },
];
