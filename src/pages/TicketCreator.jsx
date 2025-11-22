import React, { useState, useEffect } from "react";

const TicketCreator = ({ onTicketsChange, user }) => {
  const [tickets, setTickets] = useState([]);
  const [ticketCounter, setTicketCounter] = useState(1);
  const [newTitle, setNewTitle] = useState("");

  // Funzione per creare un nuovo ticket
  const addTicket = (title) => {
    const newTicket = {
      id: `t${ticketCounter}`,
      title: title?.trim() || `Ticket Numero ${ticketCounter}`,
      user: user || {
        nome: "Utente Sconosciuto",
        ruolo: "Non definito",
        email: "unknown@example.com",
        avatar: employeeImg,
      },
      createdAt: new Date(),
    };

    setTickets((prev) => [...prev, newTicket]);
    setTicketCounter((prev) => prev + 1);
  };

  // Avvisa il componente padre quando i ticket cambiano
  useEffect(() => {
    onTicketsChange?.(tickets);
  }, [tickets, onTicketsChange]);

  const handleAddTicket = () => {
    addTicket(newTitle);
    setNewTitle("");
  };

  return (
    <div className="p-4 bg-white rounded-xl shadow-md w-full max-w-md mx-auto">
      <h2 className="font-bold text-xl mb-4">Crea Nuovo Ticket</h2>

      {/* Input Titolo Ticket */}
      <input
        type="text"
        value={newTitle}
        onChange={(e) => setNewTitle(e.target.value)}
        placeholder="Titolo del ticket"
        className="border rounded p-2 w-full mb-3"
      />

      {/* Pulsante crea ticket */}
      <button
        onClick={handleAddTicket}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
      >
        + Crea Ticket
      </button>

      {/* Lista ticket creati */}
      {tickets.length > 0 && (
        <div className="mt-6">
          <h3 className="font-semibold mb-2">Ticket creati</h3>
          <ul className="space-y-2 max-h-64 overflow-y-auto">
            {tickets.map((t) => (
              <li
                key={t.id}
                className="flex justify-between items-center p-2 bg-gray-50 rounded shadow-sm"
              >
                <span>{t.title}</span>
                <div className="flex items-center gap-2">
                  <img
                    src={t.user?.avatar || employeeImg}
                    alt={t.user?.nome || "Utente Sconosciuto"}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <span className="text-sm text-gray-500">
                    {t.user?.nome || "Utente Sconosciuto"}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TicketCreator;
