import { useTheme } from "../../../context/ThemeContext";
import { useLanguage } from "../../../context/LanguageContext";
import {
	UserCircle,
	CalendarCheck,
	Bag,
	CalendarBlank,
} from "@phosphor-icons/react";
import { useState } from "react";
import Drawer from "../../../components/Drawer"

const UserEmployeePage = () => {
	const { theme } = useTheme();
	const { t } = useLanguage();

	/* --------- DATI STATICI --------- */
	const topButtons = [
		{
			label: t("employees.giorniLavorati"),
			number: 215,
			icon: <CalendarCheck size={28} color="#090c64" weight="duotone" />,
		},
		{
			label: t("employees.ferieResidue"),
			number: 12,
			icon: <Bag size={28} color="#090c64" weight="duotone" />,
		},
		{
			label: t("employees.permessi"),
			number: 2,
			icon: <CalendarBlank size={28} color="#090c64" weight="duotone" />,
		},
	];

	const anagrafica = {
		nome: "Claudia Rossi",
		ruolo: "Addetta vendita",
		matricola: "ADD-0025",
		email: "claudia.rossi@example.com",
		telefono: "+39 345 6789012",
		sede: "Milano Centro",
		contratto: "Tempo Indeterminato",
		dataAssunzione: "01/03/2020",
		responsabile: "Mario Bianchi",
	};

	const turni = [
		{ giorno: t("employees.lunedi"), orario: "8:00 - 12:00" },
		{ giorno: t("employees.martedi"), orario: "10:00 - 12:00 / 15:00 - 18:30" },
		{ giorno: t("employees.mercoledi"), orario: "8:00 - 9:00" },
		{ giorno: t("employees.giovedi"), orario: "15:30 - 16:30" },
	];

	/* --------- STATI DINAMICI --------- */
	const [ferieList, setFerieList] = useState([
		{ dal: "2025-12-30", al: "2026-01-07" },
	]);
	const [permessiList, setPermessiList] = useState([
		{ data: "2026-06-05", orario: "8:00 - 18:00" },
		{ data: "2025-12-28", orario: "10:00 - 12:00" },
	]);

	/* --------- DRAWER FERIE --------- */
	const [openFerieDrawer, setOpenFerieDrawer] = useState(false);
	const [dal, setDal] = useState("");
	const [al, setAl] = useState("");

	/* --------- DRAWER PERMESSI --------- */
	const [openPermessiDrawer, setOpenPermessiDrawer] = useState(false);
	const [permessoData, setPermessoData] = useState("");
	const [oraInizio, setOraInizio] = useState("08:00");
	const [oraFine, setOraFine] = useState("18:00");

	/* --------- VARIABILI DI STILE --------- */
	const textColor = theme === "dark" ? "text-white" : "text-[#090c64]";
	const buttonClass = `
    mt-4 bg-[#090c64] text-white font-semibold px-6 py-3
    rounded-xl shadow-md cursor-pointer transition-all duration-200
    w-fit text-center
  `;

	/* --------- FORMATTATORE DATA gg/mm/aaaa --------- */
	const formatDate = (date) => {
		if (!date) return "";
		const d = new Date(date);
		const day = String(d.getDate()).padStart(2, "0");
		const month = String(d.getMonth() + 1).padStart(2, "0");
		const year = d.getFullYear();
		return `${day}/${month}/${year}`;
	};

	/* --------- HANDLER INVIO --------- */
	const handleInviaFerie = () => {
		if (dal && al) {
			setFerieList([...ferieList, { dal, al }]);
			setDal("");
			setAl("");
			setOpenFerieDrawer(false);
		}
	};

	const handleInviaPermesso = () => {
		if (permessoData && oraInizio && oraFine) {
			setPermessiList([
				...permessiList,
				{ data: permessoData, orario: `${oraInizio} - ${oraFine}` },
			]);
			setPermessoData("");
			setOraInizio("08:00");
			setOraFine("18:00");
			setOpenPermessiDrawer(false);
		}
	};

	return (
		<div className="relative w-full h-full flex flex-col gap-8 overflow-y-auto p-2">
			{/* --------- SEZIONE 1: BOX RIASSUNTIVI --------- */}
			<section className="grid grid-cols-3 gap-6 mb-6 w-full transition-colors duration-500">
				{topButtons.map((btn, i) => (
					<div
						key={i}
						className={`
           flex items-center justify-between rounded-xl px-4 py-3
            backdrop-blur-sm border border-white/30 shadow-md transition-colors duration-500
            ${theme === "dark" ? "bg-white/20" : "bg-white/20"} ${textColor}`}
					>
						<div className="flex items-center gap-4">
							{btn.icon}
							<span className="inline-flex items-baseline gap-2 font-bold">
								{btn.label}
							</span>
						</div>

						<span className="text-sm opacity-70 leading-none font-semibold">
							{btn.number}
						</span>
					</div>
				))}
			</section>

			{/* --------- SEZIONE 2: ANAGRAFICA E TURNI --------- */}
			<div className="flex gap-6">
				{/* ANAGRAFICA */}
				<div
					className={`flex-1 p-6 rounded-xl border border-white/30 shadow-md backdrop-blur-sm ${
						theme === "dark" ? "bg-white/20" : "bg-white/20"
					}`}
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
							<strong>{t("employees.telefono")}:</strong> {anagrafica.telefono}
						</div>
						<div>
							<strong>{t("employees.sede")}:</strong> {anagrafica.sede}
						</div>
						<div>
							<strong>{t("employees.contratto")}:</strong>{" "}
							{anagrafica.contratto}
						</div>
						<div>
							<strong>{t("employees.dataAssunzione")}:</strong>{" "}
							{anagrafica.dataAssunzione}
						</div>
						<div>
							<strong>{t("employees.responsabile")}:</strong>{" "}
							{anagrafica.responsabile}
						</div>
					</div>
				</div>

				{/* TURNI */}
				<div
					className={`flex-1 p-6 rounded-xl border border-white/30 shadow-md backdrop-blur-sm ${
						theme === "dark" ? "bg-white/20" : "bg-white/20"
					}`}
				>
					<div className="flex items-center gap-3 mb-4">
						<CalendarCheck size={32} color="#090c64" weight="duotone" />
						<h2 className={`text-lg font-bold leading-none ${textColor}`}>
							{t("employees.turniSettimanali")}
						</h2>
					</div>
					<div className={`flex flex-col gap-2 ${textColor}`}>
						{turni.map((tu, i) => (
							<div
								key={i}
								className="grid grid-cols-2 bg-white/40 dark:bg-white/20 rounded-xl p-2 shadow-sm"
							>
								<span className="font-semibold">{tu.giorno}</span>
								<span>{tu.orario}</span>
							</div>
						))}
					</div>
				</div>
			</div>

			{/* --------- SEZIONE 3: FERIE E PERMESSI --------- */}
			<div className="flex gap-6 mb-6">
				{/* FERIE */}
				<div
					className={`flex-1 p-6 rounded-xl border border-white/30 shadow-md backdrop-blur-sm ${
						theme === "dark" ? "bg-white/20" : "bg-white/20"
					}`}
				>
					<div className="flex items-center justify-between mb-4">
						<div className="flex items-center gap-3">
							<Bag size={32} color="#090c64" weight="duotone" />
							<h2 className={`text-lg font-bold leading-none ${textColor}`}>
								{t("employees.ferie")}
							</h2>
						</div>
						<button
							className={buttonClass}
							onClick={() => setOpenFerieDrawer(true)}
						>
							{t("employees.richiestaFerie")}
						</button>
					</div>
					<div className={`flex flex-col gap-2 ${textColor}`}>
						{ferieList.map((f, i) => (
							<div
								key={i}
								className="grid grid-cols-2 bg-white/40 dark:bg-white/20 rounded-xl p-2 shadow-sm mt-1"
							>
								<span className="font-semibold">{formatDate(f.dal)}</span>
								<span>{formatDate(f.al)}</span>
							</div>
						))}
					</div>
				</div>

				{/* PERMESSI */}
				<div
					className={`flex-1 p-6 rounded-xl border border-white/30 shadow-md backdrop-blur-sm ${
						theme === "dark" ? "bg-white/20" : "bg-white/20"
					}`}
				>
					<div className="flex items-center justify-between mb-4">
						<div className="flex items-center gap-3">
							<CalendarCheck size={32} color="#090c64" weight="duotone" />
							<h2 className={`text-lg font-bold leading-none ${textColor}`}>
								{t("employees.permessi")}
							</h2>
						</div>
						<button
							className={buttonClass}
							onClick={() => setOpenPermessiDrawer(true)}
						>
							{t("employees.richiestaPermessi")}
						</button>
					</div>
					<div className={`flex flex-col gap-2 ${textColor}`}>
						{permessiList.map((p, i) => (
							<div
								key={i}
								className="grid grid-cols-2 bg-white/40 dark:bg-white/20 rounded-xl p-2 shadow-sm"
							>
								<span className="font-semibold">{formatDate(p.data)}</span>
								<span>{p.orario}</span>
							</div>
						))}
					</div>
				</div>
			</div>
			{/* --------- DRAWER FERIE--------- */}
						
				<Drawer
  open={openFerieDrawer}
  onClose={() => setOpenFerieDrawer(false)}
  title={t("employees.richiestaFerie")}
  width="w-[420px]"
>
  <div className="flex flex-col gap-6">
    <div className="flex flex-col">
      <label className="font-semibold">{t("employees.dal")}</label>
      <input
        type="date"
        value={dal}
        onChange={(e) => setDal(e.target.value)}
        className="border rounded p-2 w-full"
      />
    </div>

    <div className="flex flex-col">
      <label className="font-semibold">{t("employees.al")}</label>
      <input
        type="date"
        value={al}
        onChange={(e) => setAl(e.target.value)}
        className="border rounded p-2 w-full"
      />
    </div>

    <button
      className={`${buttonClass} w-full py-3`}
      onClick={handleInviaFerie}
    >
      {t("Invia Richiesta Ferie")}
    </button>
  </div>
</Drawer>


			{/* --------- DRAWER PERMESSI--------- */}
			<Drawer
  open={openPermessiDrawer}
  onClose={() => setOpenPermessiDrawer(false)}
  title={t("employees.richiestaPermessi")}
  width="w-[420px]"
>
  <div className="flex flex-col gap-6">
    <div className="flex flex-col">
      <label className="font-semibold">{t("employees.data")}</label>
      <input
        type="date"
        value={permessoData}
        onChange={(e) => setPermessoData(e.target.value)}
        className="border rounded p-2 w-full"
      />
    </div>

    <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
      <div className="flex-1 flex flex-col">
        <label className="font-semibold">{t("Ora Inizio")}</label>
        <input
          type="time"
          value={oraInizio}
          onChange={(e) => setOraInizio(e.target.value)}
          className="border rounded p-2 w-full"
        />
      </div>

      <div className="flex-1 flex flex-col">
        <label className="font-semibold">{t("Ora Fine")}</label>
        <input
          type="time"
          value={oraFine}
          onChange={(e) => setOraFine(e.target.value)}
          className="border rounded p-2 w-full"
        />
      </div>
    </div>

    <button
      className={`${buttonClass} w-full py-3`}
      onClick={handleInviaPermesso}
    >
      {t("Invia Richiesta Permessi")}
    </button>
  </div>
</Drawer>

		</div>
	);
};

export default UserEmployeePage;