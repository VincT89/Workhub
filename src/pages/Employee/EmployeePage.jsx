// src/pages/PersonalePage.jsx
import { useSelector } from "react-redux";
import AdminEmployeePage from "./admin/AdminEmployeePage";
import UserEmployeePage from "./user/UserEmployeePage";

const EmployeePage = () => {
	const user = useSelector((state) => state.auth.user);

	if (user?.role === "admin") return <AdminEmployeePage />;
	return <UserEmployeePage />;
};

export default EmployeePage;
