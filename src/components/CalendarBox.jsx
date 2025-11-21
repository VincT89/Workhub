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
            px-4 py-2 rounded-full 
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
            px-4 py-2 rounded-full 
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
					onClick={() => onView("week")}
					className={`
            px-4 py-2 rounded-full font-semibold border transition
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
            px-4 py-2 rounded-full font-semibold border transition
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
	let departments = [];

	if (loggedUser?.role === "admin") {
		// ADMIN → vede tutti i reparti
		departments = Array.from(new Set(EmployeeList.map((e) => e.ruolo)));
	}

	if (loggedUser?.role === "supervisor") {
		// SUPERVISOR → vede solo il suo reparto
		departments = [loggedUser.reparto];
	}

	if (loggedUser?.role === "user") {
		// USER → solo il suo reparto
		departments = [loggedUser.reparto];
	}

	/* STATO DEI REPARTI VISIBILI */
  const [selectedDepartments, setSelectedDepartments] = useState(departments);
  
	/* ALLINEA AUTOMATICAMENTE selectedDepartments AL RUOLO UTENTE */
	useEffect(() => {
		setSelectedDepartments(departments);
	}, [loggedUser, EmployeeList]);

	/* GENERA EVENTI in base ai turni */
	const eventi = useMemo(() => {
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
				if (loggedUser?.role === "user") {
					if (dip.matricola !== loggedUser.matricola) return;
				}

				// SUPERVISOR — vede solo chi ha il suo stesso reparto
				if (loggedUser?.role === "supervisor") {
					if (dip.ruolo !== loggedUser.reparto) return;
				}

				// ADMIN — vede tutto

				// Filtro manuale dei reparti già esistente
				if (!selectedDepartments.includes(dip.ruolo)) return;

				(dip.turni || []).forEach((turno) => {
					const offset = weekOffset[turno.giorno];
					if (offset === undefined) return;

					const base = new Date(
						monday.getFullYear(),
						monday.getMonth(),
						monday.getDate() + offset
					);

					(turno.orari || []).forEach((range, i) => {
						const [s, e] = range.split("-");
						const [sh, sm] = s.split(":").map(Number);
						const [eh, em] = e.split(":").map(Number);

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
							ruolo: dip.ruolo,
							orario: range,
							start,
							end,
							color: getDepartmentColor(dip.ruolo),
						});
					});
				});
			});
		}

		return result;
	}, [EmployeeList, loggedUser, selectedDepartments]);

	/* EVENT STYLE */
	const eventStyleGetter = (event) => ({
		style: {
			backgroundColor: event.color,
			color: "white",
			borderRadius: "12px",
			padding: expandedId === event.id ? "10px" : "4px 6px",
			fontSize: expandedId === event.id ? "13px" : "11px",
			transform: expandedId === event.id ? "scale(1.12)" : "scale(1)",
			transition: "all .18s ease",
			zIndex: expandedId === event.id ? 10 : 1,
		},
	});

	const EventComponent = ({ event }) => (
		<div className="flex flex-col gap-1 select-none">
			<div className="flex items-center gap-2">
				<div
					className="w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-bold"
					style={{ backgroundColor: "rgba(0,0,0,0.25)" }}
				>
					{event.title}
				</div>
				<span className="font-semibold truncate">{event.fullName}</span>
			</div>

			{expandedId === event.id && (
				<div className="text-[11px] opacity-90">
					<div className="italic">{event.ruolo}</div>
					<div>{event.orario}</div>
				</div>
			)}
		</div>
	);

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
                flex items-center gap-3 px-4 py-2 rounded-full cursor-pointer select-none
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
								className="w-3 h-3 rounded-full ml-1"
								style={{ backgroundColor: color }}
							/>
						</div>
					);
				})}

				{/* SELECT ALL */}
				<button
					onClick={() => setSelectedDepartments([...departments])}
					className={`
            px-4 py-2 rounded-full text-sm font-semibold border shadow-sm transition
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
            px-4 py-2 rounded-full text-sm font-semibold border shadow-sm transition
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
						views={["day", "week"]}
						culture="it"
						eventPropGetter={eventStyleGetter}
						components={{
							event: EventComponent,
							toolbar: (props) => <CustomToolbar {...props} view={view} />,
						}}
						onSelectEvent={(e) =>
							setExpandedId((prev) => (prev === e.id ? null : e.id))
						}
						style={{ height: 700 }}
						className={isDark ? "text-white" : "text-[#090c64]"}
					/>
				</div>
			</div>
		</div>
	);
};

export default CalendarBox;
