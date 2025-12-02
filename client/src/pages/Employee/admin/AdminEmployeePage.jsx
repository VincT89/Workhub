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

  const { list: employees = [], loading, error } =
    useSelector((state) => state.users || {}) || {};
  const { list: pointsOfSale = [] } =
    useSelector((state) => state.pos || {}) || {};
  const { token } = useSelector((state) => state.auth || {});

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  const [search, setSearch] = useState("");
  const [sortAsc, setSortAsc] = useState(true);

  const [editDrawerOpen, setEditDrawerOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  useEffect(() => {
    if (!token) return;
    dispatch(fetchUsersAsync(token));
    dispatch(fetchPointsOfSalesAsync({ token }));
  }, [dispatch, token]);

  const stats = [
    {
      label: t("employees.dipendentiAttivi"),
      value: employees.length,
      icon: <UsersThree size={28} color="#090c64" weight="duotone" />,
    },
    {
      label: t("employees.dipendentiInattivi"),
      value: 4,
      icon: <UserCircleMinus size={28} color="#090c64" weight="duotone" />,
    },
  ];

  const filteredEmployees = useMemo(() => {
    const s = search.toLowerCase();
    return employees
      .filter((u) => {
        const fullName = `${u.firstName || ""} ${u.lastName || ""}`.toLowerCase();
        return (
          fullName.includes(s) ||
          (u.username || "").toLowerCase().includes(s) ||
          (u.email || "").toLowerCase().includes(s) ||
          (u.department || "").toLowerCase().includes(s) ||
          String(u.personnelNumber || "").includes(s)
        );
      })
      .sort((a, b) => {
        const nameA = `${a.firstName || ""} ${a.lastName || ""}`.toLowerCase();
        const nameB = `${b.firstName || ""} ${b.lastName || ""}`.toLowerCase();
        return sortAsc ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
      });
  }, [employees, search, sortAsc]);

  const openEmployeeDetails = (employee) => {
    navigate(`/personale/${employee._id}`);
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    if (!token) return;

    const form = e.target;

    const fullName = form.nome.value.trim();
    const [firstName, ...rest] = fullName.split(" ");
    const lastName = rest.join(" ");

    const newUser = {
      firstName,
      lastName,
      username: form.username.value.trim(),
      email: form.email.value.trim(),
      phone: form.telefono.value.trim() || undefined,
      department: form.ruolo.value.trim(),
      personnelNumber: Number(form.personnelNumber.value),
      workplace: form.sede.value,
      contractType: form.contratto.value || undefined,
      hireDate: form.dataAssunzione.value
        ? new Date(form.dataAssunzione.value)
        : undefined,
      role: form.role.value,
    };

    try {
      const payload = await dispatch(
        createUserAsync({ newUser, token })
      ).unwrap();

      setGeneratedPassword(payload.tempPassword || "");

      setToastMessage("Dipendente creato con successo!");
      setTimeout(() => setToastMessage(""), 3000);

      form.reset();
    } catch (err) {
      console.error(err);
      setToastMessage("Errore nella creazione del dipendente");
      setTimeout(() => setToastMessage(""), 3000);
    }
  };

  const openEditDrawer = (employee) => {
    setSelectedEmployee({
      ...employee,
      phone: employee.phone || "",
      contractType: employee.contractType || "",
      department: employee.department || "",
      workplace: employee.workplace || "",
      hireDate: employee.hireDate
        ? new Date(employee.hireDate).toISOString().slice(0, 10)
        : "",
    });
    setEditDrawerOpen(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setSelectedEmployee((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditCancel = () => {
    setEditDrawerOpen(false);
    setSelectedEmployee(null);
  };

  const handleSave = async () => {
    if (!selectedEmployee || !token) return;

    const updates = {
      firstName: selectedEmployee.firstName.trim(),
      lastName: selectedEmployee.lastName.trim(),
      username: selectedEmployee.username.trim(),
      email: selectedEmployee.email.trim(),
      phone: selectedEmployee.phone || undefined,
      department: selectedEmployee.department,
      workplace: selectedEmployee.workplace,
      personnelNumber: Number(selectedEmployee.personnelNumber),
      role: selectedEmployee.role,
      contractType: selectedEmployee.contractType || "",
      hireDate: selectedEmployee.hireDate
        ? new Date(selectedEmployee.hireDate)
        : null,
    };

    try {
      await dispatch(
        updateUserAsync({ id: selectedEmployee._id, updates, token })
      ).unwrap();
      handleEditCancel();
    } catch (err) {
      console.error("Errore aggiornamento utente:", err);
    }
  };

  const handleDeleteUser = async (employee) => {
    if (!token) return;

    if (
      !window.confirm(
        `Vuoi eliminare ${employee.firstName} ${employee.lastName}?`
      )
    )
      return;

    try {
      await dispatch(deleteUserAsync({ id: employee._id, token })).unwrap();
    } catch (err) {
      console.error("Errore eliminazione:", err);
    }
  };

  return (
    <div className="w-full h-full flex flex-col gap-8 overflow-y-auto p-4">
      {/* STATISTICHE + AGGIUNGI DIPENDENTE */}
      <section className="grid grid-cols-3 gap-6 mb-2 w-full items-center">
        {stats.map((stat, i) => (
          <div
            key={i}
            className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 backdrop-blur-sm border border-white/30 shadow-md ${textColor}`}
          >
            {stat.icon}
            <span className="font-bold">
              {stat.label}: {stat.value}
            </span>
          </div>
        ))}

        <div
          onClick={() => setDrawerOpen(!drawerOpen)}
          className="flex items-center justify-center gap-2 rounded-xl px-4 py-3 backdrop-blur-sm border border-white/30 shadow-md cursor-pointer font-bold"
        >
          <span className="text-xl font-bold">+</span>
          {t("Aggiungi Dipendente")}
        </div>
      </section>

      {/* FORM CREAZIONE DIPENDENTE */}
      {drawerOpen && (
        <div className="p-6 flex flex-col gap-4 rounded-xl border border-white/30 shadow-md backdrop-blur-sm">
          <h3 className={`text-lg font-bold ${textColor}`}>
            {t("Nuovo Dipendente")}
          </h3>

          <form onSubmit={handleAddEmployee} className="grid grid-cols-2 gap-4">
            <input
              name="nome"
              type="text"
              placeholder="Nome completo"
              required
              className="p-2 border rounded"
            />

            <input
              name="ruolo"
              type="text"
              placeholder="Ruolo / Reparto"
              required
              className="p-2 border rounded"
            />

            <input
              name="username"
              type="text"
              placeholder="Username"
              required
              className="p-2 border rounded"
            />

            <input
              name="email"
              type="email"
              placeholder="Email"
              required
              className="p-2 border rounded"
            />

            <input
              name="telefono"
              type="text"
              placeholder="Telefono"
              className="p-2 border rounded"
            />

            <input
              name="personnelNumber"
              type="number"
              placeholder="Matricola"
              required
              className="p-2 border rounded"
            />

            <select name="sede" required className="p-2 border rounded">
              <option value="">Sede lavorativa</option>
              {pointsOfSale.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name} – {p.location?.city}
                </option>
              ))}
            </select>

            <select name="contratto" className="p-2 border rounded">
              <option value="">Tipo di contratto</option>
              <option value="indeterminato">Indeterminato</option>
              <option value="determinato">Determinato</option>
              <option value="part-time">Part-time</option>
            </select>

            <input
              name="dataAssunzione"
              type="date"
              className="p-2 border rounded"
            />

            <select name="role" required className="p-2 border rounded">
              <option value="">Ruolo account</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>

            <input
              value={generatedPassword}
              readOnly
              placeholder="Password generata"
              className="p-2 border rounded col-span-2 bg-gray-100"
            />

            <div className="col-span-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="px-4 py-2 border rounded-xl"
              >
                Annulla
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#090c64] text-white rounded-xl"
              >
                Crea
              </button>
            </div>
          </form>

          {toastMessage && (
            <div className="mt-2 p-2 bg-green-500 text-white rounded text-center">
              {toastMessage}
            </div>
          )}
        </div>
      )}

      {/* BARRA DI RICERCA */}
      <div className="flex items-center gap-2 mb-4">
        <input
          type="text"
          placeholder={t("Cerca Dipendente")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 rounded-lg border flex-1"
        />
        <button
          onClick={() => setSortAsc(!sortAsc)}
          className="p-2 bg-[#090c64] text-white rounded-lg"
        >
          {sortAsc ? "A-Z" : "Z-A"}
        </button>
      </div>

      {/* LISTA DIPENDENTI */}
      <div className="p-6 flex flex-col gap-4 h-full rounded-xl border border-white/30 shadow-md backdrop-blur-sm">
        <h2 className={`text-lg font-bold ${textColor}`}>
          {t("employees.listaDipendenti")}
        </h2>

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

            <tbody >
              {filteredEmployees.map((e) => (
                <tr
                  key={e._id}
                  className="bg-white/30 hover:bg-white/70 transition rounded-xl"
                >
                  <td className="py-2 flex justify-center">
                    <UserCircle size={34} color="#090c64" weight="duotone" />
                  </td>

                  <td
                    className="truncate cursor-pointer"
                    onClick={() => openEmployeeDetails(e)}
                  >
                    {e.firstName} {e.lastName}
                  </td>

                  <td className="truncate">{e.department}</td>
                  <td className="truncate">{e.email}</td>
                  <td>{e.personnelNumber}</td>

                  <td>
                    <div className="flex justify-center gap-3">
                      <button onClick={() => openEditDrawer(e)}>
                        <NotePencil size={28} color="#090c64" weight="duotone" />
                      </button>

                      <button onClick={() => handleDeleteUser(e)}>
                        <Trash size={28} color="red" weight="duotone" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {!loading && filteredEmployees.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-4 text-gray-500">
                    Nessun dipendente trovato
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {error && (
            <p className="mt-2 text-sm text-red-500 text-center">
              {error}
            </p>
          )}
        </div>
      </div>

      {/* DRAWER MODIFICA */}
      <Drawer
        open={editDrawerOpen}
        onClose={handleEditCancel}
        title="MODIFICA DIPENDENTE"
        width="w-[420px]"
      >
        {selectedEmployee && (
          <div className="flex flex-col gap-4">
            <input
              name="firstName"
              value={selectedEmployee.firstName}
              onChange={handleEditChange}
              placeholder="Nome"
              className="p-2 border rounded"
            />
            <input
              name="lastName"
              value={selectedEmployee.lastName}
              onChange={handleEditChange}
              placeholder="Cognome"
              className="p-2 border rounded"
            />

            <input
              name="username"
              value={selectedEmployee.username}
              onChange={handleEditChange}
              placeholder="Username"
              className="p-2 border rounded"
            />

            <input
              name="email"
              value={selectedEmployee.email}
              onChange={handleEditChange}
              placeholder="Email"
              className="p-2 border rounded"
            />

            <input
              name="phone"
              value={selectedEmployee.phone}
              onChange={handleEditChange}
              placeholder="Telefono"
              className="p-2 border rounded"
            />

            <input
              name="department"
              value={selectedEmployee.department}
              onChange={handleEditChange}
              placeholder="Reparto / Ruolo"
              className="p-2 border rounded"
            />

            <input
              name="personnelNumber"
              value={selectedEmployee.personnelNumber}
              onChange={handleEditChange}
              type="number"
              placeholder="Matricola"
              className="p-2 border rounded"
            />

            <select
              name="workplace"
              value={selectedEmployee.workplace}
              onChange={handleEditChange}
              className="p-2 border rounded"
            >
              <option value="">Sede lavorativa</option>
              {pointsOfSale.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name} – {p.location?.city}
                </option>
              ))}
            </select>

            <select
              name="contractType"
              value={selectedEmployee.contractType}
              onChange={handleEditChange}
              className="p-2 border rounded"
            >
              <option value="">Tipo di contratto</option>
              <option value="indeterminato">Indeterminato</option>
              <option value="determinato">Determinato</option>
              <option value="part-time">Part-time</option>
            </select>

            <input
              name="hireDate"
              type="date"
              value={selectedEmployee.hireDate || ""}
              onChange={handleEditChange}
              className="p-2 border rounded"
            />

            <select
              name="role"
              value={selectedEmployee.role}
              onChange={handleEditChange}
              className="p-2 border rounded"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>

            <div className="flex gap-4 mt-4">
              <button
                onClick={handleEditCancel}
                className="flex-1 py-2 bg-white text-[#090c64] border border-[#090c64] rounded-xl"
              >
                Annulla
              </button>
              <button
                onClick={handleSave}
                className="flex-1 py-2 bg-[#090c64] text-white rounded-xl"
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
