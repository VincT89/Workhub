import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import DrawerSede from "../Warehouse/DrawerSede.jsx";

const WarehouseTable = ({ data, columns }) => {
  const navigate = useNavigate();

  // ---------- STATE ----------
  const [selectedCategory, setSelectedCategory] = useState("Categorie");
  const [searchTerm, setSearchTerm] = useState(""); // cerca solo per nome
  const [sortAZ, setSortAZ] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [lowStockFilter, setLowStockFilter] = useState(false); //parte da false, cioè nessun filtro attivo

  // ---------- MEMO: categorie ---------
  const categories = useMemo(
    () => ["Categorie", ...new Set(data.map(p => p.categoria))],
    [data]
  );

  // ---------- DATA PROCESSING ----------
  const filteredData = useMemo(() => {
    let result = [...data];

    // Filtro per nome prodotto
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      result = result.filter(p =>
        String(p.nome).toLowerCase().includes(q) ||
        String(p.id).toLowerCase().includes(q)
      );
    }

    // Filtro per categoria
    if (selectedCategory !== "Categorie") {

      result = result.filter(p => p.categoria === selectedCategory);
    }

    // filtro articoli in esaurimento
    if (lowStockFilter) { // se il filtro è attivo (cioè se l'utente clicca il bottone del filtro) applicalo
      result = result.filter( //filter sostituisce "result" con un nuovo array (i prodotti filtrati)
        p => (p.stock?.["Mia Sede"] || 0) < 15 // filtro: "p" rappresenta ogni prodotto dell'array
        /* => indica che la funzione restituisce quello che c’è dopo ( come scrivere: function(p) { return ...} 
         p.stock? --> accedo alla prorpietà "stock" di ogi p
         ?. --> (optional chaining) è l'operatre che evita errore se stock non esiste: “Se stock esiste, continua.
         Se non esiste, restituisci undefined invece di errore”.
         ["Mia Sede"] accesso alla proprietà "Mia Sede" tramite stringa
         Se il valore non esiste "|| 0" lo sostituisce con zero 
         <15 --> Se il valore è minore di 15 restituisce true, altrimenti restituisce false */
      );
    }

    // Ordinamento A-Z
    if (sortAZ) {
      result.sort((a, b) => a.nome.localeCompare(b.nome));
    }

    return result;
  }, [data, searchTerm, selectedCategory, sortAZ, lowStockFilter]);

  return (
    <div className="w-full rounded-2xl bg-[#fafafa]/10 p-6 shadow-md border border-white flex flex-col gap-4">

      {/* ---------- TOOLBAR ---------- */}
      <div className="flex flex-wrap items-center gap-3 mb-3">
        <h2 className="text-[#134a7b] text-lg font-bold"> Warehouse </h2>

        {/* Ordinamento A-Z */}
        <button
          onClick={() => setSortAZ(!sortAZ)}
          className="warehouse-btn"


        >
          {sortAZ ? "Z-A" : "A-Z"}
        </button>

        {/* Filtro categoria */}
        <select
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}
          className="warehouse-btn focus:outline-none focus:ring-0" //focus:outline-none focus:ring-0 PER TOGLIERE BORDO BLU DI DEFAULT DI SELECT
        >
          {categories.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        {/* Ricerca per nome o codice prodotto */}
        <input
          type="text"
          placeholder="Cerca codice id o nome"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-3 py-1.5 rounded-lg shadow-md border border-white/20 text-sm w-64 focus:outline-none bg-white"
        />

        {/* Articoli in esaurimento */}
        <button
          onClick={() => setLowStockFilter(!lowStockFilter)}
          className="warehouse-btn"
        >
          {lowStockFilter ? "Mostra tutti" : "Articoli in esaurimento"}
          {/* operatre ternario (ternay expression) --> condizione ? valore_se_vero : valore_se_falso 
          quindi se lowStockFiltre è true "mostra tutti" se è false "articoli in esaurimento" */}
        </button>

        {/* Bottone Drawer. Disponibilità in altre sedi */}
        <button
          onClick={() => setDrawerOpen(true)}
          className="warehouse-btn"
        >
          Disponibilità in altre sedi
        </button>
      </div>

      {/* ---------- TABELLA ---------- */}
      <table className="w-full border-collapse text-sm text-[#090c64]">

        <thead>
          <tr className="bg-white/60 rounded-xl text-center">
            {columns.map((c, i) => (
              <th
                key={i}
                className={`p-3 ${i === 0 ? "rounded-l-xl" : ""} ${i === columns.length - 1 ? "rounded-r-xl" : ""}`}
              >
                {c.charAt(0).toUpperCase() + c.slice(1)}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {filteredData.map((row, i) => (
            <tr
              key={i}
              onClick={() => navigate(`/product/${row.id}`, { state: row })}
              className="hover:bg-white cursor-pointer text-center"
            >

              {/* ETICHETTE COLORATE IN BASE ALLO STATO */}
              {columns.map((col, j) => { // cicla i nomi delle colonne nell'array columns
                if (col === "stato") { // significa se colonna è = a stato, cioè se il nome della colonna corrente è stato fai quando segue
                  //colori iniziali
                  let border = "border-red-500";
                  let bg = "bg-red-100";
                  let text = "Non disponibile";

                  //raw rappresenta una riga della tabella, quindi un singolo prodotto e va a controllare lo "status" 
                  if (row.status === "disponibile") {
                    border = "border-green-600";
                    bg = "bg-green-100";
                    text = "Disponibile";
                  } else if (row.status === "fuori produzione") {
                    border = "border-gray-700";
                    bg = "bg-gray-200";
                    text = "Fuori produzione";
                  }
                  return (
                    <td
                      key={j}
                      className={`p-3 ${j === 0 ? "rounded-l-xl" : ""} ${
                        j === columns.length - 1 ? "rounded-r-xl" : ""
                      }`}
                    >
                      <span
                        className={`
                          ${bg} 
                          ${border} 
                          border 
                          text-sm 
                          px-1.5
                          py-1
                          rounded-lg 
                          font-semibold
                        `}
                      >
                        {text}
                      </span>
                    </td>
                  );
                }

                if (col === "quantita") {
                  const qty = row.stock?.["Mia Sede"] || 0;
                  return (
                    <td key={j} className={`p-3 ${j === 0 ? "rounded-l-xl" : ""} ${j === columns.length - 1 ? "rounded-r-xl" : ""}`}>
                      {qty}
                    </td>
                  );
                }

                return (
                  <td key={j} className={`p-3 ${j === 0 ? "rounded-l-xl" : ""} ${j === columns.length - 1 ? "rounded-r-xl" : ""}`}>
                    {String(row[col])}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      {filteredData.length === 0 && (
        <p className="text-center text-gray-500 italic mt-2">Nessun risultato trovato.</p>
      )}

      {/* Drawer */}
      <DrawerSede
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        productData={data}
      />
    </div>
  );
};

export default WarehouseTable;