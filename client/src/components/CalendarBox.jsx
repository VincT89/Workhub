import { useMemo, useState, useEffect, useRef } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { it } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useTheme } from "../context/ThemeContext";
import { useSelector, useDispatch } from "react-redux";

import { fetchUsersAsync } from "../store/feature/userSlice";
import { fetchAllShiftsAsync } from "../store/feature/shiftsSlice";

/* LOCALIZZAZIONE */
const localizer = dateFnsLocalizer({
	format,
	parse,
	getDay,
	startOfWeek: () => startOfWeek(new Date(), { locale: it }),
	locales: { it },
});

/* UTILS */
const getInitials = (firstName, lastName) => {
	if (!firstName && !lastName) return "?";
	const f = firstName?.[0] ?? "";
	const l = lastName?.[0] ?? "";
	return (f + l).toUpperCase();
};

const SHIFT_HOURS = {
	morning: "08:00-13:00",
	afternoon: "14:00-18:00",
};

const weekOffset = {
	Lunedì: 0,
	Martedì: 1,
	Mercoledì: 2,
	Giovedì: 3,
	Venerdì: 4,
	Sabato: 5,
};

/* TOOLBAR */
const CustomToolbar = ({ label, view, onView, onNavigate }) => (
	<div className="flex items-center justify-between w-full px-6 py-3 my-5 rounded-xl backdrop-blur-md shadow-md bg-white/20 dark:bg-white/10 border border-white/30 dark:border-white/10">
		{/* NAV */}
		<div className="flex items-center gap-2">
			<button
				onClick={() => onNavigate("PREV")}
				className="px-4 py-2 rounded-xl bg-white/70 dark:bg-white/10 text-[#090c64] dark:text-[#090c64] border border-white/40 dark:border-white/90 font-semibold hover:bg-[#090c64] hover:text-white transition"
			>
				‹
			</button>

			<button
				onClick={() => onNavigate("NEXT")}
				className="px-4 py-2 rounded-xl bg-white/70 dark:bg-white/10 text-[#090c64] dark:text-[#090c64] border border-white/40 dark:border-white/90 font-semibold hover:bg-[#090c64] hover:text-white transition"
			>
				›
			</button>
		</div>

		<span className="text-xl font-extrabold text-[#090c64]">{label}</span>

		{/* VIEW SELECT */}
		<div className="flex items-center gap-2">
			{["month", "week", "day"].map((v) => (
				<button
					key={v}
					onClick={() => onView(v)}
					className={`
						px-4 py-2 rounded-xl font-semibold border transition
						${
							view === v
								? "bg-[#090c64] text-white border-[#090c64]"
								: "bg-white/70 dark:bg-white/10 text-[#090c64] border-white/40 hover:bg-[#090c64] hover:text-white"
						}
					`}
				>
					{v === "month" ? "Mese" : v === "week" ? "Settimana" : "Giorno"}
				</button>
			))}
		</div>
	</div>
);

