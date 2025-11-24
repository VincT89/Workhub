import { useTheme } from "../../../context/ThemeContext.jsx";
import { useLanguage } from "../../../context/LanguageContext.jsx";
import { UserCircle, NotePencil, UsersThree, UserCircleMinus } from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";

const AdminEmployeePage = () => {
	const navigate = useNavigate();
	const { theme } = useTheme();
	const { t } = useLanguage();

	const textColor = theme === "dark" ? "text-white" : "text-[#090c64]";

	const [drawerOpen, setDrawerOpen] = useState(false);

	// ------ STATO EMPLOYEES DICHIARATO PRIMA DEL FILTRO ------
	const [employees, setEmployees] = useState([
		{
			nome: "Jennifer Bianchi",
			ruolo: "Responsabile reparto",
			matricola: "ADD-0001",
			email: "jennifer.bianchi@example.com",
			telefono: "3331234567",
			sede: "Milano",
			contratto: "Tempo pieno",
			dataAssunzione: "2020-01-15",
		},
		{
			nome: "Luca Rossi",
			ruolo: "Sviluppatore",
			matricola: "ADD-0002",
			email: "luca.rossi@example.com",
			telefono: "3339876543",
			sede: "Roma",
			contratto: "Tempo determinato",
			dataAssunzione: "2021-06-10",
		},
		{
			nome: "Maria Verdi",
			ruolo: "Designer",
			matricola: "ADD-0003",
			email: "maria.verdi@example.com",
			telefono: "3336543210",
			sede: "Milano",
			contratto: "Tempo pieno",
			dataAssunzione: "2019-09-01",
		},
		{
			nome: "Giovanni Neri",
			ruolo: "Marketing Manager",
			matricola: "ADD-0004",
			email: "giovanni.neri@example.com",
			telefono: "3331112233",
			sede: "Roma",
			contratto: "Tempo pieno",
			dataAssunzione: "2018-03-20",
		},
		{
			nome: "Elena Gialli",
			ruolo: "HR Specialist",
			matricola: "ADD-0005",
			email: "elena.gialli@example.com",
			telefono: "3332223344",
			sede: "Milano",
			contratto: "Part-time",
			dataAssunzione: "2022-02-14",
		},
		{
			nome: "Marco Blu",
			ruolo: "Data Analyst",
			matricola: "ADD-0006",
			email: "marco.blu@example.com",
			telefono: "3335556677",
			sede: "Roma",
			contratto: "Tempo pieno",
			dataAssunzione: "2021-11-05",
		},
	]);

	// FILTRO DI RICERCA DIPENDENTI
	const [search, setSearch] = useState("");
	const [sortAsc, setSortAsc] = useState(true);

	const filteredEmployees = useMemo(() => {
		return employees
			.filter(
				(e) =>
					e.nome.toLowerCase().includes(search.toLowerCase()) ||
					e.ruolo.toLowerCase().includes(search.toLowerCase()) ||
					e.email.toLowerCase().includes(search.toLowerCase()) ||
					e.matricola.toLowerCase().includes(search.toLowerCase())
			)
			.sort((a, b) => {
				if (a.nome.toLowerCase() < b.nome.toLowerCase())
					return sortAsc ? -1 : 1;
				if (a.nome.toLowerCase() > b.nome.toLowerCase())
					return sortAsc ? 1 : -1;
				return 0;
			});
	}, [employees, search, sortAsc]);

	// drawer modifica/elimina
	const [editDrawerOpen, setEditDrawerOpen] = useState(false);
	const [selectedEmployee, setSelectedEmployee] = useState(null);

	const stats = [
		{
			label: t("employees.dipendentiAttivi"),
      value: employees.length,
      icon: <UsersThree size={28} color="#090c64" weight="duotone" />
		},
		{
			label: t("employees.dipendentiInattivi"),
      value: 4,
      icon: <UserCircleMinus size={28} color="#090c64" weight="duotone" />
		},
	];

	const openEmployeeDetails = (employee) => {
		navigate(`/personale/${employee.matricola}`);
	};

	const openEditDrawer = (employee) => {
		setSelectedEmployee(employee);
		setEditDrawerOpen(true);
	};

	const handleEditChange = (e) => {
		const { name, value } = e.target;
		setSelectedEmployee({ ...selectedEmployee, [name]: value });
	};

	const handleSave = () => {
		setEmployees(
			employees.map((emp) =>
				emp.matricola === selectedEmployee.matricola ? selectedEmployee : emp
			)
		);
		setEditDrawerOpen(false);
	};

	const handleDelete = () => {
		setEmployees(
			employees.filter((emp) => emp.matricola !== selectedEmployee.matricola)
		);
		setEditDrawerOpen(false);
	};

	const generatePassword = (length = 12) => {
		const chars =
			"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*_";
		let password = "";
		for (let i = 0; i < length; i++) {
			password += chars.charAt(Math.floor(Math.random() * chars.length));
		}
		return password;
	};

	const [generatedPassword, setGeneratedPassword] = useState("");
	const [toastMessage, setToastMessage] = useState("");

	const handleAddEmployee = (e) => {
		e.preventDefault();
		const form = e.target;
		const password = generatePassword();
		setGeneratedPassword(password);

		const newEmployee = {
			nome: form.nome.value,
			ruolo: form.ruolo.value,
			matricola: `ADD-${(employees.length + 1).toString().padStart(4, "0")}`,
			email: form.email.value,
			telefono: form.telefono.value,
			sede: form.sede.value,
			contratto: form.contratto.value,
			dataAssunzione: form.dataAssunzione.value,
			password,
		};

		setEmployees([...employees, newEmployee]);
		setToastMessage("Dipendente creato con successo!");
		setTimeout(() => setToastMessage(""), 3000);
		form.reset();
	};

	return (
		<div className="w-full h-full flex flex-col gap-8 overflow-y-auto scrollbar-thin scrollbar-thumb-[#1C62A0] scrollbar-track-transparent p-4">
			{/* STATISTICHE */}
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

			{/* DRAWER CREAZIONE */}
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
							placeholder="Ruolo"
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
							required
							className="p-2 border rounded"
						/>
						<input
							name="sede"
							type="text"
							placeholder="Sede lavorativa"
							required
							className="p-2 border rounded"
						/>
						<input
							name="contratto"
							type="text"
							placeholder="Tipo di contratto"
							required
							className="p-2 border rounded"
						/>
						<input
							name="dataAssunzione"
							type="date"
							placeholder="Data di assunzione"
							required
							className="p-2 border rounded"
						/>
						<input
							value={generatedPassword}
							readOnly
							placeholder="Password generata"
							className="p-2 border rounded col-span-2 bg-gray-100 text-gray-700"
						/>
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

			{/* CAMPO DI RICERCA E PULSANTE FILTRA */}
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

			{/* LISTA DIPENDENTI IN TABELLA */}
			<div
				className={`p-6 flex flex-col gap-4 h-full rounded-xl border border-white/30 shadow-md backdrop-blur-sm ${
					theme === "dark" ? "bg-white/20" : "bg-white/20"
				}`}
			>
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

						<tbody>
							{filteredEmployees.map((e, i) => (
								<tr
									key={i}
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
										{e.nome}
									</td>
									<td className="truncate">{e.ruolo}</td>
									<td className="truncate">{e.email}</td>
									<td>{e.matricola}</td>

									<td>
										<button
											onClick={() => openEditDrawer(e)}
											className="flex items-center justify-center mx-auto cursor-pointer"
										>
											<NotePencil size={28} color="#090c64" weight="duotone" />
										</button>
									</td>
								</tr>
							))}

							{filteredEmployees.length === 0 && (
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

			{/* DRAWER MODIFICA/ELIMINA A DESTRA */}
			{editDrawerOpen && selectedEmployee && (
				<div
					className={`w-80 fixed top-0 right-0 h-full shadow-lg border border-white/30 backdrop-blur-sm flex flex-col justify-between ${
						theme === "dark" ? "bg-white/20" : "bg-white/20"
					} p-6`}
				>
					{/* Header  */}
					<div className="w-full flex justify-center items-center relative mb-4">
						<h3
							className={`text-lg font-bold text-center w-full mt-30 ${textColor}`}
						>
							MODIFICA DIPENDENTE
						</h3>
						<button
							onClick={() => setEditDrawerOpen(false)}
							className="absolute top-0 right-0 text-white font-bold p-1 text-lg"
						></button>
					</div>

					{/* Contenuto scrollabile */}
					<div className=" w-full flex flex-col gap-5 overflow-y-auto">
						{[
							"nome",
							"ruolo",
							"email",
							"telefono",
							"sede",
							"contratto",
							"dataAssunzione",
						].map((field) => (
							<input
								key={field}
								name={field}
								value={selectedEmployee[field]}
								onChange={handleEditChange}
								type={field === "dataAssunzione" ? "date" : "text"}
								placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
								className="w-full p-2 border rounded"
							/>
						))}
					</div>

					{/* Bottoni sempre visibili in fondo */}
					<div className="w-full flex justify-between mt-4">
						<button
							onClick={handleDelete}
							className="w-[48%] py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition cursor-pointer"
						>
							Elimina
						</button>
						<button
							onClick={handleSave}
							className="w-[48%] py-2 bg-[#090c64] text-white rounded-xl cursor-pointer transition"
						>
							Salva
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default AdminEmployeePage;
