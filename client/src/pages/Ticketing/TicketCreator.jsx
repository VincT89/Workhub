import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createTicketAsync } from "../../store/feature/ticketSlice";

const TicketCreator = ({ user }) => {
  const dispatch = useDispatch();
  const [newTitle, setNewTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const creatorStatus = useSelector((state) => state.tickets.status);

  // Auto-clear success message after 3 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const handleAddTicket = async () => {
    const title = newTitle.trim();
    if (!title || title.length < 3) {
      setError("Il titolo deve contenere almeno 3 caratteri");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    const payload = {
      user: user?._id || user?.id || "default-user",
      name: title,
      content: `Ticket creato da ${user?.nome || 'Utente sconosciuto'}`,
      status: "open",
    };

    try {
      const result = await dispatch(createTicketAsync(payload)).unwrap();
      setNewTitle("");
      setSuccess(`✓ Ticket "${result.name}" creato con successo`);
    } catch (err) {
      const errMsg = typeof err === 'string' ? err : err?.message || "Errore nella creazione del ticket";
      setError(errMsg);
      console.error("Create ticket error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white/20 rounded-xl shadow-md w-full mx-auto">
      <h2 className="font-bold text-xl mb-4">Crea Nuovo Ticket</h2>

      {/* Input Titolo Ticket */}
      <input
        type="text"
        value={newTitle}
        onChange={(e) => setNewTitle(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && !isLoading && handleAddTicket()}
        placeholder="Titolo del ticket (min. 3 caratteri)"
        className="border rounded-xl p-2 w-full mb-3 focus:outline-none focus:ring-2 focus:ring-[#090c64]"
        disabled={isLoading}
        maxLength={100}
      />

      {/* Error message */}
      {error && (
        <div className="mb-3 text-sm text-red-600 bg-red-50 p-3 rounded border border-red-200 flex justify-between items-start">
          <span>{error}</span>
          <button onClick={() => setError("")} className="ml-2 text-red-500 hover:text-red-700">✕</button>
        </div>
      )}

      {/* Success message */}
      {success && (
        <div className="mb-3 text-sm text-green-600 bg-green-50 p-3 rounded border border-green-200">
          {success}
        </div>
      )}

      {/* Pulsante crea ticket */}
      <button
        onClick={handleAddTicket}
        disabled={isLoading || !newTitle.trim()}
        className={`w-full bg-[#090c64] text-white px-4 py-2 rounded-xl transition cursor-pointer font-medium ${
          isLoading || !newTitle.trim() ? "opacity-50 cursor-not-allowed" : "hover:bg-[#0a0d7a]"
        }`}
      >
        {isLoading ? "Creando..." : "+ Crea Ticket"}
      </button>

      {/* Status message */}
      {creatorStatus === "loading" && (
        <div className="mt-3 text-sm text-blue-600 bg-blue-50 p-2 rounded border border-blue-200">
          Sincronizzazione con il server...
        </div>
      )}

      {/* Character counter */}
      <div className="mt-2 text-xs text-gray-500 text-right">
        {newTitle.length}/100 caratteri
      </div>
    </div>
  );
};

export default TicketCreator;