import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Verifica se esiste un tema salvato o usa la preferenza di sistema
  const getInitialTheme = () => {
    if (typeof window !== "undefined" && window.localStorage) {
      const stored = localStorage.getItem("theme"); // Controlla il tema salvato nel localStorage
      if (stored) return stored;
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches; // Controlla la preferenza di sistema
      return prefersDark ? "dark" : "light";
    }
    return "light";
  };

  const [theme, setTheme] = useState(getInitialTheme); // Stato per il tema corrente

  // Applica la classe "dark" all'HTML in base al tema
  useEffect(() => {
    const html = document.documentElement;
    if (theme === "dark") html.classList.add("dark");
    else html.classList.remove("dark");
    localStorage.setItem("theme", theme); // Salva il tema nel localStorage
  }, [theme]);

  const toggleTheme = () => setTheme((prev) => (prev === "light" ? "dark" : "light"));

  return (
    // Fornisce il tema e le funzioni per cambiarlo ai componenti figli tramite il context 
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
