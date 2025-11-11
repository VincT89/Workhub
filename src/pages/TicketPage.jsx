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
  const textColor = theme === "dark" ? "text-white" : "text-[#1C62A0]";
  const subTextColor = theme === "dark" ? "text-white" : "text-[#134a7b]";

  // ---- ARRAY BOX RIASSUNTIVI ----
  const stats = [
    { label: t("ticketing.ticketAperti"), number: 0, icon: openIcon },
    { label: t("ticketing.ticketRisolti"), number: 11, icon: checkIcon },
    { label: t("ticketing.ticketInAttesa"), number: 22, icon: pendingIcon },
    { label: t("ticketing.ticketUrgenti"), number: 3, icon: errorIcon },
  ];

  // ---- DATI FITTIZI ----
  const recentTickets = [
    "Prova",
    "Prova",
    "Prova",
    "Prova",
    "Prova",
    "Prova",
    "Prova",
    "Prova",
  ];
  const staffReplies = [
    "Prova",
    "Prova",
    "Prova",
    "Prova",
    "Prova",
    "Prova",
    "Prova",
    "Prova",
  ];

  return (
    <div
      className="w-full flex flex-col overflow-y-auto 
      [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
    >
      {/* --------- SEZIONE 1: BOX RIASSUNTIVI --------- */}
      <section className="grid grid-cols-4 gap-4 mb-6 w-full transition-colors duration-500">
        {stats.map((box, index) => (
          <div
            key={index}
            className={`flex items-center justify-between rounded-xl px-4 py-3 shadow 
              bg-[#fafafa20] dark:bg-[#fafafa30] backdrop-blur-sm 
              border border-white/30 dark:border-white/40 ${textColor}`}
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
      <section className="grid grid-cols-3 gap-6 w-full transition-colors duration-500 h-[480px]">
        {/* Report Ticket */}
        <div
          className={`p-4 rounded-xl shadow bg-[#fafafa20] dark:bg-[#fafafa30] 
          backdrop-blur-sm border border-white/30 dark:border-white/40 
          flex flex-col ${textColor}`}
        >
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
        <div className="col-span-2 grid grid-rows-2 gap-4">
          {/* Ticket Recenti */}
          <div
            className={`p-4 rounded-xl shadow bg-[#fafafa20] dark:bg-[#fafafa30] 
            backdrop-blur-sm border border-white/30 dark:border-white/40 ${textColor}`}
          >
            <h2 className="font-semibold mb-3 flex items-center gap-2">
              <img
                src={listIcon}
                alt="list icon"
                className="w-5 h-5 object-contain"
              />
              {t("ticketing.ticketRecenti")}
            </h2>

            <div
              className={`flex flex-col h-[172px] overflow-y-auto pr-2 ${subTextColor}
              scrollbar-thin scrollbar-thumb-[#1C62A0] scrollbar-track-transparent hover:scrollbar-thumb-[#155293]
              dark:scrollbar-thumb-white/50 dark:hover:scrollbar-thumb-[#1C62A0]`}
            >
              {recentTickets.length > 0 ? (
                recentTickets.map((item, i) => (
                  <div
                    key={i}
                    className="col-span-1 bg-white/40 dark:bg-[#fafafa30] 
                    rounded-xl shadow p-2 mb-3 flex flex-col text-center"
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
          <div
            className={`p-4 rounded-xl shadow bg-[#fafafa20] dark:bg-[#fafafa30] 
            backdrop-blur-sm border border-white/30 dark:border-white/40 ${textColor}`}
          >
            <h2 className="font-semibold mb-3 flex items-center gap-2">
              <img
                src={personalIcon}
                alt="persona icon"
                className="w-5 h-5 object-contain"
              />
              {t("ticketing.rispostePersonale")}
            </h2>

            <div
              className={`flex flex-col h-[172px] overflow-y-auto pr-2 ${subTextColor}
              scrollbar-thin scrollbar-thumb-[#1C62A0] scrollbar-track-transparent hover:scrollbar-thumb-[#155293]
              dark:scrollbar-thumb-white/50 dark:hover:scrollbar-thumb-[#1C62A0]`}
            >
              {staffReplies.length > 0 ? (
                staffReplies.map((item, i) => (
                  <div
                    key={i}
                    className="col-span-1 bg-white/40 dark:bg-[#fafafa30] 
                    rounded-xl shadow p-2 mb-3 flex flex-col text-center"
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
