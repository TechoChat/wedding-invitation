"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CurtainRevealProps {
  onComplete?: () => void;
}

export default function CurtainReveal({ onComplete }: CurtainRevealProps) {
  const [isStarted, setIsStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // Start the transition sequence shortly after mount
    const startTimeout = setTimeout(() => {
      setIsStarted(true);
    }, 3500); // Wait 3.5s so user can appreciate the curtains before opening

    // End the animation and unmount/disable overlay after curtains finish parting
    const endTimeout = setTimeout(() => {
      setIsFinished(true);
      document.body.style.overflow = previousOverflow;
      if (onComplete) onComplete();
    }, 5300); // 3.5s hold + 0.4s transition delay + 1.4s curtain slide

    return () => {
      clearTimeout(startTimeout);
      clearTimeout(endTimeout);
      document.body.style.overflow = previousOverflow;
    };
  }, [onComplete]);

  if (isFinished) return null;

  return (
    <div className="fixed inset-0 z-50 flex overflow-hidden select-none touch-none">
      {/* Left Curtain */}
      <motion.div
        initial={{ x: 0 }}
        animate={isStarted ? { x: "-100%" } : { x: 0 }}
        transition={{ duration: 1.4, ease: [0.77, 0, 0.175, 1], delay: 0.4 }}
        className="relative w-1/2 h-full bg-maroon-800 flex justify-end items-center"
        style={{ boxShadow: "10px 0 30px rgba(0,0,0,0.5)" }}
      >
        {/* Velvet Texture Folds Overlay */}
        <div className="absolute inset-0 bg-curtain-folds" />
        
        {/* Right Border Gold Cord/Trim on Left Curtain */}
        <div className="absolute top-0 right-0 w-[3px] h-full bg-gradient-to-b from-gold-300 via-gold-500 to-gold-700 shadow-[0_0_8px_#d4af37]" />
      </motion.div>

      {/* Right Curtain */}
      <motion.div
        initial={{ x: 0 }}
        animate={isStarted ? { x: "100%" } : { x: 0 }}
        transition={{ duration: 1.4, ease: [0.77, 0, 0.175, 1], delay: 0.4 }}
        className="relative w-1/2 h-full bg-maroon-800 flex justify-start items-center"
        style={{ boxShadow: "-10px 0 30px rgba(0,0,0,0.5)" }}
      >
        {/* Velvet Texture Folds Overlay */}
        <div className="absolute inset-0 bg-curtain-folds" />
        
        {/* Left Border Gold Cord/Trim on Right Curtain */}
        <div className="absolute top-0 left-0 w-[3px] h-full bg-gradient-to-b from-gold-300 via-gold-500 to-gold-700 shadow-[0_0_8px_#d4af37]" />
      </motion.div>

      {/* Floating Center Overlay (Names, Mandala, Wax Seal) */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
        <AnimatePresence>
          {!isStarted && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8, y: -20 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="flex flex-col items-center text-center px-4"
            >
              {/* Auspicious Mantra */}
              <p className="text-gold-200 tracking-[0.2em] uppercase text-xs sm:text-sm font-display-wedding mb-4">
                || Shubh Vivah ||
              </p>

              {/* Gold Decorative Mandala Outline */}
              <div className="w-40 h-40 sm:w-48 sm:h-48 border border-dashed border-gold-500/30 rounded-full flex items-center justify-center animate-spin-slow mb-6 relative">
                <div className="absolute inset-2 border border-gold-500/10 rounded-full" />
                <div className="absolute text-gold-300 font-serif-wedding text-5xl opacity-40">
                  ॐ
                </div>
              </div>

              {/* Couple Names */}
              <h1 className="text-gold-gradient text-4xl sm:text-5xl md:text-6xl font-script-wedding drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] leading-tight mb-2">
                Utsav & Devanshi
              </h1>
              
              <p className="text-gold-100/80 font-serif-wedding italic tracking-wider text-sm sm:text-base mb-4">
                Are getting married
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
