import React, { useEffect, useState } from "react";
import { useTheme } from "../../../context/ThemeContext";
import { useLanguage } from "../../../context/LanguageContext";
import { UserCircle, CalendarCheck } from "@phosphor-icons/react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { fetchUserByIdAsync } from "../../../store/feature/userSlice.js";
import { fetchPointsOfSalesAsync } from "../../../store/feature/pointOfSalesSlice.js";

const AdminEmployeeDetailsPage = () => {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const dispatch = useDispatch();
  const { id } = useParams();

  const textColor = theme === "dark" ? "text-white" : "text-[#090c64]";

  const { selected: user, loading, error } =
    useSelector((state) => state.users) || {};

  const { list: pointsOfSale = [] } =
    useSelector((state) => state.pos) || {};

  const token = useSelector((state) => state.auth?.token);

  const [workplaceName, setWorkplaceName] = useState("");

  // FETCH USER + POS
  useEffect(() => {
    if (!id || !token) return;
    dispatch(fetchUserByIdAsync({ id, token }));
    dispatch(fetchPointsOfSalesAsync({ token })); 
  }, [id, token, dispatch]);

  // Format workplace
  useEffect(() => {
    if (!user?.workplace) {
      setWorkplaceName("");
      return;
    }

    // workplace può essere string (id) o oggetto popolato
    if (typeof user.workplace === "string") {
      const found = pointsOfSale.find((p) => p._id === user.workplace);
      if (found) {
        setWorkplaceName(`${found.name} – ${found.location?.city || ""}`);
      } else {
        setWorkplaceName(user.workplace); // fallback id
      }
    } else if (typeof user.workplace === "object") {
      setWorkplaceName(
        `${user.workplace.name} – ${user.workplace.location?.city || ""}`
      );
    }
  }, [user, pointsOfSale]);

  // TOP BOX
  const topButtons = [
    { label: "Giorni lavorati", number: 215 },
    { label: "Ferie residue", number: 12 },
    { label: "Permessi", number: 2 },
    { label: "Attività", number: 47 },
  ];

  const anagrafica = user
    ? {
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
      }
    : null;
  
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
  
  const [permessi, setPermessi] = useState(richiestepermessi);

  const handleAccetta = (richiesta, nome) => {
    console.log("Accettata:", nome, richiesta);
    setPermessi((prev) => prev.filter((r) => r !== richiesta));
  };

  const handleRifiuta = (richiesta, nome) => {
    console.log("Rifiutata:", nome, richiesta);
    setPermessi((prev) => prev.filter((r) => r !== richiesta));
  };

  // ----- FERIE DI ESEMPIO ------
  const richiesteferie = [
    { matricola: "ADD-0025", inizio: "05.06.2026", fine: "12.06.2026" },
    { matricola: "ADD-0025", inizio: "28.12.25", fine: "03.01.26" },
  ];

  const [ferie, setFerie] = useState(richiesteferie);

  const handleAccettaFerie = (richiestaf, nome) => {
    console.log("Accettata:", nome, richiestaf);
    setFerie((prev) => prev.filter((rf) => rf !== richiestaf));
  };

  const handleRifiutaFerie = (richiestaf, nome) => {
    console.log("Rifiutata:", nome, richiestaf);
    setFerie((prev) => prev.filter((rf) => rf !== richiestaf));
  };

  if (!token) return null;

  if (loading && !anagrafica)
    return <p className="p-4">Caricamento dati dipendente...</p>;

  if (error && !anagrafica)
    return (
      <p className="p-4 text-red-500">
        Errore nel caricamento del dipendente: {error}
      </p>
    );

  if (!anagrafica)
    return <p className="p-4">Nessun dipendente trovato.</p>;

  return (
    <div className="w-full h-full flex flex-col gap-8 overflow-y-auto p-4">
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
            <UserCircle size={32} color="#090c64" weight="duotone" />
            <h2 className={`text-lg font-bold ${textColor}`}>
              {t("employees.anagrafica")}
            </h2>
          </div>

          <div className={`flex flex-col gap-2 ${textColor}`}>
            <div><strong>{t("employees.nome")}:</strong> {anagrafica.nome}</div>
            <div><strong>{t("employees.ruolo")}:</strong> {anagrafica.ruolo}</div>
            <div><strong>{t("employees.matricola")}:</strong> {anagrafica.matricola}</div>
            <div><strong>{t("employees.email")}:</strong> {anagrafica.email}</div>
            <div><strong>Telefono:</strong> {anagrafica.telefono}</div>
            <div><strong>Sede lavorativa:</strong> {anagrafica.sede}</div>
            <div><strong>Tipo di contratto:</strong> {anagrafica.contratto}</div>
            <div><strong>Data di assunzione:</strong> {anagrafica.assunzione}</div>
          </div>
        </div>

        {/* TURNI */}
        <div className="flex-1 p-6 rounded-xl border border-white/30 shadow-md backdrop-blur-sm bg-white/20">
          <div className="flex items-center gap-3 mb-4">
            <CalendarCheck size={32} color="#090c64" weight="duotone" />
            <h2 className={`text-lg font-bold leading-none ${textColor}`}>
              {t("employees.turniSettimanali")}
            </h2>
          </div>

          <div className={`flex flex-col gap-2 ${textColor}`}>
            {turni.map((turno, i) => (
              <div
                key={i}
                className="flex justify-between bg-white/40 dark:bg-white/20 rounded-xl p-2 shadow-sm"
              >
                <span className="font-semibold">{turno.giorno}</span>
                <span>{turno.orario}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --------- SEZIONE 3: FERIE E PERMESSI --------- */}
      <div className="flex gap-6">
        {/* FERIE */}
        <div className="flex-1 p-6 rounded-xl border border-white/30 shadow-md backdrop-blur-sm bg-white/20">
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
        <div className="flex-1 p-6 rounded-xl border border-white/30 shadow-md backdrop-blur-sm bg-white/20">
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
  );
};

export default AdminEmployeeDetailsPage;
