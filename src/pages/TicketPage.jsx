import React from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import { desktopOS, valueFormatter } from "../hooks/webUsageState";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";

import openIcon from "../assets/icons/Open Envelope Clock.png";
import checkIcon from "../assets/icons/Instagram Check Mark.png";
import pendingIcon from "../assets/icons/Data Pending.png";
import errorIcon from "../assets/icons/Error.png";
import reportIcon from "../assets/icons/Report File.png";
import listIcon from "../assets/icons/List.png";
import personalIcon from "../assets/icons/Test Passed.png";

const TicketPage = () => {
  const { theme } = useTheme();
  const { t } = useLanguage();

  // ---- COLORI DINAMICI ----
  const textColor =
    theme === "dark" ? "text-(--text-dark)" : "text-primary";
  const subTextColor =
    theme === "dark" ? "text-gray-300" : "text-gray-600";

  // ---- ARRAY BOX RIASSUNTIVI ----
  const stats = [
    { label: t("ticketing.ticketAperti"), number: 0, icon: openIcon },
    { label: t("ticketing.ticketRisolti"), number: 11, icon: checkIcon },
    { label: t("ticketing.ticketInAttesa"), number: 22, icon: pendingIcon },
    { label: t("ticketing.ticketUrgenti"), number: 3, icon: errorIcon },
  ];

  return (
    <>
      <div className="w-full flex flex-col gap-8">
        {/* --------- SEZIONE 1: BOX RIASSUNTIVI --------- */}
        <section className="section-base grid-4">
          {stats.map((box, index) => (
            <div
              key={index}
              className={`widget-box glass-card ${textColor} justify-between`}
            >
              <div className="flex items-center gap-2">
                <img src={box.icon} alt={box.label} className="w-6 h-6" />
                <span className="font-bold">{box.label}</span>
              </div>
              <span className="text-sm opacity-70 leading-none font-semibold">
                {box.number}
              </span>
            </div>
          ))}
        </section>

        {/* --------- SEZIONE 2: CONTENUTO PRINCIPALE --------- */}
        <div className="flex flex-col items-center justify-center w-full section-content ">
          <section className="grid-3 w-full section-base h-[480px] ">
            
            {/* Report Ticket */}
            <div className={`card-base glass-card flex flex-col ${textColor}`}>
              <h2 className="font-semibold mb-3 flex-gap-2">
                <img
                  src={reportIcon}
                  alt="report icon"
                  className="w-5 h-5 object-contain"
                />
                {t("ticketing.reportTicket")}
              </h2>
              <div className="flex-1 flex-center">
                <PieChart
                  series={[{ data: desktopOS, valueFormatter }]}
                  width={180}
                  height={180}
                />
              </div>
            </div>

            {/* Ticket Recenti + Risposte */}
            <div className="col-span-2 grid grid-rows-2 section-gap">
              
              {/* Ticket Recenti */}
              <div className={`card-base glass-card ${textColor}`}>
                <h2 className="font-semibold mb-3 flex-gap-2">
                  <img
                    src={listIcon}
                    alt="list icon"
                    className="w-5 h-5 object-contain"
                  />
                  {t("ticketing.ticketRecenti")}
                </h2>
                <div className={`flex-center h-full ${subTextColor}`}>
                  <p className="font-nunito">{t("ticketing.nessunTicket")}</p>
                </div>
              </div>

              {/* Risposte Personale */}
              <div className={`card-base glass-card ${textColor}`}>
                <h2 className="font-semibold mb-3 flex-gap-2">
                  <img
                    src={personalIcon}
                    alt="persona icon"
                    className="w-5 h-5 object-contain"
                  />
                  {t("ticketing.rispostePersonale")}
                </h2>
                <div className={`flex-center h-full ${subTextColor}`}>
                  <p className="font-nunito">{t("ticketing.nessunaRisposta")}</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default TicketPage;
