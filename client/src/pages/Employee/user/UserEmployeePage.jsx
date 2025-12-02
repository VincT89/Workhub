import { useTheme } from "../../../context/ThemeContext";
import { useLanguage } from "../../../context/LanguageContext";
import {
  UserCircle,
  CalendarCheck,
  Bag,
  CalendarBlank,
} from "@phosphor-icons/react";
import { useState, useEffect, useMemo } from "react";
import Drawer from "../../../components/Drawer";
import { useSelector, useDispatch } from "react-redux";
import { fetchPointsOfSalesAsync } from "../../../store/feature/pointOfSalesSlice.js";
import { fetchUserShiftsAsync } from "../../../store/feature/shiftsSlice.js";

const UserEmployeePage = () => {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const dispatch = useDispatch();

  const authUser = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const { list: pointsOfSale = [] } =
    useSelector((state) => state.pos || {}) || {};

  const {
    current: userShifts,
    loading: shiftsLoading,
    error: shiftsError,
  } = useSelector((state) => state.shifts || {}) || {};

  const [workplaceName, setWorkplaceName] = useState("");

  useEffect(() => {
    if (!token) return;
    dispatch(fetchPointsOfSalesAsync({ token }));
    if (authUser?._id) {
      dispatch(fetchUserShiftsAsync({ userId: authUser._id, token }));
    }
  }, [token, dispatch, authUser?._id]);

  useEffect(() => {
    if (!authUser?.workplace) {
      setWorkplaceName("");
      return;
    }
    const found = pointsOfSale.find((p) => p._id === authUser.workplace);
    if (found) {
      setWorkplaceName(`${found.name} – ${found.location?.city || ""}`);
    } else if (typeof authUser.workplace === "object") {
      setWorkplaceName(
        `${authUser.workplace.name} – ${
          authUser.workplace.location?.city || ""
        }`
      );
    }
  }, [authUser, pointsOfSale]);

  const textColor = theme === "dark" ? "text-white" : "text-[#090c64]";

  const topButtons = [
    {
      label: t("employees.giorniLavorati"),
      number: 215,
      icon: <CalendarCheck size={28} color="#090c64" weight="duotone" />,
    },
    {
      label: t("employees.ferieResidue"),
      number: 12,
      icon: <Bag size={28} color="#090c64" weight="duotone" />,
    },
    {
      label: t("employees.permessi"),
      number: 2,
      icon: <CalendarBlank size={28} color="#090c64" weight="duotone" />,
    },
  ];

  const anagrafica = useMemo(() => {
    if (!authUser) {
      return {
        nome: "",
        ruolo: "",
        matricola: "",
        email: "",
        telefono: "",
        sede: "",
        contratto: "",
        dataAssunzione: "",
      };
    }

    return {
      nome: `${authUser.firstName || ""} ${authUser.lastName || ""}`.trim(),
      ruolo: authUser.department || "",
      matricola: authUser.personnelNumber ?? "",
      email: authUser.email || "",
      telefono: authUser.phone || "",
      sede: workplaceName || "",
      contratto: authUser.contractType || "",
      dataAssunzione: authUser.hireDate
        ? new Date(authUser.hireDate).toLocaleDateString("it-IT")
        : "",
    };
  }, [authUser, workplaceName]);

  const dayMap = {
    monday: t("employees.lunedi") || "Lunedì",
    tuesday: t("employees.martedi") || "Martedì",
    wednesday: t("employees.mercoledi") || "Mercoledì",
    thursday: t("employees.giovedi") || "Giovedì",
    friday: t("employees.venerdi") || "Venerdì",
    saturday: t("employees.sabato") || "Sabato",
  };

  const weekDays = [
    { key: "monday", label: dayMap.monday },
    { key: "tuesday", label: dayMap.tuesday },
    { key: "wednesday", label: dayMap.wednesday },
    { key: "thursday", label: dayMap.thursday },
    { key: "friday", label: dayMap.friday },
    { key: "saturday", label: dayMap.saturday },
  ];

  // UNIONE TURNI MATTINA + POMERIGGIO IN UNA SOLA RIGA
  const existingShifts = useMemo(() => {
    if (!userShifts?.shifts) return [];

    return weekDays
      .map((day) => {
        const d = userShifts.shifts[day.key] || {};

        const morning = d.morning ? "08:00 - 13:00" : "";
        const afternoon = d.afternoon ? "14:00 - 18:00" : "";

        if (!morning && !afternoon) return null;

        return {
          dayKey: day.key,
          labelDay: day.label,
          hours:
            morning && afternoon
              ? `${morning} / ${afternoon}`
              : morning || afternoon,
        };
      })
      .filter(Boolean);
  }, [userShifts, weekDays]);

  // MOCK ferie/permessi
  const [ferieList, setFerieList] = useState([
    { dal: "2025-12-30", al: "2026-01-07" },
  ]);
  const [permessiList, setPermessiList] = useState([
    { data: "2026-06-05", orario: "8:00 - 18:00" },
    { data: "2025-12-28", orario: "10:00 - 12:00" },
  ]);

  const [openFerieDrawer, setOpenFerieDrawer] = useState(false);
  const [dal, setDal] = useState("");
  const [al, setAl] = useState("");

  const [openPermessiDrawer, setOpenPermessiDrawer] = useState(false);
  const [permessoData, setPermessoData] = useState("");
  const [oraInizio, setOraInizio] = useState("08:00");
  const [oraFine, setOraFine] = useState("18:00");

  const buttonClass = `
    mt-4 bg-[#090c64] text-white font-semibold px-6 py-3
    rounded-xl shadow-md cursor-pointer transition-all duration-200
    w-fit text-center
  `;

  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return `${String(d.getDate()).padStart(2, "0")}/${String(
      d.getMonth() + 1
    ).padStart(2, "0")}/${d.getFullYear()}`;
  };

  const handleInviaFerie = () => {
    if (dal && al) {
      setFerieList([...ferieList, { dal, al }]);
      setDal("");
      setAl("");
      setOpenFerieDrawer(false);
    }
  };

  const handleInviaPermesso = () => {
    if (permessoData && oraInizio && oraFine) {
      setPermessiList([
        ...permessiList,
        { data: permessoData, orario: `${oraInizio} - ${oraFine}` },
      ]);
      setPermessoData("");
      setOraInizio("08:00");
      setOraFine("18:00");
      setOpenPermessiDrawer(false);
    }
  };

  if (!token || !authUser) return null;

  return (
    <div className="relative w-full h-full flex flex-col gap-8 overflow-y-auto p-2">
      {/* SEZIONE 1 */}
      <section className="grid grid-cols-3 gap-6 mb-6 w-full transition-colors duration-500">
        {topButtons.map((btn, i) => (
          <div
            key={i}
            className={`flex items-center justify-between rounded-xl px-4 py-3
              backdrop-blur-sm border border-white/30 shadow-md ${textColor} bg-white/20`}
          >
            <div className="flex items-center gap-4">
              {btn.icon}
              <span className="inline-flex items-baseline gap-2 font-bold">
                {btn.label}
              </span>
            </div>
            <span className="text-sm opacity-70 leading-none font-semibold">
              {btn.number}
            </span>
          </div>
        ))}
      </section>

      {/* SEZIONE 2 */}
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
            <div>
              <strong>{t("employees.nome")}:</strong> {anagrafica.nome}
            </div>
            <div>
              <strong>{t("employees.ruolo")}:</strong> {anagrafica.ruolo}
            </div>
            <div>
              <strong>{t("employees.matricola")}:</strong>{" "}
              {anagrafica.matricola}
            </div>
            <div>
              <strong>{t("employees.email")}:</strong> {anagrafica.email}
            </div>
            <div>
              <strong>{t("employees.telefono")}:</strong>{" "}
              {anagrafica.telefono}
            </div>
            <div>
              <strong>{t("employees.sede")}:</strong> {anagrafica.sede}
            </div>
            <div>
              <strong>{t("employees.contratto")}:</strong>{" "}
              {anagrafica.contratto}
            </div>
            <div>
              <strong>{t("employees.dataAssunzione")}:</strong>{" "}
              {anagrafica.dataAssunzione}
            </div>
          </div>
        </div>

        {/* TURNI */}
        <div className="flex-1 p-6 rounded-xl border border-white/30 shadow-md bg-white/20 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-4">
            <CalendarCheck size={32} color="#090c64" weight="duotone" />
            <h2 className={`text-lg font-bold ${textColor}`}>
              {t("employees.turniSettimanali")}
            </h2>
          </div>

          <div className={`flex flex-col ${textColor}`}>
            {shiftsLoading && (
              <p className="text-sm opacity-70">Caricamento turni...</p>
            )}

            {!shiftsLoading && existingShifts.length === 0 && (
              <p className="text-sm opacity-70">Nessun turno assegnato.</p>
            )}

            {shiftsError && (
              <p className="text-sm text-red-500">{shiftsError}</p>
            )}

            {existingShifts.map((shift, i) => (
              <div
                key={`${shift.dayKey}_${i}`}
                className="grid grid-cols-2 bg-white/40 rounded-xl p-2 shadow-sm mt-3"
              >
                <span className="font-semibold">{shift.labelDay}</span>
                <span className="text-right">{shift.hours}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SEZIONE 3 */}
      <div className="flex gap-6 mb-6">
        {/* FERIE */}
        <div className="flex-1 p-6 rounded-xl border border-white/30 shadow-md bg-white/20 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Bag size={32} color="#090c64" weight="duotone" />
              <h2 className={`text-lg font-bold ${textColor}`}>
                {t("employees.ferie")}
              </h2>
            </div>
            <button
              className={buttonClass}
              onClick={() => setOpenFerieDrawer(true)}
            >
              {t("employees.richiestaFerie")}
            </button>
          </div>

          <div className={`flex flex-col gap-2 ${textColor}`}>
            {ferieList.map((f, i) => (
              <div
                key={i}
                className="grid grid-cols-2 bg-white/40 rounded-xl p-2 shadow-sm mt-1"
              >
                <span className="font-semibold">{formatDate(f.dal)}</span>
                <span>{formatDate(f.al)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* PERMESSI */}
        <div className="flex-1 p-6 rounded-xl border border-white/30 shadow-md bg-white/20 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <CalendarCheck size={32} color="#090c64" weight="duotone" />
              <h2 className={`text-lg font-bold ${textColor}`}>
                {t("employees.permessi")}
              </h2>
            </div>
            <button
              className={buttonClass}
              onClick={() => setOpenPermessiDrawer(true)}
            >
              {t("employees.richiestaPermessi")}
            </button>
          </div>

          <div className={`flex flex-col gap-2 ${textColor}`}>
            {permessiList.map((p, i) => (
              <div
                key={i}
                className="grid grid-cols-2 bg-white/40 rounded-xl p-2 shadow-sm"
              >
                <span className="font-semibold">{formatDate(p.data)}</span>
                <span>{p.orario}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* DRAWER FERIE */}
      <Drawer
        open={openFerieDrawer}
        onClose={() => setOpenFerieDrawer(false)}
        title={t("employees.richiestaFerie")}
        width="w-[420px]"
      >
        <div className="flex flex-col gap-6">
          <div className="flex flex-col">
            <label className="font-semibold">{t("employees.dal")}</label>
            <input
              type="date"
              value={dal}
              onChange={(e) => setDal(e.target.value)}
              className="border rounded p-2 w-full"
            />
          </div>

          <div className="flex flex-col">
            <label className="font-semibold">{t("employees.al")}</label>
            <input
              type="date"
              value={al}
              onChange={(e) => setAl(e.target.value)}
              className="border rounded p-2 w-full"
            />
          </div>

          <button
            className={`${buttonClass} w-full py-3`}
            onClick={handleInviaFerie}
          >
            {t("Invia Richiesta Ferie")}
          </button>
        </div>
      </Drawer>

      {/* DRAWER PERMESSI */}
      <Drawer
        open={openPermessiDrawer}
        onClose={() => setOpenPermessiDrawer(false)}
        title={t("employees.richiestaPermessi")}
        width="w-[420px]"
      >
        <div className="flex flex-col gap-6">
          <div className="flex flex-col">
            <label className="font-semibold">{t("employees.data")}</label>
            <input
              type="date"
              value={permessoData}
              onChange={(e) => setPermessoData(e.target.value)}
              className="border rounded p-2 w-full"
            />
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
            <div className="flex-1 flex flex-col">
              <label className="font-semibold">{t("Ora Inizio")}</label>
              <input
                type="time"
                value={oraInizio}
                onChange={(e) => setOraInizio(e.target.value)}
                className="border rounded p-2 w-full"
              />
            </div>

            <div className="flex-1 flex flex-col">
              <label className="font-semibold">{t("Ora Fine")}</label>
              <input
                type="time"
                value={oraFine}
                onChange={(e) => setOraFine(e.target.value)}
                className="border rounded p-2 w-full"
              />
            </div>
          </div>

          <button
            className={`${buttonClass} w-full py-3`}
            onClick={handleInviaPermesso}
          >
            {t("Invia Richiesta Permessi")}
          </button>
        </div>
      </Drawer>
    </div>
  );
};

export default UserEmployeePage;
