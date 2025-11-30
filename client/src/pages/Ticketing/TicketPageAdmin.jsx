import React, { useEffect, useState, useMemo } from "react";
import { ListMagnifyingGlass, Pencil, CalendarDots, UserList, Circle } from "@phosphor-icons/react";
import { LineChart } from "@mui/x-charts/LineChart";


const TicketPageAdmin = () => {

  /* STATI PRINCIPALI */

  const [tickets, setTickets] = useState([]);      // Lista ticket caricati dal server
  const [users, setUsers] = useState([]);          // Lista utenti caricati

  // Filtri lato UI
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  // Drawer laterale
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  // Stato dei ticket ("aperto" / "risolto")
  const [ticketStatus, setTicketStatus] = useState({});


  /* CARICAMENTO DATI REALI (FAKE API)
     -> Carica utenti e ticket da due endpoint demo
     -> Converte i dati nel formato da te utilizzato*/
  useEffect(() => {
    const fetchData = async () => {
      try {
        // --- USERS API ---
        const usersRes = await fetch("https://jsonplaceholder.typicode.com/users");
        const usersData = await usersRes.json();

        // --- TICKETS API ---
        const ticketsRes = await fetch("https://jsonplaceholder.typicode.com/posts");
        const posts = await ticketsRes.json();

        // Normalizza gli utenti
        const formattedUsers = usersData.map((u, i) => ({
          id: u.id.toString(),
          nome: u.name.split(" ")[0],
          cognome: u.name.split(" ")[1] || "",
          ruolo: "Dipendente",
          email: u.email,
          avatar: `https://i.pravatar.cc/150?img=${i + 10}`,
        }));

        // Normalizza i ticket
        const formattedTickets = posts.slice(0, 20).map((p, i) => ({
          id: p.id.toString(),
          title: p.title,
          description: p.body,
          user: formattedUsers[i % formattedUsers.length],
          date: new Date(Date.now() - Math.random() * 10 * 86400000).toISOString(),
        }));

        setUsers(formattedUsers);
        setTickets(formattedTickets);

        // Stato di default = "aperto"
        setTicketStatus(
          Object.fromEntries(formattedTickets.map((t) => [t.id, "aperto"]))
        );

      } catch (err) {
        console.error("API ERROR:", err);
      }
    };

    fetchData();
  }, []);


  /* FORMATTATORE DATE PER LA UI*/
  const formatDateVisible = (date) =>
    new Date(date).toLocaleDateString("it-IT", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });


  /* FILTRAGGIO TICKET (memoized)*/
  const filteredTickets = useMemo(() => {
    return tickets.filter(ticket => {
      const ticketDate = new Date(ticket.date);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;

      const matchDate =
        (!start || ticketDate >= start) &&
        (!end || ticketDate <= end);

      const matchUser =
        !selectedUser || ticket.user.id === selectedUser;

      const matchStatus =
        !selectedStatus || ticketStatus[ticket.id] === selectedStatus;

      return matchDate && matchUser && matchStatus;
    });
  }, [tickets, startDate, endDate, selectedUser, selectedStatus, ticketStatus]);


  /* PREPARAZIONE DATI PER IL GRAFICO LINEARE (memoized)
     ->Raggruppa ticket per giorno
     ->Conta aperti / risolti / totale */
  const lineChartData = useMemo(() => {
    const grouped = {};

    filteredTickets.forEach(t => {
      const key = t.date.split("T")[0]; // yyyy-mm-dd

      if (!grouped[key])
        grouped[key] = { date: key, aperti: 0, risolti: 0, totale: 0 };

      const status = ticketStatus[t.id];

      if (status === "aperto") grouped[key].aperti++;
      if (status === "risolto") grouped[key].risolti++;

      grouped[key].totale++;
    });


    return Object.values(grouped);
  }, [filteredTickets, ticketStatus]);
  /////////////////////

  const [hiddenLines, setHiddenLines] = useState([]);

  const toggleLine = (key) => {
    setHiddenLines(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  // Totali per la leggenda
  const totals = useMemo(() => {
    return lineChartData.reduce(
      (acc, item) => {
        acc.aperti += item.aperti;
        acc.risolti += item.risolti;
        acc.totale += item.totale;
        return acc;
      },
      { aperti: 0, risolti: 0, totale: 0 }
    );
  }, [lineChartData]);

  /* COLORI DELLE CARD IN LISTA */
  const getColor = (status) => {
    switch (status) {
      case "risolto":
        return "bg-[#FFD580] hover:bg-[#FFE8A0]";
      default:
        return "bg-[#A3B8E0] hover:bg-[#C3D2F0]";
    }
  };


  /* RENDER PRINCIPALE*/
  return (
    <div className="min-h-screen p-6 bg-[#fafafa20] rounded-xl">

      {/* FILTRI SUPERIORI*/}
      <div className="bg-white/40 backdrop-blur-md border border-white/50 rounded-xl p-4 mb-6 flex flex-col lg:flex-row gap-4">

        {/* Filtro data inizio */}
        <div className="flex flex-col w-full lg:w-1/4">
          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <CalendarDots size={20} color="#090c64" weight="duotone" /> Da
          </label>
          <input type="date" value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="mt-1 p-2 border rounded-lg bg-white text-gray-800 shadow-sm" />
        </div>

        {/* Filtro data fine */}
        <div className="flex flex-col w-full lg:w-1/4">
          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <CalendarDots size={20} color="#090c64" weight="duotone" /> A
          </label>
          <input type="date" value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="mt-1 p-2 border rounded-lg bg-white text-gray-800 shadow-sm" />
        </div>

        {/* Selezione utente */}
        <div className="flex flex-col w-full lg:w-1/4">
          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <UserList size={20} color="#090c64" weight="duotone" /> Utente
          </label>
          <select value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="mt-1 p-2 border rounded-lg bg-white text-gray-800 shadow-sm">
            <option value="">Tutti</option>
            {users.map(u => (
              <option key={u.id} value={u.id}>
                {u.nome} {u.cognome}
              </option>
            ))}
          </select>
        </div>

        {/* Selezione stato */}
        <div className="flex flex-col w-full lg:w-1/4">
          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Circle size={18} color="#090c64" weight="duotone" /> Stato
          </label>
          <select value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="mt-1 p-2 border rounded-lg bg-white text-gray-800 shadow-sm">
            <option value="">Tutti</option>
            <option value="aperto">Aperti</option>
            <option value="risolto">Risolti</option>
          </select>
        </div>

      </div>


      {/* GRAFICO + LISTA TICKET */}
      <div className="flex flex-col lg:flex-row gap-6">

        {/* GRAFICO ANDAMENTO TICKET*/}
        <div className="w-full lg:w-1/2 bg-white rounded-xl shadow p-6 sticky top-6 h-fit">
          <h2 className="font-bold text-2xl mb-4 text-[#090c64]">
            Andamento Ticket
          </h2>
          {/* LEGENDA CLICCABILE */}
          <div className="flex gap-4 mb-4">
            {["aperti", "risolti", "totale"].map(key => (
              <span
                key={key}
                onClick={() => toggleLine(key)}
                className={`cursor-pointer px-3 py-1 rounded-full text-sm border transition ${hiddenLines.includes(key) ? "opacity-40" : "opacity-100"}`}
              >
              {key} ({totals[key]})
              </span>
            ))}
          </div>

          {/* GRAFICO */}
          <LineChart
            dataset={lineChartData}
            xAxis={[{ dataKey: "date", scaleType: "band" }]}
            yAxis={[{ valueFormatter: v => v.toString() }]}
            series={[
              { dataKey: "aperti", label: "Aperti", color: "#3B82F6" },
              { dataKey: "risolti", label: "Risolti", color: "#F59E0B" },
              { dataKey: "totale", label: "Totale", color: "#111" }
            ].filter(s => !hiddenLines.includes(s.dataKey))}
            height={500}
          />
        </div>


        {/* LISTA TICKET FILTRATI */}
        <div className="w-full lg:w-1/2 bg-white rounded-xl shadow p-6 sticky top-6 h-fit">
          <h2 className="font-bold text-3xl mb-4 flex items-center gap-3 text-[#090c64]">
            <ListMagnifyingGlass size={32} color="#090c64" weight="duotone" />
            Ticket
          </h2>

          <div className="flex flex-col gap-4 max-h-[70vh] overflow-y-auto">
            {filteredTickets.map(ticket => (
              <div key={ticket.id}
                className={`rounded-xl shadow p-4 flex flex-col cursor-pointer transition ${getColor(ticketStatus[ticket.id])}`}
                onClick={() => { setSelectedTicket(ticket); setDrawerOpen(true); }}>

                {/* Titolo + icona modifica */}
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-lg">{ticket.title}</span>
                  <Pencil size={20} color="#090c64" weight="duotone" />
                </div>

                {/* Info autore */}
                <span className="text-sm text-gray-600 mt-1">
                  {ticket.user.nome} {ticket.user.cognome} • {formatDateVisible(ticket.date)}
                </span>

                {/* Descrizione */}
                <p className="text-sm text-gray-700 mt-2">{ticket.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>


      {/* DRAWER LATERALE DETTAGLI TICKET */}
      <div className={`fixed inset-0 z-50 transition-all duration-300 ${drawerOpen ? "bg-black/40 visible" : "bg-transparent invisible"}`}
        onClick={() => setDrawerOpen(false)}>

        <div className={`absolute right-0 top-0 h-full w-80 bg-white shadow-xl p-6 transition-transform duration-300
          ${drawerOpen ? "translate-x-0" : "translate-x-full"}`}
          onClick={(e) => e.stopPropagation()}>

          {selectedTicket && (
            <>
              {/* Header */}
              <h3 className="font-semibold text-xl mb-4">Dettagli Ticket</h3>

              {/* Info utente */}
              <div className="flex flex-col gap-3 mb-4 p-2 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex items-center gap-3">
                  <img src={selectedTicket.user.avatar} alt="Avatar"
                    className="w-12 h-12 rounded-full object-cover" />

                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-800">
                      {selectedTicket.user.nome} {selectedTicket.user.cognome}
                    </span>
                    <span className="text-sm text-gray-500">{selectedTicket.user.ruolo}</span>
                    <span className="text-sm text-gray-500">{selectedTicket.user.email}</span>
                  </div>
                </div>

                {/* Descrizione */}
                <div className="mt-2 p-2 bg-white rounded-lg border border-gray-200">
                  <span className="font-semibold text-gray-800">Descrizione:</span>
                  <p className="text-sm text-gray-700 mt-1">{selectedTicket.description}</p>
                </div>
              </div>

              {/* Cambio stato */}
              <div className="flex flex-col gap-2 mb-4">
                <div className="p-2 flex justify-center items-center rounded-xl bg-[#A3B8E0]
                  border border-[#7A9CC6] cursor-pointer hover:bg-[#C3D2F0]"
                  onClick={() =>
                    setTicketStatus(s => ({ ...s, [selectedTicket.id]: "aperto" }))
                  }>
                  Aperto
                </div>

                <div className="p-2 flex justify-center items-center rounded-xl bg-[#FFD580]
                  border border-[#FFE8A0] cursor-pointer hover:bg-[#FFE8A0]"
                  onClick={() =>
                    setTicketStatus(s => ({ ...s, [selectedTicket.id]: "risolto" }))
                  }>
                  Risolto
                </div>
              </div>

              {/* Pulsante chiudi */}
              <button onClick={() => setDrawerOpen(false)}
                className="w-full bg-gray-300 text-gray-800 py-2 rounded-lg hover:bg-gray-400">
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
