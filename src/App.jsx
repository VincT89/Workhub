import { Routes, Route } from "react-router-dom";

// Layout
import PublicLayout from "./layout/PublicLayout.jsx";

// Pagine pubbliche
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";

// Pagine protette
import DashboardPage from "./pages/DashboardPage.jsx";
import ClientiPage from "./pages/ClientiPage.jsx";
import EmployeePage from "./pages/Employee/EmployeePage.jsx";
import WarehousePage from "./pages/Warehouse/WarehousePage.jsx";
import Product from "./pages/Warehouse/Product.jsx";
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
        <Route path="personale" element={<EmployeePage />} />
        <Route path="magazzino" element={<WarehousePage />} />
        <Route path="product/:id" element={<Product />} />
        <Route path="ticket" element={<TicketPage />} />
      </Route>
    </Routes>
  );
}

export default App;
