import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage.jsx";

// import PublicLayout from "./layouts/PublicLayout.jsx";
// import LoginPage from "./pages/LoginPage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";
import TicketPageAdmin from "./pages/TicketPageAdmin.jsx";
import TicketCreator from "./pages/TicketCreator.jsx";


function App() {
  return (
    <Routes>
      {/* <Route path="/" element={<PublicLayout />}> */}
        <Route path="/" element={<HomePage />} />
         <Route path="login" element={<LoginPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="ticketing" element={<TicketPageAdmin />} />
        <Route path="creat-ticket" element={<TicketCreator />} />
      {/* </Route> */}
    </Routes>
  );
}

export default App;
