import React, { useEffect, useState, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "../../context/ThemeContext";
import { useLanguage } from "../../context/LanguageContext";
import bgLight from "../../assets/bg/bg.jpg";
import {
	fetchTickets,
	updateTicketAsync,
} from "../../store/feature/ticketSlice";
import {
	ListMagnifyingGlassIcon,
	PencilIcon,
	CalendarDotsIcon,
	UserListIcon,
	CircleIcon,
	CalendarDots,
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
	const dispatch = useDispatch();
	const tickets = useSelector((state) => state.tickets.tickets);
	const users = useSelector((state) => state.tickets.users);
	const ticketsStatus = useSelector((state) => state.tickets.status);
	const ticketsError = useSelector((state) => state.tickets.error);

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

	const { theme } = useTheme();
	const { t } = useLanguage();

	const [state, setState] = useState([
		{
			// default range: ultimi 30 giorni fino ad oggi (inclusi)
			startDate: addDays(new Date(), -30),
			endDate: new Date(),
			key: "selection",
		},
	]);

	const ticketSeries = [
		{ key: "aperti", label: t("aperti") , color: "#3B82F6"},
		{ key: "risolti", label: t("risolti"), color: "#F59E0B" },
		{ key: "totale", label: t("totale"), color: "#111827" },
	];

	/* CARICAMENTO DATI (FAKE API) tramite Redux slice */

	useEffect(() => {
		if ((tickets?.length || 0) === 0 && ticketsStatus === "idle") {
			dispatch(fetchTickets());
		}
	}, [dispatch, tickets?.length, ticketsStatus]);

	// Initialize ticketStatus when tickets arrive
	useEffect(() => {
		if (tickets && tickets.length > 0) {
			setTicketStatus(
				Object.fromEntries(
					tickets.map((t) => {
						const id = t._id || t.id;
						// derive local status: prefer italian values if present, else map english backend
						let s = t.status || "aperto";
						if (s === "open") s = "aperto";
						if (s === "closed") s = "risolto";
						return [id, s];
					})
				)
			);
		}
	}, [tickets]);

	/* FILTRAGGIO*/
	const formatDateVisible = (date) =>
		new Date(date).toLocaleDateString("it-IT", {
			day: "numeric",
			month: "short",
		});

	const filteredTickets = useMemo(() => {
		const start = state?.[0]?.startDate ? new Date(state[0].startDate) : null;
		const end = state?.[0]?.endDate ? new Date(state[0].endDate) : null;

		return tickets.filter((ticket) => {
			const rawDate = ticket.date || ticket.createdAt || ticket.updatedAt;
			const ticketDate = new Date(rawDate);

			const matchDate =
				(!start || ticketDate >= start) && (!end || ticketDate <= end);

			const ticketUserId = ticket.user?._id || ticket.user?.id || ticket.user;
			const matchUser = !selectedUser || ticketUserId === selectedUser;

			const tid = ticket._id || ticket.id;
			const matchStatus =
				!selectedStatus || ticketStatus[tid] === selectedStatus;

			return matchDate && matchUser && matchStatus;
		});
	}, [tickets, state, selectedUser, selectedStatus, ticketStatus]);

	/* DATA PER GRAFICO*/
	const lineChartData = useMemo(() => {
		const grouped = {};

		filteredTickets.forEach((t) => {
			const rawDate =
				t.date || t.createdAt || t.updatedAt || new Date().toISOString();
			const key = rawDate.split("T")[0];

			if (!grouped[key])
				grouped[key] = { date: key, aperti: 0, risolti: 0, totale: 0 };

			const tid = t._id || t.id;
			const status = ticketStatus[tid];

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
			prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
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
		<div className="min-h-screen py-10 px-4 lg:px-16 xl:px-24">
			{/* ERROR BANNER */}
			{ticketsError && (
				<div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-start justify-between">
					<div>
						<h3 className="font-bold">{t("erroreCaricamento")}</h3>
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

			{/* LAYOUT DUE COLONNE (GRAFICO + LISTA)*/}
			<div className="flex flex-col lg:flex-row gap-6">
				{/* COLONNA SINISTRA: DATE + GRAFICO*/}
				<div className="w-full lg:w-1/2 flex flex-col gap-4 sticky top-6 h-fit">
					{/*  Date */}
					<div className="bg-white/30 border border-white/90 rounded-xl shadow p-4">
						<h2 className="font-bold text-xl mb-2  flex items-center gap-2">
							<CalendarDotsIcon
								size={32}
								color={theme === "dark" ? "white" : "#090c64"}
								weight="duotone"
							/>
							{t("selezionaIntervalloData")}
						</h2>

						<div className="border rounded-xl overflow-hidden bg-white/30 border-white/90 flex justify-center w-full h-full">
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
					<div className="bg-white/30 border border-white/90 rounded-xl shadow p-6">
						<h2 className="font-bold text-2xl mb-4">{t("andamentoTicket")}</h2>

						{/* Legenda */}
						<div className="flex flex-wrap gap-3 mb-6 font-bold">
							{ticketSeries.map(({ key, label }) => (
								<button
									key={key}
									onClick={() => toggleLine(key)}
									className={`px-4 py-1.5 rounded-xl text-sm border shadow-sm transition ${
										hiddenLines.includes(key)
											? "opacity-40 bg-gray-100"
											: "opacity-100 bg-white text-[#090c64]"
									}`}
								>
									{t(label)} ({totals[key]})
								</button>
							))}
						</div>

						<LineChart
							dataset={lineChartData}
							xAxis={[{ dataKey: "date", scaleType: "band" }]}
							yAxis={[{ valueFormatter: (v) => v.toString() }]}
							series={ticketSeries.map(({ key, label, color }) => ({
								dataKey: key,
								label: t(label),
								color,
							})).filter((s) => !hiddenLines.includes(s.dataKey))}
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
				<div className="w-full lg:w-1/2 bg-white/30 border-white/90 border rounded-xl shadow p-6 sticky top-6 h-[1190px] flex flex-col">
					<h2 className="font-bold text-3xl mb-4 flex items-center gap-3 ">
						<ListMagnifyingGlassIcon
							size={32}
							color={theme === "dark" ? "white" : "#090c64"}
							weight="duotone"
						/>
						{t("ticket")}
					</h2>

					{/* FILTRI */}
					<div className=" backdrop-blur-md border border-white/50 rounded-xl p-4 mb-6 flex flex-col lg:flex-row gap-4">
						{/* ------------------- FILTRO UTENTE ------------------- */}
						<div className="flex flex-col w-full lg:w-2/4 relative">
							<label className="text-sm font-semibold text-gray-700 mb-1"></label>

							<div className="relative mt-1">
								<UserListIcon
									size={32}
									color={theme === "dark" ? "white" : "#090c64"}
									weight="duotone"
									className="absolute left-3 top-1/2 -translate-y-1/2"
								/>
								<input
									type="text"
									value={userSearch}
									onChange={(e) => setUserSearch(e.target.value)}
									placeholder={t("cercaUtente")}
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

							{userSearch.length > 0 && (
								<div className="absolute top-full mt-1 w-full bg-white/30  border rounded-lg shadow-md max-h-60 overflow-y-auto overflow-scroll z-20">
									<div
										onClick={() => {
											setSelectedUser("");
											setUserSearch("");
										}}
										className="px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 cursor-pointer border-b"
									>
										Tutti gli utenti
									</div>

									{users.filter((u) =>
										(u.nome + " " + u.cognome)
											.toLowerCase()
											.includes(userSearch.toLowerCase())
									).length === 0 && (
										<div className="px-3 py-2 text-sm text-gray-500">
											Nessun risultato
										</div>
									)}

									{users
										.filter((u) =>
											(u.nome + " " + u.cognome)
												.toLowerCase()
												.includes(userSearch.toLowerCase())
										)
										.map((u) => (
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
												<span className="text-sm">
													{u.nome} {u.cognome}
												</span>
											</div>
										))}
								</div>
							)}
						</div>

						{/* ------------------- FILTRO STATO ------------------- */}
						<div className="flex flex-col w-full lg:w-1/4 relative">
							<label className="text-sm font-semibold text-gray-700 mb-1"></label>

							<CircleIcon
								size={32}
								color={theme === "dark" ? "white" : "#090c64"}
								weight="duotone"
								className="absolute left-3 top-1/2 -translate-y-1/2"
							/>

							<select
								value={selectedStatus}
								onChange={(e) => setSelectedStatus(e.target.value)}
								className="w-full pl-12 p-2 border rounded-lg bg-white text-gray-800 shadow-sm focus:ring focus:ring-blue-200 focus:outline-none"
							>
								<option value="">{t("tutti")}</option>
								<option value="aperto">{t("aperti")}</option>
								<option value="risolto">{t("risolti")}</option>
							</select>
						</div>
					</div>

					{/* LISTA TICKET */}
					<div className="flex flex-col gap-4 flex-1 overflow-y-auto overflow-x-hidden p-1">
						{filteredTickets.map((ticket) => (
							<div
								key={ticket.id}
								ref={(el) => (itemRefs.current[ticket._id || ticket.id] = el)}
								className={`rounded-xl shadow p-4 flex flex-col cursor-pointer transition ${getColor(
									ticketStatus[ticket._id || ticket.id]
								)} ${
									(ticket.date || ticket.createdAt || ticket.updatedAt).split(
										"T"
									)[0] === highlightDate
										? "ring-2 ring-blue-300"
										: ""
								}`}
								onClick={() => {
									setSelectedTicket(ticket);
									setHighlightDate(
										(ticket.date || ticket.createdAt || ticket.updatedAt).split(
											"T"
										)[0]
									);
									setDrawerOpen(true);
								}}
							>
								<div className="flex justify-between items-center">
									<span className="font-semibold text-lg">
										{ticket.title || ticket.name}
									</span>
									<PencilIcon
										size={20}
										color={theme === "dark" ? "white" : "#090c64"}
										weight="duotone"
									/>
								</div>

								<span className="text-sm text-gray-600 mt-1">
									{ticket.user?.nome ||
										ticket.user?.firstName ||
										ticket.user?.name}{" "}
									{ticket.user?.cognome || ticket.user?.lastName || ""} •{" "}
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

			 {/* DRAWER LATERALE - Stile uguale a Drawer.jsx */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50">
          {/* Overlay scuro */}
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setDrawerOpen(false)}
          />

          {/* Drawer vera */}
          <aside
            className="absolute right-0 top-0 h-full w-[420px] border-l border-white/40 shadow-2xl transform transition-transform duration-300 translate-x-0 overflow-auto bg-cover bg-center"
            style={{ backgroundImage: `url(${bgLight})` }}
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header sticky con bordo */}
            <header className="sticky top-0 z-10 border-b border-white/60 px-6 py-4 flex items-center justify-between">
              <h2 className="text-base font-semibold text-[#090c64]">
                Dettagli Ticket
              </h2>

              {/* Bottone Chiudi */}
              <button
                onClick={() => setDrawerOpen(false)}
                className="custom-button"
              >
                Chiudi
              </button>
            </header>

            {/* Contenuto */}
            <div className="p-6 text-[15px] leading-relaxed text-[#090c64]">
              {selectedTicket && (
                <>

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