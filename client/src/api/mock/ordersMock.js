// src/data/ordersMock.js
export const ordersMock = [
  {
    id: 1,
    numero: "6890",
    sigla: "OC1/24",
    cliente: "Athlets srl",
    totale: 903.07,
    data: "2024-04-15T12:53:00",
    stato: "Memorizzato",
    pagamento: "Braintree",
    vettore: "Bartolini",
    consegna: "—",
    origine: "Web",
    marketplace: "—",
     items: [
      { productId: "P001", qty: 2 },
      { productId: "P003", qty: 1 },
    ],
  },
  {
    id: 2,
    numero: "6162",
    sigla: "OC2/23",
    cliente: "A.R.I.E.S spa",
    totale: 95.94,
    data: "2023-10-16T00:00:00",
    stato: "Fatturato",
    pagamento: "Bonifico",
    vettore: "Bartolini",
    consegna: "—",
    origine: "Web",
    marketplace: "—",
    items: [
      { productId: "P002", qty: 1 },
      { productId: "P005", qty: 1 },
    ],
  },
];