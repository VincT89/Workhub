import React, { useEffect, useState, useMemo, useRef } from "react";
import {
  ListMagnifyingGlass,
  Pencil,
  CalendarDots,
  UserList,
  Circle
} from "@phosphor-icons/react";
//Libreria per Grafico
import { LineChart } from "@mui/x-charts/LineChart";
//Libreria per calendario date
import { DateRangePicker } from "react-date-range";
import { addDays } from "date-fns";
// CSS Libreria del calendario
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

const TicketPageAdmin = () => {
  /* STATI PRINCIPALI*/
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);

  // highlightDate: data selezionata tramite grafico o lista
  const [highlightDate, setHighlightDate] = useState("");
  const itemRefs = useRef({});
  const [selectedUser, setSelectedUser] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  const [ticketStatus, setTicketStatus] = useState({});
  const [hiddenLines, setHiddenLines] = useState([]);

  const [state, setState] = useState([
    {
      // default range: ultimi 30 giorni fino ad oggi (inclusi)
      startDate: addDays(new Date(), -30),
      endDate: new Date(),
      key: "selection"
    }
  ]);

  /* CARICAMENTO DATI (FAKE API)*/
  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersRes = await fetch(
          "https://jsonplaceholder.typicode.com/users"
        );
        const usersData = await usersRes.json();

        const ticketsRes = await fetch(
          "https://jsonplaceholder.typicode.com/posts"
        );
        const posts = await ticketsRes.json();

        const formattedUsers = usersData.map((u, i) => ({
          id: u.id.toString(),
          nome: u.name.split(" ")[0],
          cognome: u.name.split(" ")[1] || "",
          ruolo: "Dipendente",
          email: u.email,
          avatar: `https://i.pravatar.cc/150?img=${i + 10}`
        }));

        const formattedTickets = posts.slice(0, 20).map((p, i) => ({
          id: p.id.toString(),
          title: p.title,
          description: p.body,
          user: formattedUsers[i % formattedUsers.length],
          date: new Date(
            Date.now() - Math.random() * 10 * 86400000
          ).toISOString()
        }));

        setUsers(formattedUsers);
        setTickets(formattedTickets);

        setTicketStatus(
          Object.fromEntries(formattedTickets.map((t) => [t.id, "aperto"]))
        );
      } catch (err) {
        console.error("API ERROR:", err);
      }
    };

    fetchData();
  }, []);

  /* FILTRAGGIO*/
  const formatDateVisible = (date) =>
    new Date(date).toLocaleDateString("it-IT", {
      day: "numeric",
      month: "short"
    });

  const filteredTickets = useMemo(() => {
    const start = state?.[0]?.startDate ? new Date(state[0].startDate) : null;
    const end = state?.[0]?.endDate ? new Date(state[0].endDate) : null;

    return tickets.filter((ticket) => {
      const ticketDate = new Date(ticket.date);

      const matchDate = (!start || ticketDate >= start) && (!end || ticketDate <= end);

      const matchUser = !selectedUser || ticket.user.id === selectedUser;

      const matchStatus = !selectedStatus || ticketStatus[ticket.id] === selectedStatus;

      return matchDate && matchUser && matchStatus;
    });
  }, [tickets, state, selectedUser, selectedStatus, ticketStatus]);

  /* DATA PER GRAFICO*/
  const lineChartData = useMemo(() => {
    const grouped = {};

    filteredTickets.forEach((t) => {
      const key = t.date.split("T")[0];

      if (!grouped[key])
        grouped[key] = { date: key, aperti: 0, risolti: 0, totale: 0 };

      const status = ticketStatus[t.id];

      if (status === "aperto") grouped[key].aperti++;
      if (status === "risolto") grouped[key].risolti++;

      grouped[key].totale++;
    });

    return Object.values(grouped);
  }, [filteredTickets, ticketStatus]);

  const totals = useMemo(() => {
    const t = { aperti: 0, risolti: 0, totale: 0 };
    lineChartData.forEach((d) => {
      t.aperti += d.aperti;
      t.risolti += d.risolti;
      t.totale += d.totale;
    });
    return t;
  }, [lineChartData]);

  const toggleLine = (key) => {
    setHiddenLines((prev) =>
      prev.includes(key)
        ? prev.filter((k) => k !== key)
        : [...prev, key]
    );
  };

  const getColor = (status) => {
    switch (status) {
      case "risolto":
        return "bg-[#FFD580] hover:bg-[#FFE8A0]";
      default:
        return "bg-[#A3B8E0] hover:bg-[#C3D2F0]";
    }
  };

  /* UI / RENDER*/

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 lg:px-16 xl:px-24">

      {/* LAYOUT DUE COLONNE (GRAFICO + LISTA)*/}
      <div className="flex flex-col lg:flex-row gap-6">

        {/* COLONNA SINISTRA: DATE + GRAFICO*/}
        <div className="w-full lg:w-1/2 flex flex-col gap-6 sticky top-6 h-fit">

          {/*  Date */}
                <div className="bg-white rounded-xl shadow p-4">
                <h2 className="font-bold text-xl mb-2 text-[#090c64] flex items-center gap-2">
                  <CalendarDots size={32} weight="duotone" />
                  Seleziona intervallo date
                </h2>

                <div className="border rounded-xl overflow-hidden">
                  <DateRangePicker
                  onChange={(item) => {
                    setState([item.selection]);
                    setHighlightDate("");
                  }}
                  showSelectionPreview={true}
                  moveRangeOnFirstSelection={false}
                  months={1}
                  ranges={state}
                  direction="horizontal"
                  />
                </div>
                </div>

                {/* Grafico */}
                <div className="bg-white rounded-xl shadow p-6">
                <h2 className="font-bold text-2xl mb-4 text-[#090c64]">
                  Andamento Ticket
                </h2>

                {/* Legenda */}
                <div className="flex flex-wrap gap-3 mb-6">
                  {["aperti", "risolti", "totale"].map(key => (
                  <button
                    key={key}
                    onClick={() => toggleLine(key)}
                    className={`px-4 py-1.5 rounded-full text-sm border shadow-sm transition ${hiddenLines.includes(key)
                    ? "opacity-40 bg-gray-100"
                    : "opacity-100 bg-white"
                    }`}
                  >
                    {key.charAt(0).toUpperCase() + key.slice(1)} ({totals[key]})
                  </button>
                  ))}
                </div>

                <LineChart
                  dataset={lineChartData}
                  xAxis={[{ dataKey: "date", scaleType: "band" }]}
                  yAxis={[{ valueFormatter: (v) => v.toString() }]}
                  series={[
                  { dataKey: "aperti", label: "Aperti", color: "#3B82F6" },
                  { dataKey: "risolti", label: "Risolti", color: "#F59E0B" },
                  { dataKey: "totale", label: "Totale", color: "#111" }
                  ].filter(s => !hiddenLines.includes(s.dataKey))}
                  height={500}
                  curve="monotoneX"
                  grid={{ vertical: false }}
                  tooltip={{
                  trigger: "item",
                  formatter: (item) => `${item.seriesLabel}: ${item.value}`,
                  }}
                  onPointClick={(point) => {
                const clickedDate = point.x;
                setHighlightDate(clickedDate);

                const ticketsOnDate = filteredTickets.filter(
                  (t) => t.date.split("T")[0] === clickedDate
                );

                if (ticketsOnDate.length > 0) {
                  // apri drawer sul primo ticket di quel giorno
                  setSelectedTicket(ticketsOnDate[0]);
                  setDrawerOpen(true);

                  // scroll alla card corrispondente nella lista
                  const el = itemRefs.current[ticketsOnDate[0].id];
                  if (el && el.scrollIntoView) {
                    el.scrollIntoView({ behavior: "smooth", block: "center" });
                  }
                }
              }}
            />

          </div>
        </div>

        {/* COLONNA DESTRA: LISTA TICKET*/}
        <div className="w-full lg:w-1/2 bg-white rounded-xl shadow p-6 h-fit sticky top-6">
          <h2 className="font-bold text-3xl mb-4 flex items-center gap-3 text-[#090c64]">
            <ListMagnifyingGlass
              size={32}
              color="#090c64"
              weight="duotone"
            />
            Ticket
          </h2>
          {/* FILTRI */}
          <div className="bg-white/40 backdrop-blur-md border border-white/50 rounded-xl p-4 mb-6 flex flex-col lg:flex-row gap-4">

            {/* ------------------- FILTRO UTENTE ------------------- */}
            <div className="flex flex-col w-full lg:w-2/4 relative">
              <label className="text-sm font-semibold text-gray-700 mb-1"></label>

              {/* Icona + Input */}
              <div className="relative mt-1">
                <UserList
                  size={32}
                  color="#090c64"
                  weight="duotone"
                  className="absolute left-3 top-1/2 -translate-y-1/2"
                />
                <input
                  type="text"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  placeholder="Cerca utente..."
                  className="w-full pl-16 pr-10 p-2 border rounded-lg bg-white text-gray-800 shadow-sm focus:ring focus:ring-blue-200 focus:outline-none"
                />
                {userSearch.length > 0 && (
                  <button
                    onClick={() => {
                      setUserSearch("");
                      setSelectedUser("");
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-800 hover:text-gray-600"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Lista filtrata */}
              {userSearch.length > 0 && (
                <div className="absolute top-full mt-1 w-full bg-white border rounded-lg shadow-md max-h-60 overflow-y-auto z-20">
                  {/* Tutti gli utenti */}
                  <div
                    onClick={() => { setSelectedUser(""); setUserSearch(""); }}
                    className="px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 cursor-pointer border-b"
                  >
                    Tutti gli utenti
                  </div>

                  {/* Nessun risultato */}
                  {users.filter(u =>
                    (u.nome + " " + u.cognome).toLowerCase().includes(userSearch.toLowerCase())
                  ).length === 0 && (
                      <div className="px-3 py-2 text-sm text-gray-500">
                        Nessun risultato
                      </div>
                    )}

                  {/* Lista risultati */}
                  {users.filter(u =>
                    (u.nome + " " + u.cognome).toLowerCase().includes(userSearch.toLowerCase())
                  ).map(u => (
                    <div
                      key={u.id}
                      onClick={() => {
                        setSelectedUser(u.id);
                        setUserSearch(`${u.nome} ${u.cognome}`);
                      }}
                      className="px-3 py-2 flex items-center gap-2 hover:bg-gray-100 cursor-pointer"
                    >
                      <img
                        src={u.avatar}
                        className="w-7 h-7 rounded-full border"
                        alt="avatar"
                      />
                      <span className="text-sm">{u.nome} {u.cognome}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ------------------- FILTRO STATO ------------------- */}
            <div className="flex flex-col w-full lg:w-1/4 relative">
              <label className="text-sm font-semibold text-gray-700 mb-1"></label>

              <Circle
                size={32}
                color="#090c64"
                weight="duotone"
                className="absolute left-3 top-1/2 -translate-y-1/2"
              />

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full pl-12 p-2 border rounded-lg bg-white text-gray-800 shadow-sm focus:ring focus:ring-blue-200 focus:outline-none"
              >
                <option value="">Tutti</option>
                <option value="aperto">Aperti</option>
                <option value="risolto">Risolti</option>
              </select>
            </div>
          </div>


          <div className="flex flex-col gap-4 max-h-[105vh] overflow-y-auto">
            {filteredTickets.map((ticket) => (
              <div
                key={ticket.id}
                ref={(el) => (itemRefs.current[ticket.id] = el)}
                className={`rounded-xl shadow p-4 flex flex-col cursor-pointer transition ${getColor(
                  ticketStatus[ticket.id]
                )} ${ticket.date.split("T")[0] === highlightDate ? 'ring-2 ring-blue-300' : ''}`}
                onClick={() => {
                  setSelectedTicket(ticket);
                  setHighlightDate(ticket.date.split("T")[0]);
                  setDrawerOpen(true);
                }}
              >
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-lg">
                    {ticket.title}
                  </span>
                  <Pencil
                    size={20}
                    color="#090c64"
                    weight="duotone"
                  />
                </div>

                <span className="text-sm text-gray-600 mt-1">
                  {ticket.user.nome} {ticket.user.cognome} •{" "}
                  {formatDateVisible(ticket.date)}
                </span>

                <p className="text-sm text-gray-700 mt-2">
                  {ticket.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* DRAWER LATERALE*/}
      <div
        className={`fixed inset-0 z-50 transition-all duration-300 ${drawerOpen
          ? "bg-black/40 visible"
          : "bg-transparent invisible"
          }`}
        onClick={() => setDrawerOpen(false)}
      >
        <div
          className={`absolute right-0 top-0 h-full w-80 bg-white shadow-xl p-6 transition-transform duration-300
          ${drawerOpen ? "translate-x-0" : "translate-x-full"}`}
          onClick={(e) => e.stopPropagation()}
        >
          {selectedTicket && (
            <>
              <h3 className="font-semibold text-xl mb-4">
                Dettagli Ticket
              </h3>

              <div className="flex flex-col gap-3 mb-4 p-2 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedTicket.user.avatar}
                    alt="Avatar"
                    className="w-12 h-12 rounded-full object-cover"
                  />

                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-800">
                      {selectedTicket.user.nome}{" "}
                      {selectedTicket.user.cognome}
                    </span>
                    <span className="text-sm text-gray-500">
                      {selectedTicket.user.ruolo}
                    </span>
                    <span className="text-sm text-gray-500">
                      {selectedTicket.user.email}
                    </span>
                  </div>
                </div>

                <div className="mt-2 p-2 bg-white rounded-lg border border-gray-200">
                  <span className="font-semibold text-gray-800">
                    Descrizione:
                  </span>
                  <p className="text-sm text-gray-700 mt-1">
                    {selectedTicket.description}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-2 mb-4">
                <div
                  className="p-2 flex justify-center items-center rounded-xl bg-[#A3B8E0]
                  border border-[#7A9CC6] cursor-pointer hover:bg-[#C3D2F0]"
                  onClick={() =>
                    setTicketStatus((s) => ({
                      ...s,
                      [selectedTicket.id]: "aperto"
                    }))
                  }
                >
                  Aperto
                </div>

                <div
                  className="p-2 flex justify-center items-center rounded-xl bg-[#FFD580]
                  border border-[#FFE8A0] cursor-pointer hover:bg-[#FFE8A0]"
                  onClick={() =>
                    setTicketStatus((s) => ({
                      ...s,
                      [selectedTicket.id]: "risolto"
                    }))
                  }
                >
                  Risolto
                </div>
              </div>

              <button
                onClick={() => setDrawerOpen(false)}
                className="w-full bg-gray-300 text-gray-800 py-2 rounded-lg hover:bg-gray-400"
              >
                Chiudi
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketPageAdmin;