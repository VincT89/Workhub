import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";

import jsPDF from "jspdf"; // per usare l'export pdf
// icone
import { SignOutIcon } from "@phosphor-icons/react";
import { WarehouseIcon } from "@phosphor-icons/react";
import { NoteIcon } from "@phosphor-icons/react";
import { NotepadIcon } from "@phosphor-icons/react";
import { PaperclipIcon } from "@phosphor-icons/react";
import { FilePdfIcon } from "@phosphor-icons/react";
import { PlusCircleIcon } from "@phosphor-icons/react";
import { useSelector } from "react-redux";


const Product = () => {
    // ---- OTTENGO L'ID DEL PRODOTTO DALL'URL ----
    const { id } = useParams();
    const [item, setItem] = useState(null); // nuovo state per salvare i dati dal server
    const user = useSelector(state => state.auth.user);

useEffect(() => {
    const token = user?.token;
    if (!token) return;

    fetch(`http://localhost:3030/api/v1/items/${id}`, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    })
        .then(res => {
            if (!res.ok) {
                throw new Error(`Errore API: ${res.status}`);
            }
            return res.json();
        })
        .then(data => {
            console.log("RISPOSTA API ITEM:", data);

            // Se API restituisce un array, filtriamo l'item corretto
            const foundItem = Array.isArray(data)
                ? data.find(el => el._id === id)
                : data;

            setItem(foundItem);
        })
        .catch(err => {
            console.error("Errore nel caricamento prodotto:", err);
            setItem(null);
        });
}, [id, user]);




    // -------------------------------------------------------------------------------
    /* CONST PRODUCT CON DATABASE CREATO:

const Product = () => {
const { id } = useParams();
const [prodotto, setProdotto] = useState(null);

useEffect(() => {
fetch(`http://localhost:3030/api/v1/products/${id}`)
  .then(res => res.json())
  .then(data => setProdotto(data))
  .catch(err => console.error("Errore nel caricamento prodotto:", err));
}, [id]);
 
*/
    // --------------------------------------------------------------------------------

    // ---- SE IL PRODOTTO NON ESISTE MOSTRO UN MESSAGGIO ----
    if (!item) {
        return (
            <div className="w-full min-h-screen flex flex-col justify-center items-center bg-[#f0f4f8] text-[#090c]">
                <h2 className="text-2xl font-bold mb-4">Prodotto non trovato</h2>
                <Link
                    to="/warehouse"
                    className="bg-[#fafafa]/50 text-[#090c64] font-semibold px-6 py-3 rounded-full shadow-md 
                    hover:bg-white/80 transition-all duration-200 text-center"
                >
                    Torna alla lista
                </Link>
            </div>
        );
    }


    // -------------------------------------------------------------------------------

    /* RETURN SEZIONE 1: DIV A SINISTRA: INFO PRODOTTO - CON DATABASE CREATO:
    return (
    <div>
      <h2>{prodotto.name}</h2>
      <p>Categoria: {prodotto.category?.name}</p>
      <p>Quantità: {prodotto.quantity}</p>
      <p>Soglia riordino: {prodotto.reorderLevel}</p>
    </div>
  );
}; 
    */
    // -------------------------------------------------------------------------------


    // ---- ARRAY STORICO MOVIMENTI ----
    const storico = [
        { data: "2025-10-01", tipo: "Entrata", quantita: 10 },
        { data: "2025-10-05", tipo: "Uscita", quantita: 3 },
        { data: "2025-10-12", tipo: "Entrata", quantita: 5 },
    ];

    /* ---- FUNZIONE DI ESPORTAZIONE PDF CON LA LIBRERIA jspdf) ---- 
    Cos’è jspdf??
  jspdf è una libreria JavaScript (open source) che serve per creare file PDF direttamente dal browser, 
  senza bisogno di un server. */

    // FUNZIONE ESPORTA PDF
    const handleExportPDF = () => {
        if (!item) return;

        try {
            const doc = new jsPDF();

            // Titolo
            doc.setFont("helvetica", "bold");
            doc.text("Scheda prodotto", 20, 20);
            let y = 40; // coordinata iniziale (da dove parte il testo verticalmente)

            // Immagine (se presente)
            if (item.product.image) {
                doc.addImage(item.product.image, "JPEG", 20, y, 50, 50);
                y += 60; // spazio dopo immagine
            }

            // Dati prodotto
            doc.setFont("helvetica", "normal");
            doc.text(`Nome: ${item.product.name}`, 20, y);
            doc.text(`SKU: ${item.product.sku}`, 20, y+10);
            doc.text(`Prezzo: ${item.product.price} €`, 20, y+20);
            doc.text(`Quantità: ${item.stock}`, 20, y+30);
            doc.text(`Promo: ${item.promo?.isActive ? `${item.promo.value} (${item.promo.mode})` : "Nessuna"}`, 20, y+40);
            

            // Storico movimenti
            if (storico.length > 0) {
                doc.text("Storico movimenti:", 20, y);
                y += 10;
                storico.forEach(m => {
                    doc.text(`- ${m.tipo}, ${m.quantita}, ${m.data}`, 25, y);
                    y += 10;
                });
            }

            // Salvataggio PDF
            doc.save(`Scheda_${item.product.name}.pdf`);

        } catch (e) {
            console.error("jsPDF non disponibile o errore durante export:", e);
            alert("Errore: impossibile esportare il PDF.");
        }
    };



    return (
        <>
            {/* SFONDO IMMAGINE DA ELIMINARE */}

            <div
                className="w-full min-h-screen flex justify-center items-start p-8 ">
                <div className="w-full max-w-[1200px]  
                 p-6  flex flex-col gap-8">


                    {/* ---------- SEZIONE 1: DETTAGLIO PRODOTTO ---------- */}

                    <div className="rounded-2xl bg-[#fafafa]/10 backdrop-blur-sm p-6 shadow-md flex flex-col gap-2">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2">
                                    <h2 className="text-[#090c64] text-lg font-bold">{item.product.name}</h2>
                                </div>
                            </div>




                            {/* ---- BOTTONE TORNA ALLA LISTA ---- */}

                            <div className="flex items-center justify-between mt-4">
                                <span className="text-[#090c64]/90 font-semibold mr-4">Torna alla lista prodotti</span>
                                <Link
                                    to="/warehouse"
                                    className="w-12 h-12 flex items-center justify-center 
                                    bg-white/50 rounded-full shadow-md hover:bg-white/70 transition-all duration-200"
                                >
                                    <SignOutIcon size={32} color="#090c64" weight="duotone" />
                                </Link>
                            </div>
                        </div>


                        {/* ------------------------------------- */}


                        {/* --- PRODOTTO CON DESCRIZIONE, INFO E FOTO --- */}
                        <div className="grid grid-cols-2 gap-6 items-start">
                            {/* DIV A SINISTRA: INFO PRODOTTO */}
                            <div className="flex flex-col gap-3 text-[#090c64]">


                                <div className="grid grid-cols-2 bg-white/40 rounded-lg p-2 shadow-sm">
                                    <span>ID</span>
                                    <span>{item.product._id}</span>
                                </div>
                                <div className="grid grid-cols-2 bg-white/40 rounded-lg p-2 shadow-sm">
                                    <span>Nome</span>
                                    <span>{item.product.name}</span>
                                </div>
                                <div className="grid grid-cols-2 bg-white/40 rounded-lg p-2 shadow-sm">
                                    <span>SKU</span>
                                    <span>{item.product.sku}</span>
                                </div>
                                <span>Descrizione</span>
                                <span>{item.product.description}</span>

                                <div className="grid grid-cols-2 bg-white/40 rounded-lg p-2 shadow-sm">
                                    <span>Categoria</span>
                                    <span>{item.product.price}</span>
                                </div>
                                <div className="grid grid-cols-2 bg-white/40 rounded-lg p-2 shadow-sm">
                                    <span>Quantità disponibile in sede</span>
                                    <span>{item.stock}</span>                                
                                </div>
                                <div className="grid grid-cols-2 bg-white/40 rounded-lg p-2 shadow-sm">
                                    <span>Specifiche</span>
                                    <span>Misure e peso</span>
                                </div>
                                <div className="grid grid-cols-2 bg-white/40 rounded-lg p-2 shadow-sm">
                                    <span>Soglia riordino</span>
                                </div>
                            </div>

                            {/* DIV A DESTRA: IMMAGINE PRODOTTO */}
                            <div className="flex flex-col items-center justify-center h-full w-full">
                                {item.product.image ? (
                                    <img
                                        src={item.product.image}
                                        alt={item.product.image}
                                        className="w-full h-full max-h-80 object-contain rounded-2xl shadow-md bg-white/30"
                                    />
                                ) : (
                                    <div className="w-full h-80 rounded-2xl bg-white/30 flex items-center justify-center text-sm text-[#090c64] shadow-md">
                                        Nessuna immagine
                                    </div>
                                )}
                            </div>

                        </div>

                    </div>

                    {/* --------- SEZIONE 3: DISPONIBILITÀ E AZIONI --------- */}

                    <div className="flex gap-4">
                        {/* Disponibilità */}
                        <div className="flex-1 rounded-2xl bg-[#fafafa]/10 backdrop-blur-sm p-6 shadow-md">
                            <div className="flex items-center gap-2 mb-4">
                                <WarehouseIcon size={32} color="#090c64" weight="duotone" />
                                <h3 className="text-[#090c64] text-lg font-bold">Disponibilità</h3>
                            </div>

                            {/*  ----- DISPONIBILITÀ DINAMICA -----
                 Il valore viene preso da `prodotto.quantita` dall'array `products`.
                */}
                            <div className="grid grid-cols-6 bg-white/40 rounded-xl p-2 shadow-sm">
                                <span className="col-span-6 w-full whitespace-nowrap overflow-hidden text-ellipsis">
                                    {item.product.stock} pezzi
                                </span>
                            </div>
                        </div>

                        {/* BOTTONI: RICHIEDI RIORDINO ED ESPORTA PDF */}
                        <div className="flex-1 flex flex-col justify-center items-center gap-4">
                            <button
                                className="bg-[#090c64] text-white font-semibold px-6 py-3 rounded-xl shadow-md 
                                hover:bg-[#090c64]/70 transition-all duration-200 w-3/4 text-center flex items-center justify-center gap-2"
                            >
                                <PlusCircleIcon size={32} color="#f5f5f5" weight="duotone" />
                                Rifornimento
                            </button>

                            <button
                                onClick={handleExportPDF}
                                className="bg-[#fafafa]/50 text-[#090c64] font-semibold px-6 py-3 rounded-xl shadow-md 
                                hover:bg-white/80 transition-all duration-200 w-3/4 text-center
                                flex items-center justify-center gap-2"
                            >
                                <FilePdfIcon size={32} color="#090c64" weight="duotone" />
                                <span> Esporta PDF </span>
                            </button>
                        </div>
                    </div>

                    {/* --------- SEZIONE 4: STORICO MOVIMENTI --------- */}
                    <div className="rounded-2xl bg-[#fafafa]/10 backdrop-blur-sm p-6 shadow-md">
                        <div className="flex items-center gap-2 mb-4">
                            <NotepadIcon size={32} color="#090c64" weight="duotone" />
                            <h3 className="text-[#090c64] text-lg font-bold">Storico movimenti</h3>
                        </div>

                        <div className="grid grid-cols-3 font-bold text-[#090c64] text-sm mb-2">
                            <span>Data</span>
                            <span>Tipo</span>
                            <span>Quantità</span>
                        </div>

                        {storico.map((m, i) => (
                            <div key={i} className="grid grid-cols-3 bg-white/40 rounded-lg p-2 shadow-sm mb-2">
                                <span>{m.data}</span>
                                <span>{m.tipo}</span>
                                <span>{m.quantita}</span>
                            </div>
                        ))}
                    </div>

                    {/* --------- SEZIONE 5: NOTE E ALLEGATI --------- */}
                    <div className="rounded-2xl bg-[#fafafa]/10 backdrop-blur-sm p-6 shadow-md">
                        <div className="flex items-center gap-2 mb-4" >
                            <NoteIcon size={32} className="self-center align-middle" color="#090c64" weight="duotone" />
                            <h3 className="text-[#090c64] text-lg font-bold m-0 leading-none">Note e allegati</h3>
                        </div>

                        <textarea
                            placeholder="Aggiungi una nota..."
                            className="w-full p-3 rounded-xl bg-white/40 text-[#090c64] shadow-sm mb-4"
                            rows={4}
                        ></textarea>

                        {/* ----- AGGIUNGI ALLEGATO:
                        BOTTONE "SCEGLI FILE"
                       L'attributo "type='file'" apre automaticamente la finestra di selezione file del sistema operativo.
                       Non serve alcuna funzione JavaScript aggiuntiva per farlo funzionare.
                      */}
                        <label className="flex items-center gap-2 cursor-pointer bg-[#fafafa]/50 text-[#090c64] 
                         font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-white/80 transition-all duration-200">
                            {/* Icona piccola */}
                            <PaperclipIcon size={32} color="#090c64" weight="duotone" />
                            {/* la frase dell'input si può modificare solo con js e aggiungendo la className "hidden" , xke 
                            è un testo predefinito del browser. In caso lo modifichiamo se non piace */}
                            <input type="file" />

                        </label>

                    </div>

                </div>
            </div >
        </>
    );
};

