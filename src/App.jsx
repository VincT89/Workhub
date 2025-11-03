import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx"
import DashboardPage from "./pages/DashboardPage.jsx";


function App() {
	return (
		<Routes>
			{/* <Route path="/" element={<PublicLayout />}> */}
			<Route path="/" element={<HomePage />} />
			<Route path="/login" element={<LoginPage />} />
			<Route path="/settings" element={<SettingsPage />} />
			<Route path="/dashboard" element={<DashboardPage />} />

			{/* </Route> */}
		</Routes>
	);
}

export default App;
