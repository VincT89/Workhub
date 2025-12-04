// USEMEMO → PER MEMORIZZARE UN RISULTATO DI UN CALCOLO E NON FARLO TUTTE LE VOLTE
import { useState, useMemo } from "react";

const DEFAULT_STATUS = ["In preparazione", "Spedito", "In consegna", "Consegnato"];
const DEFAULT_COURIERS = ["BRT", "SDA", "DHL", "UPS", "GLS", "FedEx"];

// Formattatore € 
const formatEuro = (value) => {
  if (value === null || value === undefined || isNaN(value)) return "-";
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
  }).format(Number(value));
};

const OrdersTable = ({
  data,
  columns,
  customToolbar,
  actions,
  actionLabel = null,
  onRowClick,
  productsOptions = [],
  customersOptions = [],
  onAddProduct,
  onUpdateStatus,
  onUpdateCarrier,
  onUpdateClient,
  onDeleteClient,
  onAddClient,
  statusOptions = [],
  courierOptions = [],
}) => {
  const statusOpts = statusOptions.length ? statusOptions : DEFAULT_STATUS;
  const courierOpts = courierOptions.length ? courierOptions : DEFAULT_COURIERS;

  const [searchTerm, setSearchTerm] = useState("");
  const [sortAZ, setSortAZ] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState("default");

  // apre finestra dettaglio
  const [openRowId, setOpenRowId] = useState(null);

  // editing cliente → SOLO PER QTY
  const [editingClient, setEditingClient] = useState(null); // { orderId, clientId }
  const [editingClientForm, setEditingClientForm] = useState(null); // { qty }

  // FILTRO + A-Z
  const filteredData = useMemo(() => {
    const query = searchTerm.toLowerCase();

    let result = data.filter((row) =>
      columns.some((col) => {
        const value = row[col];
        if (value === null || value === undefined) return false;
        return String(value).toLowerCase().includes(query);
      })
    );

    if (sortAZ && columns.length > 1) {
      const sortColumn = columns[1];
      result = [...result].sort((a, b) =>
        String(a[sortColumn] || "").localeCompare(String(b[sortColumn] || ""))
      );
    }

    return result;
  }, [searchTerm, data, columns, sortAZ]);

  // colonne da centrare
  const centeredCols = ["quantità totale", "data", "stato", "corriere", "totale"];

  return (
    <div className="w-full rounded-3xl bg-[rgba(255,255,255,0.12)] backdrop-blur-xl p-6 shadow-md border-2 border-white/70 flex flex-col gap-4">
      {/* TOOLBAR */}
      <div className="flex flex-col gap-3 mb-3">
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-[#090c64]">Ordini</h2>

            <button onClick={() => setSortAZ(!sortAZ)} className="warehouse-btn">
              {sortAZ ? "Annulla A-Z" : "A-Z"}
            </button>
          </div>

          <input 
          type="text" 
          placeholder="Cerca..." 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
          className="px-3 py-2 bg-white/40 border border-white/30 rounded-xl shadow-sm text-sm w-full sm:w-60 focus:outline-none placeholder:text-gray-600 backdrop-blur-md"/>

          <select
            value={selectedProductId}
            onChange={(e) => {
              const value = e.target.value;
              setSelectedProductId(value);

              if (value !== "default" && typeof onAddProduct === "function") {
                onAddProduct(value);
                setSelectedProductId("default");
              }
            }}
            className="warehouse-btn">

            <option value="default">Aggiungi prodotto</option>
            {productsOptions.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nome || p.name}
            </option>
            ))}
          </select>

          {customToolbar}
        </div>
      </div>

      {/* TABELLA */}
      <div className="w-full overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full text-xs sm:text-sm text-[#090c64] border-auto">
          {/* HEADER */}
          <thead>
            <tr className="bg-white/40 backdrop-blur-md text-[#090c64] border-y border-white/10">
              {columns.map((item, idx) => {
                const isCentered = centeredCols.includes(item);
                return (
                  <th
                    key={idx}
                    className={`p-3 whitespace-nowrap ${
                      isCentered ? "text-center" : "text-left"
                    }`} >
                    {item.charAt(0).toUpperCase() + item.slice(1)}
                  </th>
                );
              })}

              {actionLabel && (
                <th className="p-3 whitespace-nowrap text-center">
                  {actionLabel}
                </th>
              )}
            </tr>
          </thead>

          {/* BODY */}
          <tbody>
            {filteredData.map((row, i) => {
              const isOpen = openRowId === row.id;
              const totalColumns =
                columns.length + (actions && actions.length > 0 ? 1 : 0);

              return (
                <>
                  {/* RIGA PRINCIPALE */}
                  <tr
                    key={row.id || i}
                    className="rounded-xl"
                    style={{ transition: "none" }}
                  >
                    {columns.map((col, j) => {
                      // STATO
                      if (col === "stato") {
                        return (
                          <td key={j} className="p-3 text-center">
                            <select
                              value={row.stato || ""}
                              onClick={(e) => e.stopPropagation()}
                              onChange={(e) => {
                                e.stopPropagation();
                                onUpdateStatus?.(row.id, e.target.value);
                              }}
                              className="bg-transparent border-none text-xs cursor-pointer focus:outline-none text-center">
                              <option value="" disabled>
                                Seleziona stato
                              </option>
                              {statusOpts.map((s) => (
                                <option key={s} value={s}>
                                  {s}
                                </option>
                              ))}
                            </select>
                          </td>
                        );
                      }

                      // CORRIERE
                      if (col === "corriere") {
                        return (
                          <td key={j} className="p-3 text-center">
                            <select
                              value={row.corriere || ""}
                              onClick={(e) => e.stopPropagation()}
                              onChange={(e) => {
                                e.stopPropagation();
                                onUpdateCarrier?.(row.id, e.target.value);
                              }}
                              className="bg-transparent border-none text-xs cursor-pointer focus:outline-none text-center">
                              <option value="" disabled>
                                Seleziona corriere
                              </option>
                              {courierOpts.map((c) => (
                                <option key={c} value={c}>
                                  {c}
                                </option>
                              ))}
                            </select>
                          </td>
                        );
                      }

                      // PRODOTTO 
                      if (col === "prodotto") {
                        return (
                          <td key={j} className="p-3">
                            <div className="flex items-center gap-3">
                              {/* FRECCIA */}
                              <span
                                className={`cursor-pointer text-base transition-transform ${ isOpen ? "rotate-180" : ""}`}
                                onClick={(e) => {e.stopPropagation();
                                  setOpenRowId(isOpen ? null : row.id);
                                  if (onRowClick) onRowClick(row);
                                }}>
                                ⌵
                              </span>
                              <span>{row.prodotto}</span>
                            </div>
                          </td>
                        );
                      }

                      // TOTALE
                      if (col === "totale") {
                        return (
                          <td key={j} className="p-3 text-center">
                            {formatEuro(row.totale)}
                          </td>
                        );
                      }

                      // CELLE NORMALI
                      const centered = centeredCols.includes(col);
                      return (
                        <td
                          key={j}
                          className={`p-3 ${centered ? "text-center" : ""}`}
                        >
                          {row[col] !== null && row[col] !== undefined
                            ? String(row[col])
                            : "-"}
                        </td>
                      );
                    })}

                    {/* AZIONI */}
                    {actions && (
                      <td className="p-3 flex gap-2 items-center justify-center">
                        {actions.map((action) => (
                          <button
                            key={action.name}
                            className="cursor-pointer"
                            onClick={() => action.onClick(row)}
                          >
                            {action.icon}
                          </button>
                        ))}
                      </td>
                    )}
                  </tr>

                  {/* FINESTRELLA DETTAGLI */}
                  {isOpen && (
                    <tr>
                      <td colSpan={totalColumns} className="p-4">
                        <div
                          className="rounded-2xl bg-[rgba(255,255,255,0.14)] backdrop-blur-xl border border-white/20 p-6 shadow-[0_4px_20px_rgba(0,0,0,0.06)] flex flex-col gap-6">
                          {/* IMG + INFO PRODOTTO */}
                          <div className="flex flex-col md:flex-row gap-3 items-start">
                            {/* IMG PRODOTTO */}
                            <div className="shrink-0 flex justify-center md:justify-start">
                              {row.prodottoDettaglio?.img && (
                                <img src={row.prodottoDettaglio.img} alt={row.prodottoDettaglio.nome ||"Immagine prodotto"} className="max-w-[140px] rounded-2xl object-cover shadow-md border border-white/40 bg-white/40"/>
                              )}
                            </div>

                            {/* TESTO + PREZZO + RIORDINO */}
                            <div className="flex-1 flex flex-col justify-between gap-3 mt-1.5">
                              <div>
                                <h3 className="font-bold text-[#090c64]">
                                  Dettagli
                                </h3>
                                <p className="text-xs text-gray-700">
                                  {row.prodottoDettaglio?.categoria} ·{" "}
                                  {row.prodottoDettaglio?.colore}
                                </p>
                                <p className="text-xs text-gray-700">
                                  {row.prodottoDettaglio?.descrizione}
                                </p>
                              </div>

                              <div className="text-right flex flex-col items-end gap-2">
                                <p className="text-sm font-semibold text-[#090c64]">
                                  Prezzo unitario:{" "}
                                  {row.prodottoDettaglio?.prezzo ? formatEuro(row.prodottoDettaglio.prezzo) : "-"}
                                </p>

                                <div className="flex items-center gap-2 text-xs text-gray-700">
                                  <button className="warehouse-btn text-[10px]">
                                    Riordino per magazzino
                                  </button>
                                  <input
                                    type="number"
                                    className="w-20 custom-input text-xs text-right"
                                    placeholder="Qtà"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* TITOLINO + AGGIUNGI CLIENTE */}
                          <div className="flex items-center justify-between mt-2">
                            <h4 className="text-xs font-semibold text-[#090c64]">
                              Dettagli clienti ({row.clienti.length})
                            </h4>

                            {/* select per scegliere un cliente esistente */}
                            <select
                              defaultValue="default"
                              className="warehouse-btn text-xs"
                              onChange={(e) => {
                                const value = e.target.value;
                                if (value === "default") return;
                                onAddClient?.(row.id, value);
                                e.target.value = "default"; // reset
                              }}
                            >
                              <option value="default">+ Aggiungi cliente</option>
                              {customersOptions.map((c) => (
                                <option key={c.id} value={c.id}>
                                  {c.nome} ({c.citta})
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* GRID CLIENTI */}
                          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                            {row.clienti.map((cliente) => {
                              const isEditing = editingClient && editingClient.orderId === row.id && editingClient.clientId === cliente.id;

                              const currentQty =
                                (isEditing && editingClientForm?.qty) ?? cliente.qty;

                              return (
                                <div
                                  key={cliente.id}
                                  className="rounded-2xl bg-[rgba(255,255,255,0.15)] border border-white/20 backdrop-blur-lg p-4 shadow-sm text-xs text-[#090c64] flex flex-col gap-1">
                                  {/* DATI CLIENTE: SEMPRE TESTO */}
                                  <p className="font-bold">{cliente.nome}</p>
                                  <p>{cliente.email}</p>
                                  <p>Tel: {cliente.telefono}</p>
                                  <p>
                                    {cliente.indirizzo}, {cliente.citta}{" "}
                                    {cliente.cap}
                                  </p>

                                  {/* QTY + TOTALE */}
                                  <div className="flex justify-between mt-2 items-center">
                                    <div className="flex items-center gap-2">
                                      <span>Qty:</span>
                                      {isEditing ? (
                                        <input
                                          type="number"
                                          min="0"
                                          className="w-16 custom-input text-xs"
                                          value={currentQty}
                                          onChange={(e) =>
                                            setEditingClientForm((prev) => ({
                                              ...(prev || {}),
                                              qty: e.target.value,
                                            }))
                                          }
                                        />
                                      ) : (
                                        <strong>{cliente.qty}</strong>
                                      )}
                                    </div>
                                    <span>
                                      Tot:{" "}
                                      <strong>
                                        {formatEuro(cliente.totale)}
                                      </strong>
                                    </span>
                                  </div>

                                  {/* BOTTONI */}
                                  <div className="flex justify-end gap-2 mt-2">
                                    {isEditing ? (
                                      <>
                                        <button className="warehouse-btn text-xs"
                                          onClick={() => {
                                            setEditingClient(null);
                                            setEditingClientForm(null);
                                          }}>
                                          Annulla
                                        </button>
                                        <button className="warehouse-btn text-xs"
                                          onClick={() => {
                                            onUpdateClient(
                                              row.id,
                                              cliente.id,
                                              { qty: editingClientForm?.qty }
                                            );
                                            setEditingClient(null);
                                            setEditingClientForm(null);
                                          }} >
                                          Salva
                                        </button>
                                      </>
                                    ) : (
                                      <>
                                        <button
                                          className="warehouse-btn text-xs"
                                          onClick={() => {
                                            setEditingClient({
                                              orderId: row.id,
                                              clientId: cliente.id,
                                            });
                                            setEditingClientForm({
                                              qty: cliente.qty,
                                            });
                                          }}
                                        >
                                          Modifica
                                        </button>

                                        <button
                                          className="warehouse-btn text-xs"
                                          onClick={() =>
                                            onDeleteClient(row.id, cliente.id)
                                          }
                                        >
                                          Elimina
                                        </button>
                                      </>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>
      </div>

      {filteredData.length === 0 && (
        <p className="text-center text-gray-500 italic mt-2">
          Nessun risultato trovato.
        </p>
      )}
    </div>
  );
};

export default OrdersTable;