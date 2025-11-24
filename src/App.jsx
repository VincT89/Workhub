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
import TicketPage from "./pages/Ticketing/TicketPage.jsx";
import OrderPage from "./pages/OrderPage.jsx";
import PasswordRecoveryPage from "./pages/PasswordRecoveryPage.jsx";

function App() {
	return (
		<Routes>
			{/* ROTTE PUBBLICHE */}
			<Route path="/" element={<HomePage />} />
			<Route path="/login" element={<LoginPage />} />
			<Route path="/forgot-password" element={<PasswordRecoveryPage />} />
			

			{/* ROTTE PROTETTE */}
			<Route path="/" element={<PublicLayout />}>
				<Route path="board" element={<BoardPage />} />
				<Route path="customers" element={<CustomersPage />} />
				<Route path="item/:id" element={<CustomersRegistry />} />
				<Route path="personale" element={<EmployeePage />} />
				<Route path="personale/:id" element={<AdminEmployeeDetailsPage />} />
				<Route path="warehouse" element={<WarehousePage />} />
				<Route path="product/:id" element={<Product />} />
				<Route path="ticket" element={<TicketPage />} />
				<Route path="orders" element={<OrderPage />} />
				<Route path="settings" element={<SettingsPage />} />
			</Route>
		</Routes>
	);
}

export default App;
