// Definisce i permessi per diversi ruoli utente nell'applicazione
export const permissions = {
  admin: {
    canView: ["dashboard", "clienti", "personale", "magazzino", "ticket", "settings"],
    canAdd: true,
    canEdit: true,
    canDelete: true,
  },

  supervisor: {
    canView: ["dashboard", "clienti", "personale", "magazzino", "ticket"],
    canAdd: true,
    canEdit: true,
    canDelete: false,
  },

  user: {
    canView: ["dashboard", "clienti", "magazzino", "ticket"],
    canAdd: false,
    canEdit: false,
    canDelete: false,
  },
};
