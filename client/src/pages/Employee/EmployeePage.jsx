// src/pages/PersonalePage.jsx
import { useSelector } from "react-redux";
import AdminEmployeePage from "./admin/AdminEmployeePage";
import UserEmployeePage from "./user/UserEmployeePage";

const EmployeePage = () => {
	const user = useSelector((state) => state.auth.user); // Ottieni l'utente dallo stato Redux

	if (user?.role === "admin") return <AdminEmployeePage />; // Se l'utente è un admin, mostra la pagina admin altrimenti mostra la pagina user
	return <UserEmployeePage />;
};

export default EmployeePage;
