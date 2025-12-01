import { useTheme } from "../../../context/ThemeContext.jsx";
import { useLanguage } from "../../../context/LanguageContext.jsx";
import {
  UserCircle,
  NotePencil,
  UsersThree,
  UserCircleMinus,
  Trash,
} from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";
import { useMemo, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchUsersAsync,
  createUserAsync,
  updateUserAsync,
  deleteUserAsync,
} from "../../../store/feature/userSlice";
import { fetchPointsOfSalesAsync } from "../../../store/feature/pointOfSalesSlice";

import Drawer from "../../../components/Drawer";

const AdminEmployeePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { theme } = useTheme();
  const { t } = useLanguage();

  const textColor = theme === "dark" ? "text-white" : "text-[#090c64]";

  // ===== REDUX STATE =====
  const { list: employees = [], loading, error } =
    useSelector((state) => state.users || {}) || {};
  const { list: pointsOfSale = [] } =
    useSelector((state) => state.pos || {}) || {};
  const { token } = useSelector((state) => state.auth || {});

  // ===== UI STATE =====
  const [drawerOpen, setDrawerOpen] = useState(false); // modale creazione (inline)
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  const [search, setSearch] = useState("");
  const [sortAsc, setSortAsc] = useState(true);

  // Drawer di modifica (usa il tuo Drawer)
  const [editDrawerOpen, setEditDrawerOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // ===== FETCH iniziali =====
  useEffect(() => {
    if (!token) return;
    dispatch(fetchUsersAsync(token));
    dispatch(fetchPointsOfSalesAsync(token));
  }, [dispatch, token]);

  // ===== STATS (design originale) =====
  const stats = [
    {
      label: t("employees.dipendentiAttivi"),
      value: employees.length,
      icon: <UsersThree size={28} color="#090c64" weight="duotone" />,
    },
    {
      label: t("employees.dipendentiInattivi"),
      value: 4, // ancora statico come nel mock originale
      icon: <UserCircleMinus size={28} color="#090c64" weight="duotone" />,
    },
  ];

  // ===== FILTRO lista dipendenti =====
  const filteredEmployees = useMemo(() => {
    const s = search.toLowerCase();
    return employees
      .filter((u) => {
        const fullName = `${u.firstName || ""} ${u.lastName || ""}`.toLowerCase();
        const username = (u.username || "").toLowerCase();
        const email = (u.email || "").toLowerCase();
        const dept = (u.department || "").toLowerCase();
        const matricola = String(u.personnelNumber || "").toLowerCase();

        return (
          fullName.includes(s) ||
          username.includes(s) ||
          email.includes(s) ||
          dept.includes(s) ||
          matricola.includes(s)
        );
      })
      .sort((a, b) => {
        const nameA = `${a.firstName || ""} ${a.lastName || ""}`.toLowerCase();
        const nameB = `${b.firstName || ""} ${b.lastName || ""}`.toLowerCase();
        if (nameA < nameB) return sortAsc ? -1 : 1;
        if (nameA > nameB) return sortAsc ? 1 : -1;
        return 0;
      });
  }, [employees, search, sortAsc]);

  // ===== NAVIGA SU DETTAGLIO (AdminPage) =====
  const openEmployeeDetails = (employee) => {
    navigate(`/personale/${employee._id}`);
  };

  // ===== CREAZIONE DIPENDENTE (modale inline, non Drawer) =====
  const handleAddEmployee = async (e) => {
    e.preventDefault();
    if (!token) return;

    const form = e.target;

    // Nome completo -> split in firstName / lastName
    const fullName = form.nome.value.trim(); // "Nome Cognome"
    const [firstName, ...restCognome] = fullName.split(" ");
    const lastName = restCognome.join(" ");

    const jobDept = form.ruolo.value.trim(); // ruololavorativo/reparto
    const username = form.username.value.trim();
    const email = form.email.value.trim();
    const phone = form.telefono.value.trim();
    const workplace = form.sede.value;
    const contractType = form.contratto.value;
    const hireDate = form.dataAssunzione.value;
    const role = form.role.value; // "user" / "admin"
    const personnelNumber = Number(form.personnelNumber.value);

    const newUser = {
      email,
      username,
      firstName,
      lastName,
      role, // ruolo account
      department: jobDept, // ruololavorativo salvato come department
      personnelNumber,
      phone: phone || undefined,
      workplace,
      contractType: contractType || undefined,
      hireDate: hireDate ? new Date(hireDate) : undefined,
    };

    try {
      // ATTENZIONE: createUserAsync deve restituire data.data = { user, tempPassword }
      const payload = await dispatch(
        createUserAsync({ newUser, token })
      ).unwrap();

      // Mostro la password generata dal backend nell'input dedicato
      if (payload?.tempPassword) {
        setGeneratedPassword(payload.tempPassword);
      } else {
        setGeneratedPassword("");
      }

      setToastMessage("Dipendente creato con successo!");
      setTimeout(() => setToastMessage(""), 3000);

      form.reset();
    } catch (err) {
      console.error("Errore creazione utente:", err);
      setToastMessage(
        typeof err === "string" ? err : "Errore nella creazione del dipendente"
      );
      setTimeout(() => setToastMessage(""), 3000);
    }
  };

  // ===== MODIFICA DIPENDENTE (Drawer) =====
  const openEditDrawer = (employee) => {
    setSelectedEmployee({
      ...employee,
      hireDate: employee.hireDate
        ? new Date(employee.hireDate).toISOString().slice(0, 10)
        : "",
      phone: employee.phone || "",
      department: employee.department || "",
      contractType: employee.contractType || "",
      workplace: employee.workplace || "",
    });
    setEditDrawerOpen(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setSelectedEmployee((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditCancel = () => {
    setEditDrawerOpen(false);
    setSelectedEmployee(null);
  };

  const handleSave = async () => {
    if (!selectedEmployee || !token) return;

    const {
      _id,
      firstName,
      lastName,
      username,
      email,
      phone,
      department,
      personnelNumber,
      workplace,
      contractType,
      hireDate,
      role,
    } = selectedEmployee;

    const updates = {
      firstName: firstName?.trim(),
      lastName: lastName?.trim(),
      username: username?.trim(),
      email: email?.trim(),
      phone: phone || undefined,
      department: department || "",
      personnelNumber: Number(personnelNumber) || 0,
      workplace: workplace || "",
      contractType: contractType || "",
      hireDate: hireDate ? new Date(hireDate) : null,
      role: role || "user",
    };

    try {
      await dispatch(updateUserAsync({ id: _id, updates, token })).unwrap();
      handleEditCancel();
    } catch (err) {
      console.error("Errore aggiornamento utente:", err);
    }
  };

  // ===== ELIMINA DIPENDENTE (icona cestino nella tabella) =====
  const handleDeleteUser = async (employee) => {
    if (!token) return;
    const conferma = window.confirm(
      `Sei sicuro di voler eliminare ${employee.firstName} ${employee.lastName}?`
    );
    if (!conferma) return;

    try {
      await dispatch(deleteUserAsync({ id: employee._id, token })).unwrap();
    } catch (err) {
      console.error("Errore eliminazione utente:", err);
    }
  };

  return (
    <div className="w-full h-full flex flex-col gap-8 overflow-y-auto scrollbar-thin scrollbar-thumb-[#1C62A0] scrollbar-track-transparent p-4">
      {/* ===== STATISTICHE + BOTTONE AGGIUNGI ===== */}
      <section className="grid grid-cols-3 gap-6 mb-2 w-full items-center">
        {stats.map((stat, i) => (
          <div
            key={i}
            className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 backdrop-blur-sm border border-white/30 shadow-md ${textColor} ${
              theme === "dark" ? "bg-white/20" : "bg-white/20"
            }`}
          >
            {stat.icon}
            <span className="font-bold">
              {stat.label}: {stat.value}
            </span>
          </div>
        ))}

        {/* BOTTONE + (apre la "drawer" di creazione inline) */}
        <div
          onClick={() => setDrawerOpen(!drawerOpen)}
          className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 backdrop-blur-sm border border-white/30 shadow-md cursor-pointer transition duration-300 ${
            theme === "dark"
              ? "bg-white/20 text-white hover:bg-white/30"
              : "bg-white/20 text-[#090c64] hover:bg-white/40"
          } font-bold`}
        >
          <span className="text-xl font-bold">+</span>
          {t("Aggiungi Dipendente")}
        </div>
      </section>

      {/* ===== MODALE CREAZIONE DIPENDENTE (STESSO DESIGN ORIGINALE) ===== */}
      {drawerOpen && (
        <div
          className={`p-6 flex flex-col gap-4 rounded-xl border border-white/30 shadow-md backdrop-blur-sm transition duration-500 ${
            theme === "dark" ? "bg-white/20" : "bg-white/20"
          }`}
        >
          <h3 className={`text-lg font-bold ${textColor}`}>
            {t("Nuovo Dipendente")}
          </h3>

          <form onSubmit={handleAddEmployee} className="grid grid-cols-2 gap-4">
            {/* Nome completo (usato per firstName + lastName) */}
            <input
              name="nome"
              type="text"
              placeholder="Nome completo"
              required
              className="p-2 border rounded"
            />

            {/* Ruolo lavorativo / reparto (salvato come department) */}
            <input
              name="ruolo"
              type="text"
              placeholder="Ruolo / Reparto"
              required
              className="p-2 border rounded"
            />

            {/* Username account MANUALE */}
            <input
              name="username"
              type="text"
              placeholder="Username account"
              required
              className="p-2 border rounded"
            />

            {/* Email */}
            <input
              name="email"
              type="email"
              placeholder="Email"
              required
              className="p-2 border rounded"
            />

            {/* Telefono */}
            <input
              name="telefono"
              type="text"
              placeholder="Telefono"
              className="p-2 border rounded"
            />

            {/* Matricola (personnelNumber) */}
            <input
              name="personnelNumber"
              type="number"
              placeholder="Matricola"
              required
              className="p-2 border rounded"
            />

            {/* Sede lavorativa (PointOfSales) */}
            <select name="sede" required className="p-2 border rounded">
              <option value="">Sede lavorativa</option>
              {pointsOfSale.map((pos) => (
                <option key={pos._id} value={pos._id}>
                  {pos.name} – {pos.location?.city}
                </option>
              ))}
            </select>

            {/* Tipo di contratto */}
            <select name="contratto" className="p-2 border rounded">
              <option value="">Tipo di contratto</option>
              <option value="indeterminato">Indeterminato</option>
              <option value="determinato">Determinato</option>
              <option value="part-time">Part-time</option>
            </select>

            {/* Data di assunzione */}
            <input
              name="dataAssunzione"
              type="date"
              placeholder="Data di assunzione"
              className="p-2 border rounded"
            />

            {/* Ruolo account (user/admin) */}
            <select name="role" required className="p-2 border rounded">
              <option value="">Ruolo account</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>

            {/* Password generata dal BACKEND (tempPassword) */}
            <input
              value={generatedPassword}
              readOnly
              placeholder="Password generata dal sistema"
              className="p-2 border rounded col-span-2 bg-gray-100 text-gray-700"
            />

            {/* Bottoni */}
            <div className="col-span-2 flex justify-end gap-2 mt-2">
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="px-4 py-2 border rounded-xl cursor-pointer hover:bg-gray-100 transition"
              >
                Annulla
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#090c64] text-white rounded-xl cursor-pointer transition"
              >
                Crea
              </button>
            </div>
          </form>

          {toastMessage && (
            <div className="mt-2 p-2 bg-green-500 text-white rounded text-center animate-fade-in-out">
              {toastMessage}
            </div>
          )}
        </div>
      )}

      {/* ===== BARRA DI RICERCA ===== */}
      <div className="flex items-center gap-2 mb-4">
        <input
          type="text"
          placeholder={t("Cerca Dipendente")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 rounded-lg border border-gray-300 flex-1"
        />
        <button
          onClick={() => setSortAsc(!sortAsc)}
          className="p-2 bg-[#090c64] cursor-pointer text-white rounded-lg"
        >
          {sortAsc ? "A-Z" : "Z-A"}
        </button>
      </div>

      {/* ===== LISTA DIPENDENTI IN TABELLA (design originale) ===== */}
      <div
        className={`p-6 flex flex-col gap-4 h-full rounded-xl border border-white/30 shadow-md backdrop-blur-sm ${
          theme === "dark" ? "bg-white/20" : "bg-white/20"
        }`}
      >
        <h2 className={`text-lg font-bold ${textColor}`}>
          {t("employees.listaDipendenti")}
        </h2>

        {loading && (
          <span className="text-sm text-gray-500">
            Caricamento dipendenti...
          </span>
        )}
        {error && (
          <span className="text-sm text-red-500">
            Errore: {String(error)}
          </span>
        )}

        <div className="overflow-y-auto h-full">
          <table className="min-w-full text-sm text-center">
            <thead className="font-bold">
              <tr>
                <th>Foto</th>
                <th>Nome</th>
                <th>Ruolo</th>
                <th>Email</th>
                <th>Matricola</th>
                <th>Azioni</th>
              </tr>
            </thead>

            <tbody>
              {filteredEmployees.map((e) => (
                <tr
                  key={e._id}
                  className={`${
                    theme === "dark"
                      ? "bg-white/20 hover:bg-[#1C62A0]/20"
                      : "bg-white/40 hover:bg-white/70"
                  } transition rounded-xl`}
                >
                  <td className="py-2 items-center justify-center flex">
                    <UserCircle size={34} color="#090c64" weight="duotone" />
                  </td>

                  <td
                    className="truncate cursor-pointer"
                    onClick={() => openEmployeeDetails(e)}
                  >
                    {e.firstName} {e.lastName}
                  </td>

                  {/* Ruolo lavorativo (department) */}
                  <td className="truncate">{e.department}</td>

                  <td className="truncate">{e.email}</td>

                  <td>{e.personnelNumber}</td>

                  <td>
                    <div className="flex items-center justify-center gap-2">
                      {/* EDIT */}
                      <button
                        onClick={() => openEditDrawer(e)}
                        className="flex items-center justify-center mx-auto cursor-pointer"
                      >
                        <NotePencil
                          size={28}
                          color="#090c64"
                          weight="duotone"
                        />
                      </button>

                      {/* DELETE */}
                      <button
                        onClick={() => handleDeleteUser(e)}
                        className="flex items-center justify-center mx-auto cursor-pointer"
                      >
                        <Trash size={28} color="red" weight="duotone" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredEmployees.length === 0 && !loading && (
                <tr>
                  <td colSpan={6} className="py-4 text-gray-500 text-center">
                    Nessun dipendente trovato
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===== DRAWER MODIFICA (usa il tuo componente Drawer) ===== */}
      <Drawer
        open={editDrawerOpen}
        onClose={handleEditCancel}
        title="MODIFICA DIPENDENTE"
        width="w-[420px]"
      >
        {selectedEmployee && (
          <div className="w-full flex flex-col gap-4">
            <input
              name="firstName"
              value={selectedEmployee.firstName || ""}
              onChange={handleEditChange}
              type="text"
              placeholder="Nome"
              className="w-full p-2 border rounded"
            />
            <input
              name="lastName"
              value={selectedEmployee.lastName || ""}
              onChange={handleEditChange}
              type="text"
              placeholder="Cognome"
              className="w-full p-2 border rounded"
            />
            <input
              name="username"
              value={selectedEmployee.username || ""}
              onChange={handleEditChange}
              type="text"
              placeholder="Username"
              className="w-full p-2 border rounded"
            />
            <input
              name="email"
              value={selectedEmployee.email || ""}
              onChange={handleEditChange}
              type="email"
              placeholder="Email"
              className="w-full p-2 border rounded"
            />
            <input
              name="phone"
              value={selectedEmployee.phone || ""}
              onChange={handleEditChange}
              type="text"
              placeholder="Telefono"
              className="w-full p-2 border rounded"
            />
            <input
              name="department"
              value={selectedEmployee.department || ""}
              onChange={handleEditChange}
              type="text"
              placeholder="Ruolo / Reparto"
              className="w-full p-2 border rounded"
            />
            <input
              name="personnelNumber"
              value={selectedEmployee.personnelNumber || ""}
              onChange={handleEditChange}
              type="number"
              placeholder="Matricola"
              className="w-full p-2 border rounded"
            />
            <select
              name="workplace"
              value={selectedEmployee.workplace || ""}
              onChange={handleEditChange}
              className="w-full p-2 border rounded"
            >
              <option value="">Sede lavorativa</option>
              {pointsOfSale.map((pos) => (
                <option key={pos._id} value={pos._id}>
                  {pos.name} – {pos.location?.city}
                </option>
              ))}
            </select>
            <select
              name="contractType"
              value={selectedEmployee.contractType || ""}
              onChange={handleEditChange}
              className="w-full p-2 border rounded"
            >
              <option value="">Tipo di contratto</option>
              <option value="indeterminato">Indeterminato</option>
              <option value="determinato">Determinato</option>
              <option value="part-time">Part-time</option>
            </select>
            <input
              name="hireDate"
              value={selectedEmployee.hireDate || ""}
              onChange={handleEditChange}
              type="date"
              className="w-full p-2 border rounded"
            />
            <select
              name="role"
              value={selectedEmployee.role || "user"}
              onChange={handleEditChange}
              className="w-full p-2 border rounded"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>

            {/* Bottoni in fondo: Annulla bianco/blu, Salva blu */}
            <div className="w-full flex justify-between mt-4 gap-2">
              <button
                onClick={handleEditCancel}
                className="w-1/2 py-2 bg-white text-[#090c64] border border-[#090c64] rounded-xl hover:bg-gray-100 transition cursor-pointer"
              >
                Annulla
              </button>
              <button
                onClick={handleSave}
                className="w-1/2 py-2 bg-[#090c64] text-white rounded-xl cursor-pointer transition"
              >
                Salva
              </button>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default AdminEmployeePage;
