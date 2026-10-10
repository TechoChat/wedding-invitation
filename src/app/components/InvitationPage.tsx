"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { CalendarDays, MapPin, Flower2, ArrowLeft, Sparkles } from "lucide-react";
import CurtainReveal from "./CurtainReveal";
import ScratchDateCard from "./ScratchDateCard";
import { useCallback, useEffect, useRef, useState } from "react";
type Particle = { x: number; y: number; vx: number; vy: number; size: number; color: string; spin: number; angle: number; life: number; maxLife: number };

type Event = { time: string; title: string; subtitle?: string; venue: string; address: string; mapUrl?: string };
type Props = { side: "Utsav" | "Devanshi"; events: Event[]; intro: string };

export default function InvitationPage({ side, events, intro }: Props) {
  const isGroom = side === "Utsav";
  const wrapRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);
  const foilRef = useRef<HTMLCanvasElement>(null);
  const [scratchPercent, setScratchPercent] = useState(0);
  const celebrated = useRef(false);
  const lastPoint = useRef<{ x: number; y: number } | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const drawing = useRef(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const startMusic = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.5;
    const tryPlay = () => {
      audio.play().then(() => {
        window.removeEventListener("click", tryPlay);
        window.removeEventListener("touchstart", tryPlay);
        window.removeEventListener("keydown", tryPlay);
      }).catch(() => {
        // Browsers may require a user interaction before allowing audio playback.
      });
    };
    tryPlay();
    window.addEventListener("click", tryPlay, { once: true });
    window.addEventListener("touchstart", tryPlay, { once: true });
    window.addEventListener("keydown", tryPlay, { once: true });
  }, []);

  const resizeFoil = useCallback(() => {
    const canvas = foilRef.current, wrap = wrapRef.current;
    if (!canvas || !wrap || revealed) return;
    const rect = wrap.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(rect.width * dpr); canvas.height = Math.round(rect.height * dpr);
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    canvas.style.position = "absolute";
    canvas.style.left = "0";
    canvas.style.top = "0";
    canvas.style.zIndex = "4";
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const g = ctx.createLinearGradient(0, 0, rect.width, rect.height);
    g.addColorStop(0, "#f6f3d9"); g.addColorStop(.2, "#e3d588"); g.addColorStop(.4, "#d4af37"); g.addColorStop(.6, "#b08d27"); g.addColorStop(.8, "#d4af37"); g.addColorStop(1, "#eee7b5");
    ctx.fillStyle = g; ctx.fillRect(0, 0, rect.width, rect.height);
    // Double inset border gives the foil the look of a premium scratch-off invitation.
    ctx.strokeStyle = "rgba(140,106,27,.4)"; ctx.lineWidth = 2; ctx.strokeRect(6, 6, rect.width - 12, rect.height - 12);
    ctx.strokeStyle = "rgba(140,106,27,.15)"; ctx.lineWidth = 1; ctx.strokeRect(9, 9, rect.width - 18, rect.height - 18);
    ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillStyle = "#5b421a";
    ctx.font = "italic bold 15px Georgia, serif"; ctx.fillText("Scratch to Reveal Date", rect.width / 2, rect.height / 2 - 10);
    ctx.font = "10px Arial, sans-serif"; ctx.fillStyle = "#8c6a1b"; ctx.fillText("✧  SWIPE HERE  ✧", rect.width / 2, rect.height / 2 + 15);
  }, [revealed]);

  useEffect(() => {
    let frame = requestAnimationFrame(() => resizeFoil());
    // A second frame ensures the card has its final layout dimensions before painting foil.
    const secondFrame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => resizeFoil());
    });
    const onResize = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => resizeFoil());
    };
    window.addEventListener("resize", onResize);
    const card = wrapRef.current;
    const observer = card && typeof ResizeObserver !== "undefined"
      ? new ResizeObserver(() => resizeFoil())
      : null;
    if (card && observer) observer.observe(card);
    return () => {
      cancelAnimationFrame(frame);
      cancelAnimationFrame(secondFrame);
      window.removeEventListener("resize", onResize);
      observer?.disconnect();
    };
  }, [resizeFoil]);



  const scratchAt = (clientX: number, clientY: number) => {
    const canvas = foilRef.current; if (!canvas || revealed) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    const rect = canvas.getBoundingClientRect(), point = { x: clientX - rect.left, y: clientY - rect.top };
    ctx.globalCompositeOperation = "destination-out"; ctx.lineWidth = 46; ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.beginPath();
    if (lastPoint.current) { ctx.moveTo(lastPoint.current.x, lastPoint.current.y); ctx.lineTo(point.x, point.y); } else { ctx.moveTo(point.x, point.y); ctx.lineTo(point.x + 0.1, point.y + 0.1); } ctx.stroke(); lastPoint.current = point;
    // Sample alpha sparsely to estimate the scratched-away portion.
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let clear = 0, total = 0;
    // Sample alpha at regular intervals across the actual backing canvas.
    const step = 4 * 240;
    for (let i = 3; i < data.length; i += step) { total++; if (data[i] < 20) clear++; }
    const pct = Math.round(clear / Math.max(total, 1) * 100);
    setScratchPercent(pct);
    if (pct > 2 && !celebrated.current) { setRevealed(true); burst(); }
  };

  const pointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => { drawing.current = true; lastPoint.current = null; e.currentTarget.setPointerCapture(e.pointerId); scratchAt(e.clientX, e.clientY); };
  const pointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => { if (drawing.current) scratchAt(e.clientX, e.clientY); };
  const pointerUp = () => { drawing.current = false; lastPoint.current = null; };

  const burst = () => {
    if (celebrated.current) return;
    celebrated.current = true;
    const colors = ["#d5a747", "#8d2943", "#f1c6a8", "#71846c", "#f6df9d", "#fff8e9"];
    const w = window.innerWidth, h = window.innerHeight;
    // Two party poppers fire diagonally from the bottom corners, like the reference.
    for (const side of [0, 1]) for (let i = 0; i < 80; i++) {
      const angle = (side === 0 ? -Math.PI / 4 : -3 * Math.PI / 4) + (Math.random() - .5) * .35;
      const speed = 10 + Math.random() * 12, life = 100 + Math.random() * 80;
      particlesRef.current.push({ x: side === 0 ? 0 : w, y: h, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, size: 6 + Math.random() * 8, color: colors[Math.floor(Math.random() * colors.length)], spin: (Math.random() - .5) * .15, angle: Math.random() * 6, life, maxLife: life });
    }
  };

  useEffect(() => {
    let raf = 0;
    const canvas = document.createElement("canvas");
    canvas.setAttribute("aria-hidden", "true");
    Object.assign(canvas.style, { position: "fixed", inset: "0", width: "100%", height: "100%", pointerEvents: "none", zIndex: "80" });
    document.body.appendChild(canvas);
    const ctx = canvas.getContext("2d");
    const draw = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2), w = window.innerWidth, h = window.innerHeight;
      if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
      }
      if (ctx) {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, w, h);
        for (let i = particlesRef.current.length - 1; i >= 0; i--) {
          const p = particlesRef.current[i];
          p.x += p.vx; p.y += p.vy; p.vy += 0.13; p.vx *= 0.991; p.angle += p.spin; p.life--;
          if (p.life <= 0) { particlesRef.current.splice(i, 1); continue; }
          ctx.save(); ctx.globalAlpha = Math.min(1, p.life / 18, p.life / p.maxLife);
          ctx.translate(p.x, p.y); ctx.rotate(p.angle); ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 3, p.size, p.size * 0.65); ctx.restore();
        }
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); canvas.remove(); };
  }, []);

  return (
    <main className={`invite-page ${isGroom ? "groom-theme" : "bride-theme"}`}>
      <CurtainReveal onComplete={startMusic} />
      <audio ref={audioRef} src="/background-music.mp3" loop preload="auto" />
      <div className="ambient ambient-one" /><div className="ambient ambient-two" />
      <div className="dev-top-ornament" aria-hidden="true">✺ <span>✦</span> ✺</div>
      <section className="invite-hero">
        <motion.div className="dev-intro" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
          <p className="dev-mantra">॥ શ્રી ગણેશાય નમઃ ॥</p>
          <p className="dev-kicker">With the blessings of our families</p>
          <h1>Utsav <span>&</span><br />Devanshi</h1>
          <div className="dev-rule"><i /> <span>શુભ વિવાહ</span> <i /></div>
          <p className="dev-copy">Two hearts, two families, one auspicious beginning.<br />Your presence is a blessing as we celebrate this beautiful union.</p>
          {/* <p className="dev-date"><CalendarDays size={17}/> Monday, 15 February 2027</p> */}
          <a className="dev-cta" href="#scratch">Reveal your invitation <span>↓</span></a>
        </motion.div>
        <motion.div className="hero-photo-wrap" initial={{ opacity: 0, scale: .96, y: 18 }}
          animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 1.1, delay: .15 }}>
          <div className="photo-ornament"><span>✦</span></div>
          <div className="hero-photo">
            <Image src="/couple-hero.png" alt="Utsav and Devanshi" fill priority sizes="(max-width: 760px) 90vw, 45vw" />
          </div>
          <div className="photo-caption">Together begins forever</div>
        </motion.div>
        <div className="hero-flower flower-a">✿</div><div className="hero-flower flower-b">✽</div>
      </section>

      <section className="blessing-strip">
        <span>✦</span><p>Two families, one beautiful beginning</p><span>✦</span>
      </section>

      <section className="scratch-section" id="scratch">
        <div className="scratch-heading"><p className="dev-kicker">A little surprise, just for you</p><h2>Scratch to discover<br /><em>our special day</em></h2><p>Gently swipe the golden panel to uncover the celebrations.</p></div>
        <div ref={wrapRef} className={`scratch-card ${revealed ? "scratch-card-revealed" : ""}`}>
          <div className="revealed-content date-only-reveal">
            <span className="reveal-sparkle">✦ ✧ ✦</span>
            <p className="revealed-label">Save the date</p>
            <h3>14 & 15 February<br /><em>2027</em></h3>
          </div>
          {!revealed && <canvas ref={foilRef} className="scratch-foil" onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={pointerUp} onPointerCancel={pointerUp} onPointerLeave={pointerUp} aria-label="Scratch the gold foil to reveal the wedding invitation" />}
        </div>
        {!revealed ? <p className="scratch-progress"><Sparkles size={14} /> {scratchPercent > 0 ? `${scratchPercent}% revealed — keep going!` : "Use your finger or mouse to scratch the gold"}</p> : <motion.p className="scratch-success" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>A shower of joy, love and blessings! ✨</motion.p>}
      </section>

      <section id="celebrations" className="events-section">
        <motion.div className="section-heading" initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          {/* <Flower2 size={25} strokeWidth={1.2} /> */}
          <p className="eyebrow">The auspicious gatherings</p>
          <h2>{isGroom ? "Celebrations at the Shah Residence" : "Celebrations with the Sutaria Family"}</h2>
          <p className="section-note">We look forward to celebrating these cherished moments with you.</p>
        </motion.div>
        <div className="event-list">
          {events.map((event, index) => (
            <motion.article className="event-card" key={event.title}
              initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: .15 }} transition={{ duration: .55, delay: index * .08 }}>
              <div className="event-number">0{index + 1}</div>
              <div className="event-main">
                <div className="event-time">{event.time}</div>
                <h3>{event.title}</h3>
                {event.subtitle && <p className="event-subtitle">{event.subtitle}</p>}
                <div className="event-location"><MapPin size={16} /><div><strong>{event.venue}</strong><span>{event.address}</span></div></div>
                <div>
                  {event.mapUrl && (
                    <a
                      className="event-map-link"
                      href={event.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Open navigation for ${event.title}`}
                    >
                      <MapPin size={14} /> Navigate to venue
                    </a>
                  )}
                </div>
              </div>
              <div className="event-flourish">✺</div>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="closing-note">
        <div className="closing-lotus">❋</div>
        <p className="eyebrow">With love and blessings</p>
        <h2>Your presence will make<br />our joy complete.</h2>
        <p>May this auspicious union be filled with love, laughter, and the blessings of Shree Ganesh.</p>
        <div className="closing-names">Utsav <span>&</span> Devanshi</div>
        <div className="family-signoff">The Shah & Sutaria Families</div>
      </section>
      <footer className="invite-footer"><Sparkles size={14} /> Made with love for our most special beginning <Sparkles size={14} /></footer>
    </main>
  );
}
