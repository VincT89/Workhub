import React from "react";
import { useTheme } from "../../../context/ThemeContext";
import { useLanguage } from "../../../context/LanguageContext";
import { UserCircle, CalendarCheck } from "@phosphor-icons/react";

const AdminPage = () => {
	const { theme } = useTheme();
	const { t } = useLanguage();

	const textColor = theme === "dark" ? "text-white" : "text-[#090c64]";

	// ---- ARRAY BOTTONI INFO ----
	const topButtons = [
		{ label: "Giorni lavorati", number: 215 },
		{ label: "Ferie residue", number: 12 },
		{ label: "Permessi", number: 2 },
		{ label: "Attività", number: 47 },
	];

	// ---- DATI ANAGRAFICI  ----
	const anagrafica = {
		nome: "Jennifer Bianchi",
		ruolo: "Responsabile reparto",
		matricola: "ADD-0001",
		email: "jennifer.bianchi@example.com",
		telefono: "333 987 6543",
		sede: "Milano – Headquarters",
		contratto: "Tempo pieno – 40h",
		assunzione: "12/04/2021",
		responsabile: "Laura Fontana",
	};

	// ----- TURNI DI ESEMPIO ------
	const turni = [
		{ giorno: "Lunedì", orario: "8:00 - 12:00" },
		{ giorno: "Martedì", orario: "10:00 - 12:00 / 15:00 - 18:30" },
		{ giorno: "Giovedì", orario: "8:00 - 9:00" },
		{ giorno: "Venerdì", orario: "15:30 - 16:30" },
	];

	// ----- PERMESSI DI ESEMPIO ------
	const richiestepermessi = [
		{ matricola: "ADD-0025", data: "05.06.2026", orario: "8:00 - 18:00" },
		{ matricola: "ADD-0025", data: "28.12.25", orario: "10:00 - 12:00" },
	];

	/* Stato dinamico dei permessi-
   React.useState crea uno state locale al componente per aggiorna automaticamente 
   il rendering del componente ogni volta che chiamiamo setPermessi():
   - permessi: contiene l'array attuale di richieste mostrato in UI (copia dinamica di richiestaPermessi)
   - setPermessi: funzione per aggiornare lo stato di "permessi"
   Inizializziamo lo stato con l'array richiestepermessi. */
	const [permessi, setPermessi] = React.useState(richiestepermessi);

	// Funzione per accettare una richiesta.
	// Parametri:
	// - richiesta: l'oggetto della singola richiesta cliccata
	// - nome: il nome della persona
	// Azione: stampa in console e rimuove la richiesta dallo stato in modo immutabile.
	const handleAccetta = (richiesta, nome) => {
		console.log("Accettata:", nome, richiesta);
		setPermessi((prev) => prev.filter((r) => r !== richiesta));
	};

	// Funzione per rifiutare una richiesta
	// Stessa logica di handleAccetta: log + rimozione dalla lista.
	const handleRifiuta = (richiesta, nome) => {
		console.log("Rifiutata:", nome, richiesta);
		setPermessi((prev) => prev.filter((r) => r !== richiesta));
	};

	// ----- FERIE DI ESEMPIO ------
	const richiesteferie = [
		{ matricola: "ADD-0025", inizio: "05.06.2026", fine: "12.06.2026" },
		{ matricola: "ADD-0025", inizio: "28.12.25", fine: "03.01.26" },
	];

	/* Stato dinamico dei permessi-
   React.useState crea uno state locale al componente per aggiorna automaticamente 
   il rendering del componente ogni volta che chiamiamo setPermessi():
   - permessi: contiene l'array attuale di richieste mostrato in UI (copia dinamica di richiestaPermessi)
   - setPermessi: funzione per aggiornare lo stato di "permessi"
   Inizializziamo lo stato con l'array richiestepermessi. */
	const [ferie, setFerie] = React.useState(richiesteferie);

	const handleAccettaFerie = (richiestaf, nome) => {
		console.log("Accettata:", nome, richiestaf);
		setFerie((prev) => prev.filter((rf) => rf !== richiestaf));
	};

	const handleRifiutaFerie = (richiestaf, nome) => {
		console.log("Rifiutata:", nome, richiestaf);
		setFerie((prev) => prev.filter((rf) => rf !== richiestaf));
	};

	return (
		<>
			<div className="w-full h-full flex flex-col gap-8 overflow-y-auto scrollbar-thin scrollbar-thumb-[#1C62A0] scrollbar-track-transparent">
				{/* --------- SEZIONE 1: BOX RIASSUNTIVI --------- */}
				<div className="grid grid-cols-4 gap-6 mb-6 w-full transition-colors duration-500">
					{topButtons.map((btn, i) => (
						<div
							key={i}
							className={`
                flex flex-col items-center justify-center rounded-xl px-4 py-3
                backdrop-blur-sm border border-white/30 shadow-md transition-colors duration-500
                ${theme === "dark" ? "bg-white/20" : "bg-white/20"}
                ${textColor}
              `}
						>
							<span className="inline-flex items-baseline gap-2 font-bold">
								{btn.label}
							</span>
							<span className="text-sm opacity-70 leading-none font-semibold">
								{btn.number}
							</span>
						</div>
					))}
				</div>

				{/* --------- SEZIONE 2: ANAGRAFICA E TURNI --------- */}
				<div className="flex gap-6">
					{/* ANAGRAFICA */}
					<div
						className={`
              flex-1 p-6 rounded-xl border border-white/30 shadow-md
              backdrop-blur-sm ${
								theme === "dark" ? "bg-white/20" : "bg-white/20"
							}
            `}
					>
						<div className="flex items-center gap-3 mb-4">
							<UserCircle size={32} color="#090c64" weight="duotone" />
							<h2 className={`text-lg font-bold leading-none ${textColor}`}>
								{t("employees.anagrafica")}
							</h2>
						</div>
						<div className={`flex flex-col gap-2 ${textColor}`}>
							<div>
								<strong>{t("employees.nome")}:</strong> {anagrafica.nome}
							</div>
							<div>
								<strong>{t("employees.ruolo")}:</strong> {anagrafica.ruolo}
							</div>
							<div>
								<strong>{t("employees.matricola")}:</strong>{" "}
								{anagrafica.matricola}
							</div>
							<div>
								<strong>{t("employees.email")}:</strong> {anagrafica.email}
							</div>
							<div>
								<strong>Telefono:</strong> {anagrafica.telefono}
							</div>
							<div>
								<strong>Sede lavorativa:</strong> {anagrafica.sede}
							</div>
							<div>
								<strong>Tipo di contratto:</strong> {anagrafica.contratto}
							</div>
							<div>
								<strong>Data di assunzione:</strong> {anagrafica.assunzione}
							</div>
							<div>
								<strong>Responsabile diretto:</strong> {anagrafica.responsabile}
							</div>
						</div>
					</div>

					{/* TURNI */}
					<div
						className={`
              flex-1 p-6 rounded-xl border border-white/30 shadow-md
              backdrop-blur-sm ${
								theme === "dark" ? "bg-white/20" : "bg-white/20"
							}
            `}
					>
						<div className="flex items-center gap-3 mb-4">
							<CalendarCheck size={32} color="#090c64" weight="duotone" />
							<h2 className={`text-lg font-bold leading-none ${textColor}`}>
								{t("employees.turniSettimanali")}
							</h2>
						</div>

						<div className={`flex flex-col gap-2 ${textColor}`}>
							{turni.map((t, i) => (
								<div
									key={i}
									className="flex justify-between bg-white/40 dark:bg-white/20 rounded-xl p-2 shadow-sm"
								>
									<span className="font-semibold">{t.giorno}</span>
									<span>{t.orario}</span>
								</div>
							))}
						</div>
					</div>
				</div>

				{/* --------- SEZIONE 3: FERIE E PERMESSI --------- */}
				<div className="flex gap-6">
					{/* FERIE */}
					<div
						className={`
              flex-1 p-6 rounded-xl border border-white/30 shadow-md
              backdrop-blur-sm ${
								theme === "dark" ? "bg-white/20" : "bg-white/20"
							}
            `}
					>
						<div className="flex items-center gap-3 mb-4">
							<h2 className={`text-lg font-bold leading-none ${textColor}`}>
								{t("employees.richiestaFerie")}
							</h2>
						</div>

						<div className="flex flex-col gap-2">
							{ferie.map((fe, i) => (
								<div
									key={i}
									className="flex items-center justify-between bg-white/40 dark:bg-white/20 rounded-xl p-2 shadow-sm"
								>
									{/* Dati richiesta */}
									<span className={`font-semibold ${textColor}`}>
										{anagrafica.nome} - {t("employees.dal")} {fe.inizio},{" "}
										{t("employees.al")} {fe.fine}
									</span>

									{/* Pulsanti */}
									<div className="flex gap-2">
										<button
											onClick={() => handleAccettaFerie(fe, anagrafica.nome)}
											className="bg-[#090c64] text-white text-sm px-3 py-1 rounded-xl cursor-pointer font-semibold transition"
										>
											{t("employees.accetta")}
										</button>
										<button
											onClick={() => handleRifiutaFerie(fe, anagrafica.nome)}
											className="bg-white/30 dark:bg-white/10 text-[#090c64] text-sm px-3 py-1 rounded-xl cursor-pointer font-semibold transition"
										>
											{t("employees.rifiuta")}
										</button>
									</div>
								</div>
							))}
						</div>
					</div>

					{/* PERMESSI */}
					<div
						className={`
              flex-1 p-6 rounded-xl border border-white/30 shadow-md
              backdrop-blur-sm ${
								theme === "dark" ? "bg-white/20" : "bg-white/20"
							}
            `}
					>
						<div className="flex items-center gap-3 mb-4">
							<h2 className={`text-lg font-bold leading-none ${textColor}`}>
								{t("employees.richiestaPermessi")}
							</h2>
						</div>

						<div className="flex flex-col gap-2">
							{permessi.map((tu, i) => (
								<div
									key={i}
									className="flex items-center justify-between bg-white/40 dark:bg-white/20 rounded-xl p-2 shadow-sm"
								>
									{/* Dati richiesta */}
									<span className={`font-semibold ${textColor}`}>
										{anagrafica.nome} - {tu.data}, {tu.orario}
									</span>

									{/* Pulsanti */}
									<div className="flex gap-2">
										<button
											onClick={() => handleAccetta(tu, anagrafica.nome)}
											className="bg-[#090c64] text-white text-sm px-3 py-1 rounded-xl cursor-pointer font-semibold transition"
										>
											{t("employees.accetta")}
										</button>
										<button
											onClick={() => handleRifiuta(tu, anagrafica.nome)}
											className="bg-white/30 dark:bg-white/10 text-[#090c64] text-sm px-3 py-1 rounded-xl cursor-pointer font-semibold transition"
										>
											{t("employees.rifiuta")}
										</button>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default AdminPage;
