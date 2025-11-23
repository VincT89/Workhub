import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import { setActiveTab } from "../../store/feature/tabSlice";
import Table from "../../components/Table";
import {
	UserList,
	ShoppingBag,
	ArrowCounterClockwise,
	IdentificationBadge,
} from "@phosphor-icons/react";

const CustomersRegistry = () => {
	const location = useLocation();
	const dispatch = useDispatch();
	const customer = location.state;
	const activeTab = useSelector((state) => state.tab.activeTab);

	// Stati per la modalità modifica
	const [isEditing, setIsEditing] = useState(false);
	const [editedCustomer, setEditedCustomer] = useState(customer);

	const stats = [
		{ label: "Anagrafica", icon: UserList },
		{ label: "Ordini", icon: ShoppingBag },
		{ label: "Resi", icon: ArrowCounterClockwise },
		{ label: "Affiliazione", icon: IdentificationBadge },
	];

	const ordiniFittizi = [
		{
			id: 1,
			prodotto: "LACK Tavolino",
			Data: "2025-01-12",
			categoria: "Soggiorno",
			quantita: 1,
			prezzo: 9.99,
			totale: 9.99,
			stato: "Consegnato",
			Pagamento: "Carta di credito",
			Tracking: "IK000987654",
		},
		{
			id: 2,
			prodotto: "BILLY Libreria",
			Data: "2025-02-03",
			categoria: "Ufficio",
			quantita: 2,
			prezzo: 39.99,
			totale: 79.98,
			stato: "In transito",
			Pagamento: "PayPal",
			Tracking: "IK001123789",
		},
		{
			id: 3,
			prodotto: "MALM Cassettiera",
			Data: "2025-02-20",
			categoria: "Camera",
			quantita: 1,
			prezzo: 79.99,
			totale: 79.99,
			stato: "Preparazione",
			Pagamento: "Carta di credito",
			Tracking: "IK001998321",
		},
		{
			id: 4,
			prodotto: "POÄNG Poltrona",
			Data: "2025-03-01",
			categoria: "Soggiorno",
			quantita: 1,
			prezzo: 69.99,
			totale: 69.99,
			stato: "Consegnato",
			Pagamento: "Bonifico",
			Tracking: "IK002112455",
		},
		{
			id: 5,
			prodotto: "HEMNES Comodino",
			Data: "2025-03-15",
			categoria: "Camera",
			quantita: 1,
			prezzo: 49.99,
			totale: 49.99,
			stato: "In transito",
			Pagamento: "Carta di credito",
			Tracking: "IK002778900",
		},
	];

	const resiFittizi = [
		{
			id: 1,
			prodotto: "MALM Cassettiera",
			Data: "2025-03-02",
			categoria: "Camera",
			quantita: 1,
			Motivazione: "Pezzo mancante nel kit",
			Stato: "Accettato",
			rimborso: 79.99,
			Pagamento: "PayPal",
			Tracking: "IKR001234567",
		},
		{
			id: 2,
			prodotto: "LACK Tavolino",
			Data: "2025-02-18",
			categoria: "Soggiorno",
			quantita: 1,
			Motivazione: "Colore diverso da quanto atteso",
			Stato: "In elaborazione",
			rimborso: 9.99,
			Pagamento: "Carta di credito",
			Tracking: "IKR000456789",
		},
	];

	// Funzione per aggiornare i campi dell'anagrafica
	const handleChange = (e) => {
		const { name, value } = e.target;
		setEditedCustomer((prev) => ({ ...prev, [name]: value }));
	};

	// Funzioni per gestione pulsanti
	const handleEdit = () => setIsEditing(true);
	const handleCancel = () => {
		setEditedCustomer(customer);
		setIsEditing(false);
	};
	const handleSave = () => {
		console.log("Dati salvati:", editedCustomer);
		setIsEditing(false);
	};

	return (
		<div className="flex flex-col items-center gap-6 p-6 ">
			{/* Navbar */}
			<div className="flex items-center gap-4">
				{stats.map((item) => (
					<button
						key={item.label}
						onClick={() => dispatch(setActiveTab(item.label))}
						className={`flex items-center gap-2 rounded-xl p-2 shadow-md border border-white transition duration-200 cursor-pointer ${
							activeTab === item.label
								? "bg-white text-[#090c64] font-semibold"
								: "bg-white/40 hover:bg-white/70"
						}`}
					>
						<item.icon
							size={22}
							weight={activeTab === item.label ? "fill" : "regular"}
						/>
						{item.label}
					</button>
				))}
			</div>

			{/* Contenuto dinamico */}
			<div className="w-[1000px] rounded-xl bg-[#fafafa]/10 backdrop-blur-sm p-6 shadow-md border border-white">
				<h2 className="text-[#090c64] text-lg font-bold mb-6">
					Cliente: {customer.nome}
				</h2>

				{/* ANAGRAFICA */}
				{activeTab === "Anagrafica" && (
					<div className="flex flex-col gap-3">
						<div className="flex justify-between items-center mb-2">
							<h3 className="text-[#090c64] font-semibold">Anagrafica</h3>
							{!isEditing ? (
								<button
									onClick={handleEdit}
									className="text-sm px-3 py-1 bg-white/70 rounded-xl border border-white shadow-sm hover:bg-white transition"
								>
									✏️ Modifica
								</button>
							) : (
								<div className="flex gap-2">
									<button
										onClick={handleSave}
										className="text-sm px-3 py-1 bg-green-200 rounded-xl border border-white shadow-sm hover:bg-green-300 transition"
									>
										💾 Salva
									</button>
									<button
										onClick={handleCancel}
										className="text-sm px-3 py-1 bg-red-200 rounded-xl border border-white shadow-sm hover:bg-red-300 transition"
									>
										❌ Annulla
									</button>
								</div>
							)}
						</div>

						{/* Campi anagrafici */}
						{Object.entries(editedCustomer).map(([key, value]) => {
							// Mostra solo campi rilevanti
							const chiaviMostrate = [
								"nome",
								"indirizzo",
								"citta",
								"cap",
								"provincia",
								"nascita",
								"CF",
								"telefono",
								"email",
							];
							if (!chiaviMostrate.includes(key)) return null;

							return (
								<div
									key={key}
									className="bg-white/60 p-3 rounded-xl shadow-sm"
								>
									{isEditing ? (
										<input
											type="text"
											name={key}
											value={value}
											onChange={handleChange}
											className="bg-transparent outline-none w-full"
										/>
									) : (
										<span className="capitalize">{value}</span>
									)}
								</div>
							);
						})}
					</div>
				)}

				{/* ORDINI */}
				{activeTab === "Ordini" && (
					<div className="flex flex-col gap-3">
						<div className="flex justify-between items-center mb-2">
							<h3 className="text-[#090c64] font-semibold text-left">
								Storico Ordini
							</h3>
							<button className="text-sm px-3 py-1 bg-white/70 rounded-xl border border-white shadow-sm hover:bg-white transition">
								📊 Esporta Excel
							</button>
						</div>

						{/* 🔹 Tabella degli ordini */}
						<Table
							data={ordiniFittizi}
							columns={Object.keys(ordiniFittizi[0])}
						/>
					</div>
				)}

				{/* RESI */}
				{activeTab === "Resi" && (
					<div className="flex flex-col gap-3">
						<div className="flex justify-between items-center mb-2">
							<h3 className="text-[#090c64] font-semibold text-left">
								Storico Resi
							</h3>
							<button className="text-sm px-3 py-1 bg-white/70 rounded-xl border border-white shadow-sm hover:bg-white transition">
								📊 Esporta Excel
							</button>
						</div>
						<Table data={resiFittizi} columns={Object.keys(resiFittizi[0])} />
					</div>
				)}

				{/* AFFILIAZIONE */}
				{activeTab === "Affiliazione" && (
					<div className="flex flex-col gap-3">
						<div className="flex justify-between items-center mb-2">
							<h3 className="text-[#090c64] font-semibold text-left">
								Affiliazione
							</h3>
							<button className="text-sm px-3 py-1 bg-white/70 rounded-xl border border-white shadow-sm hover:bg-white transition">
								📊 Esporta Excel
							</button>
						</div>
						<div className="bg-white/60 p-3 rounded-xl shadow-sm">
							Livello tessera: {customer.livello}
						</div>
						<div className="bg-white/60 p-3 rounded-full shadow-sm">
							Punti: {customer.punti}
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default CustomersRegistry;
