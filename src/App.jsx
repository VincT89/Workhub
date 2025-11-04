import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import PublicLayout from "./layout/PublicLayout.jsx";
import ClientiPage from "./pages/ClientiPage.jsx";
import PersonalePage from "./pages/PersonalePage.jsx";
import MagazzinoPage from "./pages/MagazzinoPage.jsx";
import TicketPage from "./pages/TicketPage.jsx";

function App() {
	return (
		<Routes>
			{/* ROTTE PUBBLICHE */}
			<Route path="/" element={<HomePage />} />
			<Route path="/login" element={<LoginPage />} />
			<Route path="/settings" element={<SettingsPage />} />

			{/* ROTTE PROTETTE */}
			<Route path="/" element={<PublicLayout />}>
				<Route path="dashboard" element={<DashboardPage />} />
				<Route path="clienti" element={<ClientiPage />} />
				<Route path="personale" element={<PersonalePage />} />
				<Route path="magazzino" element={<MagazzinoPage />} />
				<Route path="ticket" element={<TicketPage />} />
			</Route>
		</Routes>
	);
}

export default App;
