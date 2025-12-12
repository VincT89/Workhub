import OrdersTable from "../components/Orders/OrdersTable";
//useState→x creare e gestire i dati
//useEffect→x fare qualcosa dopo che il componente è montato
import { useState, useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

import {
  createOrder,
  fetchOrders,
  deleteOrder,
} from "../store/feature/orderSlice";

import { fetchProducts } from "../store/feature/productsSlice";
import { fetchPointsOfSalesAsync } from "../store/feature/pointOfSalesSlice";
import { fetchCustomersAsync } from "../store/feature/customerSlice";
import { TrashIcon } from "@phosphor-icons/react";
import { useTheme } from "../context/ThemeContext";

const OrderPage = () => {
  // Carico gli ordini salvati (solo visualizzazione)
  const selectedProducts = useSelector((state) => state.orders.items);

  // nomi delle colonne
  const orderColumns = [
    "prodotto",
    "quantità totale",
    "data",
    "stato",
    "corriere",
    "totale",
  ];

  // stato per il drawer "Nuovo ordine"
  const [drawerOpen, setDrawerOpen] = useState(false);

  //→ tiene la lista dei clienti aggiunti al nuovo ordine
  //→ Aggiungi cliente
  const [clientRows, setClientRows] = useState([]);

  //→ ricorda quale prodotto hai selezionato nella select
  //→ seleziona prodotto
  const [selectedProductId, setSelectedProductId] = useState("");

  //→ punti vendita
  const [selectedPointOfSaleId, setSelectedPointOfSaleId] = useState("");

  const { theme } = useTheme();//dark mode

  //→ Aggiunge una nuova riga alla lista clientRows
  const handleAddClientRow = () => {
    //→(prev) = l'array che c'era prima
    //→[...prev, copia tutto quello che c'era prima=spread
    //{...}=nuova riga vuota
    setClientRows((prev) => [...prev, { customerId: "", qty: "" }]);
  };

  //→ serve per modificare una singola riga dei clienti
  //→ field= quale campo vuoi cambiare
  //→ value= il nuovo valore
  const handleClientChange = (index, field, value) => {
    setClientRows((prev) =>
      //→ map= serve per creare un nuvo array trasformando ogni elemento
      prev.map((row, i) => (i === index ? { ...row, [field]: value } : row))
    );
  };

  const products = useSelector((state) => state.products.list);
  const pointOfSales = useSelector((state) => state.pos.list); //punti vendita
  const customers = useSelector((state) => state.customers.list);
  const orders = useSelector((state) => state.orders.items);

  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    if (!token) return;

    dispatch(fetchOrders({ token }));
    dispatch(fetchProducts(token));
    dispatch(fetchPointsOfSalesAsync({ token }));
    dispatch(fetchCustomersAsync(token));
  }, [dispatch, token]);

  //Bottone → Crea (dentro nuovo ordine) → Drawer
  const handleCreateOrder = (e) => {
    // → non ricarica la pagina
    e.preventDefault();

    // → Prendo tutti i valori che ho scritto nel form
    // e li metto in un’unica scatola chiamata formData
    const formData = new FormData(e.target);

    const pointOfSaleId = formData.get("pointOfSaleId");
    const productId = formData.get("productId");

    // Number → converte la stringa in numero
    // → Prendo dal form la quantità totale, la trasformo in numero,
    //   e se non è valida metto 0, e la salvo
    const totalQuantity = Number(formData.get("totalQuantity")) || 0;

    //→ punto vendita
    const pointOfSale = pointOfSales?.find(
      (pv) => String(pv._id) === String(pointOfSaleId)
    );
    const pointOfSaleName = pointOfSale?.name || "";

    //  Cerco il prodotto vero dentro Redux
    const productFromStore = products?.find(
      (p) => String(p._id) === String(productId)
    );

    const prezzoUnitario = productFromStore?.price || 0;
    const nomeProdotto = productFromStore?.name || "Prodotto";

    //  DETTAGLI CLIENTI
    const clientiDettaglio = clientRows
      .filter((row) => row.customerId && row.qty !== "")
      .map((row) => {
        const customer = customers?.find(
          (c) => String(c._id) === String(row.customerId)
        );

        const qtyNumber = Number(row.qty) || 0;

        return {
          ...customer,
          qty: qtyNumber,
          totale: qtyNumber * prezzoUnitario,
        };
      });

    // → calcolo il totale dell’intero ordine in euro
    const totaleOrdine = clientiDettaglio.reduce(
      (sum, c) => sum + (c.totale || 0),
      0
    );

    const newOrder = {
      prodotto: nomeProdotto,
      "quantità totale": totalQuantity,
      data: new Date().toLocaleDateString("it-IT"),
      stato: "In preparazione",
      corriere: "Bartolini",
      totale: Number(totaleOrdine.toFixed(2)),
      prodottoDettaglio: productFromStore,
      clienti: clientiDettaglio,
      pointOfSaleId,
      pointOfSaleName,
    };

    dispatch(createOrder({newOrder, token}));

    // Chiudo drawer e resetto tutto
    setDrawerOpen(false);
    setClientRows([]);
    setSelectedProductId("");
    setSelectedPointOfSaleId("");
    e.target.reset();
  };

  // CESTINO/ELIMINA
  const handleDeleteOrder = (orderId) => {
    dispatch(deleteOrder(orderId));
  };

  return (
    <div className="w-full px-6 pb-6 flex flex-col gap-6">
      {/* DRAWER NUOVO ORDINE */}
      {drawerOpen && (
        <div className="p-6 flex flex-col gap-4 rounded-xl border border-white/30 shadow-md backdrop-blur-sm bg-white/20 transition duration-500">
          <h3 className="text-lg font-bold text-[#090c64]">Nuovo Ordine</h3>

          <form onSubmit={handleCreateOrder} className="grid grid-cols-2 gap-4">
            {/* SELECT PUNTI VENDITA */}
            <select
              name="pointOfSaleId"
              required
              className="p-2 border rounded"
              value={selectedPointOfSaleId}
              onChange={(e) => setSelectedPointOfSaleId(e.target.value)}
            >
              <option value=""> Seleziona punto vendita</option>
              {pointOfSales?.map((pv) => (
                <option key={pv._id} value={pv._id}>
                  {pv.name}
                </option>
              ))}
            </select>

            {/* SELECT PRODOTTO */}
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
                  {p.name}
                </option>
              ))}
            </select>

            {/* QUANTITÀ TOTALE (spostata accanto al prodotto) */}
            <input
              name="totalQuantity"
              type="number"
              min="0"
              placeholder="Quantità totale"
              required
              className="p-2 border rounded"
            />

            {/* SEZIONE CLIENTI */}
            <div className="col-span-2 flex items-center justify-between mt-2">
              <span className="text-sm font-semibold text-[#090c64]">
                Clienti e relative quantità
              </span>
              <button
                type="button"
                onClick={handleAddClientRow}
                className="px-3 py-1 text-xs bg-[#090c64] text-white rounded-lg cursor-pointer hover:bg-[#0c0f7a] transition"
              >
                Aggiungi cliente
              </button>
            </div>

            {clientRows.map((row, index) => (
              <div key={index} className="col-span-2 grid grid-cols-2 gap-2">
                <select
                  value={row.customerId}
                  onChange={(e) =>
                    handleClientChange(index, "customerId", e.target.value)
                  }
                  className="p-2 border rounded text-sm"
                >
                  <option value="">Seleziona cliente</option>
                  {customers?.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.firstName} {c.lastName} ({c.location?.city})
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  min="0"
                  value={row.qty}
                  onChange={(e) =>
                    handleClientChange(index, "qty", e.target.value)
                  }
                  placeholder="Quantità per questo cliente"
                  className="p-2 border rounded text-sm"
                />
              </div>
            ))}

            <div className="col-span-2 flex justify-end gap-2 mt-2">
              <button
                type="button"
                onClick={() => {
                  setDrawerOpen(false);
                  setClientRows([]);
                  setSelectedProductId("");
                  setSelectedPointOfSaleId("");
                }}
                className="px-4 py-2 border rounded-xl cursor-pointer hover:bg-gray-100 transition"
              >
                Annulla
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#090c64] text-white rounded-xl cursor-pointer transition"
              >
                Crea
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TABELLA ORDINI */}
      <OrdersTable
        data={orders}
        columns={orderColumns}
        customToolbar={
          <button
            type="button"
            onClick={() => setDrawerOpen((prev) => !prev)}
            className="px-4 py-2 bg-[#090c64] text-white rounded-xl shadow-md cursor-pointer hover:bg-[#0c0f7a] transition"
          >
            Nuovo Ordine
          </button>
        }
        actionLabel="Azioni"
        actions={[
          {
            name: "delete",
            icon: (
              <TrashIcon
                size={28}
                color={theme === "dark" ? "#ff4d4d" : "#ff0000"}
                weight="duotone"
              />
            ),
            onClick: (row) => handleDeleteOrder(row._id),
          },
        ]}
      />
    </div>
  );
};

export default OrderPage;