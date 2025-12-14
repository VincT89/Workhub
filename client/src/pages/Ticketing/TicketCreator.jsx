import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createTicketAsync, fetchTickets, selectTickets } from "../../store/feature/ticketSlice";
import { useLanguage } from "../../context/LanguageContext";

const TicketCreator = ({ user }) => {
  const dispatch = useDispatch();
  const { t } = useLanguage();
  const authUser = useSelector((state) => state.auth.user);
  const [newTitle, setNewTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const creatorStatus = useSelector((state) => state.tickets.status);
  const tickets = useSelector(selectTickets);
  // derive filtered tickets for the current authenticated user
  const filteredTickets = (tickets || []).filter(
    (t) => ((t.user && (t.user._id || t.user.id)) === (authUser?._id || authUser?.id) || (t.user === (authUser?._id || authUser?.id)))
  );

  // Auto-clear success message after 3 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  // Load tickets when authenticated
  useEffect(() => {
    if (authUser) {
      dispatch(fetchTickets());
    }
  }, [dispatch, authUser]);

  const handleAddTicket = async () => {
    const title = newTitle.trim();
    if (!title || title.length < 3) {
      setError("Il titolo deve contenere almeno 3 caratteri");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    const resolvedUserId = user?._id || user?.id || authUser?._id || authUser?.id;

    if (!resolvedUserId) {
      setError("Utente non autenticato: impossibile associare il ticket a un utente valido");
      setIsLoading(false);
      return;
    }

    const payload = {
      user: resolvedUserId,
      name: title,
      content: `Ticket creato da ${user?.nome || authUser?.firstName || 'Utente'}`,
      status: "open",
    };

    try {
      const result = await dispatch(createTicketAsync(payload)).unwrap();
      setNewTitle("");
      setSuccess(`✓ Ticket "${result.name}" creato con successo`);
      dispatch(fetchTickets());
    } catch (err) {
      // err can be a string or an object rejected via rejectWithValue({ message, details })
      let errMsg = "Errore nella creazione del ticket";
      if (typeof err === "string") errMsg = err;
      else if (err && typeof err === "object") {
        errMsg = err.message || errMsg;
        // if validation details exist, try to extract a readable message
        const details = err.details;
        if (details && typeof details === 'object') {
          const firstKey = Object.keys(details)[0];
          const first = details[firstKey];
          if (first && (first.message || first.reason)) errMsg += `: ${first.message || first.reason}`;
        }
      }

      setError(errMsg);
      console.error("Create ticket error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // ===== RENDER DEL COMPONENTE =====
  return (
    <div className="p-4 bg-white/20 rounded-xl shadow-md w-full mx-auto">

      <h2 className="font-bold text-xl mb-4">{t("creaTicket")}</h2>

      {/* INPUT: Campo di testo per il titolo del ticket */}
      <input
        type="text"
        value={newTitle}
        onChange={(e) => setNewTitle(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && !isLoading && handleAddTicket()}
        placeholder={t("titoloTicket")}
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
        className={` custom-button w-full bg-[#090c64] text-white px-4 py-2 rounded-xl transition cursor-pointer font-medium ${
          isLoading || !newTitle.trim() ? "opacity-50 cursor-not-allowed" : "hover:bg-[#0a0d7a]"
        }`}
      >
        {isLoading ? t("creando") : "+ " + t("richiediTicket")}
      </button>
              
      {/* Status message */}
      {creatorStatus === "loading" && (
        <div className="mt-3 text-sm text-blue-600 bg-blue-50 p-2 rounded border border-blue-200">
          {t("sincronizzazioneInCorso")}
        </div>
      )}

      {/* Character counter */}
      <div className="mt-2 text-xs text-gray-500 text-right">
        {newTitle.length}/100 {t("caratteri")}
      </div>

      <div className="mt-4">
        <h3 className="font-semibold mb-2">{t("iTuoiTicket")}</h3>
        {(!filteredTickets || filteredTickets.length === 0) ? (
          <div className="text-sm text-gray-500">{t("nessunTicket")}</div>
        ) : (
          // Compute a dynamic maxHeight: itemHeight * count (with padding) and cap it
          (() => {
            const ITEM_HEIGHT = 56; // approx px per list item
            const PADDING = 12; // extra space
            const MAX_HEIGHT = 480; // px cap before scrollbar appears
            const desired = Math.min(Math.max(filteredTickets.length * ITEM_HEIGHT + PADDING, ITEM_HEIGHT), MAX_HEIGHT);
            return (
              <ul
                className="space-y-2 overflow-auto"
                style={{ maxHeight: `${desired}px`, transition: 'max-height 180ms ease' }}
              >
                {filteredTickets.map((t) => {
                  const rawStatus = t.status || '';
                  const statusKey = rawStatus === 'open' ? 'aperto' : rawStatus === 'closed' ? 'risolto' : (rawStatus || '').toLowerCase();
                  const statusLabel = statusKey === 'aperto' ? 'Aperto' : statusKey === 'risolto' ? 'Risolto' : rawStatus;
                  // Use the same background / hover classes as in TicketPageAdmin's getColor
                  const statusClass = statusKey === 'risolto'
                    ? 'bg-[#FFD580] hover:bg-[#FFE8A0] text-[#663c00]'
                    : 'bg-[#A3B8E0] hover:bg-[#C3D2F0] text-[#06234a]';

                  return (
                    <li key={t._id || t.id} className="p-2 bg-white/60 rounded border flex justify-between items-start">
                      <div>
                        <div className="text-sm font-medium">{t.name}</div>
                        <div className="text-xs text-gray-600 mt-1">{new Date(t.createdAt || t.updatedAt || t._id).toLocaleString()}</div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className={`text-xs px-2 py-1 rounded ${statusClass}`}>{statusLabel}</span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            );
          })()
        )}
      </div>
    </div>
  );
};

export default TicketCreator;