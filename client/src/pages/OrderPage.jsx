import OrdersTable from "../components/Orders/OrdersTable";
import { useState, useEffect } from "react";
import { productsMock } from "../api/mock/productsMock";
import { customersMock } from "../api/mock/customersMock";

const STATUS_OPTIONS = ["In preparazione", "Spedito", "In consegna", "Consegnato"];
const COURIER_OPTIONS = ["Da assegnare", "BRT", "SDA", "DHL", "UPS", "GLS", "FedEx"];

// formattatore €
const formatEuro = (value) => {
  if (value === null || value === undefined || isNaN(value)) return "-";
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
  }).format(Number(value));
};

const OrderPage = () => {
  // Carico gli ordini salvati (se esistono)
  const [selectedProducts, setSelectedProducts] = useState(() => {
    const salvati = localStorage.getItem("ordini");
    return salvati ? JSON.parse(salvati) : [];
  });

  // Ogni volta che selectedProducts cambia → salvo
  useEffect(() => {
    localStorage.setItem("ordini", JSON.stringify(selectedProducts));
  }, [selectedProducts]);

  // NOMI COLONNE
  const orderColumns = [
    "prodotto",
    "quantità totale",
    "data",
    "stato",
    "corriere",
    "totale",
  ];

  // AGGIUNGI PRODOTTO
  const handleAddProduct = (productId) => {
    const product = productsMock.find((p) => String(p.id) === String(productId));
    if (!product) return;

    setSelectedProducts((prev) => {
      // se esiste già una riga per quel prodotto → non la duplico
      if (prev.some((p) => String(p.id) === String(product.id))) return prev;

      const numClienti = 3;
      const clientiSelezionatiBase = customersMock.slice(0, numClienti);

      const clientiConOrdine = clientiSelezionatiBase.map((cliente) => {
        const qty = Math.floor(Math.random() * 3) + 1; // 1-3 pezzi
        const totale = qty * product.prezzo;

        return {
          ...cliente,
          qty,
          totale,
        };
      });

      const qtyTotale = clientiConOrdine.reduce(
        (sum, c) => sum + (c.qty || 0),
        0
      );
      const totaleOrdine = clientiConOrdine.reduce(
        (sum, c) => sum + (c.totale || 0),
        0
      );

      const today = new Date().toLocaleDateString("it-IT");

      const newOrderRow = {
        id: product.id,
        prodotto: product.nome,
        "quantità totale": qtyTotale,
        data: today,
        stato: "",
        corriere: "",
        totale: Number(totaleOrdine.toFixed(2)),
        prodottoDettaglio: product, // contiene anche stock + img
        clienti: clientiConOrdine,
      };

      return [...prev, newOrderRow];
    });
  };

  // ELIMINA TUTTA LA RIGA
  const handleDeleteOrder = (orderId) => {
    setSelectedProducts((prev) => prev.filter((order) => order.id !== orderId));
  };

  // aggiorna stato
  const handleUpdateStatus = (orderId, newStatus) => {
    setSelectedProducts((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, stato: newStatus } : order
      )
    );
  };

  // aggiorna corriere
  const handleUpdateCarrier = (orderId, newCarrier) => {
    setSelectedProducts((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, corriere: newCarrier } : order
      )
    );
  };

  // ricalcola qty totale e totale ordine a partire dai clienti
  const recomputeOrderTotals = (clienti) => {
    const qtyTotale = clienti.reduce((sum, c) => sum + (c.qty || 0), 0);
    const totaleOrdine = clienti.reduce((sum, c) => sum + (c.totale || 0), 0);
    return { qtyTotale, totaleOrdine };
  };

  // modifica cliente (qty)
  const handleUpdateClient = (orderId, clientId, updatedFields) => {
    setSelectedProducts((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;

        const prezzo = order.prodottoDettaglio?.prezzo || 0;

        const updatedClients = order.clienti.map((cliente) => {
          if (cliente.id !== clientId) return cliente;

          const nuovoCliente = {
            ...cliente,
            ...updatedFields,
          };

          if (updatedFields.qty !== undefined) {
            const qtyNumber = Number(updatedFields.qty) || 0;
            nuovoCliente.qty = qtyNumber;
            nuovoCliente.totale = qtyNumber * prezzo;
          }

          return nuovoCliente;
        });

        const { qtyTotale, totaleOrdine } = recomputeOrderTotals(updatedClients);

        return {
          ...order,
          clienti: updatedClients,
          "quantità totale": qtyTotale,
          totale: Number(totaleOrdine.toFixed(2)),
        };
      })
    );
  };

  // elimina cliente
  const handleDeleteClient = (orderId, clientId) => {
    setSelectedProducts((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;

        const updatedClients = order.clienti.filter(
          (cliente) => cliente.id !== clientId
        );

        const { qtyTotale, totaleOrdine } = recomputeOrderTotals(updatedClients);

        return {
          ...order,
          clienti: updatedClients,
          "quantità totale": qtyTotale,
          totale: Number(totaleOrdine.toFixed(2)),
        };
      })
    );
  };

  //  aggiungi cliente scegliendolo da customersMock
  const handleAddClient = (orderId, customerId) => {
    setSelectedProducts((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;

        const prezzo = order.prodottoDettaglio?.prezzo || 0;
        const customer = customersMock.find((c) => c.id === customerId);
        if (!customer) return order;

        const newClient = {
          ...customer,
          qty: 1,
          totale: prezzo,
        };

        const updatedClients = [...order.clienti, newClient];

        const { qtyTotale, totaleOrdine } = recomputeOrderTotals(updatedClients);

        return {
          ...order,
          clienti: updatedClients,
          "quantità totale": qtyTotale,
          totale: Number(totaleOrdine.toFixed(2)),
        };
      })
    );
  };

  // colonna actions
  const rowActions = [
    {
      name: "delete",
      icon: (
        <span className="text-lg" role="img" aria-label="Elimina">
          🗑
        </span>
      ),
      onClick: (row) => handleDeleteOrder(row.id),
    },
  ];

  return (
    <div className="w-full px-6 pb-6">
      <OrdersTable
        data={selectedProducts}
        columns={orderColumns}
        productsOptions={productsMock}
        customersOptions={customersMock}
        onAddProduct={handleAddProduct}  
        onUpdateStatus={handleUpdateStatus}
        onUpdateCarrier={handleUpdateCarrier}
        onUpdateClient={handleUpdateClient}
        onDeleteClient={handleDeleteClient}
        onAddClient={handleAddClient}
        statusOptions={STATUS_OPTIONS}
        courierOptions={COURIER_OPTIONS}
        actions={rowActions}
        actionLabel="Actions"
      />
    </div>
  );
};

export default OrderPage;