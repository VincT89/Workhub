import React, { useEffect, useState, useMemo } from "react";
import { useTheme } from "../../../context/ThemeContext";
import { useLanguage } from "../../../context/LanguageContext";
import { UserCircleIcon, CalendarCheckIcon, TrashIcon } from "@phosphor-icons/react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { fetchUserByIdAsync } from "../../../store/feature/userSlice.js";
import { fetchPointsOfSalesAsync } from "../../../store/feature/pointOfSalesSlice.js";
import {
	fetchUserShiftsAsync,
	updateShiftAsync,
} from "../../../store/feature/shiftsSlice.js";

/* leave slice */
import {
	fetchLeaveByUserIdAsync,
	updateLeaveStatusAsync,
} from "../../../store/feature/userLeave.js";
import { useRef } from "react";

const StatusDot = ({ status }) => {
	const colors = {
		approved: "bg-green-500",
		pending: "bg-yellow-500",
		denied: "bg-red-500",
	};

	return (
		<span
			className={`inline-block w-3 h-3 rounded-full ${
				colors[status] || "bg-gray-400"
			}`}
		></span>
	);
};

const AdminEmployeeDetailsPage = () => {
	const { theme } = useTheme();
	const { t } = useLanguage();
	const dispatch = useDispatch();
	const { id } = useParams();

	const textColor = theme === "dark" ? "text-white" : "text-[#090c64]";

	const {
		selected: user,
		loading,
		error,
	} = useSelector((state) => state.users) || {};

	const { list: pointsOfSale = [] } = useSelector((state) => state.pos) || {};

	const {
		current: userShifts,
		loading: shiftsLoading,
		error: shiftsError,
	} = useSelector((state) => state.shifts) || {};

	const leave = useSelector((state) => state.leave.record);
	const leaveLoading = useSelector((state) => state.leave.loading);
	const leaveError = useSelector((state) => state.leave.error);
	const prevIdRef = useRef(null);

	const token = useSelector((state) => state.auth?.token);

	const [workplaceName, setWorkplaceName] = useState("");
	const [shiftMessage, setShiftMessage] = useState("");

	// Giorni settimanali
	const weekDays = [
		{ key: "monday", label: t("lunedi") },
		{ key: "tuesday", label: t("martedi") },
		{ key: "wednesday", label: t("mercoledi") },
		{ key: "thursday", label: t("giovedi") },
		{ key: "friday", label: t("venerdi") },
		{ key: "saturday", label: t("sabato") },
	];

	// FETCH USER + POS + SHIFTS + LEAVE
	useEffect(() => {
		if (!id || !token) return;
		if (prevIdRef.current === id) return;
		prevIdRef.current = id;
		dispatch(fetchUserByIdAsync({ id, token }));
		dispatch(fetchPointsOfSalesAsync({ token }));
		dispatch(fetchLeaveByUserIdAsync({ userId: id, token }));
	}, [id, token, dispatch]);

	// Imposta nome sede lavorativa
	useEffect(() => {
		if (!user?.workplace) {
			setWorkplaceName("");
			return;
		}

		if (typeof user.workplace === "string") {
			const found = pointsOfSale.find((p) => p._id === user.workplace);
			if (found) {
				setWorkplaceName(`${found.name} – ${found.location?.city || ""}`);
			} else {
				setWorkplaceName(user.workplace);
			}
		} else if (typeof user.workplace === "object") {
			setWorkplaceName(
				`${user.workplace.name} – ${user.workplace.location?.city || ""}`
			);
		}
	}, [user, pointsOfSale]);

	const anagrafica = useMemo(() => {
		if (!user) return null;

		return {
			nome: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
			ruolo: user.department || "",
			matricola: user.personnelNumber ?? "",
			email: user.email || "",
			telefono: user.phone || "",
			sede: workplaceName,
			contratto: user.contractType || "",
			assunzione: user.hireDate
				? new Date(user.hireDate).toLocaleDateString("it-IT")
				: "",
		};
	}, [user, workplaceName]);

	// Funzione helper per mostrare messaggio
	const showShiftMessage = (msg) => {
		setShiftMessage(msg);
		setTimeout(() => setShiftMessage(""), 2500);
	};

	// Lista preimpostata dei turni esistenti per visualizzazione
	const existingShifts = useMemo(() => {
		if (!userShifts?.shifts) return [];

		const result = [];
		weekDays.forEach((day) => {
			const dayData = userShifts.shifts[day.key] || {};
			if (dayData.morning) {
				result.push({
					dayKey: day.key,
					labelDay: day.label,
					period: "morning",
					start: "08:00",
					end: "13:00",
				});
			}
			if (dayData.afternoon) {
				result.push({
					dayKey: day.key,
					labelDay: day.label,
					period: "afternoon",
					start: "14:00",
					end: "18:00",
				});
			}
		});
		return result;
	}, [userShifts, weekDays]);

	// CREA TURNO (Mattina / Pomeriggio) se non esiste già
	const handleCreateShift = async (dayKey, period) => {
		if (!token || !userShifts?._id) return;

		const currentValue =
			userShifts?.shifts?.[dayKey]?.[period] === true ? true : false;

		if (currentValue) {
			showShiftMessage(t("turnoPresente"));
			return;
		}

		try {
			await dispatch(
				updateShiftAsync({
					id: userShifts._id,
					day: dayKey,
					period,
					value: true,
					token,
				})
			).unwrap();
			showShiftMessage(t("turnoCreato"));
		} catch (err) {
			console.error("Errore creazione turno:", err);
			showShiftMessage(t("erroreCreazioneTurno"));
		}
	};

	// ELIMINA TURNO (singolo giorno/fascia)
	const handleDeleteSingleShift = async (dayKey, period) => {
		if (!token || !userShifts?._id) return;

		try {
			await dispatch(
				updateShiftAsync({
					id: userShifts._id,
					day: dayKey,
					period,
					value: false,
					token,
				})
			).unwrap();
			showShiftMessage(t("turnoEliminato"));
		} catch (err) {
			console.error("Errore eliminazione turno:", err);
			showShiftMessage(t("erroreEliminazioneTurno"));
		}
	};

	// RICHIESTE REALI DAL BACKEND
	const ferie =
		leave?.requestedHours?.filter((r) => r.mode === "vacation") || [];
	const permessi =
		leave?.requestedHours?.filter((r) => r.mode === "leave") || [];

	const formatDate = (date) => {
		if (!date) return "";
		const d = new Date(date);
		return `${String(d.getDate()).padStart(2, "0")}/${String(
			d.getMonth() + 1
		).padStart(2, "0")}/${d.getFullYear()}`;
	};

	// APPROVA / RIFIUTA FERIE
	const handleAccettaFerie = async (richiesta) => {
		if (!token || !richiesta?._id) return;
		try {
			await dispatch(
				updateLeaveStatusAsync({
					requestId: richiesta._id,
					status: "approved",
					token,
				})
			).unwrap();
		} catch (err) {
			console.error("Errore approvazione ferie:", err);
		}
	};

	const handleRifiutaFerie = async (richiesta) => {
		if (!token || !richiesta?._id) return;
		try {
			await dispatch(
				updateLeaveStatusAsync({
					requestId: richiesta._id,
					status: "denied",
					token,
				})
			).unwrap();
		} catch (err) {
			console.error("Errore rifiuto ferie:", err);
		}
	};

	// APPROVA / RIFIUTA PERMESSI
	const handleAccettaPermesso = async (richiesta) => {
		if (!token || !richiesta?._id) return;
		try {
			await dispatch(
				updateLeaveStatusAsync({
					requestId: richiesta._id,
					status: "approved",
					token,
				})
			).unwrap();
		} catch (err) {
			console.error("Errore approvazione permesso:", err);
		}
	};

	const handleRifiutaPermesso = async (richiesta) => {
		if (!token || !richiesta?._id) return;
		try {
			await dispatch(
				updateLeaveStatusAsync({
					requestId: richiesta._id,
					status: "denied",
					token,
				})
			).unwrap();
		} catch (err) {
			console.error("Errore rifiuto permesso:", err);
		}
	};

	// TOP BOX
	// Calcolo giorni lavorati dalla configurazione turni
	const giorniLavorati = useMemo(() => {
		if (!userShifts?.shifts) return 0;

		let count = 0;

		weekDays.forEach((day) => {
			const d = userShifts.shifts[day.key] || {};
			if (d.morning || d.afternoon) count += 1;
		});

		return count;
	}, [userShifts, weekDays]);

	// Totale attività = numero totale richieste (ferie + permessi)
	const totalActivities = leave?.requestedHours?.length || 0;

	// TOP BOX
	const topButtons = [
		{ label: t("giorniLavorati"), number: giorniLavorati },
		{ label: t("ferieResidue"), number: leave?.vacationHours ?? 0 },
		{ label: t("permessiResidui"), number: leave?.leaveHours ?? 0 },
		{ label: t("richieste"), number: totalActivities },
	];

	if (!token) return null;

	if (loading && !anagrafica)
		return <p className="p-4">{t("caricamentoDipendenti")}</p>;

	if (error && !anagrafica)
		return (
			<p className="p-4 text-red-500">
				{t("erroreCaricamentoDipendenti")}: {error}
			</p>
		);

	if (!anagrafica) return <p className="p-4">{t("nessunDipendenteTrovato")}</p>;
	if(leaveLoading) return <p className="p-4">{t("caricamentoRichieste")}</p>;
	return (
		<div className=" adminEmployee w-full h-full flex flex-col gap-8 overflow-y-auto p-4">
			{/* TOP BOX */}
			<div className="grid grid-cols-4 gap-6 mb-6 w-full">
				{topButtons.map((btn, i) => (
					<div
						key={i}
						className={`flex flex-col items-center justify-center rounded-xl px-4 py-3 backdrop-blur-sm 
              border border-white/30 shadow-md ${textColor} bg-white/20`}
					>
						<span className="font-bold">{btn.label}</span>
						<span className="text-sm opacity-70 font-semibold">
							{btn.number}
						</span>
					</div>
				))}
			</div>

			{/* ANAGRAFICA + TURNI */}
			<div className="flex gap-6">
				{/* ANAGRAFICA */}
				<div className="flex-1 p-6 rounded-xl border border-white/30 shadow-md bg-white/20 backdrop-blur-sm">
					<div className="flex items-center gap-3 mb-4">
						<UserCircleIcon size={32} color={theme === "dark" ? "white" : "#090c64"} weight="duotone" />
						<h2 className={`text-lg font-bold ${textColor}`}>
							{t("anagrafica")}
						</h2>
					</div>

					<div className={`flex flex-col gap-2 ${textColor}`}>
						<div>
							<strong>{t("nome")}:</strong> {anagrafica.nome}
						</div>
						<div>
							<strong>{t("ruolo")}:</strong> {anagrafica.ruolo}
						</div>
						<div>
							<strong>{t("matricola")}:</strong>{" "}
							{anagrafica.matricola}
						</div>
						<div>
							<strong>{t("email")}:</strong> {anagrafica.email}
						</div>
						<div>
							<strong>{t("telefono")}:</strong> {anagrafica.telefono}
						</div>
						<div>
							<strong>{t("sedeLavorativa")}:</strong> {anagrafica.sede}
						</div>
						<div>
							<strong>{t("tipoContratto")}:</strong> {anagrafica.contratto}
						</div>
						<div>
							<strong>{t("dataAssunzione")}:</strong> {anagrafica.assunzione}
						</div>
					</div>
				</div>

				{/* TURNI (ADMIN CONFIGURA) */}
				<div className="flex-1 p-6 rounded-xl border border-white/30 shadow-md backdrop-blur-sm bg-white/20">
					<div className="flex items-center gap-3 mb-2">
						<CalendarCheckIcon size={32} color={theme === "dark" ? "white" : "#090c64"} weight="duotone" />
						<h2 className={`text-lg font-bold leading-none ${textColor}`}>
							{t("turniSettimanali")}
						</h2>
					</div>

					{/* Messaggi turni */}
					{shiftMessage && (
						<div className="mb-3 px-3 py-2 rounded-xl bg-green-500 text-white text-sm font-semibold">
							{shiftMessage}
						</div>
					)}
					{shiftsError && (
						<div className="mb-3 px-3 py-2 rounded-xl bg-red-500 text-white text-sm font-semibold">
							{shiftsError}
						</div>
					)}

					{/* Box lista con i bottoni mattina pomeriggio */}
					<div className="mb-4 flex flex-col gap-2">
						{weekDays.map((day) => {
							const dayData = userShifts?.shifts?.[day.key] || {};
							const morningActive = !!dayData.morning;
							const afternoonActive = !!dayData.afternoon;

							const hasAnyShift = morningActive || afternoonActive;

							return (
								<div
									key={day.key}
									className="flex items-center justify-between bg-white/40 dark:bg-white/20 rounded-xl p-2 shadow-sm"
								>
									{/* GIORNO */}
									<span className="font-semibold">{day.label}</span>

									{/* SEZIONE DESTRA */}
									<div className="flex items-center gap-2">
										{/* ----- MATTINA ----- */}
										{morningActive ? (
											<span className="px-3 py-1 rounded-xl bg-[#090c64] text-white text-xs font-semibold">
												08:00 - 13:00
											</span>
										) : (
											<button
												onClick={() => handleCreateShift(day.key, "morning")}
												className="px-3 py-1 rounded-xl text-sm font-semibold bg-white/40 text-[#090c64]"
											>
												08:00 - 13:00
											</button>
										)}

										{/* ----- POMERIGGIO ----- */}
										{afternoonActive ? (
											<span className="px-3 py-1 rounded-xl bg-[#090c64] text-white text-xs font-semibold">
												14:00 - 18:00
											</span>
										) : (
											<button
												onClick={() => handleCreateShift(day.key, "afternoon")}
												className="px-3 py-1 rounded-xl text-sm font-semibold bg-white/40 text-[#090c64]"
											>
												14:00 - 18:00
											</button>
										)}

										{/* ----- CESTINO (UNICO) ----- */}
										{hasAnyShift && (
											<button
												onClick={() => {
													if (morningActive)
														handleDeleteSingleShift(day.key, "morning");
													if (afternoonActive)
														handleDeleteSingleShift(day.key, "afternoon");
												}}
												className="p-2 bg-white/60 rounded-xl cursor-pointer"
											>
												<TrashIcon size={18} color={theme === "dark" ? "white" : "#090c64"} weight="duotone" />
											</button>
										)}
									</div>
								</div>
							);
						})}
					</div>
				</div>
			</div>

			{/* --------- SEZIONE 3: FERIE E PERMESSI (reali) --------- */}
			<div className="flex gap-6">
				{/* FERIE */}
				<div className="flex-1 p-6 rounded-xl border border-white/30 shadow-md backdrop-blur-sm bg-white/20">
					<div className="flex items-center gap-3 mb-4">
						<h2 className={`text-lg font-bold leading-none ${textColor}`}>
							{t("richiestaFerie")}
						</h2>
					</div>

					<div className="flex flex-col gap-2">
						{ferie.map((fe) => (
							<div
								key={fe._id}
								className="flex items-center justify-between bg-white/40 dark:bg-white/20 rounded-xl p-2 shadow-sm"
							>
								<span className={`font-semibold ${textColor}`}>
									{anagrafica.nome} - {t("dal")} {formatDate(fe.from)}
									, {t("al")} {formatDate(fe.to)} ({fe.hours}h)
								</span>

								<div className="flex items-center gap-5">
									<StatusDot status={fe.status} />

									<button
										onClick={() => handleAccettaFerie(fe)}
										className="bg-[#090c64] text-white text-sm px-3 py-1 rounded-xl cursor-pointer font-semibold transition"
									>
										{t("accetta")}
									</button>
									<button
										onClick={() => handleRifiutaFerie(fe)}
										className="bg-white/30 dark:bg-white/10 text-[#090c64] text-sm px-3 py-1 rounded-xl cursor-pointer font-semibold transition"
									>
										{t("rifiuta")}
									</button>
								</div>
							</div>
						))}
						{ferie.length === 0 && (
							<p className="text-sm opacity-70">{t("nessunaRichiestaFerie")}</p>
						)}
					</div>
				</div>

				{/* PERMESSI */}
				<div className="flex-1 p-6 rounded-xl border border-white/30 shadow-md backdrop-blur-sm bg-white/20">
					<div className="flex items-center gap-3 mb-4">
						<h2 className={`text-lg font-bold leading-none ${textColor}`}>
							{t("richiestaPermessi")}
						</h2>
					</div>

					<div className="flex flex-col gap-2">
						{permessi.map((tu) => (
							<div
								key={tu._id}
								className="flex items-center justify-between bg-white/40 dark:bg-white/20 rounded-xl p-2 shadow-sm"
							>
								<span className={`font-semibold ${textColor}`}>
									{anagrafica.nome} - {formatDate(tu.from)} - {tu.timeFrom} -{" "}
									{tu.timeTo} ({tu.hours}h)
								</span>

								<div className="flex items-center gap-5">
									<StatusDot status={tu.status} />

									<button
										onClick={() => handleAccettaPermesso(tu)}
										className="bg-[#090c64] text-white text-sm px-3 py-1 rounded-xl cursor-pointer font-semibold transition"
									>
										{t("accetta")}
									</button>
									<button
										onClick={() => handleRifiutaPermesso(tu)}
										className="bg-white/30 dark:bg-white/10 text-[#090c64] text-sm px-3 py-1 rounded-xl cursor-pointer font-semibold transition"
									>
										{t("rifiuta")}
									</button>
								</div>
							</div>
						))}
						{permessi.length === 0 && (
							<p className="text-sm opacity-70">{t("nessunaRichiestaPermessi")}</p>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default AdminEmployeeDetailsPage;
