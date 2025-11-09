import React, { useState } from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";

import openIcon from "../assets/icons/Open Envelope Clock.png";
import checkIcon from "../assets/icons/Instagram Check Mark.png";
import pendingIcon from "../assets/icons/Data Pending.png";
import errorIcon from "../assets/icons/Error.png";
import reportIcon from "../assets/icons/Report File.png";
import listIcon from "../assets/icons/List.png";
import personalIcon from "../assets/icons/Test Passed.png";
import webUsageState from "../hooks/webUsageState";

const TicketPage = () => {
  const { theme } = useTheme();
  const { t } = useLanguage();

  const [highlightedItem, setHighLightedItem] = useState(null);

  // ---- COLORI DINAMICI ----
  const textColor =
    theme === "dark"
      ? "text-[var(--text-dark)]"
      : "text-[var(--color-primary)]";
  const subTextColor = theme === "dark" ? "text-white" : "text-primary";

  // ---- ARRAY BOX RIASSUNTIVI ----
  const stats = [
    { label: t("ticketing.ticketAperti"), number: 0, icon: openIcon },
    { label: t("ticketing.ticketRisolti"), number: 11, icon: checkIcon },
    { label: t("ticketing.ticketInAttesa"), number: 22, icon: pendingIcon },
    { label: t("ticketing.ticketUrgenti"), number: 3, icon: errorIcon },
  ];

  // ---- DATI FITTIZI ----
  const recentTickets = ["Prova", "Prova", "Prova", "Prova", "Prova", "Prova", "Prova", "Prova"];
  const staffReplies = ["Prova", "Prova", "Prova", "Prova", "Prova", "Prova", "Prova", "Prova"];

  return (
    <div className="w-full  flex flex-col overflow-y-auto custom-scrollbar-invisible">
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
      <section className="grid-3 w-full section-base h-[480px]">
        {/* Report Ticket */}
        <div className={`card-base glass-card flex flex-col ${textColor}`}>
          <h2 className="font-semibold mb-3 flex items-center gap-2">
            <img
              src={reportIcon}
              alt="report icon"
              className="w-5 h-5 object-contain"
            />
            {t("ticketing.reportTicket")}
          </h2>
          <div className="flex-1 flex justify-center items-center">
            <PieChart
              {...webUsageState}
              highlightedItem={highlightedItem}
              onHighlightChange={setHighLightedItem}
              width={320}
              height={320}
            />
          </div>
        </div>

        {/* Ticket Recenti + Risposte Personale */}
        <div className="col-span-2 grid grid-rows-2 section-gap">
          {/* Ticket Recenti */}
          <div className={`card-base glass-card ${textColor}`}>
            <h2 className="font-semibold mb-3 flex items-center gap-2">
              <img
                src={listIcon}
                alt="list icon"
                className="w-5 h-5 object-contain"
              />
              {t("ticketing.ticketRecenti")}
            </h2>

            <div
              className={`flex flex-col h-[172px] overflow-y-auto pr-2 custom-scrollbar ${subTextColor}`}
            >
              {recentTickets.length > 0 ? (
                recentTickets.map((item, i) => (
                  <div
                    key={i}
                    className="col-span-1 bg-white/40 rounded-xl shadow p-2 mb-3 flex flex-col text-center"
                  >
                    {item}
                  </div>
                ))
              ) : (
                <p className="font-nunito text-center mt-4">
                  {t("ticketing.nessunTicket")}
                </p>
              )}
            </div>
          </div>

          {/* Risposte Personale */}
          <div className={`card-base glass-card ${textColor}`}>
            <h2 className="font-semibold mb-3 flex items-center gap-2">
              <img
                src={personalIcon}
                alt="persona icon"
                className="w-5 h-5 object-contain"
              />
              {t("ticketing.rispostePersonale")}
            </h2>

            <div
              className={`flex flex-col h-[172px] overflow-y-auto pr-2 custom-scrollbar ${subTextColor}`}
            >
              {staffReplies.length > 0 ? (
                staffReplies.map((item, i) => (
                  <div
                    key={i}
                    className="col-span-1 bg-white/40 rounded-xl shadow p-2 mb-3 flex flex-col text-center"
                  >
                    {item}
                  </div>
                ))
              ) : (
                <p className="font-nunito text-center mt-4">
                  {t("ticketing.nessunaRisposta")}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TicketPage;
