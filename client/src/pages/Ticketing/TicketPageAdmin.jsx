import React, { useEffect, useState, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTickets, updateTicketAsync } from "../../store/feature/ticketSlice";
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

/**
 * ===== COMPONENTE: TicketPageAdmin =====
 * 
 * SCOPO: Pagina amministrativa per visualizzare e gestire TUTTI i ticket
 * 
 * FEATURES PRINCIPALI:
 * 1. GRAFICO: Mostra l'andamento dei ticket nel tempo (aperti, risolti, totale)
 * 2. CALENDARIO: Filtra i ticket per intervallo di date
 * 3. FILTRI: Per utente e per status
 * 4. LISTA INTERATTIVA: Click su ticket o grafico per aprire dettagli
 * 5. DRAWER: Pannello laterale per vedere dettagli e cambiare lo status
 * 
 * INTERATTIVITÀ:
 * - Click su punto del grafico → evidenzia quella data + apre drawer del primo ticket
 * - Click su ticket nella lista → apre drawer con dettagli
 * - Click su "Aperto"/"Risolto" nel drawer → aggiorna status sul server
 * 
 * SINCRONIZZAZIONE:
 * - Quando si aggiorna uno status, ricarica tutti i ticket
 * - Questo fa sì che anche TicketCreator veda i cambiamenti (stesso store Redux)
 */
