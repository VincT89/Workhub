import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import groupIcon from "../assets/icons/Group.png";
import warehouseIcon from "../assets/icons/Warehouse.png";
import shoppingCartIcon from "../assets/icons/Shopping Cart.png";
import collaboratorMaleIcon from "../assets/icons/Collaborator Male.png";
import calendarIcon from "../assets/icons/Calendar.png";
import notificationsIcon from "../assets/icons/Notifications.png";

const BoardPage = () => {
  const { theme } = useTheme();
  const { t } = useLanguage();

  const textColor =
    theme === "dark" ? "text-[var(--text-dark)]" : "text-[var(--text-light)]";

  return (
    <div className="w-full h-full flex flex-col gap-8 overflow-y-auto custom-scrollbar-invisible">

      {/* Riga 1: i 4 box - con un div che li contiene tutti, e a seguire i singoli box-div */}
      <div className="section-base grid-4">
        <div className={`widget-box glass-card ${textColor} justify-between`}>
          <div className="flex items-center gap-2">
            <img src={groupIcon} alt="Icona gruppo" className="w-6 h-6 object-contain" />
            <span className="font-bold">{t("dashboard.clientiAttivi")}</span>
          </div>
          <span className="text-sm opacity-70 leading-none font-semibold">20</span>
        </div>

        <div className={`widget-box glass-card ${textColor} justify-between`}>
          <div className="flex items-center gap-2">
            <img src={warehouseIcon} alt="Icona magazzino" className="w-6 h-6 object-contain" />
            <span className="font-bold">{t("dashboard.depositi")}</span>
          </div>
          <span className="text-sm opacity-70 leading-none font-semibold">5</span>
        </div>

        <div className={`widget-box glass-card ${textColor} justify-between`}>
          <div className="flex items-center gap-2">
            <img src={shoppingCartIcon} alt="Icona carrello" className="w-6 h-6 object-contain" />
            <span className="font-bold">{t("dashboard.prodotti")}</span>
          </div>
          <span className="text-sm opacity-70 leading-none font-semibold">2000</span>
        </div>

        <div className={`widget-box glass-card ${textColor} justify-between`}>
          <div className="flex items-center gap-2">
            <img src={collaboratorMaleIcon} alt="Icona persona" className="w-6 h-6 object-contain" />
            <span className="font-bold">{t("dashboard.personaleAttivo")}</span>
          </div>
          <span className="text-sm opacity-70 leading-none font-semibold">50</span>
        </div>
      </div>

      {/* Riga 2: 1 box - Calendario */}
      <div className="glass-card p-6 shadow-md flex items-start gap-4 h-[180px]">
        <img src={calendarIcon} alt="Icona calendario" className="w-6 h-6 object-contain" />
        <div>
          <h3 className={`text-[14px] font-bold font-nunito ${textColor}`}>
            {t("dashboard.calendario")}
          </h3>
        </div>
      </div>

      {/* Riga 3: 3 box - con un div che li contiene tutti, e a seguire i singoli box-div  */}
      <div className="section-base grid-3">
        <div className={`flex gap-4 justify-start items-start p-6 glass-card ${textColor} h-[250px]`}>
          <img src={notificationsIcon} alt="Icona notifiche" className="w-6 h-6 object-contain" />
            <h3 className="text-[14px] font-bold font-nunito">{t("dashboard.notifiche")}</h3>
        </div>

        <div className={`flex gap-4 justify-start items-start p-6 glass-card ${textColor} h-[250px]`}>
          <img src={warehouseIcon} alt="Icona panoramica depositi" className="w-6 h-6 object-contain" />
            <h3 className="text-[14px] font-bold font-nunito">{t("dashboard.panoramicaDepositi")}</h3>
        </div>

        <div className={`flex gap-4 justify-start items-start p-6 glass-card ${textColor} h-[250px]`}>
          <img src={shoppingCartIcon} alt="Icona prodotti in esaurimento" className="w-6 h-6 object-contain" />
            <h3 className="text-[14px] font-bold font-nunito">{t("dashboard.prodottiInEsaurimento")}</h3>
        </div>
      </div>

    </div>
  );
};

export default BoardPage;
