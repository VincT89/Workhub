import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createTicketAsync, fetchTickets, selectTickets } from "../../store/feature/ticketSlice";

/**
 * ===== COMPONENTE: TicketCreator =====
 * 
 * SCOPO: Permette all'utente di creare nuovi ticket e visualizzare i propri ticket
 * 
 * COSA MOSTRA:
 * 1. Un form per creare ticket (input + bottone)
 * 2. Messaggi di successo/errore
 * 3. Una lista dei ticket dell'utente corrente (con status)
 * 
 * PROPS:
 * - user: oggetto con i dati dell'utente (opzionale, usa authUser come fallback)
 * 
 * FEATURES:
 * - Validazione: il titolo deve avere almeno 3 caratteri
 * - Caricamento automatico dei ticket quando l'utente è autenticato
 * - Lista responsive che cresce con il numero di ticket
 * - Badge colorati per mostrare lo stato (Aperto/Risolto)
 */
const TicketCreator = ({ user }) => {
  // ===== HOOKS REDUX =====
  
  // dispatch: funzione per inviare azioni a Redux (es: creare ticket, caricare ticket)
  const dispatch = useDispatch();
  
  // authUser: utente autenticato preso dallo stato globale
  const authUser = useSelector((state) => state.auth.user);
  
  // ===== STATI LOCALI =====
  // (questi stati sono privati di questo componente, non condivisi globalmente)
  
  const [newTitle, setNewTitle] = useState("");       // Testo inserito dall'utente
  const [isLoading, setIsLoading] = useState(false); // True quando stiamo creando un ticket
  const [error, setError] = useState("");            // Messaggio di errore da mostrare
  const [success, setSuccess] = useState("");        // Messaggio di successo da mostrare
  
  // ===== DATI DA REDUX =====
  
  const creatorStatus = useSelector((state) => state.tickets.status); // "idle", "loading", ecc.
  const tickets = useSelector(selectTickets); // Array di tutti i ticket
  
  // ===== FILTRO TICKETS =====
  // Mostra solo i ticket dell'utente corrente
  const filteredTickets = (tickets || []).filter(
    (t) => ((t.user && (t.user._id || t.user.id)) === (authUser?._id || authUser?.id) || (t.user === (authUser?._id || authUser?.id)))
  );

  /**
   * EFFETTO: Auto-cancellazione del messaggio di successo
   * 
   * COSA FA: Quando appare un messaggio di successo, lo cancella dopo 3 secondi
   * 
   * DIPENDENZE: [success]
   * - Si riesegue ogni volta che cambia il messaggio di successo
   * - clearTimeout previene bug se il messaggio cambia prima dei 3 secondi
   */
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(""), 3000);
      return () => clearTimeout(timer); // Cleanup: cancella il timer se il componente si smonta
    }
  }, [success]);

  /**
   * EFFETTO: Caricamento automatico dei ticket
   * 
   * COSA FA: Quando l'utente è autenticato, carica i suoi ticket dal server
   * 
   * DIPENDENZE: [dispatch, authUser]
   * - Si esegue quando il componente monta
   * - Si riesegue se cambia authUser (es: logout/login)
   */
  useEffect(() => {
    if (authUser) {
      dispatch(fetchTickets());
    }
  }, [dispatch, authUser]);

  /**
   * FUNZIONE: handleAddTicket
   * 
   * COSA FA: Gestisce la creazione di un nuovo ticket
   * 
   * FLUSSO:
   * 1. Validazione: controlla che il titolo sia valido (min 3 caratteri)
   * 2. Prepara il payload con i dati del ticket
   * 3. Invia la richiesta al server tramite Redux
   * 4. Gestisce successo (mostra messaggio + ricarica lista) o errore
   */
  const handleAddTicket = async () => {
    // STEP 1: VALIDAZIONE INPUT
    const title = newTitle.trim(); // Rimuove spazi all'inizio e alla fine
    if (!title || title.length < 3) {
      setError("Il titolo deve contenere almeno 3 caratteri");
      return; // Esci dalla funzione senza creare il ticket
    }

    // STEP 2: IMPOSTA STATO DI LOADING
    setIsLoading(true);  // Mostra "Creando..." sul bottone
    setError("");        // Reset eventuali errori precedenti
    setSuccess("");      // Reset eventuali successi precedenti

    // STEP 3: PREPARA I DATI (PAYLOAD)
    // Prova a ottenere l'ID utente da varie fonti (prop user o authUser)
    const resolvedUserId = user?._id || user?.id || authUser?._id || authUser?.id;

    // Controllo di sicurezza: se non c'è un utente valido, non possiamo creare il ticket
    if (!resolvedUserId) {
      setError("Utente non autenticato: impossibile associare il ticket a un utente valido");
      setIsLoading(false);
      return;
    }

    // Costruisci l'oggetto da inviare al server
    const payload = {
      user: resolvedUserId,  // ID dell'utente che crea il ticket
      name: title,           // Titolo del ticket
      content: `Ticket creato da ${user?.nome || authUser?.firstName || 'Utente'}`, // Descrizione
      status: "open",        // Status iniziale: aperto
    };

    // STEP 4: INVIA AL SERVER
    try {
      // dispatch(createTicketAsync(payload)) invia l'azione a Redux
      // .unwrap() aspetta il risultato e lancia un errore se fallisce
      const result = await dispatch(createTicketAsync(payload)).unwrap();
      
      // SE ARRIVIAMO QUI = SUCCESSO!
      setNewTitle(""); // Reset del form
      setSuccess(`✓ Ticket "${result.name}" creato con successo`);
      dispatch(fetchTickets()); // Ricarica la lista per mostrare il nuovo ticket
      
    } catch (err) {
      // SE ARRIVIAMO QUI = ERRORE!
      
      // L'errore può arrivare in vari formati, cerchiamo di estrarre un messaggio leggibile
      let errMsg = "Errore nella creazione del ticket";
      
      if (typeof err === "string") {
        errMsg = err; // Errore semplice (stringa)
      } else if (err && typeof err === "object") {
        errMsg = err.message || errMsg; // Errore oggetto con messaggio
        
        // Se il server ha inviato dettagli di validazione, mostrali
        const details = err.details;
        if (details && typeof details === 'object') {
          const firstKey = Object.keys(details)[0];
          const first = details[firstKey];
          if (first && (first.message || first.reason)) {
            errMsg += `: ${first.message || first.reason}`;
          }
        }
      }

      setError(errMsg); // Mostra il messaggio all'utente
      console.error("Create ticket error:", err); // Log per debug
      
    } finally {
      // QUESTO SI ESEGUE SEMPRE (successo o errore)
      setIsLoading(false); // Rimuove lo stato di loading
    }
  };

  // ===== RENDER DEL COMPONENTE =====
  return (
    <div className="p-4 bg-white/20 rounded-xl shadow-md w-full mx-auto">

      <h2 className="font-bold text-xl mb-4">Crea Nuovo Ticket</h2>

      {/* INPUT: Campo di testo per il titolo del ticket */}
      <input
        type="text"
        value={newTitle}
        onChange={(e) => setNewTitle(e.target.value)} // Aggiorna lo stato ad ogni carattere digitato
        onKeyDown={(e) => e.key === "Enter" && !isLoading && handleAddTicket()} // Crea ticket con tasto Invio
        placeholder="Titolo del ticket (min. 3 caratteri)"
        className="border rounded-xl p-2 w-full mb-3 focus:outline-none focus:ring-2 focus:ring-[#090c64]"
        disabled={isLoading} // Disabilita input durante il caricamento
        maxLength={100}      // Limite massimo 100 caratteri
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

      {/* SEZIONE: Lista dei tuoi ticket */}
      <div className="mt-4">
        <h3 className="font-semibold mb-2">I tuoi ticket</h3>
        
        {/* CASO 1: Nessun ticket trovato */}
        {(!filteredTickets || filteredTickets.length === 0) ? (
          <div className="text-sm text-gray-500">Nessun ticket trovato.</div>
        ) : (
          /* CASO 2: Ci sono ticket da mostrare */
          // IIFE (Immediately Invoked Function Expression) per calcolare l'altezza dinamica
          (() => {
            // CALCOLO ALTEZZA DINAMICA
            // L'altezza della lista cresce con il numero di ticket, fino a un massimo
            const ITEM_HEIGHT = 56;  // Altezza approssimativa di ogni elemento in pixel
            const PADDING = 12;      // Padding extra
            const MAX_HEIGHT = 480;  // Altezza massima prima che appaia la scrollbar
            
            // Formula: numero ticket * altezza singolo item (min 1 item, max MAX_HEIGHT)
            const desired = Math.min(
              Math.max(filteredTickets.length * ITEM_HEIGHT + PADDING, ITEM_HEIGHT), 
              MAX_HEIGHT
            );
            return (
              <ul
                className="space-y-2 overflow-auto"
                style={{ maxHeight: `${desired}px`, transition: 'max-height 180ms ease' }}
              >
                {filteredTickets.map((t) => {
                  // NORMALIZZAZIONE STATUS
                  // Il server manda "open"/"closed", noi mostriamo "aperto"/"risolto"
                  const rawStatus = t.status || '';
                  const statusKey = rawStatus === 'open' ? 'aperto' 
                                  : rawStatus === 'closed' ? 'risolto' 
                                  : (rawStatus || '').toLowerCase();
                  const statusLabel = statusKey === 'aperto' ? 'Aperto' 
                                    : statusKey === 'risolto' ? 'Risolto' 
                                    : rawStatus;
                  
                  // COLORI STATUS (uguali a quelli usati in TicketPageAdmin)
                  // Risolto = giallo, Aperto = blu
                  const statusClass = statusKey === 'risolto'
                    ? 'bg-[#FFD580] hover:bg-[#FFE8A0] text-[#663c00]'  // Giallo per risolto
                    : 'bg-[#A3B8E0] hover:bg-[#C3D2F0] text-[#06234a]'; // Blu per aperto

                  return (
                    <li key={t._id || t.id} className="p-2 bg-white/60 rounded border flex justify-between items-start">
                      {/* COLONNA SINISTRA: Info ticket */}
                      <div>
                        <div className="text-sm font-medium">{t.name}</div>
                        <div className="text-xs text-gray-600 mt-1">
                          {new Date(t.createdAt || t.updatedAt || t._id).toLocaleString()}
                        </div>
                      </div>
                      
                      {/* COLONNA DESTRA: Badge status */}
                      <div className="flex flex-col items-end gap-2">
                        <span className={`text-xs px-2 py-1 rounded ${statusClass}`}>
                          {statusLabel}
                        </span>
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