/* MAIN COMPONENT */
const CalendarBox = () => {
	const { theme } = useTheme();
	const isDark = theme === "dark";

	const dispatch = useDispatch();
	const token = useSelector((s) => s.auth.token);
	const loggedUser = useSelector((s) => s.auth.user);

	const users = useSelector((s) => s.users.list);
	const shifts = useSelector((s) => s.shifts.list);
	const eventsData = useSelector((s) => s.events.events);

	const [mode, setMode] = useState("turni");
	const [view, setView] = useState("week");
	const [expandedId, setExpandedId] = useState(null);
	const wrapperRef = useRef();

	/* LOAD DATA */
	useEffect(() => {
		if (!token) return;
		dispatch(fetchUsersAsync(token));
		dispatch(fetchAllShiftsAsync({ token }));
	}, [token]);

	/* Click fuori per chiudere */
	useEffect(() => {
		const handle = (e) => {
			if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
				setExpandedId(null);
			}
		};
		document.addEventListener("mousedown", handle);
		return () => document.removeEventListener("mousedown", handle);
	}, []);

	/* Employee List */
	const EmployeeList = useMemo(() => {
		if (!users || !shifts) return [];

		const employees = new Map();

		// base utenti
		users.forEach((u) => {
			employees.set(u._id, {
				id: u._id,
				firstName: u.firstName,
				lastName: u.lastName,
				fullName: `${u.firstName} ${u.lastName}`,
				email: u.email,
				department: u.department || "Senza reparto",
				matricola: u.personnelNumber,
				turni: [],
			});
		});

		// mapping giorni
		const weekdayMap = {
			monday: "Lunedì",
			tuesday: "Martedì",
			wednesday: "Mercoledì",
			thursday: "Giovedì",
			friday: "Venerdì",
			saturday: "Sabato",
		};

		// turni reali
		shifts.forEach((shiftDoc) => {
			const empId =
				typeof shiftDoc.user === "string" ? shiftDoc.user : shiftDoc.user?._id;
			const emp = employees.get(empId);
			if (!emp) return;

			for (const [dayKey, val] of Object.entries(shiftDoc.shifts)) {
				const giorno = weekdayMap[dayKey];
				if (!giorno) continue;

				const orari = [];
				if (val?.morning) orari.push(SHIFT_HOURS.morning);
				if (val?.afternoon) orari.push(SHIFT_HOURS.afternoon);

				if (orari.length > 0) {
					emp.turni.push({ giorno, orari });
				}
			}
		});

		return [...employees.values()];
	}, [users, shifts]);

	/* REPARTI DINAMICI */
	const departments = useMemo(
		() => [...new Set(EmployeeList.map((e) => e.department))],
		[EmployeeList]
	);

	/* COLORI REPARTO */
	const roleColorMap = useMemo(() => {
		const palette = [
			"#6C8AE4",
			"#5EC2E0",
			"#A88EF0",
			"#F5A97F",
			"#8DD0A6",
			"#7BB8E8",
			"#F97373",
			"#FACC15",
			"#2DD4BF",
			"#4ADE80",
		];

		const map = {};
		departments.forEach((d, i) => {
			map[d] = palette[i % palette.length];
		});
		return map;
	}, [departments]);

	const getDepartmentColor = (d) => roleColorMap[d] || "#475569";

	/* FILTRO REPARTI */
	const [selectedDepartments, setSelectedDepartments] = useState([]);
	useEffect(() => setSelectedDepartments(departments), [departments]);

	/* MERGE MENSILE */
	const mergeMonthly = (events) => {
		const map = new Map();
		for (const ev of events) {
			const key = `${ev.fullName}-${ev.start.toDateString()}`;
			if (!map.has(key)) {
				map.set(key, { ...ev, id: key, orariMultipli: [ev.orario] });
			} else {
				map.get(key).orariMultipli.push(ev.orario);
			}
		}
		return [...map.values()];
	};

	/* EVENTI TURNI REALI */
	const eventiTurni = useMemo(() => {
		if (!EmployeeList || !loggedUser) return [];

		const result = [];
		const today = new Date();
		const monday = startOfWeek(today, { locale: it });

		const weeks = 52;

		for (let w = -weeks; w <= weeks; w++) {
			const startWeek = new Date(monday);
			startWeek.setDate(monday.getDate() + w * 7);

			EmployeeList.forEach((e) => {
				if (loggedUser.role === "user" && loggedUser.email !== e.email) return;
				if (
					loggedUser.role !== "user" &&
					!selectedDepartments.includes(e.department)
				)
					return;

				e.turni.forEach((t) => {
					const offset = weekOffset[t.giorno];
					if (offset === undefined) return;

					const currentDay = new Date(startWeek);
					currentDay.setDate(startWeek.getDate() + offset);

					t.orari.forEach((range, idx) => {
						const [sh, sm] = range.split("-")[0].split(":").map(Number);
						const [eh, em] = range.split("-")[1].split(":").map(Number);

						const start = new Date(
							currentDay.getFullYear(),
							currentDay.getMonth(),
							currentDay.getDate(),
							sh,
							sm
						);
						const end = new Date(
							currentDay.getFullYear(),
							currentDay.getMonth(),
							currentDay.getDate(),
							eh,
							em
						);

						result.push({
							id: `${e.id}-${t.giorno}-${idx}-${w}`,
							title: getInitials(e.firstName, e.lastName),
							fullName: e.fullName,
							department: e.department,
							orario: range,
							start,
							end,
							type: "shift",
							color: getDepartmentColor(e.department),
						});
					});
				});
			});
		}

		return view === "month" ? mergeMonthly(result) : result;
	}, [EmployeeList, loggedUser, selectedDepartments, view]);

	/* EVENTI AZIENDALI CON ORARIO 08:00 - 13:00 */
	const eventiAziendali = useMemo(() => {
		return (eventsData || []).map((ev) => {
			//  orari fissi
			const start = new Date(ev.startDate);
			start.setHours(8, 0, 0, 0); // 08:00

			const end = new Date(ev.endDate);
			end.setHours(13, 0, 0, 0); // 13:00

			return {
				id: ev._id,
				title: ev.title,
				fullName: "Evento aziendale",
				department: "Eventi",
				orario: "08:00-13:00",
				start,
				end,
				type: "event",
				color: "#F59E0B",
			};
		});
	}, [eventsData]);

	const eventi = mode === "turni" ? eventiTurni : eventiAziendali;

	/* STILE EVENTI */
	const eventStyleGetter = (event) => ({
		style: {
			backgroundColor: event.color,
			color: "white",
			borderRadius: "10px",
			padding: expandedId === event.id ? "10px" : "6px 10px",
			fontSize: expandedId === event.id ? "15px" : "13px",
			transform: expandedId === event.id ? "scale(1.05)" : "scale(1)",
			transition: "all .18s ease",
			zIndex: expandedId === event.id ? 10 : 1,
		},
	});

	/* RENDER EVENTO */
	const EventComponent = ({ event }) => {
		const expanded = expandedId === event.id;

		if (view === "month") {
			return (
				<div className="flex flex-col items-center select-none">
					<div
						onClick={(e) => {
							e.stopPropagation();
							setExpandedId(expanded ? null : event.id);
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
						}}
					>
						{event.title}
					</div>

					{expanded && (
						<div className="text-[10px] flex flex-col items-center mt-1">
							<div className="italic font-bold">{event.fullName}</div>
							<div className="italic">{event.department}</div>
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
					<div className="w-10 h-7 rounded-xl flex items-center justify-center text-[12px] font-bold bg-black/20">
						{event.title}
					</div>
				</div>

				{expanded && (
					<div className="text-[12px] opacity-90">
						<div className="italic font-bold">{event.fullName}</div>
						<div className="italic">{event.department}</div>
						{event.orario && <div>{event.orario}</div>}
					</div>
				)}
			</div>
		);
	};

	/* RENDER */
	return (
		<div ref={wrapperRef} className="w-full flex flex-col">
			{/* REPARTI */}
			<div className="flex flex-wrap items-center gap-3 px-6 mt-4">
				{/* FILTRI REPARTI — SOLO ADMIN  */}
				{mode === "turni" &&
					loggedUser.role !== "user" &&
					departments.map((dept) => {
						const active = selectedDepartments.includes(dept);
						const color = getDepartmentColor(dept);

						return (
							<div
								key={dept}
								onClick={() =>
									setSelectedDepartments((prev) =>
										prev.includes(dept)
											? prev.filter((d) => d !== dept)
											: [...prev, dept]
									)
								}
								className={`
                        flex items-center gap-3 px-4 py-2 rounded-xl cursor-pointer select-none
                        text-sm font-semibold border shadow-sm transition-all
                        ${active ? "text-white" : "text-[#090c64] bg-white/70"}
                    `}
								style={{ backgroundColor: active ? color : undefined }}
							>
								<div
									className={`
                            w-4 h-4 rounded flex items-center justify-center text-xs font-bold
                            ${
															active
																? "bg-white text-black"
																: "border border-current"
														}
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

				{/* SELEZIONA / DESELEZIONA — SOLO ADMIN */}
				{mode === "turni" && loggedUser.role !== "user" && (
					<>
						<button
							onClick={() => setSelectedDepartments([...departments])}
							className="px-4 py-2 rounded-xl text-sm font-semibold border shadow-sm bg-[#090c64] text-white"
						>
							Seleziona tutti
						</button>

						<button
							onClick={() => setSelectedDepartments([])}
							className="px-4 py-2 rounded-xl text-sm font-semibold border shadow-sm bg-[#090c64] text-white"
						>
							Deseleziona tutti
						</button>
					</>
				)}

				{/* SELECT MODE — SEMPRE VISIBILE */}
				<select
					value={mode}
					onChange={(e) => setMode(e.target.value)}
					className="ml-auto px-6 py-2 rounded-xl text-sm font-semibold border shadow-sm bg-[#090c64] text-white"
				>
					<option value="turni">Turni</option>
					<option value="eventi">Eventi</option>
				</select>
			</div>

			{/* CALENDARIO */}
			<div className="w-full min-h-[700px] flex justify-center">
				<div className="w-full mt-3 mr-6 h-full relative">
					<Calendar
						localizer={localizer}
						events={eventi}
						view={view}
						onView={setView}
						startAccessor="start"
						endAccessor="end"
						views={["month", "week", "day"]}
						defaultView="week"
						culture="it"
						scrollToTime={new Date(1970, 0, 1, 7, 0)}
						min={new Date(1970, 0, 1, 7, 0)}
						max={new Date(1970, 0, 1, 20, 0)}
						components={{
							event: EventComponent,
							toolbar: (props) => <CustomToolbar {...props} view={view} />,
						}}
						eventPropGetter={eventStyleGetter}
						onSelectEvent={(e) =>
							setExpandedId((prev) => (prev === e.id ? null : e.id))
						}
						style={{ height: 800 }}
						className={isDark ? "text-white" : "text-[#090c64]"}
					/>
				</div>
			</div>
		</div>
	);
};

export default CalendarBox;
