import React from "react";
import { motion } from "motion/react";
import { Sun, Moon } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function Header() {
  const { theme, lang, toggleTheme, setLang, t, isRtl } = useApp();

  const navLinks = [
    { name: t("about"), href: "#about" },
    { name: t("projects"), href: "#projects" },
    { name: t("skills"), href: "#about" },
    { name: t("contactMe"), href: "#contact" },
  ];

  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 bg-bg-space/75 backdrop-blur-md border-b border-glass-border select-none z-100"
    >
      <div className="max-w-6xl mx-auto px-6 md:px-12 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <a href="#hero" className="flex items-center gap-1.5 font-mono text-lg font-bold text-text-main tracking-tight group">
          <span className="text-accent-blue">//</span>
          <span className="group-hover:text-accent-teal transition-colors duration-200">Amirrezesf</span>
        </a>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="font-sans text-sm text-text-dim hover:text-accent-blue transition-colors duration-200 relative py-1 group"
            >
              {link.name}
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-accent-blue group-hover:w-full transition-all duration-300 rounded-full" />
            </a>
          ))}
        </nav>

        {/* Controls */}
        <div className="flex items-center gap-4">
          {/* Language Pill */}
          <div className="inline-flex items-center p-1 bg-white/5 border border-glass-border rounded-full text-xs font-mono">
            <button
              onClick={() => setLang("en")}
              className={`px-3 py-1 rounded-full font-semibold transition-all duration-200 ${
                lang === "en"
                  ? "bg-accent-blue text-white shadow-sm"
                  : "text-text-dim hover:text-text-main"
              }`}
            >
              En
            </button>
            <button
              onClick={() => setLang("fa")}
              className={`px-3 py-1 rounded-full font-semibold transition-all duration-200 ${
                lang === "fa"
                  ? "bg-accent-blue text-white shadow-sm"
                  : "text-text-dim hover:text-text-main"
              }`}
            >
              Fa
            </button>
          </div>

          {/* Theme Switcher Sun/Moon Icon */}
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTheme}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-white/5 border border-glass-border text-text-main/80 hover:text-accent-teal hover:border-accent-teal/30 transition-all duration-200"
            aria-label="Theme toggle"
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
}
