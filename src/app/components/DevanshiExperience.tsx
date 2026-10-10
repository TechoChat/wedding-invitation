"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { MapPin, Sparkles } from "lucide-react";
import CurtainReveal from "./CurtainReveal";

type Particle = { x:number; y:number; vx:number; vy:number; size:number; color:string; spin:number; angle:number; life:number; maxLife:number };
const MAP_URL = "https://maps.app.goo.gl/M7wDB5sBMcZT3XeZ8";

export default function DevanshiExperience() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const foilRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [revealed, setRevealed] = useState(false);
  const [musicOn, setMusicOn] = useState(false);
  const [scratchPercent, setScratchPercent] = useState(0);
  const drawing = useRef(false);
  const lastPoint = useRef<{x:number;y:number}|null>(null);
  const celebrated = useRef(false);

  const startMusic = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.5;
    const tryPlay = () => {
      audio.play().then(() => {
        setMusicOn(true);
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
    canvas.style.display = "block";
    canvas.style.position = "absolute";
    canvas.style.left = "0";
    canvas.style.top = "0";
    canvas.style.zIndex = "4";
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const g = ctx.createLinearGradient(0, 0, rect.width, rect.height);
    g.addColorStop(0, "#f6f3d9"); g.addColorStop(.2, "#e3d588"); g.addColorStop(.4, "#d4af37"); g.addColorStop(.6, "#b08d27"); g.addColorStop(.8, "#d4af37"); g.addColorStop(1, "#eee7b5");
    ctx.fillStyle = g; ctx.fillRect(0,0,rect.width,rect.height);
    // Double inset border gives the foil the look of a premium scratch-off invitation.
    ctx.strokeStyle = "rgba(140,106,27,.4)"; ctx.lineWidth = 2; ctx.strokeRect(6,6,rect.width-12,rect.height-12);
    ctx.strokeStyle = "rgba(140,106,27,.15)"; ctx.lineWidth = 1; ctx.strokeRect(9,9,rect.width-18,rect.height-18);
    ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillStyle = "#5b421a";
    ctx.font = "italic bold 15px Georgia, serif"; ctx.fillText("Scratch to Reveal Date", rect.width/2, rect.height/2-10);
    ctx.font = "10px Arial, sans-serif"; ctx.fillStyle = "#8c6a1b"; ctx.fillText("✧  SWIPE HERE  ✧", rect.width/2, rect.height/2+15);
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

  const burst = () => {
    if (celebrated.current) return;
    celebrated.current = true;
    const colors = ["#d5a747", "#8d2943", "#f1c6a8", "#71846c", "#f6df9d", "#fff8e9"];
    const w = window.innerWidth, h = window.innerHeight;
    // Two party poppers fire diagonally from the bottom corners, like the reference.
    for (const side of [0, 1]) for (let i=0; i<80; i++) {
      const angle = (side === 0 ? -Math.PI/4 : -3*Math.PI/4) + (Math.random()-.5)*.35;
      const speed = 10 + Math.random()*12, life = 100 + Math.random()*80;
      particlesRef.current.push({x:side===0?0:w,y:h,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed,size:6+Math.random()*8,color:colors[Math.floor(Math.random()*colors.length)],spin:(Math.random()-.5)*.15,angle:Math.random()*6,life,maxLife:life});
    }
  };

  useEffect(() => {
    let raf = 0;
    const canvas = document.createElement("canvas");
    canvas.setAttribute("aria-hidden", "true");
    Object.assign(canvas.style, { position:"fixed", inset:"0", width:"100%", height:"100%", pointerEvents:"none", zIndex:"80" });
    document.body.appendChild(canvas);
    const ctx = canvas.getContext("2d");
    const draw = () => {
      const dpr = Math.min(window.devicePixelRatio||1,2), w=window.innerWidth, h=window.innerHeight;
      if (canvas.width!==Math.round(w*dpr)||canvas.height!==Math.round(h*dpr)){canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);}
      if (ctx) {ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);for(let i=particlesRef.current.length-1;i>=0;i--){const p=particlesRef.current[i];p.x+=p.vx;p.y+=p.vy;p.vy+=.13;p.vx*=.991;p.angle+=p.spin;p.life--;if(p.life<=0){particlesRef.current.splice(i,1);continue;}ctx.save();ctx.globalAlpha=Math.min(1,p.life/18,p.life/p.maxLife);ctx.translate(p.x,p.y);ctx.rotate(p.angle);ctx.fillStyle=p.color;ctx.fillRect(-p.size/2,-p.size/3,p.size,p.size*.65);ctx.restore();}}
      raf=requestAnimationFrame(draw);
    };
    raf=requestAnimationFrame(draw);
    return ()=>{cancelAnimationFrame(raf);canvas.remove();};
  }, []);

  const scratchAt = (clientX:number, clientY:number) => {
    const canvas=foilRef.current; if(!canvas||revealed)return;
    const ctx=canvas.getContext("2d"); if(!ctx)return;
    const rect=canvas.getBoundingClientRect(), point={x:clientX-rect.left,y:clientY-rect.top};
    ctx.globalCompositeOperation="destination-out";ctx.lineWidth=46;ctx.lineCap="round";ctx.lineJoin="round";ctx.beginPath();
    if(lastPoint.current){ctx.moveTo(lastPoint.current.x,lastPoint.current.y);ctx.lineTo(point.x,point.y);}else{ctx.moveTo(point.x,point.y);ctx.lineTo(point.x+0.1,point.y+0.1);}ctx.stroke();lastPoint.current=point;
    // Sample alpha sparsely to estimate the scratched-away portion.
    const data=ctx.getImageData(0,0,canvas.width,canvas.height).data;
    let clear=0,total=0;
    // Sample alpha at regular intervals across the actual backing canvas.
    const step=4*240;
    for(let i=3;i<data.length;i+=step){total++;if(data[i]<20)clear++;}
    const pct=Math.round(clear/Math.max(total,1)*100);
    setScratchPercent(pct);
    if(pct>2 && !celebrated.current){setRevealed(true);burst();}
  };
  const pointerDown=(e:React.PointerEvent<HTMLCanvasElement>)=>{drawing.current=true;lastPoint.current=null;e.currentTarget.setPointerCapture(e.pointerId);scratchAt(e.clientX,e.clientY);};
  const pointerMove=(e:React.PointerEvent<HTMLCanvasElement>)=>{if(drawing.current)scratchAt(e.clientX,e.clientY);};
  const pointerUp=()=>{drawing.current=false;lastPoint.current=null;};

  return <main className="devanshi-site">
    <CurtainReveal onComplete={startMusic} />
    <audio ref={audioRef} src="/background-music.mp3" loop preload="auto" />
    
    <div className="dev-top-ornament" aria-hidden="true">✺ <span>✦</span> ✺</div>
    <section className="dev-hero">
      <motion.div className="dev-intro" initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{duration:1}}>
        <p className="dev-mantra">॥ શ્રી ગણેશાય નમઃ ॥</p>
        <p className="dev-kicker">With the blessings of our families</p>
        <h1>Devanshi <span>&</span><br/>Utsav</h1>
        <div className="dev-rule"><i/> <span>શુભ વિવાહ</span> <i/></div>
        <p className="dev-copy">Two hearts, two families, one auspicious beginning.<br/>Your presence is a blessing as we celebrate this beautiful union.</p>
        {/* <p className="dev-date"><CalendarDays size={17}/> Monday, 15 February 2027</p> */}
        <a className="dev-cta" href="#scratch">Reveal your invitation <span>↓</span></a>
      </motion.div>
      <motion.div className="dev-photo-frame" initial={{opacity:0,scale:.96,y:18}} animate={{opacity:1,scale:1,y:0}} transition={{duration:1.1,delay:.18}}>
        <div className="dev-photo"><Image src="/couple-hero.png" alt="Utsav and Devanshi together" fill priority sizes="(max-width: 760px) 88vw, 42vw"/></div>
        <div className="dev-photo-caption">A timeless union</div><span className="frame-flower flower-left">✿</span><span className="frame-flower flower-right">❋</span>
      </motion.div>
    </section>
    <section className="scratch-section" id="scratch">
      <div className="scratch-heading"><p className="dev-kicker">A little surprise, just for you</p><h2>Scratch to discover<br/><em>our special day</em></h2><p>Gently swipe the golden panel to uncover the celebrations.</p></div>
      <div ref={wrapRef} className={`scratch-card ${revealed?"scratch-card-revealed":""}`}>
        <div className="revealed-content date-only-reveal">
          <span className="reveal-sparkle">✦ ✧ ✦</span>
          <p className="revealed-label">Save the date</p>
          <h3>15 February<br/><em>2027</em></h3>
        </div>
        {!revealed&&<canvas ref={foilRef} className="scratch-foil" onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={pointerUp} onPointerCancel={pointerUp} onPointerLeave={pointerUp} aria-label="Scratch the gold foil to reveal the wedding invitation"/>}
      </div>
      {!revealed?<p className="scratch-progress"><Sparkles size={14}/> {scratchPercent>0?`${scratchPercent}% revealed — keep going!`:"Use your finger or mouse to scratch the gold"}</p>:<motion.p className="scratch-success" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}}>A shower of joy, love and blessings! ✨</motion.p>}
    </section>
    <section className="dev-events" id="celebrations"><p className="dev-kicker">The auspicious gatherings</p><h2>Three moments, <em>one beautiful beginning</em></h2><div className="dev-event-grid">
      <motion.article className="dev-event-card haldi-card" whileHover={{y:-5}}><span className="event-symbol">✿</span><p className="event-time-label">8:00 AM</p><h3>Haldi</h3><em>Turmeric Tales</em><p>A golden morning filled with warmth, laughter and blessings.</p><span className="event-date-label">15 February 2027</span></motion.article>
      <motion.article className="dev-event-card ganesh-card" whileHover={{y:-5}}><span className="event-symbol">ॐ</span><p className="event-time-label">9:00 AM</p><h3>Ganesh Sthapana</h3><em>An auspicious beginning</em><p>Invoking Shree Ganesh&apos;s blessings for the journey ahead.</p><span className="event-date-label">15 February 2027</span></motion.article>
      <motion.article className="dev-event-card lagan-card" whileHover={{y:-5}}><span className="event-symbol">❋</span><p className="event-time-label">5:00 PM</p><h3>Lagan</h3><em>A Timeless Union</em><p>Join us as two hearts begin their forever, surrounded by family and love.</p><span className="event-date-label">15 February 2027</span></motion.article>
    </div></section>
    <section className="dev-venue"><div className="venue-floral">❋</div><p className="dev-kicker">Where we gather</p><h2>Shri Surat Jilla Leuva Patidar Samaj</h2><p>Bardoli, Gujarat, India</p><a href={MAP_URL} target="_blank" rel="noreferrer" className="dev-cta venue-cta"><MapPin size={16}/> Open directions <span>↗</span></a><p className="venue-note">We can&apos;t wait to celebrate this auspicious day with you.</p></section>
    <footer className="dev-footer"><span>✦</span><p>With love, from the Sutaria family</p><div>Devanshi<i> & </i> Utsav</div><small>॥ मंगलम भगवान विष्णुः ॥</small></footer>
  </main>;
}
