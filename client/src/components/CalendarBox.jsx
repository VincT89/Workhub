import { useMemo, useState, useEffect, useRef } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar"; // Libreria del calendario e localizzatore
import { format, parse, startOfWeek, getDay } from "date-fns"; // Funzioni per la gestione delle date
import { it } from "date-fns/locale"; // Localizzazione italiana
import "react-big-calendar/lib/css/react-big-calendar.css"; // Stili del calendario gia pronti nella libreria , il file non e' presente nel progetto
import { useTheme } from "../context/ThemeContext";
import { useSelector } from "react-redux";

/* LOCALIZZAZIONE */
const locales = { it };
const localizer = dateFnsLocalizer({
	format,
	parse,
	getDay,
	startOfWeek: () => startOfWeek(new Date(), { locale: it }),
	locales,
});

/* UTILITIES */
const getInitials = (name) => {
	const p = name.trim().split(" ");
	return p.length > 1
		? (p[0][0] + p[p.length - 1][0]).toUpperCase()
		: p[0][0].toUpperCase();
};

const departmentColors = {
	"Responsabile reparto": "#6C8AE4", // Indigo
	Sviluppatore: "#5EC2E0", // Cyan
	Designer: "#A88EF0", // Purple
	"Marketing Manager": "#F5A97F", // Arancione
	"HR Specialist": "#8DD0A6", // Verde menta
	"Data Analyst": "#7BB8E8", // Blu chiaro
};

const getDepartmentColor = (role) => {
	return departmentColors[role] || "#475569"; // Default: Grigio
};

const weekOffset = {
	Lunedì: 0,
	Martedì: 1,
	Mercoledì: 2,
	Giovedì: 3,
	Venerdì: 4,
	Sabato: 5,
	Domenica: 6,
};

