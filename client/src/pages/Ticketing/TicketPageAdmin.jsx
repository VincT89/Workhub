import React from "react";
import { ListMagnifyingGlass, Pencil, CalendarDots, UserList, Circle } from "@phosphor-icons/react";
import { LineChart } from "@mui/x-charts/LineChart";

const TicketPageAdmin = () => {
  // Drawer
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [selectedTicket, setSelectedTicket] = React.useState(null);

  // Filtri
  const [startDate, setStartDate] = React.useState("");
  const [endDate, setEndDate] = React.useState("");
  const [selectedUser, setSelectedUser] = React.useState("");
  const [selectedStatus, setSelectedStatus] = React.useState("");

  // Fake Users
  const fakeUsers = React.useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => ({
        id: `u${i + 1}`,
        nome: ["Marco","Giulia","Luca","Sara","Alessio","Elena","Davide","Marta","Simone","Valentina","Matteo","Francesca","Giorgio","Anna","Stefano","Chiara","Andrea","Paola","Riccardo","Martina"][i],
        cognome: ["Bianchi","Rossi","Verdi","Neri","Costa","Lombardi","Esposito","Ferrari","Conti","Romano","Galli","Fontana","Marino","Caruso","Greco","Silvestri","Moretti","Rinaldi","De Luca","Serra"][i],
        ruolo: ["IT Support","Account Manager","Customer Care","HR Specialist","Backend Developer","Frontend Developer","DevOps Engineer","UX Designer","Amministrazione","Marketing","Project Manager","QA Tester","Data Analyst","Team Leader","IT Security","Office Manager","Logistica","Designer","Full Stack Developer","Tecnico Assistenza"][i],
        email: `utente${i + 1}@example.com`,
        avatar: `https://i.pravatar.cc/150?img=${i + 10}`,
      })),
    []
  );

  // Tickets fake
  const tickets = React.useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => ({
        id: `t${i + 1}`,
        title: `Ticket Numero ${i + 1}`,
        description: [
          "Problema con la connessione",
          "Richiesta di aggiornamento software",
          "Errore nella stampa documenti",
          "Accesso negato al sistema",
          "Problema email aziendale",
          "Richiesta account nuovo progetto",
          "Errore dati nel database",
          "Malfunzionamento hardware",
          "Problema VPN",
          "Richiesta permessi speciali",
        ][i % 10],
        user: fakeUsers[i],
        date: new Date(Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000).toISOString(),
      })),
    [fakeUsers]
  );

  // Ticket status
  const [ticketStatus, setTicketStatus] = React.useState(
    Object.fromEntries(tickets.map((t) => [t.id, "aperto"]))
  );

  // Colore dinamico
  const getColor = (status) => {
    switch (status) {
      case "risolto":
        return "bg-[#FFD580] hover:bg-[#FFE8A0]";
      default:
        return "bg-[#A3B8E0] hover:bg-[#C3D2F0]";
    }
  };

  // Formatta data
  const formatDateVisible = (dateString) =>
    new Date(dateString).toLocaleDateString("it-IT", { day: "numeric", month: "short", year: "numeric" });

  // Filtra ticket in base ai filtri
  const filteredTickets = tickets.filter(ticket => {
    const ticketDate = new Date(ticket.date);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    const matchDate = (!start || ticketDate >= start) && (!end || ticketDate <= end);
    const matchUser = !selectedUser || ticket.user.id === selectedUser;
    const matchStatus = !selectedStatus || ticketStatus[ticket.id] === selectedStatus;
    return matchDate && matchUser && matchStatus;
  });

  // Raggruppa per giorno per LineChart
  // 1-> Cambiare il digit, migliore lasciare solo in mesi
  // 2-> Rendere il grafico piu interattivo
  // 3-> Aggiungi il totale Ticket
  // 4->connetti a delle APIs per cominciare a renderlo piu attivo e provare la funzionalita
  const ticketsByDay = {};
  filteredTickets.forEach(ticket => {
    const day = new Date(ticket.date).toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric' }); 
    if (!ticketsByDay[day]) ticketsByDay[day] = { aperti: 10, risolti: 20 };
    ticketsByDay[day][ticketStatus[ticket.id]] += 1;
  });

  const lineChartData = Object.entries(ticketsByDay)
    .sort(([a], [b]) => new Date(a) - new Date(b))
    .map(([date, counts]) => ({ date, ...counts }));

  const xAxis = [{ dataKey: 'date', scaleType: 'band' }];
  const yAxis = [{ valueFormatter: (v) => v.toString() }];
  const series = [
    { dataKey: 'aperti', label: 'Aperti', stroke: '#3B82F6' },
    { dataKey: 'risolti', label: 'Risolti', stroke: '#F59E0B' },

	/* aggiungi anche il totale dei ticket */
  ];

  return (
    <div className="min-h-screen">
      
      {/* TOOLBAR FILTRI */}
      <div className="bg-white/20 backdrop-blur-md border border-white/90 rounded-xl p-4 mb-6 flex flex-col lg:flex-row gap-4">

        {/* Data DA */}
        <div className="flex flex-col w-full lg:w-1/4">
          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <CalendarDots size={20} color="#090c64" weight="duotone" />
            Da
          </label>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
            className="mt-1 p-2 h-auto border border-white/90 rounded-xl bg-white/40 text-gray-800 shadow-sm hover:border-[#090c64]" />

        </div>
        {/* Data A */}
        <div className="flex flex-col w-full lg:w-1/4">
          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <CalendarDots size={20} color="#090c64" weight="duotone" />
            A
          </label>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
            className="mt-1 p-2 h-auto border border-white/90 rounded-xl bg-white/40 text-gray-800 shadow-sm hover:border-[#090c64]" />
        </div>

        {/* Utente */}
        <div className="flex flex-col w-full lg:w-1/4">
          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <UserList size={20} color="#090c64" weight="duotone" />
            Utente
          </label>
          <select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}
            className="mt-1 p-2 border border-white/90 rounded-xl bg-white/40 text-gray-800 shadow-sm hover:border-[#090c64]">
            <option value="">Tutti</option>
            {fakeUsers.map(user => (
              <option key={user.id} value={user.id}>{user.nome} {user.cognome}</option>
            ))}
          </select>
        </div>

        {/* Stato */}
        <div className="flex flex-col w-full lg:w-1/4">
          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Circle size={18} weight="duotone" />
            Stato
          </label>
          <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}
            className="mt-1 p-2 border border-white/90 rounded-xl bg-white/40 text-gray-800 shadow-sm hover:border-[#090c64] ">
            <option value="">Tutti</option>
            <option value="aperto">Aperti</option>
            <option value="risolto">Risolti</option>
          </select>
        </div>
      </div>

      {/* ---->LAYOUT GRAFICO + LISTA <---- */}

      <div className="flex flex-col lg:flex-row gap-6"> {/* Prova ad aumentare la altezza del grafico */}
        {/* LineChart */}
        <div className="w-full lg:w-1/2 bg-white/20 border border-white/90 rounded-xl shadow p-6 sticky top-6 h-fit">
          <h2 className="font-bold text-2xl mb-4 text-[#090c64]">Andamento Ticket</h2>
          <LineChart
            dataset={lineChartData}
            xAxis={xAxis}
            yAxis={yAxis}
            series={series}
            height={400}
            grid={{ vertical: true, horizontal: true }}
          />
        </div>

        {/* Lista Ticket */}
        <div className="w-full lg:w-1/2 bg-white/20 border border-white/90 rounded-xl shadow p-6 sticky top-6 h-fit">
          <h2 className="font-bold text-3xl mb-4 flex items-center gap-3 text-[#090c64]">
            <ListMagnifyingGlass size={32} color="#090c64" weight="duotone" />
            Ticket
          </h2>
          <div className="flex flex-col gap-4 max-h-[70vh] overflow-y-auto">
            {filteredTickets.sort((a,b) => new Date(b.date) - new Date(a.date)).map(ticket => (
              <div key={ticket.id} className={`rounded-xl shadow p-4 flex flex-col cursor-pointer transition ${getColor(ticketStatus[ticket.id])}`}
                onClick={() => { setSelectedTicket(ticket); setDrawerOpen(true); }}>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-lg">{ticket.title}</span>
                  <Pencil size={20} color="#090c64" weight="duotone" />
                </div>
                <span className="text-sm text-gray-600 mt-1">{ticket.user.nome} {ticket.user.cognome} • {formatDateVisible(ticket.date)}</span>
                <p className="text-sm text-gray-700 mt-2">{ticket.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* DRAWER */}
      <div className={`fixed inset-0 z-50 transition-all duration-300 ${drawerOpen ? "bg-black/40 visible" : "bg-transparent invisible"}`} onClick={() => setDrawerOpen(false)}>
        <div className={`absolute right-0 top-0 h-full w-80 bg-white shadow-xl p-6 transition-transform duration-300 ${drawerOpen ? "translate-x-0" : "translate-x-full"}`} onClick={(e)=>e.stopPropagation()}>
          <h3 className="font-semibold text-xl mb-4">Dettagli Ticket</h3>
          {selectedTicket && (
            <div className="flex flex-col gap-3 mb-4 p-2 bg-gray-50 rounded-xl border border-gray-200">
              <div className="flex items-center gap-3">
                <img src={selectedTicket.user.avatar} alt="Avatar" className="w-12 h-12 rounded-full object-cover"/>
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-800">{selectedTicket.user.nome} {selectedTicket.user.cognome}</span>
                  <span className="text-sm text-gray-500">{selectedTicket.user.ruolo}</span>
                  <span className="text-sm text-gray-500">{selectedTicket.user.email}</span>
                </div>
              </div>
              <div className="mt-2 p-2 bg-white rounded-lg border border-gray-200">
                <span className="font-semibold text-gray-800">Descrizione:</span>
                <p className="text-sm text-gray-700 mt-1">{selectedTicket.description}</p>
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