"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Gift } from "lucide-react";

interface ConfettiParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  width: number;
  height: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  life: number;
  maxLife: number;
}

export default function ScratchToReveal() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fullScreenCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const confettiRef = useRef<ConfettiParticle[]>([]);

  const [isRevealed, setIsRevealed] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [scratchPercentage, setScratchPercentage] = useState(0);

  // Initialize and redraw the gold scratch-off canvas dynamically
  const initCanvas = () => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container || isRevealed) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions based on parent container size
    const width = container.clientWidth;
    const height = container.clientHeight;
    const dpr = window.devicePixelRatio || 1;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    // Style canvas to match container size responsively
    canvas.style.width = "100%";
    canvas.style.height = "100%";

    // 1. Draw Gold Foil Background Gradient
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, "#f6f3d9");
    grad.addColorStop(0.2, "#e3d588");
    grad.addColorStop(0.4, "#d4af37"); // Shimmering Gold
    grad.addColorStop(0.6, "#b08d27");
    grad.addColorStop(0.8, "#d4af37");
    grad.addColorStop(1, "#eee7b5");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // 2. Draw Elegant Gold Foil Inner Border
    ctx.strokeStyle = "rgba(140, 106, 27, 0.4)";
    ctx.lineWidth = 2;
    ctx.strokeRect(6, 6, width - 12, height - 12);
    ctx.strokeStyle = "rgba(140, 106, 27, 0.15)";
    ctx.lineWidth = 1;
    ctx.strokeRect(9, 9, width - 18, height - 18);

    // 3. Draw scratch hint text
    ctx.fillStyle = "#5b421a";
    ctx.font = "italic bold 15px Georgia, serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Scratch to Reveal Date", width / 2, height / 2 - 10);
    
    ctx.fillStyle = "#8c6a1b";
    ctx.font = "10px sans-serif";
    ctx.fillText("✨ Swipe here ✨", width / 2, height / 2 + 15);
  };

  // Re-render backing canvas dimensions on window size changes
  useEffect(() => {
    initCanvas();
    window.addEventListener("resize", initCanvas);
    return () => {
      window.removeEventListener("resize", initCanvas);
    };
  }, [isRevealed]);

  // Full-Screen Confetti Popper Animation Loop
  useEffect(() => {
    const canvas = fullScreenCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;

    const updateAndDrawConfetti = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const dpr = window.devicePixelRatio || 1;

      // Fit full screen overlay bounds
      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);
      }

      ctx.clearRect(0, 0, width, height);

      const particles = confettiRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        
        // Physics updates
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.22; // gravity drop
        p.vx *= 0.98; // friction wind resistance
        p.rotation += p.rotationSpeed;
        p.life--;
        p.opacity = Math.max(0, p.life / p.maxLife);

        // Draw rotated rectangular confetti confetti piece
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        
        const w = p.width * Math.sin(p.rotation * 0.5); // simulates 3D flipping
        ctx.fillRect(-w / 2, -p.height / 2, w, p.height);
        
        ctx.restore();

        // Remove dead particles
        if (p.life <= 0) {
          particles.splice(i, 1);
        }
      }

      animationId = requestAnimationFrame(updateAndDrawConfetti);
    };

    animationId = requestAnimationFrame(updateAndDrawConfetti);
    return () => cancelAnimationFrame(animationId);
  }, []);

  // Trigger full screen party poppers from bottom corners
  const triggerFullScreenConfetti = () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const colors = ["#F58220", "#D4AF37", "#85263D", "#FFD700", "#FF69B4", "#4CAF50", "#00BCD4"];
    const particles = confettiRef.current;

    // 1. Spawn from Left Bottom Corner shooting Up-Right
    for (let i = 0; i < 80; i++) {
      const angle = -Math.PI / 4 + (Math.random() - 0.5) * 0.35; // shoot around -45deg
      const speed = Math.random() * 12 + 10; // high initial velocity
      const maxLife = Math.random() * 80 + 100;
      
      particles.push({
        x: 0,
        y: h,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: colors[Math.floor(Math.random() * colors.length)],
        width: Math.random() * 8 + 6,
        height: Math.random() * 14 + 8,
        rotation: Math.random() * Math.PI,
        rotationSpeed: (Math.random() - 0.5) * 0.15,
        opacity: 1.0,
        life: maxLife,
        maxLife,
      });
    }

    // 2. Spawn from Right Bottom Corner shooting Up-Left
    for (let i = 0; i < 80; i++) {
      const angle = -3 * Math.PI / 4 + (Math.random() - 0.5) * 0.35; // shoot around -135deg
      const speed = Math.random() * 12 + 10;
      const maxLife = Math.random() * 80 + 100;
      
      particles.push({
        x: w,
        y: h,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: colors[Math.floor(Math.random() * colors.length)],
        width: Math.random() * 8 + 6,
        height: Math.random() * 14 + 8,
        rotation: Math.random() * Math.PI,
        rotationSpeed: (Math.random() - 0.5) * 0.15,
        opacity: 1.0,
        life: maxLife,
        maxLife,
      });
    }
  };

  // Calculate scratched area percentage
  const checkScratchPercentage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const imgData = ctx.getImageData(0, 0, width, height);
    const pixels = imgData.data;
    const step = 20; // Check every 20th pixel
    let checkedCount = 0;
    let transparentPixels = 0;

    for (let i = 3; i < pixels.length; i += 4 * step) {
      checkedCount++;
      if (pixels[i] === 0) {
        transparentPixels++;
      }
    }

    const percentage = Math.round((transparentPixels / checkedCount) * 100);
    setScratchPercentage(percentage);

    if (percentage > 2 && !isRevealed) {
      setIsRevealed(true);
      triggerFullScreenConfetti();
    }
  };

  // Scratch Action Handlers
  const scratch = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    // Safety check radius value is always positive
    const radius = Math.max(1, 22);
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();

    checkScratchPercentage();
  };

  // Mouse Events
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDrawing(true);
    scratch(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing) return;
    scratch(e.clientX, e.clientY);
  };

  const handleMouseUpOrLeave = () => {
    setIsDrawing(false);
  };

  // Touch Events (Mobile)
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDrawing(true);
    const touch = e.touches[0];
    scratch(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDrawing) return;
    // Prevent screen scroll while scratching on mobile
    if (e.cancelable) {
      e.preventDefault();
    }
    const touch = e.touches[0];
    scratch(touch.clientX, touch.clientY);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-sm h-36 mx-auto rounded-2xl overflow-hidden border-2 border-gold-400 shadow-md bg-white select-none touch-none"
    >
      {/* Inner Double Border on Date Container */}
      <div className="absolute inset-1 border border-gold-500/10 rounded-xl pointer-events-none z-10" />

      {/* Date Details Revealed Underneath */}
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-cream-light to-[#f5ebd8]/20 px-6 py-4 text-center">
        <div className="flex items-center gap-1 text-gold-600 mb-1">
          <Sparkles className="w-3.5 h-3.5 fill-gold-600" />
          <span className="text-[10px] uppercase font-bold tracking-widest font-display-wedding">
            Save the Auspicious Dates
          </span>
          <Sparkles className="w-3.5 h-3.5 fill-gold-600" />
        </div>

        {/* Traditional Dates Layout */}
        <h3 className="text-xl sm:text-2xl font-display-wedding text-maroon-800 font-bold leading-tight mt-0.5">
          14th & 15th Feb 2027
        </h3>
        
        <p className="text-[11px] font-serif-wedding text-charcoal-wedding/80 mt-1.5 uppercase tracking-widest font-bold border-t border-gold-500/30 pt-1.5 px-6">
          Saturday to Monday &bull; Ahmedabad
        </p>
      </div>

      {/* Scratch Layer Canvas */}
      <AnimatePresence>
        {!isRevealed && (
          <motion.canvas
            ref={canvasRef}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
            onMouseLeave={handleMouseUpOrLeave}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleMouseUpOrLeave}
            className="absolute inset-0 z-20 cursor-crosshair w-full h-full active:scale-[1.00] transition-transform duration-300"
          />
        )}
      </AnimatePresence>

      {/* Full Screen Party Popper Confetti Canvas */}
      <canvas
        ref={fullScreenCanvasRef}
        className="fixed inset-0 pointer-events-none z-50 w-screen h-screen"
      />

      {/* Sealed Gold Effect Gift Ribbon/Sparkle */}
      {isRevealed && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute top-2 right-2 bg-saffron-500 text-white rounded-full p-1 shadow-sm z-30"
        >
          <Gift className="w-3.5 h-3.5 animate-bounce" />
        </motion.div>
      )}
    </div>
  );
}
