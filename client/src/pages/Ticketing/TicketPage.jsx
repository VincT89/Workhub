// src/pages/PersonalePage.jsx
import { useSelector } from "react-redux";
import TicketPageAdmin from "./TicketPageAdmin";
import TicketCreator from "./TicketCreator";

const TicketPage = () => {
	const user = useSelector((state) => state.auth.user); // Ottieni l'utente dallo stato Redux

	if (user?.role === "admin") return <TicketPageAdmin />; // Se l'utente è un admin, mostra la pagina admin altrimenti mostra la pagina user
	return <TicketCreator />;
};

export default TicketPage;
