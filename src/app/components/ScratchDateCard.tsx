 "use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Gift, Sparkles } from "lucide-react";

type Particle = { x:number; y:number; vx:number; vy:number; size:number; color:string; rotation:number; spin:number; life:number; maxLife:number };

export default function ScratchDateCard() {
  const cardRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const drawing = useRef(false);
  const last = useRef<{x:number;y:number}|null>(null);
  const celebrated = useRef(false);
  const [revealed, setRevealed] = useState(false);

  const paintFoil = useCallback(() => {
    const card = cardRef.current, canvas = canvasRef.current;
    if (!card || !canvas || revealed) return;
    const rect = card.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(rect.width*dpr);
    canvas.height = Math.round(rect.height*dpr);
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr,0,0,dpr,0,0);
    const g = ctx.createLinearGradient(0,0,rect.width,rect.height);
    g.addColorStop(0,"#f6f3d9"); g.addColorStop(.2,"#e3d588"); g.addColorStop(.4,"#d4af37"); g.addColorStop(.6,"#b08d27"); g.addColorStop(.8,"#d4af37"); g.addColorStop(1,"#eee7b5");
    ctx.fillStyle = g; ctx.fillRect(0,0,rect.width,rect.height);
    ctx.strokeStyle = "rgba(140,106,27,.48)"; ctx.lineWidth=2; ctx.strokeRect(6,6,rect.width-12,rect.height-12);
    ctx.strokeStyle = "rgba(140,106,27,.22)"; ctx.lineWidth=1; ctx.strokeRect(10,10,rect.width-20,rect.height-20);
    ctx.textAlign="center"; ctx.textBaseline="middle"; ctx.fillStyle="#5b421a";
    ctx.font="italic bold 15px Georgia,serif"; ctx.fillText("Scratch to Reveal Date",rect.width/2,rect.height/2-10);
    ctx.font="10px Arial,sans-serif"; ctx.fillStyle="#8c6a1b"; ctx.fillText("✧  SWIPE HERE  ✧",rect.width/2,rect.height/2+16);
  },[revealed]);

  useEffect(() => {
    let frame = requestAnimationFrame(paintFoil);
    const onResize = () => { cancelAnimationFrame(frame); frame=requestAnimationFrame(paintFoil); };
    window.addEventListener("resize",onResize);
    const observer = cardRef.current && typeof ResizeObserver !== "undefined" ? new ResizeObserver(onResize) : null;
    if (cardRef.current && observer) observer.observe(cardRef.current);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("resize",onResize); observer?.disconnect(); };
  },[paintFoil]);

  const burst = () => {
    if (celebrated.current) return;
    celebrated.current=true;
    const w=window.innerWidth,h=window.innerHeight, colors=["#d5a747","#8d2943","#f1c6a8","#71846c","#f6df9d","#fff8e9"];
    for (const side of [0,1]) for (let i=0;i<72;i++) {
      const angle=(side===0?-Math.PI/4:-3*Math.PI/4)+(Math.random()-.5)*.4;
      const speed=9+Math.random()*10, life=85+Math.random()*55;
      particles.current.push({x:side===0?0:w,y:h,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed,size:5+Math.random()*8,color:colors[Math.floor(Math.random()*colors.length)],rotation:Math.random()*6,spin:(Math.random()-.5)*.16,life,maxLife:life});
    }
  };

  useEffect(() => {
    let raf=0;
    const canvas=document.createElement("canvas");
    Object.assign(canvas.style,{position:"fixed",inset:"0",width:"100%",height:"100%",pointerEvents:"none",zIndex:"90"});
    canvas.setAttribute("aria-hidden","true"); document.body.appendChild(canvas);
    const ctx=canvas.getContext("2d");
    const draw=()=>{
      const dpr=Math.min(window.devicePixelRatio||1,2),w=window.innerWidth,h=window.innerHeight;
      if(canvas.width!==Math.round(w*dpr)||canvas.height!==Math.round(h*dpr)){canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);}
      if(ctx){ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);
        for(let i=particles.current.length-1;i>=0;i--){const p=particles.current[i];p.x+=p.vx;p.y+=p.vy;p.vy+=.14;p.vx*=.99;p.rotation+=p.spin;p.life--;if(p.life<=0){particles.current.splice(i,1);continue;}ctx.save();ctx.globalAlpha=Math.min(1,p.life/16,p.life/p.maxLife);ctx.translate(p.x,p.y);ctx.rotate(p.rotation);ctx.fillStyle=p.color;ctx.fillRect(-p.size/2,-p.size/3,p.size,p.size*.65);ctx.restore();}
      }
      raf=requestAnimationFrame(draw);
    };
    raf=requestAnimationFrame(draw);
    return ()=>{cancelAnimationFrame(raf);canvas.remove();};
  },[]);

  const scratchAt=(clientX:number,clientY:number)=>{
    const canvas=canvasRef.current;if(!canvas||revealed)return;
    const ctx=canvas.getContext("2d");if(!ctx)return;
    const rect=canvas.getBoundingClientRect(), point={x:clientX-rect.left,y:clientY-rect.top};
    ctx.globalCompositeOperation="destination-out";
    ctx.lineCap="round";ctx.lineJoin="round";ctx.lineWidth=76;
    ctx.beginPath();
    if(last.current){ctx.moveTo(last.current.x,last.current.y);ctx.lineTo(point.x,point.y);}else{ctx.moveTo(point.x,point.y);ctx.lineTo(point.x+0.1,point.y+0.1);}
    ctx.stroke();last.current=point;
    // Sample alpha values rather than every pixel to keep scratching responsive on phones.
    const data=ctx.getImageData(0,0,canvas.width,canvas.height).data;
    let checked=0,clear=0;
    for(let i=3;i<data.length;i+=4*28){checked++;if(data[i]===0)clear++;}
    if(checked && clear/checked>0.02){setRevealed(true);burst();}
  };

  const start=(x:number,y:number)=>{drawing.current=true;last.current=null;scratchAt(x,y);};
  const move=(x:number,y:number)=>{if(drawing.current)scratchAt(x,y);};
  const stop=()=>{drawing.current=false;last.current=null;};

  return (
    <div className="scratch-date-wrap">
      <div className="scratch-date-heading">
        <p>A little surprise, just for you</p>
        <h3>Scratch to discover</h3>
        <em>our special day</em>
        <span>Gently swipe the golden panel to reveal the date.</span>
      </div>
      <div ref={cardRef} className="scratch-date-card">
        <div className="scratch-date-underlay">
          <div className="scratch-stars"><Sparkles size={15} fill="currentColor"/><Sparkles size={15}/><Sparkles size={15} fill="currentColor"/></div>
          <small>SAVE THE DATE</small>
          <strong>14 & 15 February</strong>
          <em>2027</em>
        </div>
        <AnimatePresence>
          {!revealed && <motion.canvas
            ref={canvasRef}
            initial={{opacity:1}}
            exit={{opacity:0,scale:1.015}}
            transition={{duration:.45,ease:"easeOut"}}
            onPointerDown={e=>{e.currentTarget.setPointerCapture(e.pointerId);start(e.clientX,e.clientY);}}
            onPointerMove={e=>move(e.clientX,e.clientY)}
            onPointerUp={stop}
            onPointerCancel={stop}
            onLostPointerCapture={stop}
            className="scratch-date-foil"
            aria-label="Scratch the gold foil to reveal the wedding date"
          />}
        </AnimatePresence>
        {revealed && <motion.div initial={{scale:.5,opacity:0,rotate:-12}} animate={{scale:1,opacity:1,rotate:0}} className="scratch-date-gift"><Gift size={17}/></motion.div>}
      </div>
      <p className="scratch-date-hint"><Sparkles size={14}/> Use your finger or mouse to scratch the gold</p>
    </div>
  );
}
