import { useTheme } from "../../../context/ThemeContext.jsx";
import { useLanguage } from "../../../context/LanguageContext.jsx";
import deleteUserIcon from "../../../assets/icons/Delete User Male.png";
import groupIcon from "../../../assets/icons/Group.png";
import qualityIcon from "../../../assets/icons/Quality.png";
import staffIcon from "../../../assets/icons/Staff.png";
import employeeImg from "../../../assets/Employee.webp";
import { useNavigate } from "react-router-dom";

const AdminEmployeePage = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { t } = useLanguage();

  const textColor = theme === "dark" ? "text-[var(--text-dark)]" : "text-[var(--text-light)]";

  const stats = [
    { label: t("employees.dipendentiAttivi"), value: 20, icon: groupIcon },
    { label: t("employees.dipendentiInattivi"), value: 4, icon: deleteUserIcon },
    { label: t("employees.dipendentiSenior"), value: 12, icon: qualityIcon },
    { label: t("employees.totaleDipendenti"), value: 400, icon: staffIcon },
  ];

  const employee = [
    {
      nome: "Jennifer Bianchi",
      ruolo: "Responsabile reparto",
      matricola: "ADD-0001",
      email: "jennifer.bianchi@example.com",
      foto: employeeImg,
    },
    {
      nome: "Luca Rossi",
      ruolo: "Sviluppatore",
      matricola: "ADD-0002",
      email: "luca.rossi@example.com",
      foto: employeeImg,
    },
    {
      nome: "Maria Verdi",
      ruolo: "Designer",
      matricola: "ADD-0003",
      email: "maria.verdi@example.com",
      foto: employeeImg,
    },
    {
      nome: "Giovanni Neri",
      ruolo: "Marketing Manager",
      matricola: "ADD-0004",
      email: "giovanni.neri@example.com",
      foto: employeeImg,
    },
    {
      nome: "Elena Gialli",
      ruolo: "HR Specialist",
      matricola: "ADD-0005",
      email: "elena.gialli@example.com",
      foto: employeeImg,
    },
    {
      nome: "Marco Blu",
      ruolo: "Data Analyst",
      matricola: "ADD-0006",
      email: "marco.blu@example.com",
      foto: employeeImg,
    },
  ];

  const openEmployeeDetails = (employee) => {
    navigate(`/personale/${employee.matricola}`);
  };

  return (
    <div className="w-full h-full flex flex-col gap-8 overflow-y-auto custom-scrollbar-invisible">
      {/* --------- SEZIONE 1: BOX STATISTICHE --------- */}
      <section className="section-base grid-4">
        {stats.map((item, index) => (
          <div
            key={index}
            className={`widget-box glass-card ${textColor} justify-between`}
          >
            <div className="flex items-center gap-2">
              <img src={item.icon} alt={item.label} className="w-6 h-6" />
              <span className="font-bold">{item.label}</span>
            </div>
            <span className="text-sm opacity-70 leading-none font-semibold">
              {item.value}
            </span>
          </div>
        ))}
      </section>

      {/* --------- SEZIONE 2: LISTA DIPENDENTI --------- */}
      <div className="glass-card p-6 shadow-md flex flex-col gap-4 h-full">
        <h2 className={`text-lg font-bold ${textColor}`}>{t("employees.listaDipendenti")}</h2>

        {/* intestazione tabella */}
        <div
          className={`grid grid-cols-5 text-center font-bold text-sm mb-2 ${textColor}`}
        >
          <span>{t("employees.foto")}</span>
          <span>{t("employees.nome")}</span>
          <span>{t("employees.ruolo")}</span>
          <span>{t("employees.email")}</span>
          <span>{t("employees.matricola")}</span>

        </div>

        {/* corpo tabella */}
        <div className="h-full pr-2 space-y-2 custom-scrollbar overflow-y-auto">
          {employee.map((e, i) => (
            <div
              key={i}
              onClick={() => openEmployeeDetails(e)}
              className="grid grid-cols-5 text-center items-center bg-white/40 dark:bg-glass-strong
              rounded-full p-2 shadow-sm transition duration-200 
              hover:bg-white/70 dark:hover:bg-primary/20 cursor-pointer"
            >
              <div className="flex justify-center">
                <img
                  src={e.foto}
                  alt={e.nome}
                  className="w-8 h-8 rounded-full object-cover"
                />
              </div>
              <span className="truncate whitespace-nowrap overflow-hidden">{e.nome}</span>
              <span className="truncate whitespce-nowrap overflow-hidden">{e.ruolo}</span>
              <span className="truncate whitespace-nowrap overflow-hidden">
                {e.email}
              </span>
              <span>{e.matricola}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminEmployeePage;
