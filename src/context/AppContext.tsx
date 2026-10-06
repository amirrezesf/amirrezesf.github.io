import React, { createContext, useContext, useState, useEffect } from "react";
import { translations } from "../translations";
import { buildProjects } from "../data/projects";
import { Project } from "../types";

type Theme = "dark" | "light";
type Lang = "en" | "fa";

interface AppContextType {
  theme: Theme;
  lang: Lang;
  toggleTheme: () => void;
  setLang: (lang: Lang) => void;
  t: (key: keyof typeof translations.en) => string;
  isRtl: boolean;
  projectsList: Project[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  // Read initial states from localStorage with smart fallbacks
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem("portfolio-theme");
    return (saved as Theme) || "dark";
  });

  const [lang, setLangState] = useState<Lang>(() => {
    const saved = localStorage.getItem("portfolio-lang");
    return (saved as Lang) || "en";
  });

  // Track if current layout is Right-to-Left (Persian)
  const isRtl = lang === "fa";

  // Side effects: update HTML class for theme styling
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "light") {
      root.classList.add("light");
      root.classList.remove("dark");
    } else {
      root.classList.add("dark");
      root.classList.remove("light");
    }
    localStorage.setItem("portfolio-theme", theme);
  }, [theme]);

  // Side effects: update document direction and language attribute
  useEffect(() => {
    const root = window.document.documentElement;
    root.setAttribute("lang", lang);
    root.setAttribute("dir", lang === "fa" ? "rtl" : "ltr");
    localStorage.setItem("portfolio-lang", lang);
  }, [lang]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const setLang = (newLang: Lang) => {
    setLangState(newLang);
  };

  // Translation helper function
  const t = (key: keyof typeof translations.en): string => {
    return translations[lang][key] || translations.en[key] || "";
  };

  const projectsList = buildProjects(lang);

  return (
    <AppContext.Provider
      value={{
        theme,
        lang,
        toggleTheme,
        setLang,
        t,
        isRtl,
        projectsList,
      }}
    >
      <div className={lang === "fa" ? "font-sans rtl-layout" : "font-sans ltr-layout"}>
        {children}
      </div>
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