const TicketPageAdmin = () => {
  /* ===== STATI PRINCIPALI =====*/
  const dispatch = useDispatch();
  
  // DATI DA REDUX (stato globale condiviso)
  const tickets = useSelector((state) => state.tickets.tickets);     // Array di tutti i ticket
  const users = useSelector((state) => state.tickets.users);         // Array di utenti
  const ticketsStatus = useSelector((state) => state.tickets.status); // "idle", "loading", ecc.
  const ticketsError = useSelector((state) => state.tickets.error);   // Messaggio di errore

  // STATI LOCALI (privati di questo componente)
  const [highlightDate, setHighlightDate] = useState(""); // Data evidenziata nel grafico
  const itemRefs = useRef({}); // Riferimenti agli elementi DOM per lo scroll
  const [selectedUser, setSelectedUser] = useState("");  // Utente selezionato nel filtro
  const [userSearch, setUserSearch] = useState("");     // Testo di ricerca utente
  const [selectedStatus, setSelectedStatus] = useState(""); // Status selezionato nel filtro

  const [drawerOpen, setDrawerOpen] = useState(false);   // Drawer aperto/chiuso
  const [selectedTicket, setSelectedTicket] = useState(null); // Ticket selezionato nel drawer

  // ticketStatus: mappa locale degli status (aperto/risolto) per ogni ticket
  // Serve per aggiornamenti ottimistici nell'UI
  const [ticketStatus, setTicketStatus] = useState({});
  const [hiddenLines, setHiddenLines] = useState([]); // Linee nascoste nel grafico

  // STATO: Intervallo di date selezionato
  // Default: ultimi 30 giorni fino ad oggi
  const [state, setState] = useState([
    {
      startDate: addDays(new Date(), -30), // 30 giorni fa
      endDate: new Date(),                 // Oggi
      key: "selection"
    }
  ]);

  /**
   * EFFETTO: Caricamento iniziale dei ticket
   * 
   * QUANDO SI ESEGUE: Solo se non ci sono ticket e lo status è "idle"
   * COSA FA: Chiama fetchTickets per caricare i dati dal server
   */
  useEffect(() => {
    if ((tickets?.length || 0) === 0 && ticketsStatus === "idle") {
      dispatch(fetchTickets());
    }
  }, [dispatch, tickets?.length, ticketsStatus]);

  /**
   * EFFETTO: Inizializza la mappa degli status
   * 
   * QUANDO SI ESEGUE: Ogni volta che l'array dei ticket cambia
   * COSA FA: Crea una mappa { ticketId: "aperto" | "risolto" }
   * PERCHÉ: Permette di gestire aggiornamenti ottimistici nell'UI
   */
  useEffect(() => {
    if (tickets && tickets.length > 0) {
      setTicketStatus(
        Object.fromEntries(
          tickets.map((t) => {
            const id = t._id || t.id;
            // Normalizza: "open" → "aperto", "closed" → "risolto"
            let s = t.status || "aperto";
            if (s === "open") s = "aperto";
            if (s === "closed") s = "risolto";
            return [id, s];
          })
        )
      );
    }
  }, [tickets]);

  /* ===== FUNZIONI DI UTILITÀ ===== */
  
  /**
   * FUNZIONE: formatDateVisible
   * Formatta una data in formato leggibile italiano (es: "12 dic")
   */
  const formatDateVisible = (date) =>
    new Date(date).toLocaleDateString("it-IT", {
      day: "numeric",
      month: "short"
    });

  /**
   * MEMO: filteredTickets
   * 
   * COSA SONO I MEMO?
   * useMemo "memorizza" il risultato di un calcolo costoso.
   * Il calcolo si riesegue solo quando cambiano le dipendenze.
   * 
   * QUESTA MEMO:
   * Filtra i ticket in base a:
   * 1. Intervallo di date selezionato
   * 2. Utente selezionato
   * 3. Status selezionato (aperto/risolto)
   * 
   * PERCHÉ USARE MEMO?
   * Evita di ricalcolare il filtro ad ogni render, migliorando le performance
   */
  const filteredTickets = useMemo(() => {
    const start = state?.[0]?.startDate ? new Date(state[0].startDate) : null;
    const end = state?.[0]?.endDate ? new Date(state[0].endDate) : null;

    return tickets.filter((ticket) => {
      // FILTRO 1: Data del ticket
      const rawDate = ticket.date || ticket.createdAt || ticket.updatedAt;
      const ticketDate = new Date(rawDate);
      const matchDate = (!start || ticketDate >= start) && (!end || ticketDate <= end);

      // FILTRO 2: Utente
      const ticketUserId = ticket.user?._id || ticket.user?.id || ticket.user;
      const matchUser = !selectedUser || ticketUserId === selectedUser;

      // FILTRO 3: Status
      const tid = ticket._id || ticket.id;
      const matchStatus = !selectedStatus || ticketStatus[tid] === selectedStatus;

      // Il ticket passa se soddisfa TUTTI i filtri
      return matchDate && matchUser && matchStatus;
    });
  }, [tickets, state, selectedUser, selectedStatus, ticketStatus]);

  /**
   * MEMO: lineChartData
   * 
   * COSA FA: Prepara i dati per il grafico LineChart
   * 
   * PROCESSO:
   * 1. Raggruppa i ticket per data (YYYY-MM-DD)
   * 2. Per ogni data, conta quanti ticket sono aperti, risolti e il totale
   * 3. Ritorna un array di oggetti { date, aperti, risolti, totale }
   * 
   * ESEMPIO OUTPUT:
   * [
   *   { date: "2025-12-01", aperti: 5, risolti: 3, totale: 8 },
   *   { date: "2025-12-02", aperti: 7, risolti: 2, totale: 9 },
   *   ...
   * ]
   */
  const lineChartData = useMemo(() => {
    const grouped = {}; // Oggetto per raggruppare: { "2025-12-01": { aperti: 5, ... } }

    filteredTickets.forEach((t) => {
      // Estrai la data in formato YYYY-MM-DD
      const rawDate = t.date || t.createdAt || t.updatedAt || new Date().toISOString();
      const key = rawDate.split("T")[0]; // "2025-12-01T10:30:00" → "2025-12-01"

      // Inizializza l'oggetto per questa data se non esiste
      if (!grouped[key])
        grouped[key] = { date: key, aperti: 0, risolti: 0, totale: 0 };

      // Incrementa i contatori in base allo status
      const tid = t._id || t.id;
      const status = ticketStatus[tid];

      if (status === "aperto") grouped[key].aperti++;
      if (status === "risolto") grouped[key].risolti++;

      grouped[key].totale++;
    });

    // Converti l'oggetto in array: { "2025-12-01": {...} } → [ {...}, {...} ]
    return Object.values(grouped);
  }, [filteredTickets, ticketStatus]);

  /**
   * MEMO: totals
   * Calcola i totali globali (somma di tutti i giorni) per la legenda
   */
  const totals = useMemo(() => {
    const t = { aperti: 0, risolti: 0, totale: 0 };
    lineChartData.forEach((d) => {
      t.aperti += d.aperti;
      t.risolti += d.risolti;
      t.totale += d.totale;
    });
    return t;
  }, [lineChartData]);

  /**
   * FUNZIONE: toggleLine
   * Nasconde/mostra una linea nel grafico
   * (es: nascondere la linea "totale" per vedere meglio aperti/risolti)
   */
  const toggleLine = (key) => {
    setHiddenLines((prev) =>
      prev.includes(key)
        ? prev.filter((k) => k !== key) // Rimuovi dalla lista (mostra)
        : [...prev, key]                // Aggiungi alla lista (nascondi)
    );
  };

  /**
   * FUNZIONE: getColor
   * Ritorna le classi CSS per colorare una card in base allo status
   * - "risolto" → giallo (#FFD580)
   * - "aperto" (default) → blu (#A3B8E0)
   */
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

      {/* ERROR BANNER */}
      {ticketsError && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-start justify-between">
          <div>
            <h3 className="font-bold">Errore nel caricamento</h3>
            <p className="text-sm mt-1">{ticketsError}</p>
          </div>
          <button
            onClick={() => dispatch(fetchTickets())}
            className="ml-4 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
          >
            Riprova
          </button>
        </div>
      )}

      {/* LOADING STATE */}
      {ticketsStatus === "loading" && tickets.length === 0 && (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#090c64]"></div>
            <p className="mt-4 text-gray-600">Caricamento ticket...</p>
          </div>
        </div>
      )}

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
        <div className="w-full lg:w-1/2 bg-white rounded-xl shadow p-6 sticky top-6 h-[1190px]">
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
                ref={(el) => (itemRefs.current[ticket._id || ticket.id] = el)}
                className={`rounded-xl shadow p-4 flex flex-col cursor-pointer transition ${getColor(
                  ticketStatus[ticket._id || ticket.id]
                )} ${(ticket.date || ticket.createdAt || ticket.updatedAt).split("T")[0] === highlightDate ? 'ring-2 ring-blue-300' : ''}`}
                onClick={() => {
                  setSelectedTicket(ticket);
                  setHighlightDate((ticket.date || ticket.createdAt || ticket.updatedAt).split("T")[0]);
                  setDrawerOpen(true);
                }}
              >
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-lg">
                    {ticket.title || ticket.name}
                  </span>
                  <Pencil
                    size={20}
                    color="#090c64"
                    weight="duotone"
                  />
                </div>

                <span className="text-sm text-gray-600 mt-1">
                  {ticket.user?.nome || ticket.user?.firstName || ticket.user?.name} {ticket.user?.cognome || ticket.user?.lastName || ''} •{" "}
                  {formatDateVisible(ticket.date || ticket.createdAt)}
                </span>

                <p className="text-sm text-gray-700 mt-2">
                  {ticket.description || ticket.content}
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
                    src={selectedTicket.user?.avatar}
                    alt="Avatar"
                    className="w-12 h-12 rounded-full object-cover"
                  />

                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-800">
                      {selectedTicket.user?.nome || selectedTicket.user?.firstName || selectedTicket.user?.name}{" "}
                      {selectedTicket.user?.cognome || selectedTicket.user?.lastName || ''}
                    </span>
                    <span className="text-sm text-gray-500">
                      {selectedTicket.user?.ruolo || selectedTicket.user?.role}
                    </span>
                    <span className="text-sm text-gray-500">
                      {selectedTicket.user?.email}
                    </span>
                  </div>
                </div>

                <div className="mt-2 p-2 bg-white rounded-lg border border-gray-200">
                  <span className="font-semibold text-gray-800">
                    Descrizione:
                  </span>
                  <p className="text-sm text-gray-700 mt-1">
                    {selectedTicket.description || selectedTicket.content}
                  </p>
                </div>
              </div>

              {/* AZIONI: Pulsanti per cambiare lo status del ticket */}
              <div className="flex flex-col gap-2 mb-4">
                {/* PULSANTE: Segna come APERTO */}
                <div
                  className="p-2 flex justify-center items-center rounded-xl bg-[#A3B8E0]
                  border border-[#7A9CC6] cursor-pointer hover:bg-[#C3D2F0]"
                  onClick={async () => {
                    const id = selectedTicket._id || selectedTicket.id;
                    if (!id) return;
                    
                    // 1. AGGIORNAMENTO OTTIMISTICO: cambia subito l'UI
                    setTicketStatus((s) => ({ ...s, [id]: "aperto" }));
                    
                    try {
                      // 2. AGGIORNA SUL SERVER: invia richiesta PUT
                      await dispatch(updateTicketAsync({ id, payload: { status: 'open' } })).unwrap();
                      
                      // 3. RICARICA TUTTI I TICKET: così anche TicketCreator vede il cambiamento
                      dispatch(fetchTickets());
                    } catch (err) {
                      // 4. SE FALLISCE: ripristina lo stato precedente
                      setTicketStatus((s) => ({ ...s, [id]: "risolto" }));
                      console.error('Update ticket failed', err);
                    }
                  }}
                >
                  Aperto
                </div>

                {/* PULSANTE: Segna come RISOLTO */}
                <div
                  className="p-2 flex justify-center items-center rounded-xl bg-[#FFD580]
                  border border-[#FFE8A0] cursor-pointer hover:bg-[#FFE8A0]"
                  onClick={async () => {
                    const id = selectedTicket._id || selectedTicket.id;
                    if (!id) return;
                    
                    setTicketStatus((s) => ({ ...s, [id]: "risolto" }));
                    
                    try {
                      await dispatch(updateTicketAsync({ id, payload: { status: 'closed' } })).unwrap();
                      dispatch(fetchTickets()); // Sincronizza con altri componenti
                    } catch (err) {
                      setTicketStatus((s) => ({ ...s, [id]: "aperto" }));
                      console.error('Update ticket failed', err);
                    }
                  }}
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