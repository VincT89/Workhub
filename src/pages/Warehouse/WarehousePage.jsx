import { Link } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext"; 
import { useLanguage } from "../../context/LanguageContext";
import warehouseIcon from "../../assets/icons/Warehouse.png";
import boxIcon from "../../assets/icons/box.png";
import listIcon from "../../assets/icons/list.png";
import deliverytimeIcon from "../../assets/icons/Delivery Time.png";
import packageIcon from "../../assets/icons/Package.png";
import ideaIcon from "../../assets/icons/Idea.png";

const WarehousePage = () => {
  const { theme } = useTheme();
  const { t } = useLanguage();

  const textColor =
    theme === "dark" ? "text-(--text-dark)" : "text-primary"; // determina il colore del testo in base al tema corrente
  const subTextColor =
    theme === "dark" ? "text-gray-300" : "text-gray-600"; // determina il colore del sottotesto in base al tema corrente

  // ---- CREO L'ARRAY PER RENDERE I BOX DINAMICI ----
  const buttons = [
    { label: t("warehouse.prodottiTotali"), number: 240, icon: packageIcon },
    { label: t("warehouse.ordiniInUscita"), number: 32, icon: deliverytimeIcon },
    { label: t("warehouse.articoliSottoSoglia"), number: 12, icon: boxIcon },
    { label: t("warehouse.depositi"), number: 3, icon: warehouseIcon },
  ];

  // ---- CREO L'ARRAY PER LA LISTA PRODOTTI ----
  const products = [
    { id: "001", nome: "Prodotto A", categoria: "Categoria 1", quantita: 50, soglia: 20, note: "Nessuna nota" },
    { id: "002", nome: "Prodotto B", categoria: "Categoria 2", quantita: 30, soglia: 10, note: "Nessuna nota" },
    { id: "003", nome: "Prodotto C", categoria: "Categoria 3", quantita: 5, soglia: 15, note: "Sotto soglia" },
    { id: "004", nome: "Prodotto D", categoria: "Categoria 1", quantita: 22, soglia: 10, note: "Nessuna nota" },
    { id: "005", nome: "Prodotto E", categoria: "Categoria 2", quantita: 10, soglia: 15, note: "Sotto soglia" },
    { id: "006", nome: "Prodotto F", categoria: "Categoria 3", quantita: 80, soglia: 20, note: "Nessuna nota" },
    { id: "007", nome: "Prodotto G", categoria: "Categoria 1", quantita: 12, soglia: 10, note: "Nessuna nota" },
    { id: "008", nome: "Prodotto H", categoria: "Categoria 2", quantita: 6, soglia: 15, note: "Sotto soglia" },
    { id: "009", nome: "Prodotto I", categoria: "Categoria 3", quantita: 45, soglia: 25, note: "Nessuna nota" },
  ];

  return (
    <>
      <div className="w-full h-full flex flex-col gap-8 overflow-y-auto custom-scrollbar-invisible ">

        {/* --------- SEZIONE 1: BOX RIASSUNTIVI --------- */}
        <section className="section-base grid-4">
          {buttons.map((btn, index) => (
            <div
              key={index}
              className={`widget-box glass-card ${textColor} justify-between`}
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

        {/* ---------- SEZIONE 2: LISTA PRODOTTI (DINAMICA + LINK) ---------- */}
        <div className="flex-gap-2">
          <img src={listIcon} alt="Lista prodotti" className="w-6 h-6" />
          <h2 className={`text-lg font-bold ${textColor}`}>{t("warehouse.listaProdotti")}</h2>
        </div>

        {/* Contenitore lista con scrollbar personalizzata */}
        <div className="glass-card p-6 shadow-md flex flex-col gap-2">
          {/* Header tabella */}
          <div className={`grid grid-cols-6 font-bold text-sm mb-2 ${textColor}`}>
            <span>{t("warehouse.numeroArticoli")}</span>
            <span>{t("warehouse.nome")}</span>
            <span>{t("warehouse.categoria")}</span>
            <span>{t("warehouse.qtaDisponibile")}</span>
            <span>{t("warehouse.sogliaRiordino")}</span>
            <span>{t("warehouse.note")}</span>
          </div>

          {/* Scroll dinamico con classe riutilizzabile */}
          <div className="h-64 pr-2 space-y-2 custom-scrollbar">
            {products.map((p) => (
              <Link
                key={p.id}
                to={`/product/${p.id}`}
                className="grid grid-cols-6 bg-white/40 dark:bg-glass-strong
                  rounded-full p-2 shadow-sm transition duration-200 
                  hover:bg-white/70 dark:hover:bg-primary/20 cursor-pointer"
              >
                <span>{p.id}</span>
                <span>{p.nome}</span>
                <span>{p.categoria}</span>
                <span>{p.quantita}</span>
                <span>{p.soglia}</span>
                <span>{p.note}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* --------- SEZIONE 3: DEPOSITI E SUGGERIMENTI --------- */}
        <div className="flex section-gap">
          {/* Depositi */}
          <div className="flex-1 glass-card p-6 shadow-md">
            <div className="flex-gap-2 mb-4">
              <img src={warehouseIcon} alt="Depositi" className="w-6 h-6" />
              <h2 className={`text-lg font-bold ${textColor}`}>{t("warehouse.depositi")}</h2>
            </div>
            <div className="grid grid-cols-6 bg-white/40 dark:bg-glass-strong rounded-full p-2 shadow-sm">
              <span className={`col-span-6 w-full whitespace-nowrap overflow-hidden text-ellipsis ${subTextColor}`}>
                {t("warehouse.nessunaNota")}
              </span>
            </div>
          </div>

          {/* Suggerimenti riordino articoli */}
          <div className="flex-1 glass-card p-6 shadow-md">
            <div className="flex-gap-2 mb-4">
              <img src={ideaIcon} alt="Icona suggerimenti" className="w-6 h-6" />
              <h2 className={`text-lg font-bold ${textColor}`}>{t("warehouse.suggerimenti")}</h2>
            </div>
            <div className="grid grid-cols-6 bg-white/40 dark:bg-glass-strong rounded-full p-2 shadow-sm">
              <span className={`col-span-6 w-full whitespace-nowrap overflow-hidden text-ellipsis ${subTextColor}`}>
                {t("warehouse.nessunaNota")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default WarehousePage;
