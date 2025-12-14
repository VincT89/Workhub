import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import jsPDF from "jspdf";
// icone
import { SignOutIcon, WarehouseIcon, NoteIcon, NotepadIcon, PaperclipIcon, FilePdfIcon } from "@phosphor-icons/react";

import { useTheme } from "../../context/ThemeContext";
import { useLanguage } from "../../context/LanguageContext";

const Product = () => {
  const { id } = useParams();

  const { theme } = useTheme();
  const { t } = useLanguage();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  // Carico il prodotto dal server tramite id
  useEffect(() => {
    fetch(`http://localhost:3030/api/v1/items/${id}`)
      .then(res => res.json())
      .then(data => {
        setItem(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Errore nel caricamento prodotto:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div className="text-center mt-10">Caricamento...</div>;
  }

  if (!item) {
    return (
      <div className="w-full min-h-screen flex flex-col justify-center items-center bg-[#f0f4f8] text-[#090c]">
        <h2 className="text-2xl font-bold mb-4">{t("prodottoNonTrovato")}</h2>
        <Link
          to="/warehouse"
          className="bg-[#fafafa]/50 text-[#090c64] font-semibold px-6 py-3 rounded-full shadow-md 
                    hover:bg-white/80 transition-all duration-200 text-center"
        >
          {t("tornaAllaLista")}
        </Link>
      </div>
    );
  }

  const storico = [
    { data: "2025-10-01", tipo: "Entrata", quantita: 10 },
    { data: "2025-10-05", tipo: "Uscita", quantita: 3 },
    { data: "2025-10-12", tipo: "Entrata", quantita: 5 },
  ];

  const handleExportPDF = () => {
    if (!item || !item.product) return;

    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Scheda prodotto", 20, 20);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(`ID Item: ${item._id}`, 20, 40);
    doc.text(`Nome: ${item.product.name}`, 20, 50);
    doc.text(`SKU: ${item.product.sku}`, 20, 60);
    doc.text(`Categoria: ${item.product.category?.name || "N/D"}`, 20, 70);
    doc.text(`Quantità: ${item.stock}`, 20, 80);
    doc.text(`Soglia riordino: ${item.stockLimit}`, 20, 90);
    doc.text(`Note: ${item.note || "-"}`, 20, 100);

    if (storico.length > 0) {
      doc.text("Storico movimenti:", 20, 110);
      let y = 120;
      storico.forEach(m => {
        doc.text(`- ${m.tipo}, ${m.quantita}, ${m.data}`, 25, y);
        y += 10;
      });
    }

    doc.save(`Scheda_${item.product.name}.pdf`);
  };

  return (
    <div className="w-full min-h-screen flex justify-center items-start p-8">
      <div className="w-full max-w-[1200px] p-6 flex flex-col gap-8">

        {/* SEZIONE 1: DETTAGLIO PRODOTTO */}
        <div className="rounded-2xl bg-[#fafafa]/10 backdrop-blur-sm p-6 shadow-md flex flex-col gap-2">
          {/* RIGA superiore: NOME PRODOTTO + TORNA ALLA LISTA */}
          <div className="flex items-center justify-between mb-4">
            <span className=" font-bold text-3xl">
              {item.product.name}
            </span>
            <Link
              to="/warehouse"
              className="w-12 h-12 flex items-center justify-center bg-white/50 rounded-full shadow-md hover:bg-white/70 transition-all duration-200"
            >
              <SignOutIcon size={32} 	color={theme === "dark" ? "white" : "#090c64"} weight="duotone" />
            </Link>
          </div>

          {/* DIV INFO PRODOTTO + IMMAGINE */}
          <div className="grid grid-cols-2 gap-6 items-start">
            <div className="flex flex-col gap-3 ">
              <div className="grid grid-cols-2 bg-white/40 rounded-lg p-2 shadow-sm">
                <span>{t("id")}</span>
                <span className="break-all">{item._id}</span> {/* break-all per spezzare stringhe lunghe senza spazi */ }
              </div>
              <div className="grid grid-cols-2 bg-white/40 rounded-lg p-2 shadow-sm">
                <span>{t("nomeProdotto")}</span>
                <span>{item.product.name}</span>
              </div>
              <div className="grid grid-cols-2 bg-white/40 rounded-lg p-2 shadow-sm">
                <span>SKU</span>
                <span>{item.product.sku}</span>
              </div>
              <div className="grid grid-cols-2 bg-white/40 rounded-lg p-2 shadow-sm">
                <span>{t("categoria")}</span>
                <span>{item.product.category?.name || "N/D"}</span>
              </div>
              <div className="grid grid-cols-2 bg-white/40 rounded-lg p-2 shadow-sm">
                <span>{t("quantita")}</span>
                <span>{item.stock}</span>
              </div>
              <div className="grid grid-cols-2 bg-white/40 rounded-lg p-2 shadow-sm">
                <span>{t("sogliaRiordino")}</span>
                <span>{item.stockLimit}</span>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center h-full w-full">
              {item.product?.image ? (
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-full h-full max-h-80 object-contain rounded-2xl shadow-md bg-white/30"
                />
              ) : (
                <div className="w-full h-80 rounded-2xl bg-white/30 flex items-center justify-center text-sm shadow-md">
                  {t("nessunaImmagine")}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* NOTE E ALLEGATI */}
        <div className="rounded-2xl bg-[#fafafa]/10 backdrop-blur-sm p-6 shadow-md">
          <div className="flex items-center gap-2 mb-4">
            <NoteIcon size={32} color={theme === "dark" ? "white" : "#090c64"} weight="duotone" />
            <h3 className="text-[#090c64] text-lg font-bold m-0 leading-none">{t("noteAllegati")}</h3>
          </div>

          <textarea
            placeholder={t("aggiungiNota")}
            className="w-full p-3 rounded-xl bg-white/40 text-[#090c64] shadow-sm mb-4"
            rows={4}
          ></textarea>

          <label className="flex items-center gap-2 cursor-pointer bg-[#fafafa]/50 text-[#090c64] font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-white/80 transition-all duration-200">
            <PaperclipIcon size={32} 	color={theme === "dark" ? "white" : "#090c64"} weight="duotone" />
            <input type="file" hidden /> {t("scegliFile")}
          </label>
        </div>

          {/* DISPONIBILITÀ E AZIONI */}
        <div className="flex gap-4">
          <div className="flex-1 rounded-2xl bg-[#fafafa]/10 backdrop-blur-sm p-6 shadow-md">
            <div className="flex items-center gap-2 mb-4">
              <WarehouseIcon size={32} 	color={theme === "dark" ? "white" : "#090c64"} weight="duotone" />
              <h3 className="text-[#090c64] text-lg font-bold">{t("disponibilita")}</h3>
            </div>
            <div className="grid grid-cols-6 bg-white/40 rounded-xl p-2 shadow-sm">
              <span className="col-span-6 w-full whitespace-nowrap overflow-hidden text-ellipsis">
                {item.stock} {t("pezzi")}
              </span>
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-center items-center gap-4">
            <button
              onClick={handleExportPDF}
              className="bg-[#fafafa]/50 font-semibold px-6 py-3 rounded-xl shadow-md hover:bg-white/80 transition-all duration-200 w-3/4 flex items-center justify-center gap-2"
            >
              <FilePdfIcon size={32}	color={theme === "dark" ? "white" : "#090c64"} weight="duotone" />
              <span> {t("esportaPDF")} </span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Product;