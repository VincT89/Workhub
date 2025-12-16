import React, { useEffect, useState, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTickets, updateTicketAsync } from "../../store/feature/ticketSlice";
import {
  ListMagnifyingGlassIcon,
  PencilIcon,
  CalendarDotsIcon,
  UserListIcon,
  CircleIcon,
  UserCircleIcon 
} from "@phosphor-icons/react";
import bgLight from "../../assets/bg/bg.jpg";
import bgDark from "../../assets/bg/bgScuro.jpg";
import { useLanguage } from '../../context/LanguageContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
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
	const { t } = useLanguage(); // Funzione di traduzione
	const { theme } = useTheme(); // Tema corrente ("light" o "dark")
  
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
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false); // Dropdown status aperto/chiuso

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

  // STATO: Modal del calendario aperto/chiuso
  const [calendarModalOpen, setCalendarModalOpen] = useState(false);

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


  /* ho deciso di non usarla più perché il codice è ora inline nella mappa dei ticket
  
    const getColor = (status) => {
    switch (status) {
      case "risolto":
        return "bg-[#FFD580] hover:bg-[#FFE8A0]";
      default:
        return "bg-[#A3B8E0] hover:bg-[#C3D2F0]";
    }
  }; */

  /* UI / RENDER*/

  return (
    <div class="p-6 flex flex-col gap-4 h-full">
      {/* ===== NAVBAR FILTRI ===== 
       * 
       * Barra di navigazione principale che contiene tutti i filtri per la ricerca ticket:
       * - Input ricerca utente con dropdown autocomplete
       * - Filtro per status (Tutti/Aperti/Risolti)
       * - Bottone per aprire il calendario per la selezione date
       * 
       * Design: glassmorphism con sfondo semi-trasparente e sfocatura
       */}
      <nav className="bg-white/30 backdrop-blur-md border border-white/90 rounded-xl shadow-lg p-4 mb-4 relative z-50">
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          {/* ===== TITOLO DELLA PAGINA ===== 
           * Mostra l'icona e il titolo "Ticket" tradotto
           */}
          <div className="flex items-center gap-3 lg:w-1/4">
            <ListMagnifyingGlassIcon size={32} weight="duotone" color={theme === "dark" ? "white" : "#090c64"} />
            <h1 className="font-bold text-xl">{t("ticket")}</h1>
          </div>

          {/* ===== BOTTONE CALENDARIO ===== 
           * 
           * Apre un modal con il DateRangePicker per selezionare un intervallo di date
           * I ticket vengono filtrati in base all'intervallo selezionato
           * 
           * RESPONSIVE: Mostra il testo completo su desktop, solo "Date" su mobile
           */}
          <button
            onClick={() => setCalendarModalOpen(true)}
            className="lg:w-auto px-5 py-2.5 bg-[#090c64] text-white rounded-lg shadow-md hover:bg-[#0a0d7a] transition-all flex items-center gap-2 font-semibold custom-button"
          >
            <CalendarDotsIcon size={24} weight="duotone"/>
            <span className="hidden lg:inline">{t("selezionaIntervalloData")}</span>
            <span className="lg:hidden">Date</span>
          </button>

          {/* ===== INPUT RICERCA UTENTE ===== 
           * 
           * Campo di testo per cercare gli utenti che hanno creato ticket
           * 
           * FUNZIONAMENTO:
           * 1. L'utente digita nel campo di testo
           * 2. Appare un dropdown con i risultati filtrati
           * 3. Click su un risultato: filtra i ticket di quell'utente
           * 4. Click sulla X: resetta la ricerca e mostra tutti gli utenti
           * 
           * FILTRAGGIO: Case-insensitive, cerca nel nome e cognome completo
           */}
          <div className="flex-1 relative">
            {/* Icona utente posizionata a sinistra dell'input */}
            <UserListIcon
              size={24}
              weight="duotone"
              color={theme === "dark" ? "white" : "#090c64"}
              className="absolute left-3 top-1/2 -translate-y-1/2"
            />
            
            {/* Campo input per digitare il nome utente */}
            <input
              type="text"
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              placeholder={t("cercaUtente")}
              className="w-full pl-12 pr-10 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-800 shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none transition-all cursor-pointer text-left"
            />
            
            {/* Pulsante X per cancellare la ricerca (visibile solo se c'è testo) */}
            {userSearch.length > 0 && (
              <button
                onClick={() => {
                  setUserSearch("");
                  setSelectedUser("");
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 font-bold"
              >
                ✕
              </button>
            )}
            
            {/* ===== DROPDOWN RISULTATI RICERCA ===== 
             * Appare solo quando l'utente ha digitato qualcosa
             * Mostra una lista filtrata di utenti che corrispondono alla ricerca
             */}
            {userSearch.length > 0 && (
              <div className="absolute top-full mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto z-100">
                {/* Opzione "Tutti gli utenti" per resettare il filtro */}
                <div
                  onClick={() => { setSelectedUser(""); setUserSearch(""); }}
                  className="px-4 py-3 text-sm text-gray-600 hover:bg-blue-50 cursor-pointer border-b transition-colors"
                >
                  {t("tuttiUtenti")}
                </div>

                {/* Messaggio quando non ci sono risultati */}
                {users.filter(u => {
                  const firstName = u.nome || u.firstName || u.name || '';
                  const lastName = u.cognome || u.lastName || '';
                  const fullName = `${firstName} ${lastName}`.toLowerCase();
                  return fullName.includes(userSearch.toLowerCase());
                }).length === 0 && (
                  <div className="px-4 py-3 text-sm text-gray-500">
                    Nessun risultato
                  </div>
                )}

                {/* Lista utenti filtrati - Mappa ogni utente che corrisponde alla ricerca */}
                {users.filter(u => {
                  const firstName = u.nome || u.firstName || u.name || '';
                  const lastName = u.cognome || u.lastName || '';
                  const fullName = `${firstName} ${lastName}`.toLowerCase();
                  return fullName.includes(userSearch.toLowerCase());
                }).map(u => {
                  const userId = u._id || u.id;
                  const firstName = u.nome || u.firstName || u.name || '';
                  const lastName = u.cognome || u.lastName || '';
                  
                  return (
                    <div
                      key={userId}
                      onClick={() => {
                        setSelectedUser(userId);
                        setUserSearch(`${firstName} ${lastName}`);
                      }}
                      className="px-4 py-3 flex items-center gap-3 hover:bg-blue-50 cursor-pointer transition-colors"
                    >
                      <UserCircleIcon size={28} color={theme === "dark" ? "white" : "#090c64"} weight="duotone" />
                      <span className="text-sm text-gray-800">{firstName} {lastName}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ===== FILTRO STATUS ===== 
           * 
           * Dropdown personalizzato per filtrare i ticket per status
           * 
           * OPZIONI:
           * - Tutti: mostra tutti i ticket (nessun filtro)
           * - Aperti: mostra solo ticket con status "aperto"
           * - Risolti: mostra solo ticket con status "risolto"
           * 
           * IMPLEMENTAZIONE: Usa un button invece di <select> per avere più controllo sullo stile
           */}
          <div className="lg:w-48 relative">
            {/* Icona cerchio a sinistra */}
            <CircleIcon
              size={24}
              color="#090c64"
              weight="duotone"
              className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10"
            />
            
            {/* Button che mostra lo status attualmente selezionato */}
            <button
              onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
              className="w-full pl-12 pr-10 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-800 shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none transition-all cursor-pointer text-left"
            >
              {selectedStatus === "" && t("tutti")}
              {selectedStatus === "aperto" && t("aperti")}
              {selectedStatus === "risolto" && t("risolti")}
            </button>
            
            {/* Freccia che indica se il dropdown è aperto/chiuso */}
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
              {statusDropdownOpen ? "▲" : "▼"}
            </span>

            {/* ===== DROPDOWN OPZIONI STATUS ===== 
             * Appare quando l'utente clicca sul button
             * Mostra le 3 opzioni con icone colorate
             */}
            {statusDropdownOpen && (
              <div className="absolute top-full mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-100">
                <div
                  onClick={() => {
                    setSelectedStatus("");
                    setStatusDropdownOpen(false);
                  }}
                  className="px-4 py-3 text-sm text-gray-800 hover:bg-blue-50 cursor-pointer transition-colors flex items-center gap-3"
                >
                  <CircleIcon size={20} color="#090c64" weight="duotone" />
                  {t("tutti")}
                </div>
                <div
                  onClick={() => {
                    setSelectedStatus("aperto");
                    setStatusDropdownOpen(false);
                  }}
                  className="px-4 py-3 text-sm text-gray-800 hover:bg-blue-50 cursor-pointer transition-colors flex items-center gap-3"
                >
                  <CircleIcon size={20} color="#3B82F6" weight="fill" />
                  {t("aperti")}
                </div>
                <div
                  onClick={() => {
                    setSelectedStatus("risolto");
                    setStatusDropdownOpen(false);
                  }}
                  className="px-4 py-3 text-sm text-gray-800 hover:bg-blue-50 cursor-pointer transition-colors flex items-center gap-3"
                >
                  <CircleIcon size={20} color="#F59E0B" weight="fill" />
                  {t("risolti")}
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* ===== MODAL CALENDARIO ===== 
       * 
       * Modal centrato che appare quando l'utente clicca sul bottone calendario
       * 
       * CONTENUTO:
       * - DateRangePicker: calendario interattivo per selezionare intervallo di date
       * - Bottone Applica: chiude il modal e applica il filtro
       * - Bottone X: chiude il modal senza applicare modifiche
       * 
       * INTERAZIONE: Click sull'overlay scuro chiude il modal
       */}
      {calendarModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setCalendarModalOpen(false)}
          />
          <div 
            className="relative rounded-2xl shadow-2xl p-6 max-w-fit z-10"
            style={{ backgroundColor: theme === 'dark' ? '#1a1a2e' : '#ffffff' }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 
                className="font-bold text-xl flex items-center gap-2"
                style={{ color: theme === 'dark' ? '#ffffff' : '#090c64' }}
              >
                <CalendarDotsIcon size={28} color={theme === 'dark' ? 'white' : '#090c64'} weight="duotone" />
                {t("selezionaIntervalloData")}
              </h2>
              <button
                onClick={() => setCalendarModalOpen(false)}
                className="font-bold text-2xl leading-none"
                style={{ color: theme === 'dark' ? '#d1d5db' : '#6b7280' }}
              >
                ✕
              </button>
            </div>
            <div 
              className="border rounded-xl overflow-hidden"
              style={{ borderColor: theme === 'dark' ? '#374151' : '#e5e7eb' }}
            >
              <DateRangePicker
                onChange={(item) => {
                  setState([item.selection]);
                  setHighlightDate("");
                }}
                showSelectionPreview={true}
                moveRangeOnFirstSelection={false}
                months={2}
                ranges={state}
                direction="horizontal"
              />
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setCalendarModalOpen(false)}
                className="px-6 py-2 rounded-lg transition-all font-semibold"
                style={{ 
                  backgroundColor: theme === 'dark' ? '#4d4368' : '#090c64',
                  color: '#ffffff'
                }}
              >
                Applica
              </button>
            </div>
          </div>
        </div>
      )}

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
            {t("riprova")}
          </button>
        </div>
      )}

      {/* LOADING STATE */}
      {ticketsStatus === "loading" && tickets.length === 0 && (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#090c64]"></div>
            <p className="mt-4 text-gray-600">{t("caricamentoTicket")}</p>
          </div>
        </div>
      )}

      {/* ===== LAYOUT DUE COLONNE (GRAFICO + LISTA) ===== 
       * 
       * Layout principale diviso in due colonne:
       * - SINISTRA (60%): Grafico con l'andamento dei ticket nel tempo
       * - DESTRA (40%): Lista dei ticket filtrati
       * 
       * RESPONSIVE: Su mobile le colonne diventano una sotto l'altra
       */}
      <div className="flex flex-col lg:flex-row gap-6">

        {/* ===== COLONNA SINISTRA: GRAFICO ===== 
         * 
         * Mostra un LineChart con 3 linee:
         * - Aperti (blu)
         * - Risolti (arancione)
         * - Totale (nero)
         * 
         * INTERATTIVITÀ:
         * - Click sui bottoni della legenda: nasconde/mostra le linee
         * - Click su un punto del grafico: evidenzia quella data e apre il drawer del primo ticket
         * 
         * STICKY: Rimane visibile quando si scrolla
         */}
        <div className="w-full lg:w-3/5 flex flex-col gap-6 rounded-xl sticky top-6 h-fit" style={{ backgroundColor: theme === 'dark' ? '#4d4368' : 'transparent' }}>

          <div className="p-6 flex flex-col gap-4 rounded-xl border border-white/90 shadow-md backdrop-blur-sm h-[750px]">
                <h2 className="font-bold text-2xl mb-4 text-[#090c64]">
                  {t("andamentoTicket")}
                </h2>

                {/* ===== LEGENDA INTERATTIVA ===== 
                 * 
                 * Bottoni per nascondere/mostrare le linee del grafico
                 * Ogni bottone mostra il nome della linea e il totale tra parentesi
                 * 
                 * STATO: I bottoni diventano opachi quando la linea è nascosta
                 */}
                <div className="flex flex-wrap gap-3 mb-6">
                  {["aperti", "risolti", "totale"].map(key => (
                  <button
                    key={key}
                    onClick={() => toggleLine(key)}
                    className={`px-4 py-1.5 rounded-xl font-bold text-[#090c64] text-sm border shadow-sm transition ${hiddenLines.includes(key)
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
                  xAxis={[{ 
                    dataKey: "date", 
                    scaleType: "band",
                    valueFormatter: (value) => {
                      const date = new Date(value);
                      const mesi = ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'];
                      const giorno = date.getDate();
                      const mese = mesi[date.getMonth()];
                      const anno = date.getFullYear().toString().slice(-2);
                      return `${giorno} ${mese} ${anno}`;
                    },
                    tickLabelStyle: {
                      fill: theme === 'dark' ? '#ffffff' : '#000000',
                      fontSize: 12
                    }
                  }]}
                  yAxis={[{ 
                    valueFormatter: (v) => v.toString(),
                    tickLabelStyle: {
                      fill: theme === 'dark' ? '#ffffff' : '#000000',
                      fontSize: 12
                    }
                  }]}
                  series={[
                  { dataKey: "aperti", label: t("aperti"), color: "#3B82F6" },
                  { dataKey: "risolti", label: t("risolti"), color: "#F59E0B" },
                  { dataKey: "totale", label: t("totale"), color: theme === 'dark' ? '#ffffff' : '#111' }
                  ].filter(s => !hiddenLines.includes(s.dataKey))}
                  height={500}
                  curve="monotoneX"
                  grid={{ vertical: false }}
                  tooltip={{
                  trigger: "item",
                  formatter: (item) => `${item.seriesLabel}: ${item.value}`,
                  }}
                  slotProps={{
                    tooltip: {
                      sx: {
                        backgroundColor: theme === 'dark' ? '#4d4368 !important' : '#ffffff !important',
                        color: theme === 'dark' ? '#ffffff !important' : '#4d4368 !important',
                        border: `1px solid ${theme === 'dark' ? '#4d4368' : '#e5e7eb'}`,
                        borderRadius: '8px',
                        fontSize: '14px',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
                      }
                    }
                  }}
                  sx={{
                    backgroundColor: theme === 'dark' ? '#4d4368' : 'transparent',
                    '.MuiChartsAxis-line': {
                      stroke: theme === 'dark' ? '#ffffff' : '#000000',
                    },
                    '.MuiChartsAxis-tick': {
                      stroke: theme === 'dark' ? '#ffffff' : '#000000',
                    },
                    '.MuiChartsLegend-label': {
                      fill: theme === 'dark' ? '#ffffff !important' : '#000000 !important',
                    },
                    '.MuiChartsLegend-series text': {
                      fill: theme === 'dark' ? '#ffffff !important' : '#000000 !important',
                    }
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

        {/* ===== COLONNA DESTRA: LISTA TICKET ===== 
         * 
         * Lista scrollabile dei ticket filtrati in base ai criteri selezionati:
         * - Intervallo di date (dal calendario)
         * - Utente (dalla ricerca)
         * - Status (dal dropdown)
         * 
         * VISUALIZZAZIONE: Ogni ticket mostra:
         * - Titolo
         * - Nome utente e data di creazione
         * - Descrizione (troncata a 2 righe)
         * - Badge colorato con lo status (Aperto/Risolto)
         * - Icona matita per indicare che è modificabile
         * 
         * INTERATTIVITÀ:
         * - Click su un ticket: apre il drawer con i dettagli completi
         * - I ticket evidenziati (dal click sul grafico) hanno un bordo blu
         * 
         * STILE: Coerente con TicketCreator.jsx
         */}
        <div className="w-full lg:w-2/5 p-6 flex flex-col gap-4 rounded-xl border border-white/90 shadow-md backdrop-blur-sm sticky top-6 h-[750px] " style={{ backgroundColor: theme === 'dark' ? '#4d4368' : 'transparent' }}>
          <h2 className="font-bold text-2xl mb-4 flex items-center gap-3 text-[#090c64]">
            <ListMagnifyingGlassIcon
              size={28}
              weight="duotone"
            />
            Lista {t("ticket")}
          </h2>

          {/* Container scrollabile con la lista dei ticket */}
          <div className="flex flex-col gap-2 max-h-[105vh] overflow-y-auto">
            {/* Mappa ogni ticket filtrato in una card */}
            {filteredTickets.map((ticket) => {
              // Estrai l'ID del ticket (supporta sia _id che id)
              const tid = ticket._id || ticket.id;
              
              // Determina lo status del ticket dalla mappa locale
              const status = ticketStatus[tid];
              
              // Crea la label leggibile dello status
              const statusLabel = status === 'aperto' ? 'Aperto' : status === 'risolto' ? 'Risolto' : status;
              
              // Classi CSS per colorare il badge dello status:
              // - Risolto: giallo/arancione (#FFD580)
              // - Aperto: blu (#A3B8E0)
              const statusClass = status === 'risolto'
                ? 'bg-[#FFD580] hover:bg-[#FFE8A0] text-[#663c00]'
                : 'bg-[#A3B8E0] hover:bg-[#C3D2F0] text-[#06234a]';
              
              // Verifica se questo ticket è evidenziato (corrisponde alla data cliccata nel grafico)
              const isHighlighted = (ticket.date || ticket.createdAt || ticket.updatedAt).split("T")[0] === highlightDate;

              return (
                <div
                  key={tid}
                  ref={(el) => (itemRefs.current[tid] = el)}
                  className={`p-3 bg-white/60 rounded-lg border border-gray-200 flex justify-between items-start cursor-pointer transition hover:bg-white/80 hover:shadow-md ${
                    isHighlighted ? 'ring-2 ring-blue-100' : ''
                  }`}
                  onClick={() => {
                    setSelectedTicket(ticket);
                    setHighlightDate((ticket.date || ticket.createdAt || ticket.updatedAt).split("T")[0]);
                    setDrawerOpen(true);
                  }}
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-gray-900 truncate">
                      {ticket.title || ticket.name}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {ticket.user?.nome || ticket.user?.firstName || ticket.user?.name}{' '}
                      {ticket.user?.cognome || ticket.user?.lastName || ''} •{' '}
                      {formatDateVisible(ticket.date || ticket.createdAt)}
                    </div>
                    {ticket.description || ticket.content ? (
                      <p className="text-xs text-gray-700 mt-1 line-clamp-2">
                        {ticket.description || ticket.content}
                      </p>
                    ) : null}
                  </div>
                  <div className="flex flex-col items-end gap-2 ml-3">
                    <span className={`text-xs px-3 py-1 rounded-lg font-medium ${statusClass}`}>
                      {statusLabel}
                    </span>
                    <PencilIcon
                      size={18}
                      color="#090c64"
                      weight="duotone"
                      className="shrink-0"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ===== DRAWER LATERALE ===== 
       * 
       * Pannello laterale che scivola da destra per mostrare i dettagli di un ticket
       * 
       * QUANDO SI APRE:
       * - Click su un ticket nella lista
       * - Click su un punto del grafico
       * 
       * CONTENUTO:
       * - Informazioni utente (nome, ruolo, email) con avatar
       * - Descrizione completa del ticket
       * - Due pulsanti per cambiare lo status:
       *   - "Aperto": segna il ticket come aperto (blu)
       *   - "Risolto": segna il ticket come risolto (giallo)
       * 
       * FUNZIONALITÀ:
       * - Aggiornamento ottimistico: l'UI si aggiorna immediatamente
       * - Se la richiesta al server fallisce, lo status viene ripristinato
       * - Dopo l'aggiornamento, ricarica tutti i ticket per sincronizzare con altri componenti
       * 
       * STILE: Sfondo con immagine (bgLight/bgDark) e glassmorphism
       */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50">
          {/* Overlay scuro semi-trasparente - Click per chiudere */}
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setDrawerOpen(false)}
          />

          {/* Drawer - Pannello laterale */}
          <aside
            className="absolute right-0 top-0 h-full w-[420px] border-l border-white/40 shadow-2xl transform transition-transform duration-300 translate-x-0 overflow-auto bg-cover bg-center"
            style={{ backgroundImage: `url(${theme === 'light' ? bgLight : bgDark})` }}
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header sticky con bordo */}
            <header className="sticky top-0 z-10 border-b border-white/60 px-6 py-4 flex items-center justify-between">
              <h2 className="text-base font-semibold text-[#090c64]">
                {t("dettagliTicket")}
              </h2>

              {/* Bottone Chiudi */}
              <button
                onClick={() => setDrawerOpen(false)}
                className="custom-button"
              >
                {t("chiudi")}
              </button>
            </header>

            {/* Contenuto */}
            <div className="p-6 text-[15px] leading-relaxed text-[#090c64]">
              {selectedTicket && (
                <>

              <div className="flex flex-col gap-3 mb-4 p-2 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex items-center gap-3">
                  <UserCircle size={48} color="#090c64" weight="duotone" />

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

              {/* ===== AZIONI: Pulsanti per cambiare lo status del ticket ===== 
               * 
               * Due pulsanti per modificare lo status:
               * 
               * FLUSSO DI AGGIORNAMENTO (Optimistic Update):
               * 1. Click sul pulsante
               * 2. Aggiornamento IMMEDIATO dell'UI (senza aspettare il server)
               * 3. Invio richiesta al server per salvare il cambiamento
               * 4. Ricarica di tutti i ticket per sincronizzare
               * 5. Se la richiesta fallisce → ripristina lo stato precedente
               * 
               * VANTAGGI:
               * - UI reattiva: l'utente vede il cambiamento immediatamente
               * - Sincronizzazione: tutti i componenti (incluso TicketCreator) vedono il cambiamento
               * - Fallback: se il server è offline, lo stato viene ripristinato
               */}
              <div className="flex flex-col gap-2 mb-4">
                {/* PULSANTE: Segna come APERTO (Blu) */}
                <div
                  className="p-2 flex justify-center items-center rounded-xl bg-[#A3B8E0]
                  border border-[#7A9CC6] cursor-pointer hover:bg-[#C3D2F0]"
                  onClick={async () => {
                    const id = selectedTicket._id || selectedTicket.id;
                    if (!id) return;
                    
                    // 1. AGGIORNAMENTO OTTIMISTICO: cambia subito l'UI
                    setTicketStatus((s) => ({ ...s, [id]: "aperto" }));
                    
                    try {
                      // 2. AGGIORNA SUL SERVER: invia richiesta PUT con status='open'
                      await dispatch(updateTicketAsync({ id, payload: { status: 'open' } })).unwrap();
                      
                      // 3. RICARICA TUTTI I TICKET: sincronizza con Redux store
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

                {/* PULSANTE: Segna come RISOLTO (Giallo) */}
                <div
                  className="p-2 flex justify-center items-center rounded-xl bg-[#FFD580]
                  border border-[#FFE8A0] cursor-pointer hover:bg-[#FFE8A0]"
                  onClick={async () => {
                    const id = selectedTicket._id || selectedTicket.id;
                    if (!id) return;
                    
                    // Stesso flusso del pulsante "Aperto", ma con status='closed'
                    setTicketStatus((s) => ({ ...s, [id]: "risolto" }));
                    
                    try {
                      await dispatch(updateTicketAsync({ id, payload: { status: 'closed' } })).unwrap();
                      dispatch(fetchTickets());
                    } catch (err) {
                      setTicketStatus((s) => ({ ...s, [id]: "aperto" }));
                      console.error('Update ticket failed', err);
                    }
                  }}
                >
                  Risolto
                </div>
              </div>

                </>
              )}
            </div>
          </aside>
        </div>
      )}
    </div>
  );
};

export default TicketPageAdmin;