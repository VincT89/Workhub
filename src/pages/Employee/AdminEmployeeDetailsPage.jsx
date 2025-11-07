import React from "react";
import { useTheme } from "../../context/ThemeContext";
import calIcon from "../../assets/icons/Calendar.png";
import employeeImg from "../../assets/Employee.webp";

const AdminPage = () => {
  const { theme } = useTheme();

  const textColor =
    theme === "dark" ? "text-[var(--text-dark)]" : "text-[var(--text-light)]";

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
    foto: employeeImg,
  };

  // ----- TURNI DI ESEMPIO ------
  const turni = [
    { giorno: "Lunedì", orario: "8:00 - 12:00" },
    { giorno: "Martedì", orario: "10:00 - 12:00 / 15:00 - 18:30" },
    { giorno: "Giovedì", orario: "8:00 - 9:00" },
    { giorno: "Venerdì", orario: "15:30 - 16:30" },
  ];

// Array statico di richieste di permesso usato come valore iniziale.
// Ogni elemento è un oggetto che rappresenta una singola richiesta.
const richiestepermessi = [
    { matricola: "ADD-0025", data: "05.06.2026", orario: "8:00 - 18:00" },
    { matricola: "ADD-0025", data: "28.12.25", orario: "10:00 - 12:00" },
];

// Stato dinamico dei permessi
// React.useState crea uno state locale al componente:
// - permessi: contiene l'array attuale di richieste mostrato in UI
// - setPermessi: funzione per aggiornare lo stato
// Inizializziamo lo stato con l'array richiestepermessi.
const [permessi, setPermessi] = React.useState(richiestepermessi);

// Funzione per accettare una richiesta
// Parametri:
// - richiesta: l'oggetto della singola richiesta cliccata (es. { matricola, data, orario })
// - nome: il nome della persona (passato per logging o per azioni che richiedono il nome)
// Azione: stampa in console e rimuove la richiesta dallo stato in modo immutabile.
const handleAccetta = (richiesta, nome) => {
    // Log utile durante lo sviluppo per sapere quale richiesta è stata accettata
    console.log("Accettata:", nome, richiesta);

    // Aggiorniamo lo stato permessi rimuovendo l'elemento "richiesta".
    // Usiamo la forma con funzione (prev => ...) perché è la forma sicura
    // quando l'aggiornamento dipende dallo stato precedente.
    // prev è il valore precedente di `permessi`.
    // filter crea un nuovo array contenente solo gli elementi che non sono === alla richiesta.
    setPermessi(prev => prev.filter(r => r !== richiesta));
  };
  
  // Funzione per rifiutare una richiesta
// Stessa logica di handleAccetta: log + rimozione dalla lista.
const handleRifiuta = (richiesta, nome) => {
    console.log("Rifiutata:", nome, richiesta);
    setPermessi(prev => prev.filter(r => r !== richiesta));
};

  return (
    <>
      <div className="w-full h-full flex flex-col gap-8 overflow-y-auto custom-scrollbar-invisible">
        {/* --------- SEZIONE 1: BOX RIASSUNTIVI --------- */}
        <div className="section-base grid-4">
          {topButtons.map((btn, i) => (
            <div
              key={i}
              className={`widget-box glass-card ${textColor} justify-center gap-2`}
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
        <div className="flex section-gap">
          {/* ANAGRAFICA */}
          <div className="flex-1 glass-card p-6 shadow-md">
            <div className="flex items-center gap-3 mb-4">
              <img
                src={anagrafica.foto}
                alt="employee image"
                className="w-12 h-12 rounded-full object-cover"
              />
              <h2 className={`text-lg font-bold leading-none ${textColor}`}>
                Anagrafica
              </h2>
            </div>
            <div className={`flex flex-col gap-2 ${textColor}`}>
              <div>
                <strong>Nome:</strong> {anagrafica.nome}
              </div>
              <div>
                <strong>Ruolo:</strong> {anagrafica.ruolo}
              </div>
              <div>
                <strong>Matricola:</strong> {anagrafica.matricola}
              </div>
              <div>
                <strong>Email:</strong> {anagrafica.email}
              </div>
            </div>
          </div>

          {/* TURNI */}
          <div className="flex-1 glass-card p-6 shadow-md">
            <div className="flex items-center gap-3 mb-4">
              <img src={calIcon} alt="Calendario" className="w-6 h-6 shrink-0" />
              <h2 className={`text-lg font-bold leading-none ${textColor}`}>
                Turni settimanali
              </h2>
            </div>

            <div className={`flex flex-col gap-2 ${textColor}`}>
              {turni.map((t, i) => (
                <div
                  key={i}
                  className="flex justify-between bg-white/40 dark:bg-glass-strong rounded-full p-2 shadow-sm"
                >
                  <span className="font-semibold">{t.giorno}</span>
                  <span>{t.orario}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* --------- SEZIONE 3: FERIE E PERMESSI --------- */}
        <div className="flex section-gap">
          {/* FERIE */}
          <div className="flex-1 glass-card p-6 shadow-md">
            <div className="flex items-center gap-3 mb-4">
              <h2 className={`text-lg font-bold leading-none ${textColor}`}>
                Richieste ferie
              </h2>
            </div>

            <div className="flex flex-col gap-2">
              {permessi.map((t, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between bg-white/40 dark:bg-glass-strong rounded-full p-2 shadow-sm"
                >
                  {/* Dati richiesta */}
                  <span className={`font-semibold ${textColor}`}>
                    {anagrafica.nome} - {t.data}, {t.orario}
                  </span>

                  {/* Pulsanti */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAccetta(t, anagrafica.nome)}
                      className="bg-primary text-(--text-dark) text-sm px-3 py-1 rounded-full hover:bg-primary-dark font-semibold transition"
                    >
                      Accetta
                    </button>
                    <button
                      onClick={() => handleRifiuta(t, anagrafica.nome)}
                      className="bg-white/30 dark:bg-glass text-primary text-sm px-3 py-1 rounded-full hover:bg-white/50 dark:hover:bg-primary/20 font-semibold transition"
                    >
                      Rifiuta
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* PERMESSI */}
          <div className="flex-1 glass-card p-6 shadow-md">
            <div className="flex items-center gap-3 mb-4">
              <h2 className={`text-lg font-bold leading-none ${textColor}`}>
                Richieste permessi
              </h2>
            </div>

            <div className="flex flex-col gap-2">
              {permessi.map((t, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between bg-white/40 dark:bg-glass-strong rounded-full p-2 shadow-sm"
                >
                  {/* Dati richiesta */}
                  <span className={`font-semibold ${textColor}`}>
                    {anagrafica.nome} - {t.data}, {t.orario}
                  </span>

                  {/* Pulsanti */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAccetta(t, anagrafica.nome)}
                      className="bg-primary text-(--text-dark) text-sm px-3 py-1 rounded-full hover:bg-primary-dark font-semibold transition"
                    >
                      Accetta
                    </button>
                    <button
                      onClick={() => handleRifiuta(t, anagrafica.nome)}
                      className="bg-white/30 dark:bg-glass text-primary text-sm px-3 py-1 rounded-full hover:bg-white/50 dark:hover:bg-primary/20 font-semibold transition"
                    >
                      Rifiuta
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
