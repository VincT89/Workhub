import { API_URL } from "../config/api";

// Funzione GET per ottenere tutti gli eventi
export const fetchEvents = async (token) => {
    const response = await fetch(`${API_URL}/events`, {
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    });
    if (!response.ok) {
        throw new Error("Errore nel recupero degli eventi");
    }
    const json = await response.json();
    return json.data;
};

// Funzione POST per creare un nuovo evento
export const createEvent = async (data, token) => {
    const response = await fetch(`${API_URL}/events`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        throw new Error("Errore nella creazione dell'evento");
    }
    const json = await response.json();
    return json.data;
};

// Funzione PUT per aggiornare un evento esistente
export const updateEvent = async (id, data, token) => {
    const response = await fetch(`${API_URL}/events/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        throw new Error("Errore nell'aggiornamento dell'evento");
    }
    const json = await response.json();
    return json.data;
};

// Funzione DELETE per eliminare un evento
export const deleteEvent = async (id, token) => {
    const response = await fetch(`${API_URL}/events/${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    });
    if (!response.ok) {
        throw new Error("Errore nell'eliminazione dell'evento");
    }
};
