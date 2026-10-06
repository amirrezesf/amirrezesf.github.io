import { motion } from "motion/react";
import { skills } from "../data/skills";
import { Sparkles, Terminal } from "lucide-react";
import TiltCard from "./TiltCard";
import { useApp } from "../context/AppContext";

export default function AboutSection() {
  const { t, isRtl } = useApp();

  return (
    <section id="about" className="py-24 w-full border-t border-glass-border bg-bg-space/40 relative overflow-hidden">
      {/* Decorative localized blur lights */}
      <div className="absolute top-1/4 right-0 -translate-y-1/2 w-80 h-80 rounded-full bg-accent-blue/5 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 translate-y-1/2 w-80 h-80 rounded-full bg-accent-teal/5 blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start"
        >
          {/* Text Column (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className={`inline-flex items-center gap-2 mb-4 ${isRtl ? "self-start" : ""}`}>
              <Sparkles size={16} className="text-accent-teal" />
              <span className="font-mono text-xs text-accent-teal tracking-widest uppercase font-semibold">{t("introduction")}</span>
            </div>

            <h2 className="font-display font-medium text-4xl md:text-5xl text-text-main mb-8 tracking-tight">
              {t("aboutMeTitle")}
            </h2>

            <p className="font-sans text-base md:text-lg text-text-dim leading-relaxed mb-6 font-light">
              {t("aboutPara1")}
            </p>

            <p className="font-sans text-base md:text-lg text-text-dim leading-relaxed font-light">
              {t("aboutPara2")}
            </p>
          </div>

          {/* Tech Stack Card Column Wrapped in 3D Motion TiltCard */}
          <div className="lg:col-span-5 w-full">
            <motion.div
              initial={{ opacity: 0, rotateY: 15, z: -100 }}
              whileInView={{ opacity: 1, rotateY: 0, z: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, type: "spring", damping: 15 }}
              className="perspective-[1000px] w-full"
            >
              <TiltCard className="p-8 w-full block">
                <div className={`flex items-center gap-3 mb-6 pb-4 border-b border-glass-border select-none ${isRtl ? "flex-row-reverse" : ""}`}>
                  <Terminal size={18} className="text-accent-blue" />
                  <h3 className="font-display font-medium text-lg text-text-main">{t("fullStackStack")}</h3>
                </div>
                
                <div className={`flex flex-wrap gap-2.5 ${isRtl ? "flex-row-reverse justify-start" : ""}`}>
                  {skills.map((skill, index) => (
                    <motion.span
                      key={index}
                      whileHover={{ 
                        scale: 1.08, 
                        backgroundColor: "rgba(62, 189, 106, 0.08)", 
                        borderColor: "rgba(62, 189, 106, 0.45)",
                        color: "var(--color-accent-blue-val)",
                        boxShadow: "0 0 15px rgba(62,189,106,0.15)"
                      }}
                      className="font-sans text-sm font-light text-text-main px-3.5 py-1.5 rounded-xl bg-glass-sub-bg border border-glass-border backdrop-blur-md select-none transition-all duration-200"
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </TiltCard>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
