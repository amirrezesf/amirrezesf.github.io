import { motion } from "motion/react";
import { Github, Linkedin, Mail } from "lucide-react";
import TiltCard from "./TiltCard";
import { useApp } from "../context/AppContext";

export default function ContactSection() {
  const { t, isRtl } = useApp();

  return (
    <section id="contact" className="py-24 w-full relative overflow-hidden border-t border-glass-border bg-bg-space/20">
      {/* Decorative localized light shadow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-accent-teal/5 blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 30 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, type: "spring", damping: 15 }}
          className="perspective-[1000px]"
        >
          <TiltCard className="p-10 md:p-16 text-center flex flex-col items-center">
            <div className={`inline-flex items-center gap-2 mb-6 px-3 py-1 rounded-full bg-accent-teal/10 border border-accent-teal/25 select-none ${isRtl ? "flex-row-reverse" : ""}`}>
              <Mail size={14} className="text-accent-teal" />
              <span className="font-mono text-[10px] text-accent-teal uppercase tracking-widest font-semibold">{t("getInTouch")}</span>
            </div>

            <h2 className="font-display font-medium text-3xl md:text-5xl text-text-main mb-6 tracking-tight select-none">
              <span className="text-accent-blue font-mono">&lt;</span>
              <span className="text-accent-blue mx-1">{t("contactMe")}</span>
              <span className="text-accent-blue font-mono">&gt;</span>
            </h2>

            <p className="font-sans text-base md:text-lg text-text-dim max-w-lg mx-auto mb-10 font-light select-none">
              {t("contactPara")}
            </p>

            <div className="flex flex-col items-center gap-6 w-full">
              <motion.a
                whileHover={{ scale: 1.05, y: -2, boxShadow: "0 0 25px rgba(62, 189, 106, 0.45)" }}
                whileTap={{ scale: 0.98 }}
                href="mailto:amir.reza.esf@gmail.com"
                className={`inline-flex items-center gap-2 py-4 px-10 rounded-full bg-accent-teal text-[#0a0a12] font-semibold text-center transition-all duration-300 group select-none ${isRtl ? "flex-row-reverse" : ""}`}
              >
                <Mail size={18} className="group-hover:rotate-12 transition-transform duration-200" />
                <span>{t("sendEmail")}</span>
              </motion.a>

              <div className="flex justify-center gap-4 mt-4 select-none">
                <motion.a
                  whileHover={{ scale: 1.15, y: -4, borderColor: "rgba(62, 189, 106, 0.4)" }}
                  whileTap={{ scale: 0.95 }}
                  href="https://github.com/amirrezesf"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className="w-12 h-12 rounded-full bg-glass-sub-bg border border-glass-border flex items-center justify-center text-text-dim hover:text-text-main hover:border-text-main/30 backdrop-blur-md transition-all duration-200"
                >
                  <Github size={18} />
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.15, y: -4, borderColor: "rgba(62, 189, 106, 0.4)" }}
                  whileTap={{ scale: 0.95 }}
                  href="#"
                  aria-label="LinkedIn"
                  className="w-12 h-12 rounded-full bg-glass-sub-bg border border-glass-border flex items-center justify-center text-text-dim hover:text-text-main hover:border-text-main/30 backdrop-blur-md transition-all duration-200"
                >
                  <Linkedin size={18} />
                </motion.a>
              </div>
            </div>
          </TiltCard>
        </motion.div>

        {/* Minimal Copyright */}
        <div className="mt-16 text-center select-none">
          <p className="font-mono text-[9px] text-text-dim/40 tracking-widest uppercase">
            {t("copyright")}
          </p>
        </div>
      </div>
    </section>
  );
}
