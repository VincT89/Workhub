import OrdersTable from "../components/Orders/OrdersTable";
import { useState, useEffect } from "react";
import { productsMock } from "../api/mock/productsMock";
import { customersMock } from "../api/mock/customersMock";
import { TrashIcon } from "@phosphor-icons/react";

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

  // localStorage
  const [selectedProducts, setSelectedProducts] = useState(() => {
    const salvati = localStorage.getItem("ordini");
    return salvati ? JSON.parse(salvati) : [];
  });

  useEffect(() => {
    localStorage.setItem("ordini", JSON.stringify(selectedProducts));
  }, [selectedProducts]);

  const orderColumns = [
    "prodotto",
    "quantità totale",
    "data",
    "stato",
    "corriere",
    "totale",
  ];

  // -------------------------
  // AGGIUNGI PRODOTTO
  // -------------------------
  const handleAddProduct = (productId) => {
    const product = productsMock.find((p) => String(p.id) === String(productId));
    if (!product) return;

    setSelectedProducts((prev) => {
      if (prev.some((p) => String(p.id) === String(product.id))) return prev;

      const clientiBase = customersMock.slice(0, 3);

      const clientiConOrdine = clientiBase.map((cliente) => {
        const qty = Math.floor(Math.random() * 3) + 1;
        const totale = qty * product.prezzo;

        return {
          ...cliente,
          qty,
          totale,
        };
      });

      const qtyTot = clientiConOrdine.reduce((s, c) => s + c.qty, 0);
      const totOrdine = clientiConOrdine.reduce((s, c) => s + c.totale, 0);

      const today = new Date().toLocaleDateString("it-IT");

      const newOrder = {
        id: product.id,
        prodotto: product.nome,
        "quantità totale": qtyTot,
        data: today,
        stato: "",
        corriere: "",
        totale: Number(totOrdine.toFixed(2)),
        prodottoDettaglio: product,
        clienti: clientiConOrdine,
      };

      return [...prev, newOrder];
    });
  };

  const handleDeleteOrder = (orderId) => {
    setSelectedProducts((prev) => prev.filter((o) => o.id !== orderId));
  };

  const handleUpdateStatus = (orderId, newStatus) => {
    setSelectedProducts((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, stato: newStatus } : o))
    );
  };

  const handleUpdateCarrier = (orderId, newCarrier) => {
    setSelectedProducts((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, corriere: newCarrier } : o))
    );
  };

  const recomputeOrderTotals = (clienti) => {
    const qtyTot = clienti.reduce((s, c) => s + c.qty, 0);
    const totOrdine = clienti.reduce((s, c) => s + c.totale, 0);
    return { qtyTot, totOrdine };
  };

  const handleUpdateClient = (orderId, clientId, updatedFields) => {
    setSelectedProducts((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;

        const prezzo = order.prodottoDettaglio?.prezzo || 0;

        const upd = order.clienti.map((c) => {
          if (c.id !== clientId) return c;

          const nuovo = { ...c, ...updatedFields };

          if (updatedFields.qty !== undefined) {
            const qtyN = Number(updatedFields.qty) || 0;
            nuovo.qty = qtyN;
            nuovo.totale = qtyN * prezzo;
          }

          return nuovo;
        });

        const { qtyTot, totOrdine } = recomputeOrderTotals(upd);

        return {
          ...order,
          clienti: upd,
          "quantità totale": qtyTot,
          totale: Number(totOrdine.toFixed(2)),
        };
      })
    );
  };

  const handleDeleteClient = (orderId, clientId) => {
    setSelectedProducts((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;

        const upd = order.clienti.filter((c) => c.id !== clientId);
        const { qtyTot, totOrdine } = recomputeOrderTotals(upd);

        return {
          ...order,
          clienti: upd,
          "quantità totale": qtyTot,
          totale: Number(totOrdine.toFixed(2)),
        };
      })
    );
  };

  const handleAddClient = (orderId, customerId) => {
    setSelectedProducts((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;
        const prezzo = order.prodottoDettaglio?.prezzo || 0;

        const customer = customersMock.find((c) => c.id === customerId);
        if (!customer) return order;

        const nuovo = {
          ...customer,
          qty: 1,
          totale: prezzo,
        };

        const upd = [...order.clienti, nuovo];
        const { qtyTot, totOrdine } = recomputeOrderTotals(upd);

        return {
          ...order,
          clienti: upd,
          "quantità totale": qtyTot,
          totale: Number(totOrdine.toFixed(2)),
        };
      })
    );
  };

  // --------------------------------------------------------
  // FUNZIONE RIORDINO → stock + quantità totale
  // --------------------------------------------------------
  const handleReorderStock = (orderId, qty) => {
    const aggiunta = Number(qty) || 0;

    setSelectedProducts((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;

        const oldStock = order.prodottoDettaglio?.stock || 0;

        return {
          ...order,
          "quantità totale": order["quantità totale"] + aggiunta,
          prodottoDettaglio: {
            ...order.prodottoDettaglio,
            stock: oldStock + aggiunta,
          },
        };
      })
    );
  };

  const rowActions = [
    {
      name: "delete",
      icon: (
        <span className="text-lg" role="img" aria-label="Elimina">
          <TrashIcon size={28} color="#ff0000" weight="duotone" />
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
        onReorderStock={handleReorderStock} 
        statusOptions={STATUS_OPTIONS}
        courierOptions={COURIER_OPTIONS}
        actions={rowActions}
        actionLabel="Actions"
      />
    </div>
  );
};

export default OrderPage;
