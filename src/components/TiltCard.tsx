import React, { useRef, useState } from "react";
import { motion } from "motion/react";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function TiltCard({ children, className = "", onClick }: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={`glass-card-interactive bg-glass-bg border border-glass-border backdrop-blur-xl rounded-2xl transition-shadow duration-300 relative overflow-hidden select-none cursor-pointer ${isHovered ? "shadow-[0_20px_40px_rgba(0,229,204,0.12)] border-accent-teal/40" : "shadow-md"} ${className}`}
    >
      {/* Reflection Glare Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 0.08 : 0 }}
        className="absolute inset-0 bg-gradient-to-tr from-transparent via-white to-transparent pointer-events-none transition-opacity duration-300 z-10"
      />

      {/* Ambient hover highlight */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 0.15 : 0 }}
        className="absolute inset-0 bg-radial-[circle_at_center,rgba(0,229,204,0.4)_0%,transparent_70%] pointer-events-none transition-opacity duration-300 -z-10"
      />

      {/* Main card content */}
      <div className="relative z-20 h-full w-full flex flex-col justify-between">
        {children}
      </div>
    </motion.div>
  );
}