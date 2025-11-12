import React, { createContext, useContext, useState, useEffect } from "react";

// Importa tutte le traduzioni
import itSidebar from "../languages/it/sidebar.json";
import itTopbar from "../languages/it/topbar.json";
import itLogin from "../languages/it/login.json";
import itDashboard from "../languages/it/dashboard.json";
import itEmployees from "../languages/it/employees.json";
import itCustomers from "../languages/it/customers.json";
import itWarehouse from "../languages/it/warehouse.json";
import itTicketing from "../languages/it/ticketing.json";
import itSettings from "../languages/it/settings.json";
import itHome from "../languages/it/home.json";

import enSidebar from "../languages/en/sidebar.json";
import enTopbar from "../languages/en/topbar.json"; 
import enLogin from "../languages/en/login.json";
import enDashboard from "../languages/en/dashboard.json";
import enEmployees from "../languages/en/employees.json";
import enCustomers from "../languages/en/customers.json";
import enWarehouse from "../languages/en/warehouse.json";
import enTicketing from "../languages/en/ticketing.json";
import enSettings from "../languages/en/settings.json";
import enHome from "../languages/en/home.json";

// Combina le traduzioni per lingua
const translations = {
  it: {
    sidebar: itSidebar,
    topbar: itTopbar,
    login: itLogin,
    dashboard: itDashboard,
    employees: itEmployees,
    customers: itCustomers,
    warehouse: itWarehouse,
    ticketing: itTicketing,
    settings: itSettings,
    home: itHome
  },
  en: {
    sidebar: enSidebar,
    topbar: enTopbar,
    login: enLogin,
    dashboard: enDashboard,
    employees: enEmployees,
    customers: enCustomers,
    warehouse: enWarehouse,
    ticketing: enTicketing,
    settings: enSettings,
    home: enHome
  },
};

// Crea il contesto
const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem("lang") || "it";
  });

  // Funzione per cambiare lingua
  const toggleLang = () => {
    const newLang = lang === "it" ? "en" : "it"; // alterna tra italiano e inglese e lo usa per aggiornare lo stato
    setLang(newLang);
    localStorage.setItem("lang", newLang);
  };

  // Funzione per tradurre
  const t = (key) => {
   
    const [section, term] = key.split("."); // / divide la chiave in sezione e termine in modo da poter cercare la traduzione corretta
    const dictionary = translations[lang][section]; // translations[lang] restituisce tutte le traduzioni per la lingua corrente e poi accede alla sezione specifica - translations è l'oggetto che contiene tutte le traduzioni nella cartella languages del progetto

    if (dictionary && dictionary[term]) return dictionary[term]; // se trova la traduzione la ritorna

    return key; // se non trova la traduzione ritorna la chiave originale
  };

  useEffect(() => {
    document.documentElement.lang = lang; // Imposta l'attributo lang dell'elemento HTML con la lingua corrente ogni volta che cambia la lingua
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t }}> 
      {children}
    </LanguageContext.Provider>
  );
};


export const useLanguage = () => useContext(LanguageContext);