/* CUSTOM TOOLBAR */
const CustomToolbar = ({ label, onView, view, onNavigate }) => {
	return (
		<div
			className="
		flex items-center justify-between w-full px-6 py-3 my-5
		rounded-xl backdrop-blur-md shadow-md
		bg-white/20 dark:bg-white/10
		border border-white/30 dark:border-white/10"
		>
			{/* BACK / NEXT */}
			<div className="flex items-center gap-2">
				<button
					onClick={() => onNavigate("PREV")}
					className="
			px-4 py-2 rounded-xl 
			bg-white/70 dark:bg-white/10 
			text-[#090c64] dark:text-[#090c64]
			border border-white/40 dark:border-white/90 
			font-semibold
			hover:bg-[#090c64] hover:text-white transition"
				>
					‹
				</button>

				<button
					onClick={() => onNavigate("NEXT")}
					className="
			px-4 py-2 rounded-xl 
			bg-white/70 dark:bg-white/10 
			text-[#090c64] dark:text-[#090c64]
			border border-white/40 dark:border-white/90 
			font-semibold
			hover:bg-[#090c64] hover:text-white transition"
				>
					›
				</button>
			</div>

			{/* LABEL */}
			<span className="text-xl font-extrabold text-[#090c64] dark:text-[#090c64] select-none">
				{label}
			</span>

			{/* BUTTONS */}
			<div className="flex items-center gap-2">
				<button
					onClick={() => onView("month")}
					className={`
	px-4 py-2 rounded-xl font-semibold border transition
	${
		view === "month"
			? "bg-[#090c64] text-white border-[#090c64]"
			: "bg-white/70 dark:bg-white/10 text-[#090c64] dark:text-[#090c64] border-white/40 dark:border-white/90 hover:bg-[#090c64] hover:text-white"
	}
	`}
				>
					Mese
				</button>

				<button
					onClick={() => onView("week")}
					className={`
			px-4 py-2 rounded-xl font-semibold border transition
			${
				view === "week"
					? "bg-[#090c64] text-white border-[#090c64]"
					: "bg-white/70 dark:bg-white/10 text-[#090c64] dark:text-[#090c64]  border-white/40 dark:border-white/90 hover:bg-[#090c64] hover:text-white"
			}
			`}
				>
					Settimana
				</button>

				<button
					onClick={() => onView("day")}
					className={`
			px-4 py-2 rounded-xl font-semibold border transition
			${
				view === "day"
					? "bg-[#090c64] text-white border-[#090c64]"
					: "bg-white/70 dark:bg-white/10 text-[#090c64] dark:text-[#090c64]  border-white/40 dark:border-white/90 hover:bg-[#090c64] hover:text-white"
			}
			`}
				>
					Giorno
				</button>
			</div>
		</div>
	);
};

/* MAIN COMPONENT */
const CalendarBox = () => {
	const { theme } = useTheme();
	const isDark = theme === "dark";

	const [view, setView] = useState("week");
	const [expandedId, setExpandedId] = useState(null);
	const wrapperRef = useRef();

	const EmployeeList = useSelector((state) => state.employees.employees);
	const loggedUser = useSelector((state) => state.auth.user);

	/* CLICK OUTSIDE */
	useEffect(() => {
		const handleOutside = (e) => {
			if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
				setExpandedId(null);
			}
		};
		document.addEventListener("mousedown", handleOutside);
		return () => document.removeEventListener("mousedown", handleOutside);
	}, []);

	/* FILTRO REPARTI BASATO SU RUOLO UTENTE */
	const departments = useMemo(() => {
		if (!loggedUser || !EmployeeList) return [];

		if (loggedUser.role === "admin") {
			return Array.from(new Set(EmployeeList.map((e) => e.ruolo)));
		}

		// USER: nessun reparto → può vedere solo se stesso
		return [];
	}, [loggedUser, EmployeeList]);

	/* STATO DEI REPARTI VISIBILI */
	const [selectedDepartments, setSelectedDepartments] = useState([]);

	/* ALLINEA AUTOMATICAMENTE selectedDepartments AL RUOLO UTENTE */
	useEffect(() => {
		setSelectedDepartments(departments);
	}, [departments]);

	const toggleDepartment = (dept) => {
		setSelectedDepartments((prev) =>
			prev.includes(dept) ? prev.filter((d) => d !== dept) : [...prev, dept]
		);
	};

	// Rimuove duplicati nella vista mensile (stesso dipendente + stesso giorno)
	const mergeMonthlyEvents = (events) => {
		const map = new Map();

		for (const ev of events) {
			const dayKey = ev.start.toDateString(); // Giorno
			const employeeKey = ev.fullName; // Dipendente
			const key = `${employeeKey}-${dayKey}`;

			if (!map.has(key)) {
				map.set(key, {
					...ev,
					id: key, // ID unico per quel giorno/dipendente
					orariMultipli: [ev.orario],
				});
			} else {
				map.get(key).orariMultipli.push(ev.orario);
			}
		}

		return [...map.values()];
	};

	/* GENERA EVENTI in base ai turni */
	const eventi = useMemo(() => {
		if (!EmployeeList || !loggedUser) return [];

		const result = [];
		const today = new Date();
		const weekMonday = startOfWeek(today, { locale: it });
		const range = 52;

		for (let w = -range; w <= range; w++) {
			const monday = new Date(
				weekMonday.getFullYear(),
				weekMonday.getMonth(),
				weekMonday.getDate() + w * 7 // calcolo dei lunedi delle settimane cosi da andare avanti e indietro nel tempo
			);

			EmployeeList.forEach((dip) => {
				// USER — vede solo i suoi turni
				if (loggedUser.role === "user") {
					if (dip.email !== loggedUser.email) return;
				}

				// ADMIN — vede tutto

				// Filtro manuale dei reparti già esistente
				// ADMIN  → filtra per reparto
				if (loggedUser.role !== "user") {
					if (!selectedDepartments.includes(dip.ruolo)) return;
				}

				if (!dip.turni) return;

				dip.turni.forEach((turno) => {
					const offset = weekOffset[turno.giorno];
					if (offset === undefined) return;

					const base = new Date(
						monday.getFullYear(),
						monday.getMonth(),
						monday.getDate() + offset
					);

					if (!turno.orari) return;

					turno.orari.forEach((range, i) => {
						const [s, e] = range.split("-");
						if (!s || !e) return;

						const [sh, sm] = s.split(":").map(Number);
						const [eh, em] = e.split(":").map(Number);

						if (isNaN(sh) || isNaN(sm) || isNaN(eh) || isNaN(em)) return;

						const start = new Date(
							base.getFullYear(),
							base.getMonth(),
							base.getDate(),
							sh,
							sm
						);
						const end = new Date(
							base.getFullYear(),
							base.getMonth(),
							base.getDate(),
							eh,
							em
						);

						result.push({
							id: `${dip.matricola}-${turno.giorno}-${i}-w${w}`,
							title: getInitials(dip.nome),
							fullName: dip.nome,
							role: dip.ruolo,
							orario: range,
							start,
							end,
							color: getDepartmentColor(dip.ruolo),
						});
					});
				});
			});
		}

		// Se siamo in vista mensile, rimuovo i duplicati dei turni spezzati
		if (view === "month") {
			return mergeMonthlyEvents(result);
		}

		return result;
	}, [EmployeeList, loggedUser, selectedDepartments, view]);

	/* EVENT STYLE */
	const eventStyleGetter = (event) => ({
		style: {
			backgroundColor: event.color,
			color: "white",
			borderRadius: "12px",
			padding: expandedId === event.id ? "8px" : "2px 4px",
			fontSize: expandedId === event.id ? "15px" : "13px",
			transform: expandedId === event.id ? "scale(1.02)" : "scale(1)",
			transition: "all .18s ease",
			zIndex: expandedId === event.id ? 10 : 1,
			width: expandedId === event.id ? "auto" : "fit-content",
		},
	});

	const EventComponent = ({ event }) => {
		//vista mensile solo iniziali
		if (view === "month") {
			const isExpanded = expandedId === event.id;

			return (
				<div className="flex flex-col items-center select-none">
					{/* PALLINO CON INIZIALI */}
					<div
						onClick={(e) => {
							e.stopPropagation();
							setExpandedId(isExpanded ? null : event.id);
						}}
						className="flex items-center justify-center cursor-pointer"
						style={{
							width: "25px",
							height: "25px",
							borderRadius: "50%",
							backgroundColor: event.color,
							color: "white",
							fontSize: "11px",
							fontWeight: "bold",
							margin: "0 auto",
							lineHeight: 1,
							userSelect: "none",
						}}
					>
						{event.title}
					</div>

					{/* DETTAGLI QUANDO ESPANSO */}
					{isExpanded && (
						<div className="text-[10px] flex flex-col items-center">
							<div className="italic">{event.ruolo}</div>
							<div className="italic">{event.fullName}</div>
							{event.orariMultipli?.map((o, i) => (
								<div key={i}>{o}</div>
							))}
						</div>
					)}
				</div>
			);
		}

		return (
			<div className="flex flex-col gap-1 select-none">
				<div className="flex items-center gap-2">
					<div
						className="w-10 h-7 rounded-xl flex items-center justify-center text-[12px] font-bold"
						style={{ backgroundColor: "rgba(0,0,0,0.25)" }}
					>
						{event.title}
					</div>
				</div>

				{expandedId === event.id && (
					<div className="text-[12px] opacity-90">
						<div className="italic font-bold">{event.fullName}</div>
						<div className="italic">{event.ruolo}</div>
						<div>{event.orario}</div>
					</div>
				)}
			</div>
		);
	};

	/* RENDER */
	return (
		<div ref={wrapperRef} className="w-full flex flex-col">
			{/* FILTRI */}
			<div className="flex flex-wrap items-center gap-3 px-6 mt-4">
				{departments.map((dept) => {
					const active = selectedDepartments.includes(dept);
					const color = getDepartmentColor(dept);

					return (
						<div
							key={dept}
							onClick={() => toggleDepartment(dept)}
							className={`
				flex items-center gap-3 px-4 py-2 rounded-xl cursor-pointer select-none
				text-sm font-semibold border shadow-sm transition-all
				${
					active
						? "text-white"
						: isDark
						? "text-white border-white/30 bg-white/5"
						: "text-[#090c64] border-gray-300 bg-white/70"
				}
				`}
							style={{ backgroundColor: active ? color : undefined }}
						>
							<div
								className={`
					w-4 h-4 rounded flex items-center justify-center text-xs font-bold
					${active ? "bg-white text-black" : "border border-current"}
				`}
							>
								{active ? "✓" : ""}
							</div>
							{dept}
							<div
								className="w-3 h-3 rounded-xl ml-1"
								style={{ backgroundColor: color }}
							/>
						</div>
					);
				})}

				{/* SELECT ALL */}
				<button
					onClick={() => setSelectedDepartments([...departments])}
					className={`
			px-4 py-2 rounded-xl text-sm font-semibold border shadow-sm transition
			${
				isDark
					? "text-white border-white/30 bg-white/10 hover:bg-white/20"
					: "text-white border-gray-900 bg-[#090c64] hover:bg-[#090c64]/70"
			}
			`}
				>
					Seleziona tutti
				</button>

				{/* DESELECT ALL */}
				<button
					onClick={() => setSelectedDepartments([])}
					className={`
			px-4 py-2 rounded-xl text-sm font-semibold border shadow-sm transition
			${
				isDark
					? "text-white border-white/30 bg-white/10 hover:bg-white/20"
					: "text-white border-gray-900 bg-[#090c64] hover:bg-[#090c64]/70"
			}
			`}
				>
					Deseleziona tutti
				</button>
			</div>

			{/* CALENDARIO */}
			<div className="w-full min-h-[700px] flex justify-center">
				<div className="w-full mt-3 mr-6 h-full relative">
					<Calendar
						localizer={localizer}
						events={eventi}
						startAccessor="start"
						endAccessor="end"
						view={view}
						onView={(v) => setView(v)}
						defaultView="week"
						views={["month", "day", "week"]}
						culture="it"
						eventPropGetter={eventStyleGetter}
						components={{
							event: EventComponent,
							toolbar: (props) => <CustomToolbar {...props} view={view} />,
						}}
						onSelectEvent={(e) =>
							setExpandedId((prev) => (prev === e.id ? null : e.id))
						}
						style={{ height: 800 }}
						min={new Date(1970, 0, 1, 7, 0)} // dalle 07:00
						max={new Date(1970, 0, 1, 20, 0)} // fino alle 20:00 (opzionale)
						/* opzionale: dove scrollare di default */
						scrollToTime={new Date(1970, 0, 1, 7, 0)}
						className={isDark ? "text-white" : "text-[#090c64]"}
					/>
				</div>
			</div>
		</div>
	);
};

export default CalendarBox;
