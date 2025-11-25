import { useEffect, useState } from "react";
import bgLight from "../../assets/bg/bg.jpg";

// serve per calcolare e distanze xke il cap. Nell array dei prodotti è come se
// fosse il cap del prodotto e non dello stock.... da capire e sistemare. Forse facendo backend si chiarisce questo punto.
const sedeCoordinates = {
	"Mia Sede": "20100",
	"Sede Milano": "20100",
	"Sede Torino": "10100",
	"Sede Genova": "16100",
	"Sede Verona": "37100",
	"Sede Bologna": "40100",
	"Sede Firenze": "50100",
	"Sede Roma": "00100",
	"Sede Napoli": "80100",
	"Sede Palermo": "90100",
};

// ----- DESTRUCTURING DELLE PROPS
const DrawerSede = ({ open, onClose, productData }) => {
	// le 3 props: open --> gestisce la renderizzazione del drawer,
	// onClose --> prop he contiene la funz. per chiudere il drawer quando si preme x o quando si clicca lo sfondo fuori dal drawer,
	// onClose() chiude il drawer perché il parent modifica lo stato che passa come open.
	// productData --> è la prop che contiene l'array dei prodotti passato dal parent.

	const [searchCode, setSearchCode] = useState("");
	const [searchCap, setSearchCap] = useState("");
	const [results, setResults] = useState([]);

	// ---- OPZIONALE: add listener a tastiera x chiudere drawer premendo ESC
	// uso useEffect per aggiungere un listener alla tastiera:
	// quando l'utente preme "ESC" sulla tastiera il drawer si chiude
	useEffect(() => {
		const onKey = (e) => e.key === "Escape" && onClose?.();
		// valuta il codice prima di && (operatore logico AND) e se è vero esegui il codice dopo &&
		if (open) document.addEventListener("keydown", onKey);
		return () => document.removeEventListener("keydown", onKey);
	}, [open, onClose]);
	/* esempi tasti:
  e.key === " Escape" --> tasto "esc"
  e.key === "Enter" --> tasto "Invio"
  e.key === "ArrowUp" --> "freccia su"
  */

	// ----- searchStores CERCA LA DISPONIBILITà DI UN PRODOTTO SPECIFICO e si attiva don il bottone "CERCA DISPONIBILTà"

	/* searchStores è invece la funzione che viene eseguita quando l’utente clicca 
  il bottone “Cerca disponibilità” dentro il drawer:
  Il suo scopo principale è:
  - Prendere il codice prodotto inserito dall’utente (searchCode)
  - Cercare quel prodotto dentro productData
  - Prendere lo stock per ogni sede
  - Filtrare le sedi per quantità disponibile (>0)
  - Ordinare le sedi per distanza dal CAP inserito (se è stato inserito un CAP)
  - Aggiornare lo stato results, che poi viene renderizzato dentro il drawer.
  */
	const searchStores = () => {
		if (!searchCode.trim()) return;
		/* 
    "searchCode" è il termine di ricerca inserito dall'utente nell'input.
    .trim() rimuove gli spazi all'inizio e alla fine della stringa.
    La condizione !searchCode.trim() verifica se l'utente non ha scritto nulla di significativo
    (vuoto o solo spazi). Se è così, la funzione termina subito con return (ritorna undefined)
    e **non esegue la ricerca**. Funziona come un blocco preventivo per input non validi.
    */

		const product = productData.find(
			// trovo il prodotto in productData
			(p) => p.id.toLowerCase() === searchCode.toLowerCase()
		); // Confronta l’ID del prodotto (A001, B002…) con quello inserito dall’utente.
		if (!product) {
			setResults([{ error: "Prodotto non trovato" }]);
			return; // Se non lo trova, mostra il messaggio di errore. */
		}

		// Prendiamo tutte le sedi e le quantità disponibili per il prodotto:
		const stockEntries = Object.entries(product.stock);
		// Converte l’oggetto stock in un array di coppie [sede, quantità].
		// Se l’utente non ha inserito un CAP, mostra tutte le sedi così come sono:
		if (!searchCap.trim()) {
			setResults(stockEntries);
			return;
		}
	};

	if (!open) return null; // non renderizzare niente se il drawer "non è aperto"
	//"open" è la prop booleana che ho creato per indicare se il drawer deve essere aperto(true) o chiuso(false).

	return (
		<div className="fixed inset-0 z-50">
			<div className="absolute inset-0 bg-black/30" onClick={onClose} />

			<aside
				className="absolute right-0 top-0 w-[420px] h-full
                  border-l border-white/40 shadow-2xl
                   overflow-auto bg-cover bg-center"
				role="dialog"
				aria-modal="true"
				style={{
					backgroundImage: `url(${bgLight})`,
				}}
			>
				{/* HEADER */}
				<header className="sticky top-0  border-b border-white/60 px-6 py-4 flex items-center justify-between">
					<h2 className="text-base font-semibold text-[#090c64]">
						Disponibilità in altre sedi
					</h2>
					{/* BOTTONE CHIUDI */}
					<button
						onClick={onClose}
						className="px-4 py-2  border border-white/70 shadow-sm rounded-xl text-sm bg-[#090c64] text-white cursor-pointer"
					>
						Chiudi
					</button>
				</header>

				{/* CONTENUTO */}
				<div className="p-6 text-[15px] text-[#090c64]">
					<label className="block mb-2 font-semibold">Codice prodotto</label>
					<input
						type="text"
						placeholder="Es. A001"
						value={searchCode}
						onChange={(e) => setSearchCode(e.target.value)}
						className="w-full mb-4 px-3 py-2 border rounded-xl"
					/>
					{/* VALUTARE SE INSERIRLO CON API COORDINATE GEOGRAFICHE
          <label className="block mb-2 font-semibold">CAP (opzionale)</label>
          <input
            type="number"
            placeholder="Es. 20100"
            value={searchCap}
            onChange={(e) => setSearchCap(e.target.value)}
            className="w-full mb-4 px-3 py-2 border rounded"
          />
*/}

					{/* BOTTONE CERCA */}
					<button
						onClick={searchStores}
						className="px-4 py-2  border border-white/70 shadow-sm rounded-xl text-sm text-white bg-[#090c64] mb-6 cursor-pointer"
					>
						Cerca disponibilità
					</button>

					<div>
						{results.length === 0 && (
							<p className="opacity-70">Nessuna ricerca effettuata.</p>
						)}

						{results.map((item, i) => {
							if (item.error)
								return (
									<p key={i} className="text-red-600">
										{item.error}
									</p>
								);

							const [sede, qty] = item;

							return (
								<div
									key={i}
									className="py-2 border-b border-white/40 flex justify-between"
								>
									<span>{sede}</span>
									<span className="font-semibold">
										{qty > 0 ? qty + " pezzi" : "Non disponibile"}
									</span>
								</div>
							);
						})}
					</div>
				</div>
			</aside>
		</div>
	);
};

export default DrawerSede;
