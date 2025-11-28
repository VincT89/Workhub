# WorkHub - Gestionale aziendale

**WorkHub** è una piattaforma web progettata per la gestione aziendale del personale, con funzionalità integrate di autenticazione, gestione dipendenti, gestione turni, recupero password, gestione magazzino e ordini, gestione ticketing aziendale e un'interfaccia moderna basata su React + Tailwind.

Il progetto comprende un **backend Node.js/Express** con database **MongoDB** e un **frontend React** completo, organizzato con Redux Toolkit e componenti riutilizzabili.

---

# Funzionalità Principali

## Autenticazione & Sicurezza

- Login con **JWT token**
- Persistenza dell'autenticazione tramite **localStorage**
- Middleware di protezione rotte (admin/user)
- Recupero password tramite generazione password temporanea
- Cambio password da pannello impostazioni
- Password hash con **bcrypt**

## Ruoli Utente

- **Admin** → gestione completa degli utenti, turni, reparti
- **User** → accesso ai propri dati, visualizzazione turni personali

## Gestione utenti (account e dipendenti)

- Registrazione utente (solo admin)
- Update profilo
- Update password
- Eliminazione utente
- Dashboard utenti
- Validazioni tramite Joi
- Anagrafica dipendenti con dettagli personali e lavorativi
- CRUD dipendenti
- Filtri e ricerche avanzate
- Visualizzazione differenziata tra admin e user:
  - Admin → vede tutti i dipendenti
  - User → vede esclusivamente il proprio profilo
- Gestione ferie e permessi

## Gestione Turni di Lavoro

- Calendario interattivo con **react-big-calendar**
- Turni settimanali/mensili
- Visualizzazione differenziata tra admin e user:
  - Admin → vede tutti i turni filtrabili per reparto
  - User → vede esclusivamente i propri turni
- Espansione eventi, filtro reparti, colori per ruolo/settore

## Gestione Clienti
- Anagrafica clienti con dettagli di contatto
- CRUD clienti
- Filtri e ricerche avanzate

## Gestione Magazzino & Ordini

- CRUD prodotti
- Gestione stock e livelli di inventario
- Creazione e monitoraggio ordini
- Filtri e ricerche avanzate

## Sistema di Ticketing Aziendale

- Creazione ticket per segnalazioni o richieste
- Assegnazione e monitoraggio stato ticket

## UI/UX

- Tema dinamico (light/dark)
- Layout responsive
- Componenti ottimizzati Tailwind
- Interfaccia moderna e pulita
- Cambio lingua - italiano/inglese

---

# Stack Tecnologico

## Backend

- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- Bcrypt
- Joi (validazione)
- Middleware personalizzati
- Struttura REST API

## Frontend

- React + Vite
- Redux Toolkit (authSlice, userSlice, employeeSlice)
- Tailwind CSS
- React Router
- React Big Calendar
- Date-fns
- Context API (tema)
- LocalStorage per persistenza stato
- Phosphor Icons
- Mui React (componenti UI)

---
