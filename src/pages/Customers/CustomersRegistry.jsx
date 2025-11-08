import { useLocation } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { useLanguage } from "../../context/LanguageContext";

import deleteUserIcon from "../../assets/icons/Delete User Male.png";
import groupIcon from "../../assets/icons/Group.png";
import qualityIcon from "../../assets/icons/Quality.png";
import staffIcon from "../../assets/icons/Staff.png";

const CustomersRegistry = () => {
    const location = useLocation(); //useLocation() è una hook che ci fa accedere alla location corrente, cioè a tutte le info presenti sul percorso in cui ci troviamo
    //con questa hook possiamo leggere i dati che ci sono stati passati da CustomersPage.jsx
    const customer = location.state; //i dati passati da CustomersPage.jsx sono salvati dentro location.state, che è una proprietà dell'oggetto location che contiene suddetti dati che ci sono stati inviati tramite navigate (vedi riga 29 nel componente CustomersPage.jsx)

    const { theme } = useTheme();
    const { t } = useLanguage();

    const textColor =
        theme === "dark" ? "text-[var(--text-dark)]" : "text-[var(--text-light)]";

    const stats = [
        { label: t("customers.clientiAttivi"), value: 20, icon: groupIcon },
        { label: t("customers.clientiInattivi"), value: 4, icon: deleteUserIcon },
        { label: t("customers.ClientiPremium"), value: 12, icon: qualityIcon },
        { label: t("customers.clientiMensili"), value: 400, icon: staffIcon },
    ];

    return (
        <div className="w-full h-full flex flex-col gap-8 overflow-y-auto custom-scrollbar-invisible">
            <section className="section-base grid-4">
                {/* bottoni con map per non doverli scrivere uno ad uno manualmente. 
                    li rende dinamici e crea un button per ogni elemtno dell'array stats */}
                {stats.map((item) => (
                    <div
                        key={item.label}
                        className={`widget-box glass-card ${textColor} justify-between`}
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

            {/* sezione centrale della pagina con le tre tabelle/colonne */}
            <div className="glass-card p-6 shadow-md flex flex-col gap-6">
                <h2 className={`text-lg font-bold mb-2 ${textColor}`}>
                    {t("customers.cliente")}: {customer.nome}
                </h2>

                {/* griglia a 3 colonne */}
                <div className="grid grid-cols-3 gap-6">
                    {/* colonna anagrafica */}
                    <div className="flex flex-col gap-3">
                        <h3 className={`font-semibold mb-2 text-left ${textColor}`}>
                            {t("customers.anagrafica")}
                        </h3>
                        <div className="bg-white/40 dark:bg-glass-strong p-3 rounded-full shadow-sm">
                            {customer.nome}
                        </div>
                        <div className="bg-white/40 dark:bg-glass-strong p-3 rounded-full shadow-sm">
                            {customer.indirizzo}
                        </div>
                        <div className="bg-white/40 dark:bg-glass-strong p-3 rounded-full shadow-sm">
                            {customer.email}
                        </div>
                        <div className="bg-white/40 dark:bg-glass-strong p-3 rounded-full shadow-sm">
                            {customer.telefono}
                        </div>
                    </div>

                    {/* colonna storico ordini */}
                    <div className="flex flex-col gap-3">
                        <h3 className={`text-left font-semibold mb-2 ${textColor}`}>
                            {t("customers.storicoOrdini")}
                        </h3>
                        <div className="bg-white/40 dark:bg-glass-strong p-3 rounded-full shadow-sm">
                            {t("customers.ordine")}: #1
                        </div>
                        <div className="bg-white/40 dark:bg-glass-strong p-3 rounded-full shadow-sm">
                            {t("customers.ordine")}: #2
                        </div>
                        <div className="bg-white/40 dark:bg-glass-strong p-3 rounded-full shadow-sm">
                            {t("customers.ordine")}: #3
                        </div>
                    </div>

                    {/* colonna card punti */}
                    <div className="flex flex-col gap-3">
                        <h3 className={`font-semibold mb-2 text-left ${textColor}`}>
                            {t("customers.cardPunti")}
                        </h3>
                        <div className="bg-white/40 dark:bg-glass-strong p-3 rounded-full shadow-sm">
                            {t("customers.livello")}: {customer.livello}
                        </div>
                        <div className="bg-white/40 dark:bg-glass-strong p-3 rounded-full shadow-sm">
                            {t("customers.punti")}: {customer.punti}
                        </div>
                    </div>
                </div>

                {/* button esportazione PDF */}
                <div className="w-full flex justify-end mt-4">
                    <button className="px-4 py-2 bg-white/60 dark:bg-glass-strong rounded-full shadow-sm border border-white hover:text-white dark:hover:bg-primary transition cursor-pointer">
                        {t("customers.esportaPDF")}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CustomersRegistry;
