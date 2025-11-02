import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage.jsx";

// import PublicLayout from "./layouts/PublicLayout.jsx";
// import LoginPage from "./pages/LoginPage.jsx";
// import SettingsPage from "./pages/SettingsPage.jsx";


function App() {
  return (
    <Routes>
      {/* <Route path="/" element={<PublicLayout />}> */}
        <Route path="/" element={<HomePage />} />
         <Route path="login" element={<LoginPage />} />
        {/*<Route path="settings" element={<SettingsPage />} /> */}
      {/* </Route> */}
    </Routes>
  );
}

export default App;
