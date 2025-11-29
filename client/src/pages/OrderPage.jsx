import OrdersTable from "../components/Orders/OrdersTable";
import { useEffect, useState } from "react";
import { ordersMock } from "../api/mock/ordersMock";
import { productsMock } from "../api/mock/productsMock";
import OrdersDrawer from "../components/Orders/OrdersDrawer";

// TABELLA ORDINI PER ARTICOLO
const orderColumns = [
  "numero", // Ordine / Articolo (es. SKU o codice)
  "data", // Data ordine
  "cliente", // Elenco clienti che vogliono quell'articolo
  "qty", // Quantità per cliente + totale + giacenza
  "pagamentoBadge", // Pagamento (pillolina)
  "statoLabel", // Stato / consegna (pillolina)
  "vettore", // Corriere
  "totaleLabel", // Totale ordine
];

// FUNZIONE PER FORMATTARE TOTALE
const formatTotale = (value, locale = "it-IT") => {
  if (value === null || value === undefined || isNaN(value)) return "—";
  return Number(value).toLocaleString(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

// STILE BASE PER LE PILLOLE (pagamento + stato)
const badgeBaseClass =
  "inline-flex items-center justify-center border text-sm px-1.5 py-1 rounded-lg font-semibold";

// varianti colore pagamento
const pagamentoStyles = {
  successo: "bg-[#d1fadf] text-[#166534] border-[#bbf7d0]", // verde
  "in attesa": "bg-[#fef9c3] text-[#854d0e] border-[#fef08a]", // giallo
  default: "bg-[#e5e7eb] text-[#374151] border-[#d1d5db]", // grigio
};

// varianti colore stato
const statoStyles = {
  consegnato: "bg-[#d1fadf] text-[#166534] border-[#bbf7d0]", // verde
  spedito: "bg-[#fef9c3] text-[#854d0e] border-[#fef08a]", // giallo
  preparazione: "bg-[#e5e7eb] text-[#374151] border-[#d1d5db]", // grigio chiaro
};

// FUNZIONE X PILLOLA COLORATA → PAGAMENTO
const getPagamentoBadge = (pagamento) => {
  const norm = pagamento?.toLowerCase().trim();

  let style;
  let label;

  if (!pagamento || pagamento === "—" || norm === "in attesa") {
    style = pagamentoStyles["in attesa"];
    label = "In attesa";
  } else {
    style = pagamentoStyles.successo;
    label = "Successo";
  }

  return <span className={`${badgeBaseClass} ${style}`}>{label}</span>;
};

// FUNZIONE X PILLOLA COLORATA → STATO
const getStatoBadge = (stato) => {
  if (!stato || stato === "—") return "—";

  const norm = stato.toLowerCase().trim();

  let style;
  if (norm === "consegnato") {
    style = statoStyles.consegnato;
  } else if (norm === "spedito") {
    style = statoStyles.spedito;
  } else if (norm === "in preparazione") {
    style = statoStyles.preparazione;
  } else {
    // se è un valore strano → testo semplice senza pillola
    return stato;
  }

  return <span className={`${badgeBaseClass} ${style}`}>{stato}</span>;
};

// INIZIO DEL COMPONENTE
const OrdersPage = () => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem("orders");
    if (saved) return JSON.parse(saved);
    return ordersMock;
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const [editValues, setEditValues] = useState({
    numero: "",
    cliente: "",
    totale: "",
    stato: "",
    pagamento: "",
    vettore: "",
    consegna: "",
  });

  const [newItems, setNewItems] = useState([]);
  const [newItemProductId, setNewItemProductId] = useState(
    productsMock[0]?.id || ""
  );
  const [newItemQty, setNewItemQty] = useState(1);

  // lista clienti per articolo
  const [clients, setClients] = useState([]);

  const [alert, setAlert] = useState(null);

  const inputClass =
    "mt-1 w-full px-3 py-2 rounded-xl bg-white/90 border border-white/70 text-sm text-[#090c64] shadow-sm";

  const selectClass =
    "mt-1 w-full px-3 py-2 rounded-xl bg-white/90 border border-white/70 text-sm text-[#090c64] shadow-sm";

  const qtyInputClass =
    "mt-1 w-20 px-3 py-2 rounded-lg bg-white/90 border border-white/80 text-sm text-[#090c64] text-center";

  const paymentOptions = [
    "Bonifico",
    "Carta di credito",
    "PayPal",
    "Contanti",
    "Braintree",
  ];

  const vettoreOptions = ["BRT", "Poste Italiane", "UPS", "GLS", "DHL"];

  // opzioni per STATO (ex Consegna)
  const consegnaOptions = ["In preparazione", "Spedito", "Consegnato"];

  // SALVA ORDINI SU LOCAL STORAGE
  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(orders));
  }, [orders]);

  // quando selezioni una riga, popola gli input del drawer
  useEffect(() => {
    if (selected) {
      setEditValues({
        numero: selected.numero || "",
        cliente: selected.cliente || "",
        totale:
          selected.totale === undefined || selected.totale === null
            ? ""
            : String(selected.totale),
        stato: selected.stato || "",
        pagamento: selected.pagamento || "",
        vettore: selected.vettore || "",
        consegna: selected.consegna || "",
      });

      setNewItems(selected.items || []);
      setClients(Array.isArray(selected.clienti) ? selected.clienti : []);

      setIsEditing(false);
      setIsAdding(false);
    } else {
      setClients([]);
    }
  }, [selected]);

  useEffect(() => {
    if (!alert) return;
    const t = setTimeout(() => setAlert(null), 3000);
    return () => clearTimeout(t);
  }, [alert]);

  const handleRowClick = (row) => {
    const baseOrder = orders.find((o) => o.id === row.id) || row;

    setSelected(baseOrder);
    setOpen(true);
    setIsEditing(false);
    setIsAdding(false);
  };

  const handleDeleteOrder = () => {
    if (!selected) return;

    const deletedNumber = selected.numero;

    setOrders((prev) => prev.filter((order) => order.id !== selected.id));
    close();

    setAlert({
      type: "delete",
      text: `L'ordine #${deletedNumber} è stato eliminato.`,
    });
  };

  const handleEditOrder = () => {
    if (!selected) return;
    setIsEditing(true);
    setIsAdding(false);
  };

  const calculateTotalFromItems = (items) => {
    return (items || []).reduce((sum, it) => {
      const product = productsMock.find((p) => p.id === it.productId);
      if (!product) return sum;
      const qtyNumber = Number(it.qty) || 0;
      return sum + product.prezzo * qtyNumber;
    }, 0);
  };

  const handleSaveOrder = () => {
    // CREAZIONE NUOVO ORDINE
    if (isAdding) {
      const parsedTotaleAdd = parseFloat(
        (editValues.totale || "").replace(",", ".")
      );
      let newTotaleAdd = isNaN(parsedTotaleAdd) ? 0 : parsedTotaleAdd;

      const totalFromItemsAdd = calculateTotalFromItems(newItems);
      if (newItems.length > 0) {
        newTotaleAdd = totalFromItemsAdd;
      }

      const nuovoOrdine = {
        id: Date.now(),
        numero: editValues.numero.trim() || "S/N",
        cliente: editValues.cliente.trim() || "Cliente sconosciuto",
        totale: newTotaleAdd,
        data: new Date().toISOString(),
        stato: editValues.stato.trim() || "Memorizzato",
        pagamento: editValues.pagamento.trim() || "—",
        vettore: editValues.vettore.trim() || "—",
        consegna: editValues.consegna.trim() || "—",
        marketplace: "—",
        items: newItems,
        clienti: clients,
      };

      setOrders((prev) => [...prev, nuovoOrdine]);
      setSelected(nuovoOrdine);
      setIsAdding(false);
      setIsEditing(false);

      setAlert({
        type: "create",
        text: `L'ordine #${nuovoOrdine.numero} è stato creato.`,
      });

      return;
    }

    // UPDATE ORDINE ESISTENTE
    if (!selected) return;

    const parsedTotale = parseFloat(
      (editValues.totale || "").replace(",", ".")
    );
    let newTotale = isNaN(parsedTotale) ? selected.totale : parsedTotale;

    const totalFromItems = calculateTotalFromItems(newItems);
    if (newItems.length > 0) {
      newTotale = totalFromItems;
    }

    const updatedOrder = {
      ...selected,
      numero: editValues.numero.trim() || selected.numero,
      cliente: editValues.cliente.trim() || selected.cliente,
      totale: newTotale,
      stato: editValues.stato.trim() || selected.stato,
      pagamento: editValues.pagamento.trim() || selected.pagamento,
      vettore: editValues.vettore.trim() || selected.vettore,
      consegna: editValues.consegna.trim() || selected.consegna,
      items: newItems,
      clienti: clients,
    };

    setOrders((prev) =>
      prev.map((order) => (order.id === selected.id ? updatedOrder : order))
    );

    setSelected(updatedOrder);
    setIsEditing(false);

    setAlert({
      type: "update",
      text: `L'ordine #${updatedOrder.numero} è stato modificato.`,
    });
  };

  const handleAddOrder = () => {
    setIsAdding(true);
    setIsEditing(true);
    setSelected(null);
    setEditValues({
      numero: "",
      cliente: "—",
      totale: "",
      stato: "—",
      pagamento: "—",
      vettore: "—",
      consegna: "—",
    });
    setNewItems([]);
    setNewItemProductId(productsMock[0]?.id || "");
    setNewItemQty(1);
    setClients([]);
    setOpen(true);
  };

  const close = () => {
    setOpen(false);
    setSelected(null);
    setIsEditing(false);
    setIsAdding(false);
  };

  const handleAddItemToNewOrder = () => {
    if (!newItemProductId) return;

    const qty = parseInt(newItemQty, 10) || 1;

    // IMPORTANTE: forza SEMPRE e SOLO 1 articolo
    setNewItems([
      {
        productId: newItemProductId,
        qty,
      },
    ]);

    setNewItemQty(1);
  };

  const findProduct = (id) => productsMock.find((p) => p.id === id);

  const handleChangeItemQty = (index, newQty) => {
    const safeQty = newQty < 1 ? 1 : newQty;
    setNewItems((prev) =>
      prev.map((it, i) => (i === index ? { ...it, qty: safeQty } : it))
    );
  };

  const getTotalOrderedForProduct = (productId) => {
    return orders.reduce((sum, order) => {
      const items = order.items || [];
      const orderSum = items.reduce((s, it) => {
        if (it.productId !== productId) return s;
        return s + (Number(it.qty) || 0);
      }, 0);
      return sum + orderSum;
    }, 0);
  };

  // CLIENTI ARTICOLO
  const handleAddClient = () => {
    setClients((prev) => [
      ...prev,
      {
        nome: "",
        qty: 1,
        // niente pagamento / vettore / stato / data qui:
        // verranno presi dai valori dell'ordine (editValues)
      },
    ]);
  };

  const handleClientChange = (index, field, value) => {
    setClients((prev) =>
      prev.map((c, i) => (i === index ? { ...c, [field]: value } : c))
    );
  };

  const handleRemoveClient = (index) => {
    setClients((prev) => prev.filter((_, i) => i !== index));
  };

  // PREZZO UNITARIO ARTICOLO CORRENTE (per calcolare il totale di ogni cliente)
  const currentItem =
    (isEditing || isAdding ? newItems[0] : selected?.items?.[0]) || null;
  const currentProduct = currentItem ? findProduct(currentItem.productId) : null;
  const unitPrice = currentProduct?.prezzo ?? 0;

  // dati preparati per la tabella
  const ordersForTable = orders.flatMap((order) => {
    const items = Array.isArray(order.items) ? order.items : [];
    const firstItem = items.length > 0 ? items[0] : null;
    const product = firstItem ? findProduct(firstItem.productId) : null;

    // etichetta articolo (n° ordine / SKU / id prodotto)
    const prodottoLabel = order.numero || product?.sku || product?.id;

    const clienti = Array.isArray(order.clienti) ? order.clienti : [];

    // per giacenza
    let giacenza = 79;
    if (firstItem && product) {
      const totalOrdered = getTotalOrderedForProduct(firstItem.productId);
      const initialStock = product.stock ?? null;
      if (initialStock != null) {
        giacenza = Math.max(initialStock - totalOrdered, 0);
      }
    }

    // prezzo unitario per calcolare il totale di ogni cliente in tabella
    const unitPriceTable = product?.prezzo ?? 0;

    let totalQty = 0;

    const clientRows =
      clienti.length > 0
        ? clienti.map((c, idx) => {
          const qtyNum = Number(c.qty) || 0;
          totalQty += qtyNum;

          // se il cliente ha "—" o stringa vuota, usiamo i valori dell'ordine
          const rawPagamento = c.pagamento;
          const clientPagamento =
            rawPagamento && rawPagamento !== "—" ? rawPagamento : "";

          const rawVettore = c.vettore;
          const clientVettore =
            rawVettore && rawVettore !== "—" ? rawVettore : "";

          const rawConsegna = c.consegna;
          const clientConsegna =
            rawConsegna && rawConsegna !== "—" ? rawConsegna : "";

          const statoRow = clientConsegna || order.consegna || "—";

          // totale per SINGOLO CLIENTE (stessa logica del Drawer)
          const clientTotal = unitPriceTable * qtyNum;
          const clientTotaleLabel =
            clientTotal > 0
              ? `€ ${formatTotale(clientTotal, "it-IT")}`
              : "€ 0,00";

          return {
            id: order.id,
            numero: idx === 0 ? prodottoLabel : "",
            data: idx === 0 ? new Date(order.data).toLocaleString() : "",
            cliente: c.nome || `Cliente ${idx + 1}`,
            qty: qtyNum ? String(qtyNum) : "—",
            pagamentoBadge: getPagamentoBadge(
              clientPagamento || order.pagamento
            ),
            statoLabel: getStatoBadge(statoRow),
            vettore: clientVettore || order.vettore || "—",
            // QUI: totale per cliente, non totale ordine
            totaleLabel: clientTotaleLabel,
          };
        })
        : [
          (() => {
            const statoRow = order.consegna || "—";
            const ordineTotaleLabel = `€ ${formatTotale(
              order.totale,
              "it-IT"
            )}`;
            return {
              id: order.id,
              numero: prodottoLabel,
              data: new Date(order.data).toLocaleString(),
              cliente: order.cliente || "—",
              qty: "—",
              pagamentoBadge: getPagamentoBadge(order.pagamento),
              statoLabel: getStatoBadge(statoRow),
              vettore: order.vettore || "—",
              totaleLabel: ordineTotaleLabel,
            };
          })(),
        ];

    const ordineTotaleLabel = `€ ${formatTotale(order.totale, "it-IT")}`;

    const totalRowStato = order.consegna || "—";
    const totalRow = {
      id: order.id,
      numero: "",
      data: "",
      cliente: "Totale",
      qty: String(totalQty || 0),
      pagamentoBadge: getPagamentoBadge(order.pagamento),
      statoLabel: getStatoBadge(totalRowStato),
      vettore: order.vettore || "—",
      // qui ha senso usare il totale ordine
      totaleLabel: ordineTotaleLabel,
    };

    const stockRowStato = order.consegna || "—";
    const stockRow = {
      id: order.id,
      numero: "",
      data: "",
      cliente: "Giacenza / scorte",
      qty: giacenza !== null && !isNaN(giacenza) ? String(giacenza) : "-",
      pagamentoBadge: getPagamentoBadge(order.pagamento),
      statoLabel: getStatoBadge(stockRowStato),
      vettore: order.vettore || "—",
      totaleLabel: ordineTotaleLabel,
    };

    return [...clientRows, totalRow, stockRow];
  });

  const drawerTitle =
    (selected && selected.numero && `Ordine ${selected.numero}`) ||
    (isAdding && editValues.numero && `Ordine ${editValues.numero}`) ||
    (isAdding ? "Nuovo ordine" : "Dettaglio ordine");

  return (
    <div className="p-6">
      <OrdersTable
        title="Ordini"
        data={ordersForTable}
        columns={orderColumns}
        onClick={handleRowClick}
        onAdd={handleAddOrder}
      />

      <OrdersDrawer
        open={open}
        onClose={close}
        title={drawerTitle}
        width="w-[700px]"
      >
        {(isAdding || selected) && (
          <div className="space-y-6 text-sm">
            {/* DETTAGLI ORDINE: numero + pagamento + corriere + stato */}
            <div className="grid grid-cols-4 gap-4">
              <div className="col-span-2">
                <b>Numero ordine</b>
                <input
                  className={inputClass}
                  value={editValues.numero}
                  onChange={(e) =>
                    setEditValues((prev) => ({
                      ...prev,
                      numero: e.target.value,
                    }))
                  }
                />
              </div>

              <div>
                <b>Pagamento</b>
                <select
                  className={selectClass}
                  value={editValues.pagamento}
                  onChange={(e) =>
                    setEditValues((prev) => ({
                      ...prev,
                      pagamento: e.target.value,
                    }))
                  }
                >
                  <option value="">—</option>
                  {paymentOptions.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <b>Corriere</b>
                <select
                  className={selectClass}
                  value={editValues.vettore}
                  onChange={(e) =>
                    setEditValues((prev) => ({
                      ...prev,
                      vettore: e.target.value,
                    }))
                  }
                >
                  <option value="">—</option>
                  {vettoreOptions.map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <b>Stato</b>
                <select
                  className={selectClass}
                  value={editValues.consegna}
                  onChange={(e) =>
                    setEditValues((prev) => ({
                      ...prev,
                      consegna: e.target.value,
                    }))
                  }
                >
                  <option value="">—</option>
                  {consegnaOptions.map((co) => (
                    <option key={co} value={co}>
                      {co}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* ARTICOLI */}
            <div>
              <h3 className="font-semibold mb-2 text-base">Articoli</h3>

              {(isEditing || isAdding) && newItems.length === 0 && (
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <select
                    className={selectClass}
                    value={newItemProductId}
                    onChange={(e) => setNewItemProductId(e.target.value)}
                  >
                    {productsMock.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.nome}
                        {p.sku ? ` (${p.sku})` : ""}
                      </option>
                    ))}
                  </select>

                  <input
                    type="number"
                    min={1}
                    className={qtyInputClass}
                    value={newItemQty}
                    onChange={(e) => setNewItemQty(e.target.value)}
                  />

                  <button
                    type="button"
                    onClick={handleAddItemToNewOrder}
                    className="custom-button px-3 py-1 text-xs"
                  >
                    Aggiungi articolo
                  </button>
                </div>
              )}

              <ul className="space-y-3">
                {(isEditing || isAdding ? newItems : selected?.items || []).map(
                  (it, idx) => {
                    const p = findProduct(it.productId);

                    const totalOrdered = getTotalOrderedForProduct(
                      it.productId
                    );
                    const initialStock = p?.stock ?? null;
                    const giacenza =
                      initialStock != null
                        ? Math.max(initialStock - totalOrdered, 0)
                        : null;

                    return (
                      <li
                        key={idx}
                        className="rounded-2xl border border-white/70 p-4"
                      >
                        <div className="flex justify-between gap-4">
                          <div className="flex gap-4">
                            {p?.img && (
                              <img
                                src={p.img}
                                alt={p.nome}
                                className="w-24 h-24 rounded-xl object-cover"
                              />
                            )}

                            <div>
                              <div className="font-semibold text-[#090c64] text-base">
                                {p?.nome}{" "}
                                {p?.sku && (
                                  <span className="text-sm text-[#090c64]/70">
                                    ({p.sku})
                                  </span>
                                )}
                              </div>

                              <div className="text-sm text-[#090c64]/70 mt-1">
                                {p?.categoria} • {p?.colore} • {p?.materiale}
                              </div>
                              <div className="text-sm text-[#090c64]/70">
                                Dimensioni: {p?.dimensioni}
                              </div>
                            </div>
                          </div>

                          {/* A DESTRA SOLO PREZZO, SENZA Q.TÀ */}
                          <div className="text-right text-sm text-[#090c64]">
                            <div className="mb-2">
                              Prezzo: € {p?.prezzo?.toFixed(2)}
                            </div>
                          </div>
                        </div>

                        {p?.descrizione && (
                          <p className="text-sm mt-3 text-[#090c64]">
                            {p.descrizione}
                          </p>
                        )}

                        <p className="text-xs mt-3 text-[#090c64]">
                          Giacenza per questo articolo:{" "}
                          <b>
                            {giacenza !== null && !isNaN(giacenza)
                              ? giacenza
                              : "-"}
                          </b>{" "}
                          pezzi (ordinati totali: {totalOrdered}
                          {initialStock != null
                            ? `, stock iniziale: ${initialStock}`
                            : ""}
                          )
                        </p>
                      </li>
                    );
                  }
                )}
              </ul>
            </div>

            <hr className="my-4 border-white/70" />

            {/* CLIENTI ARTICOLO */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Clienti articolo</h3>
                <button
                  type="button"
                  onClick={handleAddClient}
                  className="custom-button px-3 py-1 text-xs"
                >
                  Aggiungi cliente
                </button>
              </div>

              <div className="space-y-3">

                {clients.map((c, idx) => {
                  const qtyNum = Number(c.qty) || 0;
                  const clientTotal = unitPrice * qtyNum;

                  return (
                    <div
                      key={idx}
                      className="rounded-2xl border border-white/70 bg-white/5 p-4 space-y-3"
                    >
                      {/* NOME CLIENTE, QUANTITÀ, TOTALE + RIMUOVI */}
                      <div className="grid grid-cols-4 gap-3 items-end">
                        <div className="col-span-2">
                          <label className="block font-semibold">Nome cliente</label>
                          <input
                            className={inputClass}
                            value={c.nome}
                            onChange={(e) =>
                              handleClientChange(idx, "nome", e.target.value)
                            }
                          />
                        </div>

                        <div>
                          <label className="block font-semibold">Quantità</label>
                          <input
                            type="number"
                            min={1}
                            className={qtyInputClass}
                            value={c.qty}
                            onChange={(e) =>
                              handleClientChange(
                                idx,
                                "qty",
                                Number(e.target.value) || 1
                              )
                            }
                          />
                        </div>

                        <div>
                          <label className="block font-semibold">Totale</label>
                          <input
                            className={`${inputClass} text-right`}
                            value={
                              clientTotal > 0
                                ? `€ ${formatTotale(clientTotal, "it-IT")}`
                                : "€ 0,00"
                            }
                            readOnly
                          />
                        </div>

                        <div className="col-span-4 flex justify-end mt-2">
                          <button
                            type="button"
                            onClick={() => handleRemoveClient(idx)}
                            className="custom-button px-3 py-2 text-xs"
                          >
                            Rimuovi
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}


                {clients.length === 0 && (
                  <p className="text-xs text-[#090c64]/70">
                    Nessun cliente aggiunto per questo articolo.
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              {!isAdding && (
                <button onClick={handleEditOrder} className="custom-button">
                  Modifica
                </button>
              )}

              <button onClick={handleSaveOrder} className="custom-button">
                Salva
              </button>

              {!isAdding && (
                <button onClick={handleDeleteOrder} className="custom-button">
                  Elimina
                </button>
              )}
            </div>
          </div>
        )}
      </OrdersDrawer>

      {alert && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-9999">
          <div className="px-8 py-4 rounded-2xl bg-white/95 shadow-xl border border-[#d9c9ff] text-base text-[#090c64] font-semibold tracking-wide min-w-[320px] text-center">
            {alert.text}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;