import React from "react";
import { PieChart } from "@mui/x-charts/PieChart";

import { ChartDonut } from "@phosphor-icons/react";
import { ListMagnifyingGlass } from "@phosphor-icons/react";
import { Pencil } from "@phosphor-icons/react";

import TicketCreator from "./TicketCreator";

//collegato alla Workhub/src/pages/Employee/user/UserEmployeePage.jsx
//import UserEmployeePage from "./user/UserEmployeePage";

const TicketPageAdmin = () => {
	// Drawer
	const [drawerOpen, setDrawerOpen] = React.useState(false);
	const [selectedTicket, setSelectedTicket] = React.useState(null);

	// 20 utenti fake
	const fakeUsers = React.useMemo(
		() =>
			Array.from({ length: 20 }, (_, i) => ({
				id: `u${i + 1}`,
				nome: [
					"Marco",
					"Giulia",
					"Luca",
					"Sara",
					"Alessio",
					"Elena",
					"Davide",
					"Marta",
					"Simone",
					"Valentina",
					"Matteo",
					"Francesca",
					"Giorgio",
					"Anna",
					"Stefano",
					"Chiara",
					"Andrea",
					"Paola",
					"Riccardo",
					"Martina",
				][i],
				cognome: [
					"Bianchi",
					"Rossi",
					"Verdi",
					"Neri",
					"Costa",
					"Lombardi",
					"Esposito",
					"Ferrari",
					"Conti",
					"Romano",
					"Galli",
					"Fontana",
					"Marino",
					"Caruso",
					"Greco",
					"Silvestri",
					"Moretti",
					"Rinaldi",
					"De Luca",
					"Serra",
				][i],
				ruolo: [
					"IT Support",
					"Account Manager",
					"Customer Care",
					"HR Specialist",
					"Backend Developer",
					"Frontend Developer",
					"DevOps Engineer",
					"UX Designer",
					"Amministrazione",
					"Marketing",
					"Project Manager",
					"QA Tester",
					"Data Analyst",
					"Team Leader",
					"IT Security",
					"Office Manager",
					"Logistica",
					"Designer",
					"Full Stack Developer",
					"Tecnico Assistenza",
				][i],
				email: `utente${i + 1}@example.com`,
				avatar: `https://i.pravatar.cc/150?img=${i + 10}`,
			})),
		[]
	);

	// Tickets finti
	const tickets = React.useMemo(
		() =>
			Array.from({ length: 20 }, (_, i) => ({
				id: `t${i + 1}`,
				title: `Ticket Numero ${i + 1}`,
				user: fakeUsers[i],
			})),
		[fakeUsers]
	);

	// Stato
	const [ticketStatus, setTicketStatus] = React.useState(
		Object.fromEntries(tickets.map((t) => [t.id, "aperto"]))
	);

	// Numeri
	const totalTickets = tickets.length;
	const aperti = Object.values(ticketStatus).filter(
		(s) => s === "aperto"
	).length;
	const risolti = Object.values(ticketStatus).filter(
		(s) => s === "risolto"
	).length;

	// Colore dinamico
	const getColor = (status) => {
		switch (status) {
			case "risolto":
				return "bg-green-200";
			default:
				return "bg-blue-100";
		}
	};

	return (
		<div className="  bg-[#fafafa20] backdrop-blur-sm rounded-xl border border-neutral-50/30 p-6 shadow-lg">
			{/* HEADER */}
			<section className="grid grid-cols-4 gap-4 mb-6"></section>

			{/* CONTENUTO PRINCIPALE */}
			<section className="grid grid-cols-3 gap-6 h-[70vh]">
				{/* GRAFICO DONUT */}
				<div className="col-span-1 bg-white/20 rounded-xl shadow p-4 flex flex-col relative">
					<h2
						className="font-bold text-3xl mb-3 flex items-center gap-3"
						style={{ color: "#090c64" }}
					>
						<ChartDonut size={32} color="#090c64" weight="duotone" />
						Report Ticket
					</h2>

					<div className="flex-1 flex items-center justify-center relative">
						<PieChart
							series={[
								{
									type: "pie",
									innerRadius: 60,
									outerRadius: 120,
									data: [
										{ id: 0, value: aperti },
										{ id: 1, value: risolti },
									],
								},
							]}
							width={350}
							height={350}
						/>

						{/* NUMERO AL CENTRO */}
						<div
							className="absolute text-center pointer-events-none select-none"
							style={{
								top: "50%",
								left: "50%",
								transform: "translate(-50%, -60%)",
							}}
						>
							<div className="text-4xl font-bold text-blue-900">
								{totalTickets}
							</div>
							<div className="text-sm text-gray-600">Totale</div>
						</div>
					</div>
				</div>

				{/* LISTA TICKET */}
				<div className="col-span-2 bg-white/20 rounded-xl shadow p-4 flex flex-col min-h-0">
					<h2
						className="font-bold text-3xl mb-3 flex items-center gap-3"
						style={{ color: "#090c64" }}
					>
						<ListMagnifyingGlass size={32} color="#090c64" weight="duotone" />
						Ticket
					</h2>

					<div className="flex-1 min-h-0 overflow-y-auto pr-2 flex gap-4">
						{/* COLONNA APERTI */}
						<div className="flex-1 space-y-2">
							<h3
								className="font-bold text-2xl mb-2 text-center"
								style={{ color: "#090c64" }}
							>
								Aperti
							</h3>

							{tickets
								.filter((ticket) => ticketStatus[ticket.id] === "aperto")
								.map((ticket) => (
									<div
										key={ticket.id}
										className={`rounded-xl shadow p-4 flex justify-between items-center cursor-pointer transition ${getColor(
											ticketStatus[ticket.id]
										)}`}
										onClick={() => {
											//Quando apro drawer, passa tutto il ticket (non solo ID)
											setSelectedTicket(ticket);
											setDrawerOpen(true);
										}}
									>
										<span>{ticket.title}</span>
										<Pencil size={20} color="#090c64" weight="duotone" />
									</div>
								))}
						</div>

						<div className="w-px bg-gray-300"></div>

						{/* COLONNA RISOLTI */}
						<div className="flex-1 space-y-2">
							<h3
								className="font-bold text-2xl mb-2 text-center"
								style={{ color: "#090c64" }}
							>
								Risolti
							</h3>

							{tickets
								.filter((ticket) => ticketStatus[ticket.id] === "risolto")
								.map((ticket) => (
									<div
										key={ticket.id}
										className={`rounded-xl shadow p-4 flex justify-between items-center cursor-pointer transition ${getColor(
											ticketStatus[ticket.id]
										)}`}
										onClick={() => {
											setSelectedTicket(ticket);
											setDrawerOpen(true);
										}}
									>
										<span>{ticket.title}</span>
										<Pencil size={20} color="#090c64" weight="duotone" />
									</div>
								))}
						</div>
					</div>
				</div>
			</section>

			{/* DRAWER DETTAGLI TICKET (deve essere testata dopo il merge con la pag di Anto!!!!)*/}
			<div
				className={`fixed inset-0 z-50 transition-all duration-300 ${
					drawerOpen ? "bg-black/40 visible" : "bg-transparent invisible"
				}`}
				onClick={() => setDrawerOpen(false)}
			>
				<div
					className={`absolute right-0 top-0 h-full w-80 bg-white shadow-xl p-6 transition-transform duration-300 ${
						drawerOpen ? "translate-x-0" : "translate-x-full"
					}`}
					onClick={(e) => e.stopPropagation()}
				>
					<h3 className="font-semibold text-xl mb-4">Dettagli Ticket</h3>

					{/* INFO UTENTE */}
					{selectedTicket && (
						<div className="flex items-center gap-3 mb-4 p-2 bg-gray-50 rounded-xl border border-gray-200">
							<img
								// per il futuro me: src={selectedTicket.user.avatar} -> Carica e mostra l’immagine di questo utente specifico
								src={selectedTicket.user.avatar}
								alt="Avatar Utente"
								className="w-12 h-12 rounded-full object-cover"
							/>
							<div className="flex flex-col">
								<span className="font-semibold text-gray-800">
									{selectedTicket.user.nome} {selectedTicket.user.cognome}
								</span>
								<span className="text-sm text-gray-500">
									{selectedTicket.user.ruolo}
								</span>
								<span className="text-sm text-gray-500">
									{selectedTicket.user.email}
								</span>
							</div>
						</div>
					)}

					{/* Stato Ticket */}
					<div className="flex flex-col gap-2 mb-4">
						<div
							className="p-2 rounded-xl bg-blue-50 border border-blue-200 cursor-pointer"
							onClick={() =>
								setTicketStatus((p) => ({
									...p,
									[selectedTicket.id]: "aperto",
								}))
							}
						>
							📬 Aperto
						</div>

						<div
							className="p-2 rounded-lg bg-green-50 border border-green-200 cursor-pointer"
							onClick={() =>
								setTicketStatus((p) => ({
									...p,
									[selectedTicket.id]: "risolto",
								}))
							}
						>
							✔️ Risolto
						</div>
					</div>

					<button
						onClick={() => setDrawerOpen(false)}
						className="w-full bg-gray-300 text-gray-800 py-2 rounded-lg hover:bg-gray-400"
					>
						Chiudi
					</button>
				</div>
			</div>
		</div>
	);
};

export default TicketPageAdmin;
