import { Routes, Route } from "react-router-dom";

// Layout
import PublicLayout from "./layout/PublicLayout.jsx";

// Pagine pubbliche
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";

// Pagine protette
import BoardPage from "./pages/BoardPage.jsx";
import CustomersRegistry from "./pages/Customers/CustomersRegistry.jsx";
import CustomersPage from "./pages/Customers/CustomersPage.jsx";
import EmployeePage from "./pages/Employee/EmployeePage.jsx";
import AdminEmployeeDetailsPage from "./pages/Employee/admin/AdminEmployeeDetailsPage.jsx";
import WarehousePage from "./pages/Warehouse/WarehousePage.jsx";
import Product from "./pages/Warehouse/Product.jsx";
import TicketPage from "./pages/TicketPage.jsx";
import OrderPage from "./pages/OrderPage.jsx";
import ReturnPage from "./pages/ReturnPage.jsx";

function App() {
	return (
		<Routes>
			{/* ROTTE PUBBLICHE */}
			<Route path="/" element={<HomePage />} />
			<Route path="/login" element={<LoginPage />} />
			

			{/* ROTTE PROTETTE */}
			<Route path="/" element={<PublicLayout />}>
				<Route path="dashboard" element={<BoardPage />} />
				<Route path="clienti" element={<CustomersPage />} />
				<Route path="clienti/:id" element={<CustomersRegistry />} />
				<Route path="personale" element={<EmployeePage />} />
				<Route path="personale/:id" element={<AdminEmployeeDetailsPage />} />
				<Route path="magazzino" element={<WarehousePage />} />
				<Route path="product/:id" element={<Product />} />
				<Route path="ticket" element={<TicketPage />} />
				<Route path="ordini" element={<OrderPage />} />
				<Route path="resi" element={<ReturnPage />} />
				<Route path="settings" element={<SettingsPage />} />
			</Route>
		</Routes>
	);
}

export default App;
