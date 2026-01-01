#  WorkHub - Gestionale aziendale

**WorkHub** è una piattaforma web avanzata per la gestione aziendale del personale, progettata per centralizzare turni, dipendenti, magazzino, ticketing, clienti ed eventi aziendali.  
Include un backend moderno in **Node.js/Express** e un frontend scalabile in **React + Redux Toolkit**, con UI professionale basata su **TailwindCSS**.

---

#  Funzionalità Principali

##  Autenticazione & Sicurezza

- Login tramite **JWT token**
- Persistenza sessione con **localStorage**
- Autenticazione 2FA (opzionale)
- Middleware di protezione per ruoli (`user`, `admin`)
- Recupero password tramite generazione password temporanea casuale
- Cambio password dalla pagina impostazioni
- Hashing sicuro con **bcrypt**
- Validazioni backend tramite **Joi**


---

##  Ruoli Utente

- **Admin**  
  + Controllo totale: utenti, turni, eventi, reparti, magazzino, clienti, ordini, ticket
- **User**  
  + Accesso limitato ai propri dati e ai propri turni  
  + Lettura eventi aziendali

---

##  Gestione Utenti (Account e Dipendenti)

- Registrazione nuovi utenti (solo admin)
- Update profilo lavoratore
- Update password
- Eliminazione utenti
- Dashboard avanzata dipendenti
- Filtri e ricerca rapida
- **Admin** → vista globale dei dipendenti  
- **User** → vede solo il proprio profilo
- Gestione ferie, permessi e informazioni lavorative

---

##  Gestione Turni di Lavoro (Calendario)

Calendario professionale basato su **react-big-calendar**, con:

###  Modalità dinamiche
- **Turni** (visualizzazione orari dei dipendenti)
- **Eventi aziendali** (comunicazioni interne)

Switch tramite select direttamente nel calendario.

###  Funzionalità
- Vista **giorno**, **settimana**, **mese**
- Eventi dei turni generati in modo intelligente per 52 settimane avanti e indietro
- Espansione evento con click
- Filtri reparti (solo admin)
- Colori dinamici basati sul ruolo/settore
- Unione eventi duplicati in vista mensile (turni spezzati)

---

##  Bacheca Eventi Aziendali

Sistema completo per comunicazioni interne aziendali.

### **Admin**
- Crea eventi
- Modifica eventi
- Elimina eventi

### **User**
- Può solo visualizzarli

Gli eventi includono:
- Titolo  
- Data inizio/fine  
- Descrizione  
- Ordinamento automatico  
- Visualizzazione nella **Bacheca** e nel **Calendario** tramite switch “Eventi”

UI dedicata con Drawer per aggiunta/modifica.

---

##  Gestione Clienti

- Anagrafica completa clienti
- CRUD clienti
- Filtri
- Ricerca avanzata
- Vista dettagliata cliente

---

##  Gestione Magazzino & Ordini

- CRUD prodotti  
- Gestione stock e soglie  
- Tabella prodotti in esaurimento (con dati mock)  
- Dashboard magazzino  
- CRUD ordini  
- Avvisi prodotti sotto soglia  

---

##  Ticketing Aziendale

- Creazione ticket per segnalazioni interne
- Assegnazione ticket
- Cambiamento stato (aperto / in lavorazione / risolto)
- Storico richieste

---

##  UI/UX Moderno

- Tema light/dark  
- Layout responsive  
- Componenti ottimizzati con TailwindCSS  
- Icone Phosphor Icons  
- Cambio lingua (ITA/ENG) tramite Context  
- Design pulito e professionale  
- Tabelle con ricerca, ordinamento e azioni inline  

---

#  Backend

## Tecnologie
- Node.js
- Express
- MongoDB + Mongoose
- JWT Auth
- Joi (Validazione)
- Bcrypt
- Middleware personalizzati
- Architettura REST scalabile

## API principali

###  Auth
- `POST /auth/login`
- `POST /auth/recover`
- `PATCH /auth/password`

###  Users
- `GET /users`
- `POST /users`
- `PATCH /users/:id`
- `DELETE /users/:id` *solo admin*

###  Eventi
- `GET /events`
- `POST /events` *solo admin*
- `PATCH /events/:id`
- `DELETE /events/:id`

###  Dipendenti
- `GET /employees`
- `POST /employees`
- `PATCH /employees/:id`
- `DELETE /employees/:id` 

###  Magazzino
- `GET /items`
- `POST /items`
- `PATCH /items/:id`
- `DELETE /items/:id`

###  Ordini
- `GET /orders`
- `POST /orders`
- `PATCH /orders/:id`
- `DELETE /orders/:id`

###  Ticket
- `GET /tickets`
- `POST /tickets`
- `PATCH /tickets/:id`
- `DELETE /tickets/:id`

---

# Frontend

## Tecnologie
- React + Vite
- Redux Toolkit
- React Router
- TailwindCSS
- React Big Calendar
- Date-fns
- Context API
- Phosphor Icons
- Persistenza stato

## Features Frontend

✔ Layout responsive  
✔ Redux per stato globale di:
- auth
- employees
- events
- products
- orders  
✔ Calendario completo  
✔ Bacheca eventi  
✔ Drawer, modali, tabelle personalizzate  
✔ Ricerca + sorting  
✔ Temi dinamici  
✔ Multilingua  

---

### Aggiornamenti
1. DARK MODE - `COMPLETATO`
2. MULTILINGUA - `COMPLETATO`  
3. Login e autenticazione JWT - `COMPLETATO`
4. Autenticazione 2FA (opzionale) - `COMPLETATO`
5. Gestione utenti e dipendenti - `COMPLETATO`
6. Calendario turni ed eventi con react-big-calendar - `COMPLETATO`
7. Bacheca eventi aziendali - `COMPLETATO` 
8. Gestione magazzino - `COMPLETATO`
9. Gestione clienti - `COMPLETATO`
10. Gestione ticketing - `COMPLETATO`
11. Gestione ordini - `COMPLETATO`