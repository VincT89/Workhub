// Import principali
import { useState, useEffect } from "react"; // useState per stato locale, useEffect per effetti collaterali
import { useDispatch, useSelector } from "react-redux"; // Redux: dispatch per inviare azioni, useSelector per leggere lo stato
import { updateItemQuantity } from "../../store/feature/itemsSlice"; // thunk per aggiornare stock
import { useTheme } from "../../context/ThemeContext"; // contesto tema (chiaro/scuro)
import bgLight from "../../assets/bg/bg.jpg"; // immagine di sfondo del drawer
import bgDark from "../../assets/bg/bgScuro.jpg"; // immagine di sfondo del drawer scuro

const DrawerAddNewProduct = ({ open, onClose }) => {
  const dispatch = useDispatch(); // funzione per inviare azioni a Redux
  const items = useSelector(state => state.items.list); // lista di prodotti dallo store Redux

  // Stati locali
  const [search, setSearch] = useState(""); // stringa di ricerca per nome prodotto o SKU
  const [results, setResults] = useState([]); // risultati della ricerca
  const [quantity, setQuantity] = useState(1); // quantità da aggiungere

  const { theme } = useTheme(); // tema attuale (chiaro/scuro)

  // Chiude il drawer premendo "Escape"
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose?.(); // se premi ESC chiude il drawer
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Funzione per cercare prodotti nello store locale
  const searchItems = () => {
    if (!search.trim()) return; // esce se la ricerca è vuota

    // Filtra i prodotti con nome o SKU che contiene la stringa di ricerca (case-insensitive)
    const filtered = items.filter(
      (item) =>
        item.product?.name.toLowerCase().includes(search.toLowerCase()) ||
        item.product?.sku.toLowerCase().includes(search.toLowerCase())
    );

    // Se non trova niente, mostra messaggio di errore
    if (filtered.length === 0) {
      setResults([{ error: "Prodotto non trovato" }]);
      return;
    }

    // Ordina i risultati per stock decrescente
    filtered.sort((a, b) => b.stock - a.stock);
    setResults(filtered); // aggiorna lo stato con i risultati
  };

  // Funzione per modificare la quantità di un prodotto specifico per id
  const handleAddStock = async (itemId) => {
    if (!quantity || quantity === 0) return alert("Inserisci quantità valida");
    try {
      const resultAction = await dispatch(updateItemQuantity({ id: itemId, quantityToAdd: Number(quantity) }));


      if (updateItemQuantity.fulfilled.match(resultAction)) {
        // successo: puoi mostrare toast o alert
        alert(`Stock aggiornato: ${resultAction.payload.stock}`);
        // reset UI
        setQuantity(1);
        setSearch("");
        setResults([]);
        onClose();
      } else {
        // errore
        const err = resultAction.payload || resultAction.error?.message;
        alert("Errore: " + err);
      }
    } catch (err) {
      console.error(err);
      alert("Errore imprevisto");
    }
  };


  // Se il drawer non è aperto, non renderizza nulla
  if (!open) return null;


  return (
    <div className="fixed inset-0 z-50">
      {/* Sfondo scuro semi-trasparente */}
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      {/* Drawer vero e proprio */}
      <aside
        className="absolute right-0 top-0 w-[420px] h-full border-l border-white/40 shadow-2xl overflow-auto bg-cover bg-center"
        role="dialog"
        aria-modal="true"
       style={{ backgroundImage: `url(${theme === "dark" ? bgDark : bgLight})` }}
      >
        {/* HEADER: titolo e bottone chiudi */}
        <header className="sticky top-0 border-b border-white/60 px-6 py-4 flex items-center justify-between">
          <h2 className="text-base font-semibold">
            Aggiungi stock
          </h2>
          <button
            onClick={onClose} // chiude il drawer
            className="px-4 py-2 border border-white/70 shadow-sm rounded-xl text-sm custom-button cursor-pointer"
          >
            Chiudi
          </button>
        </header>

        {/* CONTENUTO PRINCIPALE */}
        <div className="p-6 text-[15px] ">
          {/* Input ricerca prodotto/SKU */}
          <label className="block mb-2 font-semibold">Nome prodotto o SKU</label>
          <input
            type="text"
            placeholder="Es. BILLY Libreria o SKU1234"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full mb-4 px-3 py-2 border rounded-xl"
          />

          {/* Input quantità da aggiungere */}
          <label className="block mb-2 font-semibold">Quantità da aggiungere</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full mb-4 px-3 py-2 border rounded-xl"
            min={1}
          />

          {/* Bottone per cercare */}
          <button
            onClick={searchItems}
            className="px-4 py-2 border border-white/70 shadow-sm rounded-xl text-sm custom-button mb-6 cursor-pointer"
          >
            Cerca prodotto
          </button>

          {/* RISULTATI DELLA RICERCA */}
          <div>
            {/* Messaggio predefinito se non ci sono risultati */}
            {results.length === 0 && (
              <p className="opacity-70">Nessuna ricerca effettuata.</p>
            )}

            {/* Lista dei risultati */}
            {results.map((item, i) => {
              if (item.error)
                return (
                  <p key={i} className="text-red-600">{item.error}</p>
                );

              return (
                <div
                  key={i}
                  className="py-2 border-b border-white/40 flex flex-col gap-1"
                >
                  <span><strong>Prodotto:</strong> {item.product?.name}</span>
                  <span><strong>SKU:</strong> {item.product?.sku}</span>
                  <span><strong>Sede:</strong> {item.pointOfSales?.name}</span>
                  <span><strong>Stock attuale:</strong> {item.stock}</span>

                  {/* Bottone aggiungi quantità */}
                  <button
                    onClick={() => handleAddStock(item._id)}
                    className="mt-2 px-3 py-1 border border-white/70 shadow-sm rounded-xl text-sm text-white bg-[#090c64] hover:bg-[#0a0f85]"
                  >
                    Aggiungi {quantity} pezzi
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </aside>
    </div>
  );
};

// Export normale
export default DrawerAddNewProduct;