import React, { useEffect, useState } from "react";
import { useTheme } from "../../../context/ThemeContext";
import { useLanguage } from "../../../context/LanguageContext";
import calIcon from "../../../assets/icons/Calendar.png";
import employeeImg from "../../../assets/Employee.webp";

const AdminEmployeeDetailsPage = ({ selectedEmployee }) => {
  const { theme } = useTheme();
  const { t } = useLanguage();

  const textColor = theme === "dark" ? "text-white" : "text-[#134a7b]";

  /* === NESSUN DIPENDENTE SELEZIONATO === */
  if (!selectedEmployee) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className={`text-center ${textColor}`}>
          <h2 className="text-xl font-bold mb-2">
            {t("employees.selezionaDipendente")}
          </h2>
          <p className="opacity-70">
            {t("employees.selezionaDipendenteDescrizione")}
          </p>
        </div>
      </div>
    );
  }

  /* === ANAGRAFICA === */
  const anagrafica = {
    nome: selectedEmployee.nome,
    ruolo: selectedEmployee.ruolo,
    matricola: selectedEmployee.matricola,
    email: selectedEmployee.email,
    foto: selectedEmployee.foto || employeeImg,
  };

  /* === STATISTICHE === */
  const topButtons = [
    { label: "Giorni lavorati", number: selectedEmployee.giorniLavorati || 215 },
    { label: "Ferie residue", number: selectedEmployee.ferieResidue || 12 },
    { label: "Permessi", number: selectedEmployee.permessiResidue || 2 },
    { label: "Attività", number: selectedEmployee.attivita || 47 },
  ];

  /* === TURNI === */
  const turni = selectedEmployee.turni || [];

  /* === NORMALIZZA TURNI PER CALENDARIO === */
  useEffect(() => {
    const turniNormalizzati = [];

    turni.forEach((t) => {
      t.orari.forEach((slot, index) => {
        const [startStr, endStr] = slot.split("-");

        turniNormalizzati.push({
          id: `${selectedEmployee.matricola}-${t.giorno}-${index}`,
          nome: selectedEmployee.nome,
          matricola: selectedEmployee.matricola,
          giorno: t.giorno,
          startTime: startStr.trim(),
          endTime: endStr.trim(),
          tipo: "Turno",
        });
      });
    });

    localStorage.setItem("turniDipendenti", JSON.stringify(turniNormalizzati));
  }, [turni, selectedEmployee]);

  /* === PERMESSI === */
  const richiestepermessi = selectedEmployee.richiestepermessi || [];
  const [permessi, setPermessi] = useState(richiestepermessi);

  const handleAccetta = (r) => setPermessi((prev) => prev.filter((x) => x !== r));
  const handleRifiuta = (r) => setPermessi((prev) => prev.filter((x) => x !== r));

  /* === FERIE === */
  const richiesteferie = selectedEmployee.richiesteferie || [];
  const [ferie, setFerie] = useState(richiesteferie);

  const handleAccettaFerie = (r) =>
    setFerie((prev) => prev.filter((x) => x !== r));
  const handleRifiutaFerie = (r) =>
    setFerie((prev) => prev.filter((x) => x !== r));

  return (
    <>
      <div className="w-full h-full flex flex-col gap-8 overflow-y-auto scrollbar-thin scrollbar-thumb-[#1C62A0] scrollbar-track-transparent">

        {/* === SEZIONE 1: STATISTICHE === */}
        <div className="grid grid-cols-4 gap-6 mb-6 w-full">
          {topButtons.map((btn, i) => (
            <div
              key={i}
              className={`flex flex-col items-center justify-center rounded-[25px] px-4 py-3
                backdrop-blur-sm border border-white/30 shadow-md
                ${theme === "dark" ? "bg-white/20" : "bg-white/20"} ${textColor}`}
            >
              <span className="font-bold">{btn.label}</span>
              <span className="text-sm opacity-70">{btn.number}</span>
            </div>
          ))}
        </div>

        {/* === SEZIONE 2: ANAGRAFICA + TURNI === */}
        <div className="flex gap-6">

          {/* --- ANAGRAFICA --- */}
          <div
            className={`flex-1 p-6 rounded-[25px] border border-white/30 shadow-md backdrop-blur-sm 
            ${theme === "dark" ? "bg-white/20" : "bg-white/20"}`}
          >
            <div className="flex items-center gap-3 mb-4">
              <img src={anagrafica.foto} className="w-12 h-12 rounded-full" />
              <h2 className={`text-lg font-bold ${textColor}`}>
                {t("employees.anagrafica")}
              </h2>
            </div>

            <div className={`flex flex-col gap-2 ${textColor}`}>
              <div><strong>{t("employees.nome")}:</strong> {anagrafica.nome}</div>
              <div><strong>{t("employees.ruolo")}:</strong> {anagrafica.ruolo}</div>
              <div><strong>{t("employees.matricola")}:</strong> {anagrafica.matricola}</div>
              <div><strong>{t("employees.email")}:</strong> {anagrafica.email}</div>
            </div>
          </div>

          {/* --- TURNI --- */}
          <div
            className={`flex-1 p-6 rounded-[25px] border border-white/30 shadow-md backdrop-blur-sm 
            ${theme === "dark" ? "bg-white/20" : "bg-white/20"}`}
          >
            <div className="flex items-center gap-3 mb-4">
              <img src={calIcon} className="w-6 h-6" />
              <h2 className={`text-lg font-bold ${textColor}`}>
                {t("employees.turniSettimanali")}
              </h2>
            </div>

            <div className={`flex flex-col gap-2 ${textColor}`}>
              {turni.length === 0 ? (
                <div className="opacity-60 italic">
                  Nessun turno assegnato
                </div>
              ) : (
                turni.map((t, i) => (
                  <div
                    key={i}
                    className="flex justify-between bg-white/40 dark:bg-white/20 rounded-full p-2 shadow-sm"
                  >
                    <span className="font-semibold">{t.giorno}</span>
                    <span>{t.orari.join(" / ")}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* === SEZIONE 3: FERIE E PERMESSI === */}
        <div className="flex gap-6">

          {/* --- FERIE --- */}
          <div
            className={`flex-1 p-6 rounded-[25px] border border-white/30 shadow-md backdrop-blur-sm 
            ${theme === "dark" ? "bg-white/20" : "bg-white/20"}`}
          >
            <h2 className={`text-lg font-bold mb-4 ${textColor}`}>
              {t("employees.richiestaFerie")}
            </h2>

            <div className="flex flex-col gap-2">
              {ferie.length === 0 ? (
                <div className="opacity-60 italic">Nessuna richiesta ferie</div>
              ) : (
                ferie.map((fe, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between bg-white/40 dark:bg-white/20 rounded-full p-2 shadow-sm"
                  >
                    <span className={`font-semibold ${textColor}`}>
                      {anagrafica.nome} — dal {fe.inizio} al {fe.fine}
                    </span>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAccettaFerie(fe)}
                        className="bg-[#1C62A0] text-white text-sm px-3 py-1 rounded-full hover:bg-[#155293]"
                      >
                        {t("employees.accetta")}
                      </button>
                      <button
                        onClick={() => handleRifiutaFerie(fe)}
                        className="bg-white/30 dark:bg-white/10 text-[#1C62A0] text-sm px-3 py-1 rounded-full hover:bg-white/50 dark:hover:bg-[#1C62A0]/30"
                      >
                        {t("employees.rifiuta")}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* --- PERMESSI --- */}
          <div
            className={`flex-1 p-6 rounded-[25px] border border-white/30 shadow-md backdrop-blur-sm 
            ${theme === "dark" ? "bg-white/20" : "bg-white/20"}`}
          >
            <h2 className={`text-lg font-bold mb-4 ${textColor}`}>
              {t("employees.richiestaPermessi")}
            </h2>

            <div className="flex flex-col gap-2">
              {permessi.length === 0 ? (
                <div className="opacity-60 italic">
                  Nessuna richiesta permesso
                </div>
              ) : (
                permessi.map((p, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between bg-white/40 dark:bg-white/20 rounded-full p-2 shadow-sm"
                  >
                    <span className={`font-semibold ${textColor}`}>
                      {anagrafica.nome} — {p.data}, {p.orario}
                    </span>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAccetta(p)}
                        className="bg-[#1C62A0] text-white text-sm px-3 py-1 rounded-full hover:bg-[#155293]"
                      >
                        {t("employees.accetta")}
                      </button>
                      <button
                        onClick={() => handleRifiuta(p)}
                        className="bg-white/30 dark:bg-white/10 text-[#1C62A0] text-sm px-3 py-1 rounded-full hover:bg-white/50 dark:hover:bg-[#1C62A0]/30"
                      >
                        {t("employees.rifiuta")}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default AdminEmployeeDetailsPage;
