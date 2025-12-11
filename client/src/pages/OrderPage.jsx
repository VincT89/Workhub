import OrdersTable from "../components/Orders/OrdersTable";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchOrders,
  createOrder,
  deleteOrder,
} from "../store/feature/orderSlice.js";

import { fetchCustomersAsync } from "../store/feature/customerSlice.js";
import { fetchProducts } from "../store/feature/productsSlice.js";

const OrderPage = () => {
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");

  // ====== REDUX STATE ======
  const { items: orders, loading: loadingOrders } = useSelector((state) => state.orders);
  const { list: customers } = useSelector((state) => state.customers);
  const { list: products } = useSelector((state) => state.products);

  // ====== UI STATE ======
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [clientRows, setClientRows] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState("");

  // ====== FETCH DATI REALI ======
  useEffect(() => {
    dispatch(fetchOrders({ token }));
    dispatch(fetchCustomersAsync(token));
    dispatch(fetchProducts(token)); // <-- il tuo slice accetta token semplice
  }, [dispatch, token]);

  const orderColumns = [
    "product",
    "totalQuantity",
    "createdAt",
    "stato",
    "corriere",
    "totale",
  ];

  // ====== AGGIUNGI CLIENTE ======
  const handleAddClientRow = () => {
    setClientRows((prev) => [...prev, { clientId: "", quantity: "" }]);
  };

  const handleClientChange = (index, field, value) => {
    setClientRows((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [field]: value } : row))
    );
  };

  // ====== CREA ORDINE ======
  const handleCreateOrder = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const orderData = {
      pointOfSales: formData.get("pointOfSaleId"),
      product: formData.get("productId"),
      totalQuantity: Number(formData.get("totalQuantity")),

      clients: clientRows
        .filter((r) => r.clientId && r.quantity)
        .map((r) => ({
          client: r.clientId,
          quantity: Number(r.quantity),
        })),

      note: formData.get("note") || "",
    };

    dispatch(createOrder({ orderData, token }))
      .unwrap()
      .then(() => {
        setToastMessage("Ordine creato con successo!");
        setTimeout(() => setToastMessage(""), 2500);

        setDrawerOpen(false);
        setClientRows([]);
        setSelectedProductId("");
        e.target.reset();
      })
      .catch((err) => console.error("Errore creazione ordine:", err));
  };

  // ====== DELETE ORDINE ======
  const handleDeleteOrder = (id) => {
    dispatch(deleteOrder({ id, token }));
  };

  return (
    <div className="w-full px-6 pb-6 flex flex-col gap-6">

      {/* DRAWER NUOVO ORDINE */}
      {drawerOpen && (
        <div className="p-6 flex flex-col gap-4 rounded-xl border border-white/30 shadow-md backdrop-blur-sm bg-white/20">
          <h3 className="text-lg font-bold text-[#090c64]">Nuovo Ordine</h3>

          <form onSubmit={handleCreateOrder} className="grid grid-cols-2 gap-4">

            <input
              name="pointOfSaleId"
              type="text"
              placeholder="ID pointOfSale"
              required
              className="p-2 border rounded"
            />

            {/* SELECT PRODOTTO DA REDUX */}
            <select
              name="productId"
              required
              className="p-2 border rounded"
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
            >
              <option value="">Seleziona prodotto</option>

              {products?.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name} — €{p.price}
                </option>
              ))}
            </select>

            {/* QUANTITÀ TOTALE */}
            <input
              name="totalQuantity"
              type="number"
              min="1"
              placeholder="Quantità totale"
              required
              className="p-2 border rounded"
            />

            {/* CLIENTI */}
            <div className="col-span-2 flex items-center justify-between mt-2">
              <span className="text-sm font-semibold text-[#090c64]">
                Clienti e quantità
              </span>

              <button
                type="button"
                onClick={handleAddClientRow}
                className="px-3 py-1 text-xs bg-[#090c64] text-white rounded-lg"
              >
                Aggiungi cliente
              </button>
            </div>

            {clientRows.map((row, index) => (
              <div key={index} className="col-span-2 grid grid-cols-2 gap-2">

                {/* SELECT CLIENTE DA REDUX */}
                <select
                  value={row.clientId}
                  onChange={(e) =>
                    handleClientChange(index, "clientId", e.target.value)
                  }
                  className="p-2 border rounded text-sm"
                >
                  <option value="">Seleziona cliente</option>

                  {customers?.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.firstName} {c.lastName} — {c.location.city}
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  min="1"
                  value={row.quantity}
                  onChange={(e) =>
                    handleClientChange(index, "quantity", e.target.value)
                  }
                  placeholder="Quantità"
                  className="p-2 border rounded text-sm"
                />
              </div>
            ))}

            <div className="col-span-2 flex justify-end gap-2 mt-3">
              <button
                type="button"
                onClick={() => {
                  setDrawerOpen(false);
                  setClientRows([]);
                  setSelectedProductId("");
                }}
                className="px-4 py-2 border rounded-xl"
              >
                Annulla
              </button>

              <button
                type="submit"
                className="px-4 py-2 bg-[#090c64] text-white rounded-xl"
              >
                Crea Ordine
              </button>
            </div>

          </form>

          {toastMessage && (
            <div className="mt-2 p-2 bg-green-500 text-white rounded text-center">
              {toastMessage}
            </div>
          )}
        </div>
      )}

      {/* TABELLA ORDINI */}
      <OrdersTable
        data={orders}
        columns={orderColumns}
        loading={loadingOrders}
        customToolbar={
          <button
            onClick={() => setDrawerOpen((prev) => !prev)}
            className="px-4 py-2 bg-[#090c64] text-white rounded-xl shadow-md"
          >
            Nuovo Ordine
          </button>
        }
        actions={[
          {
            name: "delete",
            icon: <span role="img" aria-label="Elimina">🗑</span>,
            onClick: (row) => handleDeleteOrder(row._id),
          },
        ]}
      />
    </div>
  );
};

export default OrderPage;
