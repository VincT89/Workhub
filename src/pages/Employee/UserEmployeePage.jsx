import { useTheme } from "../../context/ThemeContext";
import calIcon from "../../assets/icons/Calendar.png";
import employeeImg from "../../assets/Employee.webp";

const UserEmployeePage = () => {
  const { theme } = useTheme();

  /* --------- DATI STATICI --------- */
  const topButtons = [
    { label: "Giorni lavorati", number: 215 },
    { label: "Ferie residue", number: 12 },
    { label: "Permessi", number: 2 },
    { label: "Attività", number: 47 },
  ];

  const anagrafica = {
    nome: "Claudia Rossi",
    ruolo: "Addetta vendita",
    matricola: "ADD-0025",
    email: "claudia.rossi@example.com",
    foto: employeeImg,
  };

  const turni = [
    { giorno: "Lunedì", orario: "8:00 - 12:00" },
    { giorno: "Martedì", orario: "10:00 - 12:00 / 15:00 - 18:30" },
    { giorno: "Giovedì", orario: "8:00 - 9:00" },
    { giorno: "Venerdì", orario: "15:30 - 16:30" },
  ];

  const permessi = [
    { data: "05.06.2026", orario: "8:00 - 18:00" },
    { data: "28.12.25", orario: "10:00 - 12:00" },
  ];

  /* --------- VARIABILI DI STILE --------- */
  const textColor =
    theme === "dark" ? "text-[var(--text-dark)]" : "text-[var(--text-light)]";
  const buttonClass =
    "mt-4 bg-[var(--color-primary)]/80 text-[var(--text-dark)] font-semibold px-6 py-3 rounded-full shadow-md hover:bg-[var(--color-primary)] transition-all duration-200 w-fit text-center";

  return (
    <div className="relative w-full h-full flex flex-col gap-8 overflow-y-auto custom-scrollbar-invisible p-2">
      {/* --------- SEZIONE 1: BOX RIASSUNTIVI --------- */}
      <section className="section-base grid-4">
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
      </section>

      {/* --------- SEZIONE 2: ANAGRAFICA E TURNI --------- */}
      <div className="flex section-gap">
        {/* ANAGRAFICA */}
        <div className="flex-1 glass-card p-6 shadow-md">
          <div className="flex items-center gap-3 mb-4">
            <img
              src={anagrafica.foto}
              alt="employee"
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
            <img src={calIcon} alt="Calendario" className="w-6 h-6" />
            <h2 className={`text-lg font-bold leading-none ${textColor}`}>
              Turni settimanali
            </h2>
          </div>

          <div className={`flex flex-col gap-2 ${textColor}`}>
            {turni.map((t, i) => (
              <div
                key={i}
                className="grid grid-cols-2 bg-white/40 dark:bg-glass-strong rounded-full p-2 shadow-sm"
              >
                <span className="font-semibold">{t.giorno}</span>
                <span>{t.orario}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --------- SEZIONE 3: FERIE E PERMESSI --------- */}
      <div className="flex section-gap mb-6">
        {/* FERIE */}
        <div className="flex-1 glass-card p-6 shadow-md">
          <div className="flex items-center gap-3 mb-4">
            <h2 className={`text-lg font-bold leading-none ${textColor}`}>
              Ferie
            </h2>
          </div>

          <div className="grid grid-cols-2 bg-white/40 dark:bg-glass-strong rounded-full p-2 shadow-sm">
            <span className="font-semibold">
              Dal 30.12.25 al 7.01.26
            </span>
          </div>

          <button className={buttonClass}>Richiesta ferie</button>
        </div>

        {/* PERMESSI */}
        <div className="flex-1 glass-card p-6 shadow-md">
          <div className="flex items-center gap-3 mb-4">
            <img src={calIcon} alt="Calendario" className="w-6 h-6" />
            <h2 className={`text-lg font-bold leading-none ${textColor}`}>
              Permessi
            </h2>
          </div>

          <div className={`flex flex-col gap-2 ${textColor}`}>
            {permessi.map((p, i) => (
              <div
                key={i}
                className="grid grid-cols-2 bg-white/40 dark:bg-glass-strong rounded-full p-2 shadow-sm"
              >
                <span className="font-semibold">{p.data}</span>
                <span>{p.orario}</span>
              </div>
            ))}
          </div>

          <button className={buttonClass}>Richiesta permessi</button>
        </div>
      </div>
    </div>
  );
};

export default UserEmployeePage;
