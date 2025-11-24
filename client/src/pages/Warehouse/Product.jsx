import { useParams, Link } from "react-router-dom";
import jsPDF from "jspdf"; // per usare l'export pdf
// icone
import { SignOut } from "@phosphor-icons/react";
import { Warehouse } from "@phosphor-icons/react";
import { Note } from "@phosphor-icons/react";
import { Notepad } from "@phosphor-icons/react";
import { Paperclip } from "@phosphor-icons/react";
import { FilePdf } from "@phosphor-icons/react";
import { PlusCircle } from "@phosphor-icons/react";


const Product = () => {
    // ---- OTTENGO L'ID DEL PRODOTTO DALL'URL ----
    const { id } = useParams();

    // ---- ARRAY PRODOTTI ----
    const products = [
        {
            id: "A001",
            nome: "LACK Tavolino",
            categoria: "Tavoli",
            cap: "20100",
            stock: {
                "Mia Sede": 10,
                "Sede Milano": 12,
                "Sede Monza": 8,
                "Sede Sesto San Giovanni": 5,
                "Sede Cologno Monzese": 3,
                "Sede Rho": 0,
                "Sede Roma": 0,
                "Sede Firenze": 0,
                "Sede Torino": 0,
                "Sede Napoli": 0
            },
            status: "disponibile"
        },
        {
            id: "B002",
            nome: "BILLY Libreria",
            categoria: "Librerie",
            cap: "20100",
            stock: {
                "Mia Sede": 22,
                "Sede Milano": 10,
                "Sede Roma": 2,
                "Sede Firenze": 8,
                "Sede Torino": 0,
                "Sede Napoli": 4,
                "Sede Bologna": 0,
                "Sede Genova": 1,
                "Sede Palermo": 3,
                "Sede Verona": 6
            },
            status: "disponibile"
        },
        {
            id: "C003",
            nome: "KALLAX Scaffale",
            categoria: "Scaffali",
            cap: "00100",
            stock: {
                "Mia Sede": 0,
                "Sede Roma": 30,
                "Sede Firenze": 5,
                "Sede Torino": 3,
                "Sede Milano": 0,
                "Sede Napoli": 12,
                "Sede Bologna": 7,
                "Sede Genova": 0,
                "Sede Palermo": 4,
                "Sede Verona": 1
            },
            status: "disponibile"
        },
        {
            id: "D004",
            nome: "POÄNG Poltrona",
            categoria: "Sedie e Poltrone",
            cap: "10100",
            stock: {
                "Mia Sede": 10,
                "Sede Roma": 0,
                "Sede Firenze": 6,
                "Sede Torino": 2,
                "Sede Milano": 4,
                "Sede Napoli": 3,
                "Sede Bologna": 1,
                "Sede Genova": 0,
                "Sede Palermo": 0,
                "Sede Verona": 7
            },
            status: "non disponibile"
        },
        {
            id: "E005",
            nome: "MALM Comò 3 cassetti",
            categoria: "Cassettiere",
            cap: "50100",
            stock: {
                "Mia Sede": 0,
                "Sede Roma": 4,
                "Sede Firenze": 12,
                "Sede Torino": 1,
                "Sede Milano": 5,
                "Sede Napoli": 0,
                "Sede Bologna": 8,
                "Sede Genova": 0,
                "Sede Palermo": 3,
                "Sede Verona": 6
            },
            status: "non disponibile"
        },
        {
            id: "F006",
            nome: "EKET Mobile componibile",
            categoria: "Soluzioni Modulari",
            cap: "20100",
            stock: {
                "Mia Sede": 80,
                "Sede Roma": 12,
                "Sede Firenze": 5,
                "Sede Torino": 6,
                "Sede Milano": 9,
                "Sede Napoli": 14,
                "Sede Bologna": 0,
                "Sede Genova": 3,
                "Sede Palermo": 10,
                "Sede Verona": 7
            },
            status: "disponibile"
        },
        {
            id: "G007",
            nome: "LURV Tappeto",
            categoria: "Tappeti",
            cap: "00100",
            stock: {
                "Mia Sede": 0,
                "Sede Roma": 3,
                "Sede Firenze": 5,
                "Sede Torino": 0,
                "Sede Milano": 7,
                "Sede Napoli": 1,
                "Sede Bologna": 2,
                "Sede Genova": 0,
                "Sede Palermo": 4,
                "Sede Verona": 0
            },
            status: "non disponibile"
        },
        {
            id: "H008",
            nome: "POÄNG Poggiapiedi",
            categoria: "Sedie e Poltrone",
            cap: "20100",
            stock: {
                "Mia Sede": 0,
                "Sede Milano": 0,
                "Sede Roma": 0,
                "Sede Firenze": 0,
                "Sede Torino": 0,
                "Sede Napoli": 0,
                "Sede Bologna": 0,
                "Sede Genova": 0,
                "Sede Palermo": 0,
                "Sede Verona": 0
            },
            status: "fuori produzione"
        },
        {
            id: "I009",
            nome: "FÄRGRIK Set piatti",
            categoria: "Cucina",
            cap: "10100",
            stock: {
                "Mia Sede": 0,
                "Sede Roma": 7,
                "Sede Firenze": 4,
                "Sede Torino": 45,
                "Sede Milano": 3,
                "Sede Napoli": 10,
                "Sede Bologna": 1,
                "Sede Genova": 0,
                "Sede Palermo": 5,
                "Sede Verona": 6
            },
            status: "disponibile"
        },
        {
            id: "J010",
            nome: "HEMNES Letto 140",
            categoria: "Letti",
            cap: "20100",
            stock: {
                "Mia Sede": 0,
                "Sede Roma": 28,
                "Sede Firenze": 3,
                "Sede Torino": 1,
                "Sede Milano": 4,
                "Sede Napoli": 8,
                "Sede Bologna": 0,
                "Sede Genova": 6,
                "Sede Palermo": 3,
                "Sede Verona": 7
            },
            status: "non disponibile"
        },
        {
            id: "K011",
            nome: "RÅSHULT Tavolo da lavoro",
            categoria: "Scrivanie",
            cap: "20100",
            stock: {
                "Mia Sede": 0,
                "Sede Roma": 18,
                "Sede Firenze": 5,
                "Sede Torino": 4,
                "Sede Milano": 7,
                "Sede Napoli": 2,
                "Sede Bologna": 1,
                "Sede Genova": 0,
                "Sede Palermo": 9,
                "Sede Verona": 6
            },
            status: "disponibile"
        },
        {
            id: "L012",
            nome: "TROFAST Sistema di stoccaggio",
            categoria: "Stoccaggio",
            cap: "20100",
            stock: {
                "Mia Sede": 0,
                "Sede Roma": 11,
                "Sede Firenze": 6,
                "Sede Torino": 2,
                "Sede Milano": 60,
                "Sede Napoli": 3,
                "Sede Bologna": 10,
                "Sede Genova": 0,
                "Sede Palermo": 5,
                "Sede Verona": 7
            },
            status: "disponibile"
        },
        {
            id: "M013",
            nome: "KLIPPAN Divano 2 posti",
            categoria: "Divani",
            cap: "20100",
            stock: {
                "Mia Sede": 15,
                "Sede Roma": 4,
                "Sede Firenze": 3,
                "Sede Torino": 5,
                "Sede Milano": 1,
                "Sede Napoli": 0,
                "Sede Bologna": 6,
                "Sede Genova": 2,
                "Sede Palermo": 0,
                "Sede Verona": 4
            },
            status: "disponibile"
        },
        {
            id: "N014",
            nome: "VINSTUR Bottiglia",
            categoria: "Accessori Cucina",
            cap: "20100",
            stock: {
                "Mia Sede": 0,
                "Sede Roma": 2,
                "Sede Firenze": 4,
                "Sede Torino": 0,
                "Sede Milano": 8,
                "Sede Napoli": 1,
                "Sede Bologna": 3,
                "Sede Genova": 0,
                "Sede Palermo": 2,
                "Sede Verona": 5
            },
            status: "non disponibile"
        },
        {
            id: "O015",
            nome: "MALM Armadio 2 ante",
            categoria: "Armadi",
            cap: "20100",
            stock: {
                "Mia Sede": 50,
                "Sede Roma": 9,
                "Sede Firenze": 7,
                "Sede Torino": 2,
                "Sede Milano": 11,
                "Sede Napoli": 4,
                "Sede Bologna": 0,
                "Sede Genova": 6,
                "Sede Palermo": 2,
                "Sede Verona": 3
            },
            status: "disponibile"
        },
        {
            id: "P016",
            nome: "NORDLI Cassettiera",
            categoria: "Cassettiere",
            cap: "20100",
            stock: {
                "Mia Sede": 0,
                "Sede Roma": 3,
                "Sede Firenze": 2,
                "Sede Torino": 5,
                "Sede Milano": 20,
                "Sede Napoli": 1,
                "Sede Bologna": 7,
                "Sede Genova": 0,
                "Sede Palermo": 4,
                "Sede Verona": 3
            },
            status: "non disponibile"
        },
        {
            id: "Q017",
            nome: "LÄTTAD Contenitore cestino",
            categoria: "Stoccaggio",
            cap: "20100",
            stock: {
                "Mia Sede": 12,
                "Sede Roma": 1,
                "Sede Firenze": 3,
                "Sede Torino": 0,
                "Sede Milano": 5,
                "Sede Napoli": 2,
                "Sede Bologna": 0,
                "Sede Genova": 4,
                "Sede Palermo": 0,
                "Sede Verona": 6
            },
            status: "disponibile"
        },
        {
            id: "R018",
            nome: "SKUBB Scatola tessile",
            categoria: "Organizzazione",
            cap: "20100",
            stock: {
                "Mia Sede": 70,
                "Sede Roma": 6,
                "Sede Firenze": 12,
                "Sede Torino": 4,
                "Sede Milano": 9,
                "Sede Napoli": 1,
                "Sede Bologna": 10,
                "Sede Genova": 0,
                "Sede Palermo": 5,
                "Sede Verona": 8
            },
            status: "disponibile"
        },
        {
            id: "S019",
            nome: "EKET Mensola",
            categoria: "Soluzioni Modulari",
            cap: "50100",
            stock: {
                "Mia Sede": 0,
                "Sede Roma": 5,
                "Sede Firenze": 25,
                "Sede Torino": 4,
                "Sede Milano": 6,
                "Sede Napoli": 2,
                "Sede Bologna": 0,
                "Sede Genova": 7,
                "Sede Palermo": 3,
                "Sede Verona": 1
            },
            status: "disponibile"
        },
        {
            id: "T020",
            nome: "LAGAN Tavolo pieghevole",
            categoria: "Tavoli",
            cap: "10100",
            stock: {
                "Mia Sede": 0,
                "Sede Roma": 7,
                "Sede Firenze": 2,
                "Sede Torino": 35,
                "Sede Milano": 3,
                "Sede Napoli": 10,
                "Sede Bologna": 4,
                "Sede Genova": 0,
                "Sede Palermo": 5,
                "Sede Verona": 6
            },
            status: "disponibile"
        }
    ];

    // ---- CERCO IL PRODOTTO CORRISPONDENTE ALL'ID CHE ARRIVA DALL'URL PER MOSTRARNE LA PAGINA PRODOTTO ----
    const prodotto = products.find((p) => p.id === id);



    // ---- SE IL PRODOTTO NON ESISTE MOSTRO UN MESSAGGIO ----
    if (!prodotto) {
        return (
            <div className="w-full min-h-screen flex flex-col justify-center items-center bg-[#f0f4f8] text-[#134a7b]">
                <h2 className="text-2xl font-bold mb-4">Prodotto non trovato</h2>
                <Link
                    to="/warehouse"
                    className="bg-[#fafafa]/50 text-[#134a7b] font-semibold px-6 py-3 rounded-full shadow-md 
                    hover:bg-white/80 transition-all duration-200 text-center"
                >
                    Torna alla lista
                </Link>
            </div>
        );
    }

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
        if (!prodotto) return;

        try {
            const doc = new jsPDF();

            // Titolo
            doc.setFont("helvetica", "bold");
            doc.text("Scheda prodotto", 20, 20);
            let y = 40; // coordinata iniziale (da dove parte il testo verticalmente)

            // Immagine (se presente)
            if (prodotto.img) {
                doc.addImage(prodotto.img, "JPEG", 20, y, 50, 50);
                y += 60; // spazio dopo immagine
            }

            // Dati prodotto
            doc.setFont("helvetica", "normal");
            doc.text(`ID: ${prodotto.id}`, 20, y); y += 10; // y+=10 = scrivi partendo dall'attuale posizione + 10, in modo ds non sovrappore le righe
            doc.text(`Nome: ${prodotto.nome}`, 20, y); y += 10; // 20 distanza da sinistra
            doc.text(`Categoria: ${prodotto.categoria}`, 20, y); y += 10;
            doc.text(`Quantità: ${prodotto.quantita}`, 20, y); y += 10;
            doc.text(`Soglia riordino: ${prodotto.soglia}`, 20, y); y += 10;
            doc.text(`Note: ${prodotto.note}`, 20, y); y += 10;
            doc.text(`Disponibilità: ${prodotto.disponibilita}`, 20, y); y += 10;

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
            doc.save(`Scheda_${prodotto.nome}.pdf`);

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
                                    <h2 className="text-[#134a7b] text-lg font-bold">{prodotto.nome}</h2>
                                </div>
                            </div>




                            {/* ---- BOTTONE TORNA ALLA LISTA ---- */}

                            <div className="flex items-center justify-between mt-4">
                                <span className="text-[#134a7b]/90 font-semibold mr-4">Torna alla lista prodotti</span>
                                <Link
                                    to="/warehouse"
                                    className="w-12 h-12 flex items-center justify-center 
                                    bg-white/50 rounded-full shadow-md hover:bg-white/70 transition-all duration-200"
                                >
                                    <SignOut size={32} color="#090c64" weight="duotone" />
                                </Link>
                            </div>
                        </div>


                        {/* ------------------------------------- */}


                        {/* --- PRODOTTO CON DESCRIZIONE, INFO E FOTO --- */}
                        <div className="grid grid-cols-2 gap-6 items-start">
                            {/* DIV A SINISTRA: INFO PRODOTTO */}
                            <div className="flex flex-col gap-3 text-[#134a7b]">

                           
                                <div className="grid grid-cols-2 bg-white/40 rounded-lg p-2 shadow-sm">
                                    <span>ID</span>
                                    <span>{prodotto.id}</span>
                                </div>
                                <div className="grid grid-cols-2 bg-white/40 rounded-lg p-2 shadow-sm">
                                    <span>Nome</span>
                                    <span>{prodotto.nome}</span>
                                </div>
                                <div className="grid grid-cols-2 bg-white/40 rounded-lg p-2 shadow-sm">
                                    <span>Categoria</span>
                                    <span>{prodotto.categoria}</span>
                                </div>
                                <div className="grid grid-cols-2 bg-white/40 rounded-lg p-2 shadow-sm">
                                    <span>Quantità</span>
                                    <span>{prodotto.quantita}</span>
                                </div>
                                <div className="grid grid-cols-2 bg-white/40 rounded-lg p-2 shadow-sm">
                                    <span>Soglia riordino</span>
                                    <span>{prodotto.soglia}</span>
                                </div>
                                <div className="grid grid-cols-2 bg-white/40 rounded-lg p-2 shadow-sm">
                                    <span>Note</span>
                                    <span>{prodotto.note}</span>
                                </div>
                            </div>

                            {/* DIV A DESTRA: IMMAGINE PRODOTTO */}
                            <div className="flex flex-col items-center justify-center h-full w-full">
                                {prodotto.img ? (
                                    <img
                                        src={prodotto.img}
                                        alt={prodotto.nome}
                                        className="w-full h-full max-h-80 object-contain rounded-2xl shadow-md bg-white/30"
                                    />
                                ) : (
                                    <div className="w-full h-80 rounded-2xl bg-white/30 flex items-center justify-center text-sm text-[#134a7b] shadow-md">
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
                                <Warehouse size={32} color="#090c64" weight="duotone" />
                                <h3 className="text-[#134a7b] text-lg font-bold">Disponibilità</h3>
                            </div>

                            {/*  ----- DISPONIBILITÀ DINAMICA -----
                 Il valore viene preso da `prodotto.quantita` dall'array `products`.
                */}
                            <div className="grid grid-cols-6 bg-white/40 rounded-xl p-2 shadow-sm">
                                <span className="col-span-6 w-full whitespace-nowrap overflow-hidden text-ellipsis">
                                    {prodotto.quantita} pezzi
                                </span>
                            </div>
                        </div>

                        {/* BOTTONI: RICHIEDI RIORDINO ED ESPORTA PDF */}
                        <div className="flex-1 flex flex-col justify-center items-center gap-4">
                            <button
                                className="bg-[#090c64] text-white font-semibold px-6 py-3 rounded-xl shadow-md 
                                hover:bg-[#090c64]/70 transition-all duration-200 w-3/4 text-center flex items-center justify-center gap-2"
                            >
                                <PlusCircle size={32} color="#f5f5f5" weight="duotone" />
                                Rifornimento
                            </button>

                            <button
                                onClick={handleExportPDF}
                                className="bg-[#fafafa]/50 text-[#134a7b] font-semibold px-6 py-3 rounded-xl shadow-md 
                                hover:bg-white/80 transition-all duration-200 w-3/4 text-center
                                flex items-center justify-center gap-2"
                            >
                                <FilePdf size={32} color="#090c64" weight="duotone" />
                                <span> Esporta PDF </span>
                            </button>
                        </div>
                    </div>

                    {/* --------- SEZIONE 4: STORICO MOVIMENTI --------- */}
                    <div className="rounded-2xl bg-[#fafafa]/10 backdrop-blur-sm p-6 shadow-md">
                        <div className="flex items-center gap-2 mb-4">
                            <Notepad size={32} color="#090c64" weight="duotone" />
                            <h3 className="text-[#134a7b] text-lg font-bold">Storico movimenti</h3>
                        </div>

                        <div className="grid grid-cols-3 font-bold text-[#134a7b] text-sm mb-2">
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
                            <Note size={32} className="self-center align-middle" color="#090c64" weight="duotone"/>
                            <h3 className="text-[#134a7b] text-lg font-bold m-0 leading-none">Note e allegati</h3>
                        </div>

                        <textarea
                            placeholder="Aggiungi una nota..."
                            className="w-full p-3 rounded-xl bg-white/40 text-[#134a7b] shadow-sm mb-4"
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
                            <Paperclip size={32} color="#090c64" weight="duotone" />
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
  className="bg-[#fafafa]/50 text-[#134a7b] font-semibold px-6 py-3 rounded-full shadow-md 
  hover:bg-white/80 transition-all duration-200 w-3/4 text-center"
>
  Esporta PDF
</button>

*/