export default Product;



/* ---- POSSIBILITà DI AGGIUNGERE UNA LIBRERIA E COLLEGARE DIRETTAMENTE IL BTTONE "ESPORTA PDF" ALLA FUNZIONE:


All’interno di Product.jsx, subito prima del return, aggiungi questa funzione:

import jsPDF from "jspdf"; // in cima al file

// ...

const handleExportPDF = () => {
    if (!prodotto) return;

    const doc = new jsPDF();

    doc.setFont("helvetica", "bold");
    doc.text("Scheda prodotto", 20, 20);

    doc.setFont("helvetica", "normal");
    doc.text(`ID: ${prodotto.id}`, 20, 40);
    doc.text(`Nome: ${prodotto.nome}`, 20, 50);
    doc.text(`Categoria: ${prodotto.categoria}`, 20, 60);
    doc.text(`Quantità: ${prodotto.quantita}`, 20, 70);
    doc.text(`Soglia riordino: ${prodotto.soglia}`, 20, 80);
    doc.text(`Note: ${prodotto.note}`, 20, 90);

    doc.save(`Scheda_${prodotto.nome}.pdf`);
};


Poi collega la funzione al bottone “Esporta PDF”:

<button
  onClick={handleExportPDF}
  className="bg-[#fafafa]/50 text-[#090c64] font-semibold px-6 py-3 rounded-full shadow-md 
  hover:bg-white/80 transition-all duration-200 w-3/4 text-center"
>
  Esporta PDF
</button>

*/