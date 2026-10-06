import { motion, type Variants } from "motion/react";
import { Github, ExternalLink } from "lucide-react";
import TiltCard from "./TiltCard";
import { useApp } from "../context/AppContext";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const cardWrapperVariants: Variants = {
  hidden: { opacity: 0, y: 40, rotateX: 10 },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { type: "spring", stiffness: 80, damping: 12 },
  },
};

export default function ProjectsSection() {
  const { t, projectsList, isRtl } = useApp();

  return (
    <section id="projects" className="py-24 w-full relative overflow-hidden bg-bg-space/30 border-t border-glass-border">
      {/* Visual background ambient orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-accent-blue/3 blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 md:px-12">
        {/* Title Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 select-none"
        >
          <h2 className="font-display font-medium text-4xl md:text-5xl text-text-main tracking-tight">
            <span className="text-accent-blue font-mono">&lt;</span>
            <span className="text-accent-blue mx-1">{t("projects")}</span>
            <span className="text-accent-blue font-mono">&gt;</span>
          </h2>
        </motion.div>

        {/* Projects Grid with 3D TiltCards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 perspective-[1200px]"
        >
          {projectsList.map((project) => (
            <motion.div
              key={project.id}
              variants={cardWrapperVariants}
              className="h-full transform-gpu"
            >
              <TiltCard className="p-6 h-full flex flex-col justify-between group">
                <div>
                  {project.image && (
                    <div className="w-full h-44 rounded-xl overflow-hidden mb-5 relative border border-glass-border/40 bg-[#131413] select-none">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#141514]/30 to-transparent pointer-events-none" />
                    </div>
                  )}

                  <div className={`flex justify-between items-center mb-3 select-none ${isRtl ? "flex-row-reverse" : ""}`}>
                    <span className="font-mono text-[10px] font-bold tracking-widest text-accent-blue uppercase bg-accent-blue/10 px-2.5 py-1 rounded-md">
                      {project.category}
                    </span>
                  </div>

                  <h3 className="font-display font-medium text-xl md:text-2xl text-text-main group-hover:text-accent-blue mb-2.5 transition-colors duration-200 select-none">
                    {project.title}
                  </h3>

                  <p className="font-sans text-xs md:text-sm text-text-dim leading-relaxed font-light mb-5 select-none">
                    {project.description}
                  </p>
                </div>

                <div>
                  {/* Tech Badges */}
                  <div className={`flex flex-wrap gap-2 mb-6 select-none ${isRtl ? "flex-row-reverse justify-start" : ""}`}>
                    {project.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="font-sans text-[11px] font-light text-text-dim/80 px-2.5 py-1 rounded-lg bg-glass-sub-bg border border-glass-border"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Project Links */}
                  <div className={`flex gap-4 items-center border-t border-glass-border pt-4 ${isRtl ? "flex-row-reverse" : ""}`}>
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 font-mono text-xs text-text-main/70 hover:text-accent-blue border-b border-transparent hover:border-accent-teal pb-0.5 transition-all duration-200 group/link"
                      >
                        <Github size={14} className="group-hover/link:scale-110 transition-transform duration-200" />
                        <span>{t("code")}</span>
                      </a>
                    )}
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        className="inline-flex items-center gap-1.5 font-mono text-xs text-text-main/70 hover:text-accent-teal border-b border-transparent hover:border-accent-teal pb-0.5 transition-all duration-200 group/link"
                      >
                        <ExternalLink size={14} className="group-hover/link:scale-110 transition-transform duration-200" />
                        <span>{t("demo")}</span>
                      </a>
                    )}
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
