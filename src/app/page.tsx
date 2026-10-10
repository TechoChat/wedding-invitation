"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useCallback, useRef } from "react";
import { ArrowUpRight, Flower2 } from "lucide-react";
import CurtainReveal from "./components/CurtainReveal";

export default function Home() {
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

  return (
    <main className="home-page">
      <CurtainReveal onComplete={startMusic} />
      <audio ref={audioRef} src="/background-music.mp3" loop preload="auto" />
      <div className="home-top"><span>॥ શ્રી ગણેશાય નમઃ ॥</span><div className="mini-flower">✿</div></div>
      <motion.section className="home-content" initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8 }}>
        <p className="eyebrow">Two families · One auspicious union</p>
        <h1>Utsav <i>&</i> Devanshi</h1>
        <p className="home-subtitle">A celebration of love, tradition, and togetherness</p>
        <div className="home-image"><Image src="/couple-hero.png" alt="Utsav and Devanshi" fill priority sizes="(max-width: 760px) 90vw, 560px" /></div>
        <p className="choose-label"><Flower2 size={17} /> Choose your invitation</p>
        <div className="invitation-choices">
          <Link href="/utsav" className="choice-card groom-choice">
            <span className="choice-small">From the family of</span><strong>Utsav Shah</strong><span className="choice-action">Groom's invitation <ArrowUpRight size={16} /></span>
          </Link>
          <Link href="/devanshi" className="choice-card bride-choice">
            <span className="choice-small">From the family of</span><strong>Devanshi Sutaria</strong><span className="choice-action">Bride's invitation <ArrowUpRight size={16} /></span>
          </Link>
        </div>
        <p className="home-date">14 & 15 February 2027 <span>✦</span> Surat · Bardoli</p>
      </motion.section>
      <footer className="home-footer">With the blessings of Shree Ganesh and our families</footer>
    </main>
  );
}
