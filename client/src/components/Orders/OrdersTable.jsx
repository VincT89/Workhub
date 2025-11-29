import { useState, useMemo } from "react";

const OrdersTable = ({ data, columns, onClick, title, onAdd }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortAZ, setSortAZ] = useState(false);

  const columnLabels = {
    numero: "N° Articolo",
    data: "Data",
    cliente: "Cliente",
    qty: "Quantità",
    pagamentoBadge: "Pagamento",
    statoLabel: "Stato",
    totaleLabel: "Totale",
    vettore: "Corriere",
  };

  const getHeaderLabel = (col) => {
    if (columnLabels[col]) return columnLabels[col];
    return col.charAt(0).toUpperCase() + col.slice(1);
  };

  const filteredData = useMemo(() => {
    const query = searchTerm.toLowerCase();

    let result = data.filter((row) =>
      columns.some((col) => {
        const value = row[col];
        if (value === null || value === undefined) return false;

        const normalizedValue = String(value)
          .toLowerCase()
          .replace(/\s+/g, "")
          .replace(/\+/g, "");

        const normalizedQuery = query.replace(/\s+/g, "").replace(/\+/g, "");

        return normalizedValue.includes(normalizedQuery);
      })
    );

    if (sortAZ && columns.length > 1) {
      const sortColumn = columns[1];
      result = [...result].sort((a, b) => {
        const aVal = String(a[sortColumn] || "").toLowerCase();
        const bVal = String(b[sortColumn] || "").toLowerCase();
        return aVal.localeCompare(bVal);
      });
    }

    return result;
  }, [searchTerm, data, columns, sortAZ]);

  return (
    <div className="w-full rounded-2xl custom-box p-6 flex flex-col gap-4">

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 mb-3">
        {title && (
          <h2 className="text-lg font-semibold">{title}</h2>
        )}

        <button
          onClick={() => setSortAZ(!sortAZ)}
          className="px-3 py-2 rounded-xl bg-white text-[#090c64] border border-white/40 shadow-md hover:bg-white/80 transition"
        >
          A-Z
        </button>

        <input
          type="text"
          placeholder="Cerca..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="custom-input w-60"
        />

        {onAdd && (
          <button
            type="button"
            onClick={onAdd}
            className="custom-button px-4 py-2 whitespace-nowrap"
          >
            Aggiungi
          </button>
        )}
      </div>

      {/* Tabella */}
      <table className="w-full border-collapse text-sm text-[#090c64]">
        <thead>
          <tr className="bg-white/40 rounded-xl">
            {columns.map((col, idx) => (
              <th
                key={idx}
                className={`p-3 text-left 
                ${idx === 0 ? "rounded-l-xl" : ""}
                ${idx === columns.length - 1 ? "rounded-r-xl" : ""}`}
              >
                {getHeaderLabel(col)}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {filteredData.map((row, i) => (
            <tr
              key={i}
              className="hover:bg-white/40 transition cursor-pointer"
              onClick={() => onClick?.(row)}
            >
              {columns.map((col, j) => (
                <td
                  key={j}
                  className={`p-3
                  ${j === 0 ? "rounded-l-xl" : ""}
                  ${j === columns.length - 1 ? "rounded-r-xl" : ""}`}
                >
                  {row[col] ?? "—"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {filteredData.length === 0 && (
        <p className="text-center text-gray-500 italic mt-2">
          Nessun risultato trovato.
        </p>
      )}
    </div>
  );
};

export default OrdersTable;