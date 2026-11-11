import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const outlineRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Detect mobile touch capability or screen width < 768px, disable custom cursor
    const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice || window.innerWidth < 768) return;

    const dot = dotRef.current;
    const outline = outlineRef.current;
    if (!dot || !outline) return;

    let posX = 0;
    let posY = 0;
    let mouseX = 0;
    let mouseY = 0;

    // Instant precision positioning (0 lag trailing)
    const updateCursor = () => {
      posX = mouseX;
      posY = mouseY;

      const scale = isHovered ? 1.2 : 1;

      if (outline) {
        outline.style.transform = `translate3d(${posX}px, ${posY}px, 0) translate(-50%, -50%) scale(${scale})`;
      }
      if (dot) {
        dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
      }

      requestAnimationFrame(updateCursor);
    };

    const animationId = requestAnimationFrame(updateCursor);

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isVisible) setIsVisible(true);
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const isInteractive = 
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") !== null ||
        target.closest("button") !== null ||
        target.closest(".glass-card-interactive") !== null ||
        target.closest("[role='button']") !== null;

      setIsHovered(isInteractive);
    };

    const onMouseLeaveWindow = () => {
      setIsVisible(false);
    };

    const onMouseEnterWindow = () => {
      setIsVisible(true);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseover", onMouseOver);
    document.addEventListener("mouseleave", onMouseLeaveWindow);
    document.addEventListener("mouseenter", onMouseEnterWindow);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseleave", onMouseLeaveWindow);
      document.removeEventListener("mouseenter", onMouseEnterWindow);
    };
  }, [isHovered, isVisible]);

  return (
    <div className="custom-pointer">
      <div
        ref={dotRef}
        style={{ opacity: isVisible ? 1 : 0 }}
        className="fixed top-0 left-0 w-2 h-2 bg-accent-teal rounded-full pointer-events-none z-50 transition-opacity duration-300 hidden md:block"
      />
      <div
        ref={outlineRef}
        style={{ opacity: isVisible ? 1 : 0 }}
        className={`fixed top-0 left-0 w-8 h-8 border-2 rounded-full pointer-events-none z-50 transition-[border-color,opacity] duration-300 ease-out hidden md:block ${
          isHovered ? "border-accent-teal" : "border-accent-blue"
        }`}
      />
    </div>
  );
}
