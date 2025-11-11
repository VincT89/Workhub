import { useTheme } from "../../context/ThemeContext";
import { useLanguage } from "../../context/LanguageContext";
import deleteUserIcon from "../../assets/icons/Delete User Male.png";
import groupIcon from "../../assets/icons/Group.png";
import qualityIcon from "../../assets/icons/Quality.png";
import staffIcon from "../../assets/icons/Staff.png";
import { useNavigate } from "react-router-dom";

const CustomersPage = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { t } = useLanguage();

  const textColor =
    theme === "dark" ? "text-white" : "text-[#134a7b]"; // determina il colore del testo in base al tema corrente

  const stats = [
    { label: t("customers.clientiAttivi"), value: 20, icon: groupIcon },
    { label: t("customers.clientiInattivi"), value: 4, icon: deleteUserIcon },
    { label: t("customers.ClientiPremium"), value: 12, icon: qualityIcon },
    { label: t("customers.clientiMensili"), value: 400, icon: staffIcon },
  ];

  const customers = [
    {
      nome: "Mario Mario",
      indirizzo: "Via Roma 12",
      email: "mariobros@super.com",
      telefono: "+39 333 1234567",
      livello: "Standard",
      punti: 120,
    },
    {
      nome: "Luigi Mario",
      indirizzo: "Via Roma 12",
      email: "luigibros@super.com",
      telefono: "+39 333 9876543",
      livello: "Premium",
      punti: 530,
    },
  ];

  // funzione da triggherare al click della riga con i dati di un cliente che riporta alla pagina di anagrafica del suddetto cliente
  const openCustomerDetails = (customer) => {
    navigate(`/clienti/${customer.id}`, { state: customer }); // state serve ad immagazzinare i dati presenti nella riga della tabella e a trasportarli alla pagina CustomerRegistry dove navigate riporta l'utente al click del div
  };

  return (
    <div className="w-full h-full flex flex-col gap-8 overflow-y-auto scrollbar-thin scrollbar-thumb-[#1C62A0] scrollbar-track-transparent">
      <section className="grid grid-cols-4 gap-6 mb-6 w-full transition-colors duration-500">
        {/* bottoni con map per non doverli scrivere uno ad uno manualmente. li rende dinamici e crea un button per ogni elemtno dell'array stats*/}
        {stats.map((item, index) => (
          <div
            key={index}
            className={`
              flex items-center justify-between rounded-xl px-4 py-3 shadow
              transition-colors duration-500
              backdrop-blur-sm border border-white/30 shadow-md rounded-[25px]
              ${theme === "dark" ? "bg-white/20" : "bg-white/20"}
              ${textColor}
            `}
          >
            <div className="flex items-center gap-2">
              <img src={item.icon} alt={item.label} className="w-6 h-6" />
              <span className="font-bold">{item.label}</span>
            </div>
            <span className="text-sm opacity-70 leading-none font-semibold">
              {item.value}
            </span>
          </div>
        ))}
      </section>

      {/* tabella fatta di div per garantire la compatibilità con le classi tailwind*/}
      <div
        className={`
          backdrop-blur-sm border border-white/30 rounded-[25px]
          shadow-md p-6 flex flex-col gap-2
          ${theme === "dark" ? "bg-white/20" : "bg-white/20"}
        `}
      >
        <h2 className={`text-lg font-bold mb-2 ${textColor}`}>
          {t("customers.listaClienti")}
        </h2>

        {/* header della tabella */}
        <div
          className={`grid grid-cols-6 font-bold text-sm mb-2 ${textColor}`}
        >
          <span>{t("customers.nomeCompleto")}</span>
          <span>{t("customers.indirizzo")}</span>
          <span>{t("customers.email")}</span>
          <span>{t("customers.telefono")}</span>
          <span>{t("customers.livello")}</span>
          <span>{t("customers.saldoPunti")}</span>
        </div>

        {/* lista dei clienti con map per non doverli scrivere uno ad uno manualmente. li rende dinamici e crea un div per ogni elemtno dell'array customers*/}
        <div className="h-64 pr-2 space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-[#1C62A0] scrollbar-track-transparent">
          {customers.map((c, i) => (
            <div
              key={i}
              onClick={() => openCustomerDetails(c)}
              className={`
                grid grid-cols-6 p-2 rounded-full shadow-sm transition duration-200 cursor-pointer
                ${theme === "dark"
                  ? "bg-white/20 hover:bg-[#1C62A0]/20"
                  : "bg-white/40 hover:bg-white/70"}
              `}
            >
              <span>{c.nome}</span>
              <span>{c.indirizzo}</span>
              {/* queste classi tailwind servono a troncare i dati troppo lunghi in caso di necessità per evitare che ci sia overflow sugli altri spazi della tabella*/}
              <span className="truncate whitespace-nowrap overflow-hidden mr-3">
                {c.email}
              </span>
              <span className="truncate whitespace-nowrap overflow-hidden">
                {c.telefono}
              </span>
              <span>{c.livello}</span>
              <span>{c.punti}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomersPage;
