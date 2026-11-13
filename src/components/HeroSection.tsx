import React from "react";
import { motion } from "motion/react";
import ThreeCanvas from "./ThreeCanvas";
import { ArrowDown } from "lucide-react";
import { useApp } from "../context/AppContext";
// @ts-ignore
import amirPortrait from "../assets/images/profile-3.webp";

export default function HeroSection() {
  const { t, isRtl, theme } = useApp();

  // Letter transition presets for high-end 3D staggered effect
  const letterContainerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.04,
        delayChildren: 0.2,
      },
    },
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden w-full pt-20">
      {/* 3D Canvas Background */}
      <ThreeCanvas />

      {/* Radial shade overlay for readability - optimized to look stellar in both light & dark modes */}
      <div className={`absolute inset-0 pointer-events-none transition-all duration-300 ${
        theme === "dark" 
          ? "bg-radial-[circle_at_center,rgba(20,21,20,0.15)_0%,rgba(20,21,20,0.92)_100%]"
          : "bg-radial-[circle_at_center,rgba(250,250,249,0.1)_0%,rgba(250,250,249,0.88)_100%]"
      }`} />

      <div className="w-full max-w-6xl mx-auto px-6 md:px-12 relative z-10 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Text and Bio Column (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-center order-2 lg:order-1">
            
            {/* Code Bracket: < About > */}
            <div className={`font-mono text-xs text-accent-blue/50 mb-4 select-none flex items-center gap-1.5 ${isRtl ? "justify-start" : ""}`}>
              <span>&lt;</span>
              <span className="text-accent-blue">{t("about")}</span>
              <span>&gt;</span>
            </div>

            {/* Main Title & Role */}
            <div className="mb-6">
              <motion.h1 
                variants={letterContainerVariants}
                initial="initial"
                animate="animate"
                className={`font-display font-medium text-4xl md:text-5xl text-text-main tracking-tight mb-2 select-none leading-tight ${isRtl ? "font-sans font-bold" : ""}`}
              >
                {t("greeting")}{" "}
                <span className="text-accent-blue font-semibold block sm:inline-block">
                  {t("role")}
                </span>
              </motion.h1>
            </div>

            {/* Persona Paragraph */}
            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className={`font-sans text-sm md:text-base text-text-dim leading-relaxed mb-6 font-light max-w-xl ${isRtl ? "text-justify" : ""}`}
            >
              {t("bio")}
            </motion.p>

            {/* Code Bracket: </ About > */}
            <div className={`font-mono text-xs text-accent-blue/50 mb-10 select-none flex items-center gap-1.5 ${isRtl ? "justify-start" : ""}`}>
              <span>&lt;/</span>
              <span className="text-accent-blue">{t("about")}</span>
              <span>&gt;</span>
            </div>

            {/* Call to Actions Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className={`flex flex-col sm:flex-row items-stretch sm:items-center gap-4 ${isRtl ? "sm:flex-row-reverse sm:justify-end" : ""}`}
            >
              <motion.a
                whileHover={{ scale: 1.04, y: -2, boxShadow: "0 0 25px rgba(62, 189, 106, 0.45)" }}
                whileTap={{ scale: 0.98 }}
                href="#projects"
                className="py-3 px-8 rounded-full bg-accent-blue text-white font-semibold text-center transition-all duration-300"
              >
                {t("viewWork")}
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.04, backgroundColor: "rgba(62, 189, 106, 0.08)", borderColor: "rgba(62, 189, 106, 0.45)" }}
                whileTap={{ scale: 0.98 }}
                href="#about"
                className="py-3 px-8 rounded-full bg-glass-sub-bg border border-glass-border text-text-main font-medium text-center backdrop-blur-md transition-all duration-300"
              >
                {t("techStack")}
              </motion.a>
            </motion.div>
          </div>

          {/* User Circular Portrait Column (5 cols) */}
          <div className="lg:col-span-5 flex justify-center items-center order-1 lg:order-2">
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 85, damping: 15 }}
              className="relative w-[320px] h-[320px] sm:w-[432px] sm:h-[432px] md:w-[480px] md:h-[480px] max-w-full flex items-center justify-center"
            >
              {/* Outer decorative dashed green ring spinning slow */}
              <div 
                className="absolute inset-0 rounded-full border border-dashed border-accent-blue/30 animate-[spin_50s_linear_infinite]"
              />

              {/* Inner glowing green ring spinning reverse */}
              <div 
                className="absolute inset-3 rounded-full border-2 border-accent-teal/40 border-t-accent-teal/10 animate-[spin_20s_linear_infinite_reverse] scale-[1.01]"
              />

              {/* Solid subtle backdrop ring */}
              <div className="absolute inset-6 rounded-full bg-accent-blue/5 border border-accent-blue/10" />

              {/* Core Rounded Avatar Mask Container */}
              <div className="absolute inset-7 rounded-full overflow-hidden border-2 border-accent-teal/60 shadow-[0_0_25px_rgba(74,222,128,0.25)] bg-white/80 dark:bg-[#1e201e]/80 flex items-center justify-center p-1 group">
                <motion.img 
                  src={amirPortrait} 
                  alt="Amirreza Esfandiyari Portrait" 
                  className="w-full h-full object-cover rounded-full select-none transform transition-transform duration-500 group-hover:scale-105 group-hover:rotate-1"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Subtle ambient back light */}
              <div className="absolute -inset-10 bg-radial-[circle,rgba(62,189,106,0.08)_0%,transparent_70%] pointer-events-none -z-10" />
            </motion.div>
          </div>

        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.8 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center pointer-events-none hidden xl:flex flex-col items-center gap-1.5 text-text-dim/50 font-mono text-xs"
        >
          <span>{t("scrollToExplore")}</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            <ArrowDown size={14} className="text-accent-teal" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
