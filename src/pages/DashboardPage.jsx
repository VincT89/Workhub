import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchClients } from "../store/feature/clientiSlice";
import { fetchMagazzino } from "../store/feature/magazzinoSlice";
import { fetchPersonale } from "../store/feature/personaleSlice";
import { fetchTickets } from "../store/feature/ticketSlice";
import { logout } from "../store/feature/authSlice";
import { useNavigate } from "react-router-dom";

const DashboardPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, token } = useSelector((state) => state.auth);
  const clienti = useSelector((state) => state.clienti.lista || []);
const magazzino = useSelector((state) => state.magazzino.depositi || []);
const personale = useSelector((state) => state.personale.lista || []);
  const ticket = useSelector((state) => state.ticket.list || []);

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }
    
    dispatch(fetchClients(token));
    dispatch(fetchMagazzino(token));
    dispatch(fetchPersonale(token));
    dispatch(fetchTickets(token));
  }, [dispatch, token, navigate]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <main className="min-h-screen bg-[#f5f7fa] flex flex-col items-center py-8 px-4">
      <header className="w-full max-w-6xl flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold text-[#134a7b]">
            Benvenuto, {user?.nome}
          </h1>
          <p className="text-gray-500">Ruolo: {user?.ruolo}</p>
        </div>
        <button
          onClick={handleLogout}
          className="bg-[#1C62A0] hover:bg-[#155293] text-white px-4 py-2 rounded-xl font-semibold transition"
        >
          Esci
        </button>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl">
        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
          <h2 className="text-lg font-bold text-[#134a7b] mb-1">Clienti</h2>
          <p className="text-4xl font-extrabold text-gray-800">
            {clienti.length}
          </p>
          <p className="text-sm text-gray-500">Totale clienti registrati</p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
          <h2 className="text-lg font-bold text-[#134a7b] mb-1">Magazzini</h2>
          <p className="text-4xl font-extrabold text-gray-800">
            {magazzino.length}
          </p>
          <p className="text-sm text-gray-500">Depositi attivi</p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
          <h2 className="text-lg font-bold text-[#134a7b] mb-1">Personale</h2>
          <p className="text-4xl font-extrabold text-gray-800">
            {personale.length}
          </p>
          <p className="text-sm text-gray-500">Dipendenti totali</p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
          <h2 className="text-lg font-bold text-[#134a7b] mb-1">Ticket</h2>
          <p className="text-4xl font-extrabold text-gray-800">
            {ticket.filter((t) => t.stato === "Aperto").length}
          </p>
          <p className="text-sm text-gray-500">Ticket aperti</p>
        </div>
      </section>

      <section className="w-full max-w-6xl mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-[#134a7b] mb-4">
            Ultimi Clienti
          </h3>
          <ul>
            {clienti.slice(0, 3).map((c) => (
              <li
                key={c.id}
                className="border-b border-gray-100 py-2 flex justify-between"
              >
                <span>{c.nome} {c.cognome}</span>
                <span className="text-sm text-gray-500">{c.livelloFidelizzazione}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-[#134a7b] mb-4">
            Ticket Recenti
          </h3>
          <ul>
            {ticket.slice(0, 3).map((t) => (
              <li
                key={t.id}
                className="border-b border-gray-100 py-2 flex justify-between"
              >
                <span>{t.titolo}</span>
                <span
                  className={`text-sm font-semibold ${
                    t.stato === "Aperto"
                      ? "text-red-600"
                      : t.stato === "In progress"
                      ? "text-yellow-500"
                      : "text-green-600"
                  }`}
                >
                  {t.stato}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
};

export default DashboardPage;
