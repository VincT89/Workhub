import { useTheme } from "../../../context/ThemeContext";
import { useLanguage } from "../../../context/LanguageContext";
import calIcon from "../../../assets/icons/Calendar.png";
import employeeImg from "../../../assets/Employee.webp";

const UserEmployeePage = () => {
  const { theme } = useTheme();
  const { t } = useLanguage();

  /* --------- DATI STATICI --------- */
  const topButtons = [
    { label: t("employees.giorniLavorati"), number: 215 },
    { label: t("employees.ferieResidue"), number: 12 },
    { label: t("employees.permessi"), number: 2 },
    { label: t("employees.attivita"), number: 47 },
  ];

  const anagrafica = {
    nome: "Claudia Rossi",
    ruolo: "Addetta vendita",
    matricola: "ADD-0025",
    email: "claudia.rossi@example.com",
    foto: employeeImg,
  };

  const turni = [
    { giorno: t("employees.lunedi"), orario: "8:00 - 12:00" },
    { giorno: t("employees.martedi"), orario: "10:00 - 12:00 / 15:00 - 18:30" },
    { giorno: t("employees.mercoledi"), orario: "8:00 - 9:00" },
    { giorno: t("employees.giovedi"), orario: "15:30 - 16:30" },
  ];

  const permessi = [
    { data: "05.06.2026", orario: "8:00 - 18:00" },
    { data: "28.12.25", orario: "10:00 - 12:00" },
  ];

  /* --------- VARIABILI DI STILE --------- */
  const textColor = theme === "dark" ? "text-white" : "text-[#134a7b]";
  const buttonClass = `
    mt-4 bg-[#1C62A0]/80 text-white font-semibold px-6 py-3
    rounded-full shadow-md hover:bg-[#1C62A0] transition-all duration-200
    w-fit text-center
  `;

  return (
    <div className="relative w-full h-full flex flex-col gap-8 overflow-y-auto scrollbar-thin scrollbar-thumb-[#1C62A0] scrollbar-track-transparent p-2">
      {/* --------- SEZIONE 1: BOX RIASSUNTIVI --------- */}
      <section className="grid grid-cols-4 gap-6 mb-6 w-full transition-colors duration-500">
        {topButtons.map((btn, i) => (
          <div
            key={i}
            className={`
              flex flex-col items-center justify-center rounded-[25px] px-4 py-3
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
      </section>

      {/* --------- SEZIONE 2: ANAGRAFICA E TURNI --------- */}
      <div className="flex gap-6">
        {/* ANAGRAFICA */}
        <div
          className={`
            flex-1 p-6 rounded-[25px] border border-white/30 shadow-md
            backdrop-blur-sm ${theme === "dark" ? "bg-white/20" : "bg-white/20"}
          `}
        >
          <div className="flex items-center gap-3 mb-4">
            <img
              src={anagrafica.foto}
              alt="employee"
              className="w-12 h-12 rounded-full object-cover"
            />
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
              <strong>{t("employees.matricola")}:</strong> {anagrafica.matricola}
            </div>
            <div>
              <strong>{t("employees.email")}:</strong> {anagrafica.email}
            </div>
          </div>
        </div>

        {/* TURNI */}
        <div
          className={`
            flex-1 p-6 rounded-[25px] border border-white/30 shadow-md
            backdrop-blur-sm ${theme === "dark" ? "bg-white/20" : "bg-white/20"}
          `}
        >
          <div className="flex items-center gap-3 mb-4">
            <img src={calIcon} alt="Calendario" className="w-6 h-6" />
            <h2 className={`text-lg font-bold leading-none ${textColor}`}>
              {t("employees.turniSettimanali")}
            </h2>
          </div>

          <div className={`flex flex-col gap-2 ${textColor}`}>
            {turni.map((tu, i) => (
              <div
                key={i}
                className="grid grid-cols-2 bg-white/40 dark:bg-white/20 rounded-full p-2 shadow-sm"
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
          className={`
            flex-1 p-6 rounded-[25px] border border-white/30 shadow-md
            backdrop-blur-sm ${theme === "dark" ? "bg-white/20" : "bg-white/20"}
          `}
        >
          <div className="flex items-center gap-3 mb-4">
            <h2 className={`text-lg font-bold leading-none ${textColor}`}>
              {t("employees.ferie")}
            </h2>
          </div>

          <div className="grid grid-cols-2 bg-white/40 dark:bg-white/20 rounded-full p-2 shadow-sm">
            <span className="font-semibold">
              {t("employees.dal")} 30.12.25 {t("employees.al")} 7.01.26
            </span>
          </div>

          <button className={buttonClass}>{t("employees.richiestaFerie")}</button>
        </div>

        {/* PERMESSI */}
        <div
          className={`
            flex-1 p-6 rounded-[25px] border border-white/30 shadow-md
            backdrop-blur-sm ${theme === "dark" ? "bg-white/20" : "bg-white/20"}
          `}
        >
          <div className="flex items-center gap-3 mb-4">
            <img src={calIcon} alt="Calendario" className="w-6 h-6" />
            <h2 className={`text-lg font-bold leading-none ${textColor}`}>
              {t("employees.permessi")}
            </h2>
          </div>

          <div className={`flex flex-col gap-2 ${textColor}`}>
            {permessi.map((p, i) => (
              <div
                key={i}
                className="grid grid-cols-2 bg-white/40 dark:bg-white/20 rounded-full p-2 shadow-sm"
              >
                <span className="font-semibold">{p.data}</span>
                <span>{p.orario}</span>
              </div>
            ))}
          </div>

          <button className={buttonClass}>
            {t("employees.richiestaPermessi")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserEmployeePage;
