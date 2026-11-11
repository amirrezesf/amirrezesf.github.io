import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function TiltCard({ children, className = "", onClick }: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Mouse position values relative to card center (-0.5 to 0.5)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const hoverVal = useMotionValue(0);

  // Smooth springs for fluid responsive animation without layout shifts
  const springConfig = { damping: 25, stiffness: 200, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);
  const smoothHover = useSpring(hoverVal, springConfig);

  // Interactive dynamic box shadow that tracks the cursor position smoothly
  const dynamicBoxShadow = useTransform(
    [smoothX, smoothY, smoothHover],
    ([x, y, h]) => {
      const hoverFactor = Number(h);
      const offX = Number(x) * 26 * hoverFactor;
      const offY = Number(y) * 26 * hoverFactor;
      const glowBlur = 12 + 32 * hoverFactor;
      const glowAlpha = 0.22 * hoverFactor;
      const ambientAlpha = 0.12 + 0.18 * hoverFactor;
      return `${offX}px ${offY}px ${glowBlur}px rgba(62, 189, 106, ${glowAlpha}), 0 16px 36px rgba(0, 0, 0, ${ambientAlpha})`;
    }
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;

    mouseX.set(px / rect.width - 0.5);
    mouseY.set(py / rect.height - 0.5);

    cardRef.current.style.setProperty("--mouse-x", `${px}px`);
    cardRef.current.style.setProperty("--mouse-y", `${py}px`);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    hoverVal.set(1);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    hoverVal.set(0);
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        boxShadow: dynamicBoxShadow,
      }}
      className={`bg-glass-bg border backdrop-blur-xl rounded-2xl transition-colors duration-300 relative overflow-hidden ${
        onClick ? "glass-card-interactive cursor-pointer select-none" : ""
      } ${
        isHovered ? "border-accent-teal/40" : "border-glass-border"
      } ${className}`}
    >
      {/* Dynamic Cursor Reflection Glare */}
      <div
        style={{
          opacity: isHovered ? 0.08 : 0,
          background:
            "radial-gradient(400px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255, 255, 255, 0.5), transparent 60%)",
        }}
        className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-10"
      />

      {/* Dynamic Cursor Ambient Hover Spotlight */}
      <div
        style={{
          opacity: isHovered ? 0.2 : 0,
          background:
            "radial-gradient(450px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(62, 189, 106, 0.45), transparent 70%)",
        }}
        className="absolute inset-0 pointer-events-none transition-opacity duration-300 -z-10"
      />

      {/* Main card content */}
      <div className="relative z-20 h-full w-full flex flex-col justify-between">
        {children}
      </div>
    </motion.div>
  );
}