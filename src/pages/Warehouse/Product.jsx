import { useParams, Link } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { useLanguage } from "../../context/LanguageContext";
import jsPDF from "jspdf"; // per usare l'export pdf

import sampleProduct from "../../assets/sample-product.jpg";

// icone
import warehouseIcon from "../../assets/icons/warehouse.png";
import boxIcon from "../../assets/icons/box.png";
import packageIcon from "../../assets/icons/Package.png";
import ideaIcon from "../../assets/icons/Idea.png";
import attachmentIcon from "../../assets/icons/Attachment.png";
import logout from "../../assets/icons/Logout.png";

const Product = () => {
  // ---- THEME CONTEXT (per dark mode dinamica) ----
  const { theme } = useTheme();
  const textColor = theme === "dark" ? "text-white" : "text-[#134a7b]";

  const { t } = useLanguage();

  // ---- OTTENGO L'ID DEL PRODOTTO DALL'URL ----
  const { id } = useParams();

  // ---- ARRAY PRODOTTI ----
  const products = [
    {
      id: "001",
      nome: "Prodotto A",
      categoria: "Categoria 1",
      quantita: 50,
      soglia: 20,
      note: "Nessuna nota",
      img: sampleProduct,
    },
    {
      id: "002",
      nome: "Prodotto B",
      categoria: "Categoria 2",
      quantita: 30,
      soglia: 10,
      note: "Nessuna nota",
      img: sampleProduct,
    },
    {
      id: "003",
      nome: "Prodotto C",
      categoria: "Categoria 3",
      quantita: 5,
      soglia: 15,
      note: "Sotto soglia",
      img: sampleProduct,
    },
  ];

  // ---- CERCO IL PRODOTTO CORRISPONDENTE ALL'ID CHE ARRIVA DALL'URL PER MOSTRARNE LA PAGINA PRODOTTO ----
  const prodotto = products.find((p) => p.id === id);

  // ----ARRAY CON BOX DATI ----
  const buttons = [
    { label: t("warehouse.prodottiTotali"), number: 240, icon: packageIcon },
    { label: t("warehouse.ordiniInUscita"), number: 32, icon: packageIcon },
    { label: t("warehouse.articoliSottoSoglia"), number: 12, icon: boxIcon },
    { label: t("warehouse.depositi"), number: 3, icon: warehouseIcon },
  ];

  // ---- SE IL PRODOTTO NON ESISTE MOSTRO UN MESSAGGIO ----
  if (!prodotto) {
    return (
      <div
        className="
          w-full min-h-screen flex flex-col justify-center items-center
          bg-[#fafafa20] dark:bg-[#fafafa30] backdrop-blur-sm
          border border-white/30 dark:border-white/40
          rounded-[25px] shadow-md
          text-[#134a7b] dark:text-white
          transition-colors duration-300
        "
      >
        <h2 className="text-2xl font-bold mb-4">{t("warehouse.prodottoNonTrovato")}</h2>
        <Link
          to="/magazzino"
          className="
            bg-[#1C62A0] text-white border border-white/20
            rounded-2xl shadow-md font-bold px-6 py-3
            transition-colors duration-300 hover:bg-[#155293]
          "
        >
          {t("warehouse.tornaAllaLista")}
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
    senza bisogno di un server.
    */

  // FUNZIONE CHE DEFINISCE COSA SUCCEDE QUANDO CLICCHIAMO IL BOTTONE “ESPORTA PDF”
  const handleExportPDF = () => {
    if (!prodotto) return;
    try {
      const doc = new jsPDF();
      doc.setFont("helvetica", "bold");
      doc.text("Scheda prodotto", 20, 20);
      let y = 40; // coordinata iniziale (da dove part il testo verticalmente)

      // Immagine (se presente)
      if (prodotto.img) {
        doc.addImage(prodotto.img, "JPEG", 20, y, 50, 50);
        y += 60; // spazio dopo l'immagine
      }

      // Dati prodotto
      doc.setFont("helvetica", "normal");
      doc.text(`ID: ${prodotto.id}`, 20, y);
      y += 10; // y+=10 = scrivi partendo dall'attuale posizione + 10, in modo ds non sovrappore le righe
      doc.text(`Nome: ${prodotto.nome}`, 20, y);
      y += 10; // 20 distanza da sinistra
      doc.text(`Categoria: ${prodotto.categoria}`, 20, y);
      y += 10;
      doc.text(`Quantità: ${prodotto.quantita}`, 20, y);
      y += 10;
      doc.text(`Soglia riordino: ${prodotto.soglia}`, 20, y);
      y += 10;
      doc.text(`Note: ${prodotto.note}`, 20, y);
      y += 10;
      doc.text(`Disponibilità: ${prodotto.disponibilita}`, 20, y);
      y += 10;

      // Storico movimenti
      if (storico.length > 0) {
        doc.text("Storico movimenti:", 20, y);
        y += 10;
        storico.forEach((m) => {
          doc.text(`- ${m.tipo}, ${m.quantita}, ${m.data}`, 25, y);
          y += 10;
        });
      }

      // Salvataggio PDF
      doc.save(`Scheda_${prodotto.nome}.pdf`);
    } catch (e) {
      // se si verifica errore con jsPDF, messaggio in console e non si interrompe la pagina
      console.error("jsPDF non disponibile o errore durante export:", e);
      alert("Errore: impossibile esportare il PDF.");
    }
  };

  return (
    <>
      <div
        className="
          w-full h-full flex flex-col gap-8 pr-2
          overflow-y-auto
          [scrollbar-width:none] [-ms-overflow-style:none]
          [&::-webkit-scrollbar]:hidden
        "
      >
        {/* --------- SEZIONE 1: BOX RIASSUNTIVI --------- */}
        <section className="grid gap-6 mb-6 w-full transition-colors duration-500 grid-cols-4">
          {buttons.map((btn, index) => (
            <div
              key={index}
              className={`
                flex items-center justify-between rounded-xl px-4 py-3 shadow
                bg-[#fafafa20] dark:bg-[#fafafa30]
                backdrop-blur-sm border border-white/30 dark:border-white/40
                ${textColor}
              `}
            >
              <div className="flex items-center gap-2">
                <img src={btn.icon} alt={btn.label} className="w-6 h-6" />
                <span className="font-bold">{btn.label}</span>
              </div>
              <span className="text-sm opacity-70 leading-none font-semibold">
                {btn.number}
              </span>
            </div>
          ))}
        </section>

        {/* ---------- SEZIONE 2: DETTAGLIO PRODOTTO ---------- */}
        <div
          className="
            p-6 shadow-md flex flex-col gap-2
            bg-[#fafafa20] dark:bg-[#fafafa30]
            backdrop-blur-sm border border-white/30 dark:border-white/40
            rounded-[25px]
            transition-colors duration-300
          "
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {/* IMMAGINE PRODOTTO: mettere il path in prodotto.img; 
                  Se prodotto.img esiste mostra l’immagine del prodotto (dimensione 48x48 px, rotonda). 
                  Altrimenti → mostra un placeholder circolare con scritto “Img”.*/}
              {prodotto.img ? (
                <img
                  src={prodotto.img}
                  alt={prodotto.nome}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div
                  className="
                    w-12 h-12 rounded-full
                    bg-white/30 flex items-center justify-center text-sm
                    text-[#1C62A0] dark:text-white
                  "
                >
                  Img
                </div>
              )}
              <div className="flex items-center gap-2">
                <h2 className={`text-lg font-bold ${textColor}`}>{prodotto.nome}</h2>
              </div>

              {/* ---- BARRA DI RICERCA ---- 

                  <div className="flex-1 flex justify-center">
                      <input
                          type="text"
                          placeholder="Cerca..."
                          className="w-full max-w-xs px-3 py-2 rounded-full border border-gray-300 bg-[#fafafa]/50 shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                  </div> */}
            </div>

            {/* ---- BOTTONE TORNA ALLA LISTA ---- */}
            <div className="flex items-center justify-between mt-4">
              <span className={`${textColor} font-semibold mr-4`}>
                {t("warehouse.tornaAllaLista")}
              </span>
              <Link
                to="/magazzino"
                className="
                  w-12 h-12 flex items-center justify-center
                  bg-white/50 rounded-full shadow-md
                  hover:bg-white/70 transition-all duration-200
                  dark:bg-[#fafafa30]
                "
              >
                <img src={logout} alt="Chiudi" className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* --- PRODOTTO CON DESCRIZIONE, INFO E FOTO --- */}
          <div className="grid grid-cols-2 gap-6 items-start">
            {/* DIV A SINISTRA: INFO PRODOTTO */}
            <div className={`flex flex-col gap-3 ${textColor}`}>
              <div className="grid grid-cols-2 bg-white/40 dark:bg-[#fafafa30] rounded-full p-2 shadow-sm">
                <span>{t("warehouse.id")}</span>
                <span>{prodotto.id}</span>
              </div>
              <div className="grid grid-cols-2 bg-white/40 dark:bg-[#fafafa30] rounded-full p-2 shadow-sm">
                <span>{t("warehouse.nome")}</span>
                <span>{prodotto.nome}</span>
              </div>
              <div className="grid grid-cols-2 bg-white/40 dark:bg-[#fafafa30] rounded-full p-2 shadow-sm">
                <span>{t("warehouse.categoria")}</span>
                <span>{prodotto.categoria}</span>
              </div>
              <div className="grid grid-cols-2 bg-white/40 dark:bg-[#fafafa30] rounded-full p-2 shadow-sm">
                <span>{t("warehouse.quantita")}</span>
                <span>{prodotto.quantita}</span>
              </div>
              <div className="grid grid-cols-2 bg-white/40 dark:bg-[#fafafa30] rounded-full p-2 shadow-sm">
                <span>{t("warehouse.sogliaRiordino")}</span>
                <span>{prodotto.soglia}</span>
              </div>
              <div className="grid grid-cols-2 bg-white/40 dark:bg-[#fafafa30] rounded-full p-2 shadow-sm">
                <span>{t("warehouse.note")}</span>
                <span>{prodotto.note}</span>
              </div>
            </div>

            {/* DIV A DESTRA: IMMAGINE PRODOTTO */}
            <div className="flex flex-col items-center justify-center h-full w-full">
              {prodotto.img ? (
                <img
                  src={prodotto.img}
                  alt={prodotto.nome}
                  className="
                    w-full h-full max-h-80 object-contain rounded-2xl shadow-md
                    bg-white/30 dark:bg-[#fafafa30]
                  "
                />
              ) : (
                <div
                  className="
                    w-full h-80 rounded-2xl bg-white/30 shadow-md
                    flex items-center justify-center text-sm
                    text-[#1C62A0] dark:text-white
                  "
                >
                  Nessuna immagine
                </div>
              )}
            </div>
          </div>
        </div>

        {/* --------- SEZIONE 3: DISPONIBILITÀ E AZIONI --------- */}
        <div className="flex gap-4">
          {/* Disponibilità */}
          <div
            className="
              flex-1 p-6 shadow-md
              bg-[#fafafa20] dark:bg-[#fafafa30]
              backdrop-blur-sm border border-white/30 dark:border-white/40
              rounded-[25px]
            "
          >
            <div className="flex items-center gap-2 mb-4">
              <img src={warehouseIcon} alt="Disponibilità" className="w-6 h-6" />
              <h2 className={`text-lg font-bold ${textColor}`}>
                {t("warehouse.disponibilita")}
              </h2>
            </div>

            {/*  ----- DISPONIBILITÀ DINAMICA -----
                Il valore viene preso da `prodotto.quantita` dall'array `products`.
            */}
            <div className="grid grid-cols-6 bg-white/40 dark:bg-[#fafafa30] rounded-full p-2 shadow-sm">
              <span className="col-span-6 w-full whitespace-nowrap overflow-hidden text-ellipsis">
                {prodotto.quantita} {t("warehouse.pezzi")}
              </span>
            </div>
          </div>

          {/* BOTTONI: RICHIEDI RIORDINO ED ESPORTA PDF */}
          <div className="flex-1 flex flex-col justify-center items-center gap-4">
            <button
              className="
                bg-[#1C62A0] text-white border border-white/20
                rounded-2xl shadow-md font-bold px-6 py-3
                transition-colors duration-300 hover:bg-[#155293]
                w-3/4 text-center
              "
            >
              {t("warehouse.richiediRiordino")}
            </button>

            <button
              onClick={handleExportPDF}
              className="
                bg-white/50 text-[#1C62A0] hover:bg-white/80
                dark:bg-[#fafafa30] dark:text-white dark:hover:bg-[#1C62A0]/20
                border border-white/20 rounded-2xl shadow-md font-bold px-6 py-3
                transition-colors duration-300
                w-3/4 text-center
              "
            >
              {t("warehouse.esportaPDF")}
            </button>
          </div>
        </div>

        {/* --------- SEZIONE 4: STORICO MOVIMENTI --------- */}
        <div
          className="
            p-6 shadow-md
            bg-[#fafafa20] dark:bg-[#fafafa30]
            backdrop-blur-sm border border-white/30 dark:border-white/40
            rounded-[25px]
          "
        >
          <div className="flex items-center gap-2 mb-4">
            <img src={ideaIcon} alt="Storico" className="w-6 h-6" />
            <h2 className={`text-lg font-bold ${textColor}`}>
              {t("warehouse.storicoMovimenti")}
            </h2>
          </div>

          <div className={`grid grid-cols-3 font-bold text-sm mb-2 ${textColor}`}>
            <span>{t("warehouse.data")}</span>
            <span>{t("warehouse.tipo")}</span>
            <span>{t("warehouse.quantita")}</span>
          </div>

          {storico.map((m, i) => (
            <div
              key={i}
              className="
                grid grid-cols-3
                bg-white/40 dark:bg-[#fafafa30]
                rounded-full p-2 shadow-sm mb-2
              "
            >
              <span>{m.data}</span>
              <span>{m.tipo}</span>
              <span>{m.quantita}</span>
            </div>
          ))}
        </div>

        {/* --------- SEZIONE 5: NOTE E ALLEGATI --------- */}
        <div
          className="
            p-6 shadow-md
            bg-[#fafafa20] dark:bg-[#fafafa30]
            backdrop-blur-sm border border-white/30 dark:border-white/40
            rounded-[25px]
          "
        >
          <div className="flex items-center gap-2 mb-4">
            <img src={boxIcon} alt="Note e allegati" className="w-6 h-6" />
            <h2 className={`text-lg font-bold ${textColor}`}>
              {t("warehouse.noteAllegati")}
            </h2>
          </div>

          <textarea
            placeholder={t("warehouse.aggiungiNota")}
            className="
              w-full bg-white/40 dark:bg-[#fafafa30] rounded-xl p-3 mb-4 shadow-sm
              text-[#134a7b] dark:text-white
              placeholder:text-[#134a7b]/80 dark:placeholder:text-white/80
              focus:outline-none focus:ring-2 focus:ring-[#1C62A0]
              transition-colors duration-300
            "
            rows={4}
          />

          {/* ----- AGGIUNGI ALLEGATO:
              BOTTONE "SCEGLI FILE"
             L'attributo "type='file'" apre automaticamente la finestra di selezione file del sistema operativo.
             Non serve alcuna funzione JavaScript aggiuntiva per farlo funzionare.
            */}
          <label
            className="
              flex items-center gap-2 cursor-pointer 
              bg-white/50 dark:bg-[#fafafa30]
              text-[#1C62A0] dark:text-white
              font-semibold px-4 py-2 rounded-full shadow-md 
              hover:bg-white/80 dark:hover:bg-[#1C62A0]/20
              transition-colors duration-200
            "
          >
            {/* Icona piccola */}
            <img src={attachmentIcon} alt="Allegati" className="w-4 h-4" />
            {/* Input invisibile, gestito solo da JS */}
            <input type="file" className="hidden" />
            {/* Testo personalizzabile */}
            {t("warehouse.scegliFile")}
          </label>
        </div>
      </div>
    </>
  );
};

export default Product;
