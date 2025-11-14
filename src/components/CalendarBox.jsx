import React, { useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { it } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";

import { useTheme } from "../context/ThemeContext";
import { EmployeeList } from "../pages/Employee/admin/AdminEmployeePage.jsx";

/* === LOCALIZZAZIONE === */
const locales = { it };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { locale: it }),
  getDay,
  locales,
});

/* === UTILITIES === */

// Iniziali da "Nome Cognome" → "NC"
const getInitials = (name) => {
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

// Colore deterministico per ruolo
const getRoleColor = (ruolo) => {
  let hash = 0;
  for (let i = 0; i < ruolo.length; i++) {
    hash = ruolo.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 65%, 45%)`;
};

// Mappa giorni in indice settimana JS
const weekMap = {
  Lunedì: 1,
  Martedì: 2,
  Mercoledì: 3,
  Giovedì: 4,
  Venerdì: 5,
  Sabato: 6,
  Domenica: 0,
};

const CalendarBox = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const today = new Date();
  const todayWeekday = today.getDay();

  /* === STATO: evento espanso === */
  const [expandedId, setExpandedId] = useState(null);

  const toggleEvent = (event) => {
    setExpandedId((prev) => (prev === event.id ? null : event.id));
  };

  /* === COSTRUZIONE EVENTI DA EmployeeList === */
  const eventi = [];

  EmployeeList.forEach((dip) => {
    (dip.turni || []).forEach((turno) => {
      const weekday = weekMap[turno.giorno];
      if (weekday === undefined) return;

      const baseDay = new Date(today);
      const diff = weekday - todayWeekday;
      baseDay.setDate(today.getDate() + diff);

      (turno.orari || []).forEach((orario, index) => {
        const [startStr, endStr] = orario.split("-").map((s) => s.trim());
        const [sh, sm] = startStr.split(":").map(Number);
        const [eh, em] = endStr.split(":").map(Number);

        const start = new Date(baseDay);
        start.setHours(sh || 0, sm || 0, 0, 0);

        const end = new Date(baseDay);
        end.setHours(eh || 0, em || 0, 0, 0);

        // qui NON gestisco ancora "dopo mezzanotte" apposta, per non rompere nulla
        // se vuoi gestirli, ti dico sotto cosa aggiungere

        eventi.push({
          id: `${dip.matricola}-${turno.giorno}-${index}`,
          title: getInitials(dip.nome),
          fullName: dip.nome,
          ruolo: dip.ruolo,
          orario,
          start,
          end,
          color: getRoleColor(dip.ruolo),
        });
      });
    });
  });

  /* === STILE EVENTO (ingrandisce ma non sballa il layout) === */
  const eventStyleGetter = (event) => {
    const expanded = expandedId === event.id;

    return {
      style: {
        backgroundColor: event.color,
        color: "white",
        borderRadius: "12px",
        padding: expanded ? "10px 10px" : "4px 6px",
        fontFamily: "Nunito",
        fontWeight: 600,
        fontSize: expanded ? "13px" : "11px",
        border: "none",
        display: "flex",
        alignItems: "center",
        gap: "6px",

        // resta nella cella del calendario
        width: "100%",
        height: "100%",
        position: "relative",

        // zoom leggero + leggibile
        transform: expanded ? "scale(1.12)" : "scale(1)",
        transformOrigin: "center",
        transition:
          "transform 0.18s ease, box-shadow 0.18s ease, padding 0.18s ease, font-size 0.18s ease",

        // viene davanti se ci sono più eventi
        zIndex: expanded ? 10 : 1,
        overflow: "visible",
        boxShadow: expanded
          ? "0 4px 12px rgba(0,0,0,0.25)"
          : "none",
      },
    };
  };

  /* === COMPONENTE EVENTO === */
  const EventComponent = ({ event }) => {
    const expanded = expandedId === event.id;

    return (
      <div className="flex flex-col gap-1 pointer-events-auto select-none">
        {/* Riga avatar + nome */}
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-bold"
            style={{ backgroundColor: "rgba(0,0,0,0.25)" }}
          >
            {event.title}
          </div>
          <span className="font-semibold truncate">{event.fullName}</span>
        </div>

        {/* Dettagli extra solo se espanso */}
        {expanded && (
          <div className="mt-1 text-[11px] leading-tight">
            <div className="italic opacity-90 truncate">{event.ruolo}</div>
            <div className="opacity-80">{event.orario}</div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full flex justify-center">
      <div className="w-full mt-5 mr-6 h-full relative">
        <Calendar
          localizer={localizer}
          events={eventi}
          startAccessor="start"
          endAccessor="end"
          defaultView="week"
          views={["day", "week"]}
          culture="it"
          eventPropGetter={eventStyleGetter}
          components={{ event: EventComponent }}
          onSelectEvent={toggleEvent}
          // altezza fissa per non "tagliare" gli slot alti verso le 23
          style={{ height: 600 }}
          className={isDark ? "text-white" : "text-[#090c64]"}
        />
      </div>
    </div>
  );
};

export default CalendarBox;
