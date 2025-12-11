import React, { useState, useMemo } from "react";
import { TrashIcon } from "@phosphor-icons/react";
import { useTheme } from "../../context/ThemeContext.jsx";

// Format € currency
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
  onRowClick,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortAZ, setSortAZ] = useState(false);
  const { theme } = useTheme();

  // Selected row for details open/close
  const [openRowId, setOpenRowId] = useState(null);

  // ---  FILTER DATA  ---
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

  // ENRICH DATA → Calcolo totale (sum qty * product.price)
  const enrichedData = filteredData.map((order) => {
    const totale = order.clients?.reduce((sum, c) => {
      const qty = Number(c.quantity) || 0;
      const price = Number(order.product?.price) || 0;
      return sum + qty * price;
    }, 0);

    return {
      ...order,
      totale,
      stato: order.status || "In preparazione",
      corriere: order.courier || "Bartolini",
    };
  });

  // colonne centrate
  const centeredCols = ["totalQuantity", "createdAt", "stato", "corriere", "totale"];

  return (
    <div className="w-full rounded-3xl bg-[rgba(255,255,255,0.12)] backdrop-blur-xl p-6 shadow-md border-2 border-white/70 flex flex-col gap-4">

      {/* TOOLBAR */}
      <div className="flex flex-col gap-3 mb-3">
        <div className="flex flex-wrap items-center gap-6">
          
          {/* Title + A-Z */}
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-[#090c64]">Ordini</h2>

            <button onClick={() => setSortAZ(!sortAZ)} className="warehouse-btn">
              {sortAZ ? "Annulla A-Z" : "A-Z"}
            </button>
          </div>

          {/* SEARCH */}
          <input
            type="text"
            placeholder="Cerca..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-2 bg-white/40 border border-white/30 rounded-xl shadow-sm text-sm w-full sm:w-60 focus:outline-none placeholder:text-gray-600 backdrop-blur-md"
          />

          {/* BUTTON FROM PARENT */}
          {customToolbar}
        </div>
      </div>


      {/* TABLE */}
      <div className="w-full overflow-x-auto rounded-xl border border-white/10">

        <table className="w-full text-xs sm:text-sm text-[#090c64] border-auto">

          {/* HEADER */}
          <thead>
            <tr className="bg-white/40 backdrop-blur-md text-[#090c64] border-y border-white/10">

              {columns.map((item, idx) => {
                const isCentered = centeredCols.includes(item);

                return (
                  <th
                    key={item}
                    className={`p-3 whitespace-nowrap ${isCentered ? "text-center" : "text-left"}`}
                  >
                    {item.charAt(0).toUpperCase() + item.slice(1)}
                  </th>
                );
              })}

              {actions?.length > 0 && (
                <th className="p-3 whitespace-nowrap text-center">Azioni</th>
              )}

            </tr>
          </thead>

          {/* BODY */}
          <tbody>
            {enrichedData.map((row) => {
              const isOpen = openRowId === row._id;
              const totalColumns =
                columns.length + (actions && actions.length > 0 ? 1 : 0);

              return (
                <React.Fragment key={row._id}>

                  {/* MAIN ROW */}
                  <tr className="rounded-xl" style={{ transition: "none" }}>

                    {columns.map((col, j) => {

                      // ---- STATO ----
                      if (col === "stato") {
                        return (
                          <td key={col} className="p-3 text-center">
                            {row.stato}
                          </td>
                        );
                      }

                      // ---- CORRIERE ----
                      if (col === "corriere") {
                        return (
                          <td key={col} className="p-3 text-center">
                            {row.corriere}
                          </td>
                        );
                      }

                      // ---- PRODUCT + DROPDOWN ----
                      if (col === "product") {
                        return (
                          <td key={col} className="p-3">
                            <div className="flex items-center gap-3">

                              <span
                                className={`cursor-pointer text-base transition-transform ${
                                  isOpen ? "rotate-180" : ""
                                }`}
                                onClick={() => setOpenRowId(isOpen ? null : row._id)}
                              >
                                ⌵
                              </span>

                              <span>{row.product?.name || "Prodotto"}</span>
                            </div>
                          </td>
                        );
                      }

                      // ---- TOTAL € ----
                      if (col === "totale") {
                        return (
                          <td key={col} className="p-3 text-center">
                            {formatEuro(row.totale)}
                          </td>
                        );
                      }

                      // ---- NORMAL CELLS ----
                      const centered = centeredCols.includes(col);
                      return (
                        <td key={col} className={`p-3 ${centered ? "text-center" : ""}`}>
                          {row[col] ?? "-"}
                        </td>
                      );
                    })}

                    {/* ACTIONS */}
                    {actions?.length > 0 && (
                      <td className="p-3 flex gap-2 items-center justify-center">

                        {actions.map((action) => (
                          <button
                            key={action.name}
                            className="cursor-pointer hover:text-red-600 transition"
                            onClick={() => action.onClick(row)}
                          >
                            <TrashIcon
                              size={22}
                              color={theme === "dark" ? "#ff4d4d" : "#ff0000"}
                              weight="duotone"
                            />
                          </button>
                        ))}

                      </td>
                    )}

                  </tr>


                  {/* DETAILS ROW */}
                  {isOpen && (
                    <tr>
                      <td colSpan={totalColumns} className="p-4">

                        <div className="rounded-xl bg-[rgba(255,255,255,0.14)] 
                          backdrop-blur-xl border border-white/20 p-6 shadow-md flex flex-col gap-6">

                          {/* PRODUCT SECTION */}
                          <h3 className="font-bold text-[#090c64] text-sm">Dettagli Prodotto</h3>

                          <p>{row.product?.name}</p>
                          <p>Prezzo unitario: €{row.product?.price}</p>
                          <p>{row.product?.description || "Nessuna descrizione"}</p>

                          {/* CLIENT SECTION */}
                          <h4 className="text-sm font-bold text-[#090c64] mt-3">
                            Clienti ({row.clients?.length || 0})
                          </h4>

                          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">

                            {row.clients?.map((c) => (
                              <div
                                key={c.client?._id}
                                className="rounded-xl bg-[rgba(255,255,255,0.15)]
                                  border border-white/20 backdrop-blur-lg p-4 shadow-sm text-xs text-[#090c64]"
                              >
                                <p className="font-bold">
                                  {c.client.firstName} {c.client.lastName}
                                </p>

                                <p>
                                  {c.client.location.address}, {c.client.location.city}{" "}
                                  {c.client.location.zipCode}
                                </p>

                                <p>Qty: {c.quantity}</p>
                              </div>
                            ))}

                          </div>

                        </div>

                      </td>
                    </tr>
                  )}

                </React.Fragment>
              );
            })}
          </tbody>

        </table>
      </div>

      {/* NO RESULTS */}
      {enrichedData.length === 0 && (
        <p className="text-center text-gray-500 italic mt-2">
          Nessun risultato trovato.
        </p>
      )}

    </div>
  );
};

export default OrdersTable;
