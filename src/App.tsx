// @ts-nocheck
import { useState, useEffect, useRef } from "react";

/* ─── CHARTE GWADA BEER ───────────────────────────────────────── */
// Couleurs extraites du label : turquoise caraïbe, doré soleil, blanc
const G = {
  teal:   "#00B4C8",  // turquoise principal
  teal2:  "#0091A8",  // turquoise foncé
  gold:   "#F0A500",  // doré soleil
  gold2:  "#C8820A",  // doré foncé
  dark:   "#00253A",  // bleu nuit tropical
  darker: "#001825",
  white:  "#FFFFFF",
  cream:  "#FFF8E7",
};

/* ─── CSS ─────────────────────────────────────────────────────── */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:ital,wght@0,400;0,600;0,700;0,900;1,700&display=swap');
  *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }

  @keyframes flashGoal {
    0%   { opacity:0; transform:scale(0.5); }
    30%  { opacity:1; transform:scale(1.18); }
    65%  { opacity:1; transform:scale(1); }
    100% { opacity:0; transform:scale(0.9); }
  }
  @keyframes confettiFall {
    from { transform:translateY(-6vh) rotate(0deg) scale(1); opacity:1; }
    to   { transform:translateY(108vh) rotate(var(--rot)) scale(0.5); opacity:0; }
  }
  @keyframes prizeReveal {
    0%   { transform:scale(0.25) translateY(50px); opacity:0; filter:blur(12px); }
    55%  { transform:scale(1.07) translateY(-4px); opacity:1; filter:blur(0); }
    100% { transform:scale(1) translateY(0); opacity:1; }
  }
  @keyframes bounceIn {
    0%   { transform:scale(0.7) translateY(24px); opacity:0; }
    65%  { transform:scale(1.04) translateY(-3px); opacity:1; }
    100% { transform:scale(1) translateY(0); opacity:1; }
  }
  @keyframes slideUp {
    from { transform:translateY(14px); opacity:0; }
    to   { transform:translateY(0); opacity:1; }
  }
  @keyframes cursorPulse {
    0%,100% { opacity:1; }
    50%     { opacity:0.6; }
  }
  @keyframes keeperBob {
    0%,100% { transform:scaleY(1); }
    50%     { transform:scaleY(0.93) scaleX(1.05); }
  }
  @keyframes waveSway {
    0%,100% { transform:translateX(0); }
    50%     { transform:translateX(-8px); }
  }
  @keyframes palmSway {
    0%,100% { transform:rotate(0deg); transform-origin: bottom center; }
    50%     { transform:rotate(3deg); transform-origin: bottom center; }
  }
  @keyframes bubbleRise {
    0%   { transform:translateY(0) scale(1); opacity:0.6; }
    100% { transform:translateY(-40px) scale(0.4); opacity:0; }
  }
  @keyframes shimmer {
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
  }

  .tap {
    cursor:pointer; border:none; background:transparent; padding:0;
    user-select:none; font-family:'Bebas Neue',sans-serif;
    transition:transform .12s ease, filter .12s ease, box-shadow .15s ease;
    -webkit-tap-highlight-color: transparent;
  }
  .tap:not(:disabled):hover  { transform:scale(1.03) translateY(-2px); filter:brightness(1.1); }
  .tap:not(:disabled):active { transform:scale(0.95); filter:brightness(0.88); }
  .tap:disabled              { opacity:0.22; cursor:not-allowed; transform:none !important; }

  .gold-shimmer {
    background: linear-gradient(90deg, #F0A500, #FFD966, #F0A500, #C8820A, #F0A500);
    background-size: 300% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: shimmer 3s linear infinite;
  }
`;

/* ─── Logo SVG Gwada Beer ─────────────────────────────────────── */
function GwadaLogo({ size = 120 }) {
  return (
    <svg width={size} height={size * 0.75} viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg">
      {/* Soleil */}
      <circle cx="100" cy="72" r="32" fill="#F0A500" opacity="0.95"/>
      {/* Rayons */}
      {Array.from({length:12}, (_,i) => {
        const a = i * 30 * Math.PI / 180;
        return <line key={i}
          x1={100 + 35*Math.cos(a)} y1={72 + 35*Math.sin(a)}
          x2={100 + 46*Math.cos(a)} y2={72 + 46*Math.sin(a)}
          stroke="#F0A500" strokeWidth="3" strokeLinecap="round" opacity="0.7"/>;
      })}
      {/* Mer */}
      <ellipse cx="100" cy="98" rx="70" ry="14" fill="#00B4C8" opacity="0.6"/>
      <ellipse cx="100" cy="102" rx="60" ry="10" fill="#0091A8" opacity="0.7"/>
      {/* Île */}
      <ellipse cx="100" cy="98" rx="28" ry="7" fill="#F5C842"/>
      {/* Palmier gauche */}
      <line x1="84" y1="98" x2="80" y2="72" stroke="#3A6B35" strokeWidth="3.5"/>
      <ellipse cx="80" cy="70" rx="12" ry="7" fill="#2E8B3A" transform="rotate(-20 80 70)"/>
      <ellipse cx="74" cy="67" rx="10" ry="5" fill="#3AAA44" transform="rotate(-40 74 67)"/>
      <ellipse cx="86" cy="66" rx="10" ry="5" fill="#3AAA44" transform="rotate(15 86 66)"/>
      {/* Palmier droit */}
      <line x1="116" y1="98" x2="120" y2="72" stroke="#3A6B35" strokeWidth="3.5"/>
      <ellipse cx="120" cy="70" rx="12" ry="7" fill="#2E8B3A" transform="rotate(20 120 70)"/>
      <ellipse cx="114" cy="66" rx="10" ry="5" fill="#3AAA44" transform="rotate(-15 114 66)"/>
      <ellipse cx="126" cy="67" rx="10" ry="5" fill="#3AAA44" transform="rotate(40 126 67)"/>
      {/* Vague */}
      <path d="M30 105 Q55 98 80 105 Q105 112 130 105 Q155 98 170 105"
        stroke="white" strokeWidth="2.5" fill="none" opacity="0.6"/>
      {/* Texte GWADA */}
      <text x="100" y="134" textAnchor="middle"
        fontFamily="'Bebas Neue', sans-serif" fontSize="26"
        fill="white" letterSpacing="4">GWADA</text>
      {/* Texte BEER petit */}
      <text x="100" y="145" textAnchor="middle"
        fontFamily="'Barlow Condensed', sans-serif" fontSize="10"
        fill="#F0A500" letterSpacing="6" fontWeight="700">BEER</text>
    </svg>
  );
}

/* ─── Constantes jeu ──────────────────────────────────────────── */
const GOAL_LEFT   = 5.0;
const GOAL_RIGHT  = 95.0;
const KEEPER_HALF = 11;

const CURSOR_AMP   = [55, 57, 60];
const CURSOR_SPEED = [1.2, 1.9, 2.9];
const KEEPER_AMP   = [30, 32, 34];
const KEEPER_SPEED = [0.8, 1.35, 2.1];
const KEEPER_PHASE = [1.7, 0.85, 2.4];

const PRIZES = {
  3:{ label:"GROS CADEAU",  sub:"1 fût de Gwada Beer offert !",   icon:"🏆", color:G.gold,  glow:"#F0A50044", bg:`radial-gradient(ellipse at 20% 20%,#5A3A00,#1C1000)` },
  2:{ label:"CADEAU MOYEN", sub:"6 bières Gwada Beer offertes !",  icon:"🎁", color:"#D0D0D0",glow:"#D0D0D033", bg:`radial-gradient(ellipse at 20% 20%,#2A3A4A,#0A1520)` },
  1:{ label:"PETIT CADEAU", sub:"1 bière Gwada Beer offerte !",    icon:"🍺", color:G.teal,  glow:"#00B4C844", bg:`radial-gradient(ellipse at 20% 20%,#003A4A,#001825)` },
  0:{ label:"REJOUEZ !",    sub:"Retentez votre chance !",         icon:"🔄", color:"#88DDCC",glow:"#88DDCC33", bg:`radial-gradient(ellipse at 20% 20%,#1A3A2A,#051008)` },
};

function makeCode(g) {
  const a = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const r = Array.from({length:6},()=>a[Math.floor(Math.random()*a.length)]).join("");
  const t = Date.now().toString(36).toUpperCase().slice(-4);
  return `GWADA-WC26-${g}G-${t}${r}`;
}

/* ─── Confetti tropical ───────────────────────────────────────── */
const CONFETTI = Array.from({length:80},(_,i)=>({
  id:i, x:Math.random()*100,
  delay:Math.random()*2.5, dur:2.5+Math.random()*2.5,
  rot:Math.random()*800-400,
  color:[G.teal, G.gold, "#FFFFFF", "#FF6B35", "#00E5FF", "#FFD700", "#88DDCC", "#F0A500"][i%8],
  w:6+Math.random()*9, h:8+Math.random()*12, round:Math.random()>.45,
}));

function Confetti() {
  return (
    <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:999,overflow:"hidden"}}>
      {CONFETTI.map(p=>(
        <div key={p.id} style={{
          position:"absolute", left:`${p.x}%`, top:-20,
          width:p.w, height:p.h, borderRadius:p.round?"50%":2,
          background:p.color, "--rot":`${p.rot}deg`,
          animation:`confettiFall ${p.dur}s ${p.delay}s ease-in both`,
        }}/>
      ))}
    </div>
  );
}

/* ─── Fond tropical ───────────────────────────────────────────── */
function TropicalBg() {
  return (
    <div style={{position:"fixed",inset:0,zIndex:0,overflow:"hidden",pointerEvents:"none"}}>
      {/* Dégradé ciel-mer */}
      <div style={{
        position:"absolute",inset:0,
        background:`linear-gradient(180deg, ${G.darker} 0%, #002A3A 40%, #001E2D 100%)`,
      }}/>
      {/* Vague basse gauche */}
      <svg style={{position:"absolute",bottom:0,left:0,opacity:.12}} width="100%" height="200" viewBox="0 0 400 200">
        <path d="M0 120 Q100 80 200 120 Q300 160 400 120 L400 200 L0 200Z" fill={G.teal}/>
      </svg>
      {/* Lumières ambiantes */}
      <div style={{
        position:"absolute",inset:0,
        background:`
          radial-gradient(ellipse 60% 35% at 15% 10%, ${G.teal}14, transparent),
          radial-gradient(ellipse 40% 25% at 85% 85%, ${G.gold}0A, transparent),
          radial-gradient(ellipse 30% 20% at 90% 5%,  ${G.gold}10, transparent)
        `,
      }}/>
    </div>
  );
}

/* ─── Cage SVG ────────────────────────────────────────────────── */
function GoalSVG() {
  return (
    <svg viewBox="0 0 300 200" style={{width:"100%",display:"block"}}>
      <defs>
        <linearGradient id="pg" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"  stopColor="#FFFFFF20"/>
          <stop offset="50%" stopColor="#FFFFFF80"/>
          <stop offset="100%" stopColor="#FFFFFF10"/>
        </linearGradient>
        <radialGradient id="ng" cx="50%" cy="0%" r="100%">
          <stop offset="0%" stopColor={G.teal+"08"}/>
          <stop offset="100%" stopColor={G.dark+"88"}/>
        </radialGradient>
      </defs>
      {/* Pelouse tropicale */}
      <rect x={0} y={160} width={300} height={40} fill="#0D3A1A"/>
      <rect x={0} y={160} width={300} height={5} fill="#1A5A28" opacity={.9}/>
      <line x1={150} y1={163} x2={150} y2={200} stroke="#FFFFFF18" strokeWidth={1} strokeDasharray="5,5"/>
      {/* Fond filet */}
      <rect x={14} y={14} width={272} height={146} fill="url(#ng)"/>
      {/* Grillage */}
      {Array.from({length:15},(_,i)=>(
        <line key={`v${i}`} x1={14+i*(272/14)} y1={14} x2={14+i*(272/14)} y2={160}
          stroke={G.teal+"18"} strokeWidth={0.9}/>
      ))}
      {Array.from({length:9},(_,i)=>(
        <line key={`h${i}`} x1={14} y1={14+i*(146/8)} x2={286} y2={14+i*(146/8)}
          stroke={G.teal+"18"} strokeWidth={0.9}/>
      ))}
      {/* Poteaux blancs */}
      <rect x={8}   y={8} width={9} height={155} rx={3} fill="#E0E0E0"/>
      <rect x={8}   y={8} width={9} height={155} rx={3} fill="url(#pg)"/>
      <rect x={283} y={8} width={9} height={155} rx={3} fill="#E0E0E0"/>
      <rect x={283} y={8} width={9} height={155} rx={3} fill="url(#pg)"/>
      <rect x={8}   y={8} width={284} height={9} rx={3} fill="#F0F0F0"/>
      <rect x={8}   y={8} width={284} height={9} rx={3} fill="url(#pg)"/>
      <rect x={14} y={158} width={272} height={2} fill="#FFFFFF22"/>
    </svg>
  );
}

/* ─── INTRO ───────────────────────────────────────────────────── */
function IntroScreen({ onStart }) {
  return (
    <div style={{animation:"bounceIn .6s ease both"}}>
      <div style={{
        background:`linear-gradient(155deg, ${G.dark}F0, ${G.darker}F0)`,
        border:`1.5px solid ${G.teal}44`,
        borderRadius:24, padding:"28px 22px 24px", marginBottom:12,
        backdropFilter:"blur(8px)",
        boxShadow:`0 0 60px ${G.teal}18, 0 8px 40px #00000066`,
      }}>

        {/* Badge World Cup */}
        <div style={{textAlign:"center",marginBottom:18}}>
          <span style={{
            display:"inline-block",
            background:`linear-gradient(135deg,${G.gold2},${G.gold},${G.gold2})`,
            borderRadius:100, padding:"5px 22px",
            fontFamily:"'Barlow Condensed',sans-serif",
            fontWeight:700, fontSize:11, color:G.darker, letterSpacing:"0.18em",
          }}>🌍 FIFA WORLD CUP 2026</span>
        </div>

        {/* Logo Gwada */}
        <div style={{textAlign:"center",marginBottom:6}}>
          <GwadaLogo size={130}/>
        </div>

        {/* Sous-titre */}
        <div style={{textAlign:"center",marginBottom:20}}>
          <div style={{
            fontFamily:"'Barlow Condensed',sans-serif",
            fontWeight:700, fontSize:13, color:G.teal,
            letterSpacing:".25em", textTransform:"uppercase",
          }}>Les Brasseurs de Guadeloupe</div>
          <div style={{
            fontFamily:"'Bebas Neue',sans-serif",
            fontSize:28, color:"#FFFFFF",
            letterSpacing:".15em", marginTop:4,
          }}>⚽ PENALTY CHALLENGE ⚽</div>
        </div>

        {/* Comment jouer */}
        <div style={{
          background:`${G.teal}10`,
          border:`1px solid ${G.teal}30`,
          borderRadius:14, padding:"13px 16px", marginBottom:14,
        }}>
          <div style={{
            fontFamily:"'Bebas Neue',sans-serif",
            fontSize:17, color:G.gold, letterSpacing:".1em", marginBottom:8,
          }}>COMMENT JOUER ?</div>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:14,color:"#FFFFFFAA",lineHeight:1.8}}>
            🎯 La <span style={{color:"#FFF",fontWeight:700}}>visée</span> se déplace de gauche à droite<br/>
            🧤 Le <span style={{color:G.gold,fontWeight:700}}>gardien</span> protège une zone du but<br/>
            👆 Appuie sur <span style={{color:G.teal,fontWeight:700}}>TIRER !</span> au bon moment<br/>
            ✅ Vise entre les poteaux, sans toucher le gardien
          </div>
        </div>

        {/* Tableau des prix */}
        <div style={{display:"flex",flexDirection:"column",gap:7,marginBottom:22}}>
          {[
            {g:3, l:"3 BUTS →", p:"GROS CADEAU 🏆",  c:G.gold},
            {g:2, l:"2 BUTS →", p:"CADEAU MOYEN 🎁", c:"#C0C0C0"},
            {g:1, l:"1 BUT →",  p:"PETIT CADEAU 🍺", c:G.teal},
            {g:0, l:"0 BUT →",  p:"REJOUE ! 🔄",     c:"#88DDCC"},
          ].map(r=>(
            <div key={r.g} style={{
              display:"flex", justifyContent:"space-between", alignItems:"center",
              padding:"9px 14px",
              background:"#FFFFFF07",
              border:`1px solid ${r.c}28`, borderRadius:10,
            }}>
              <span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:24,color:r.c,letterSpacing:".06em"}}>{r.l}</span>
              <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:14,color:"#FFF"}}>{r.p}</span>
            </div>
          ))}
        </div>

        {/* Bouton JOUER */}
        <button className="tap" onClick={onStart} style={{
          width:"100%", padding:"20px",
          background:`linear-gradient(135deg,${G.teal2},${G.teal},${G.teal2})`,
          borderRadius:16, color:"#FFF",
          fontSize:30, letterSpacing:".12em",
          boxShadow:`0 0 42px ${G.teal}50, 0 6px 24px #00000066`,
        }}>
          JOUER →
        </button>
      </div>

      <p style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,color:"#FFFFFF22",textAlign:"center",letterSpacing:".06em"}}>
        Jeu sans obligation d'achat • L'abus d'alcool est dangereux pour la santé
      </p>
    </div>
  );
}

/* ─── JEU ─────────────────────────────────────────────────────── */
function GameScreen({ shots, phase, ball, flash, goals, cursorX, keeperX, frozenKeeperX, shotIndex, onShoot }) {
  const canShoot = phase === "aiming";
  const isInGoal  = cursorX >= GOAL_LEFT && cursorX <= GOAL_RIGHT;
  const isBlocked = isInGoal && Math.abs(cursorX - keeperX) < KEEPER_HALF;
  const wouldScore = isInGoal && !isBlocked;

  const cursorColor = wouldScore ? G.teal : isBlocked ? G.gold : "#FF4444";
  const statusLabel = wouldScore ? "TIREZ !" : isBlocked ? "GARDIEN !" : "HORS BUT !";

  const gkX = phase === "aiming" ? keeperX : frozenKeeperX;
  const gkL = Math.max(GOAL_LEFT,  gkX - KEEPER_HALF);
  const gkR = Math.min(GOAL_RIGHT, gkX + KEEPER_HALF);

  const diffLabels = ["NORMAL","RAPIDE","TRÈS RAPIDE"];
  const diffColors = [G.teal, G.gold, "#FF4444"];

  return (
    <div style={{display:"flex",flexDirection:"column",gap:13}}>

      {/* En-tête avec mini logo */}
      <div style={{
        display:"flex", alignItems:"center", justifyContent:"space-between",
        animation:"slideUp .4s ease both",
      }}>
        <GwadaLogo size={56}/>
        <div style={{textAlign:"right"}}>
          <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:28,color:G.teal,letterSpacing:".06em",lineHeight:1}}>
            PENALTY CHALLENGE
          </div>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:11,color:"#FFFFFF38",letterSpacing:".14em"}}>
            WORLD CUP 2026
          </div>
        </div>
      </div>

      {/* Indicateurs */}
      <div style={{display:"flex",justifyContent:"center",gap:9,alignItems:"center"}}>
        {[0,1,2].map(i=>{
          const s=shots[i];
          const active=!s&&i===shots.length;
          return(
            <div key={i} style={{
              width:56,height:56,borderRadius:12,
              display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,
              border:`2px solid ${s?(s.isGoal?G.teal:"#FF4444"):active?G.gold:"#FFFFFF18"}`,
              background:s?(s.isGoal?G.teal+"18":"#FF444418"):"#FFFFFF05",
              boxShadow:s?(s.isGoal?`0 0 16px ${G.teal}50`:"0 0 14px #FF444440"):active?`0 0 18px ${G.gold}50`:"none",
              transition:"all .3s ease",
            }}>
              {s?(s.isGoal?"⚽":"❌"):active?"🎯":"●"}
            </div>
          );
        })}
        <div style={{
          marginLeft:6,padding:"5px 11px",
          background:"#FFFFFF08",borderRadius:9,
          border:`1px solid ${diffColors[shotIndex]}40`,
          textAlign:"center",minWidth:74,
        }}>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:10,color:"#FFFFFF40",letterSpacing:".1em"}}>
            TIR {shotIndex+1}/3
          </div>
          <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:15,color:diffColors[shotIndex],letterSpacing:".05em"}}>
            {diffLabels[shotIndex]}
          </div>
        </div>
      </div>

      {/* Zone cage */}
      <div style={{
        background:`linear-gradient(160deg,${G.dark}CC,${G.darker}CC)`,
        border:`1px solid ${G.teal}28`,
        borderRadius:20,padding:"10px 10px 8px",
        position:"relative",overflow:"hidden",
        backdropFilter:"blur(4px)",
      }}>
        {/* Statut */}
        <div style={{
          textAlign:"center",marginBottom:6,
          fontFamily:"'Bebas Neue',sans-serif",fontSize:22,
          color:phase==="aiming"?cursorColor:"#FFFFFF28",
          letterSpacing:".1em",
          textShadow:phase==="aiming"?`0 0 16px ${cursorColor}`:"none",
          transition:"color .08s,text-shadow .08s",
          minHeight:28,
        }}>
          {phase==="aiming"?statusLabel:phase==="shooting"?"EN VOL…":""}
        </div>

        {/* Cage */}
        <div style={{position:"relative",overflow:"hidden"}}>
          <GoalSVG/>

          {/* Gardien humain SVG */}
          {phase!=="idle"&&(
            <div style={{
              position:"absolute",
              left:`${gkX}%`,
              top:"48%",
              width:0, height:0,
              zIndex:8,
              transition:"left .06s linear",
              animation:phase==="aiming"?"keeperBob .8s ease infinite":"none",
            }}>
              <svg
                width="38" height="72"
                viewBox="0 0 38 72"
                style={{
                  position:"absolute",
                  transform:"translate(-50%, 0)",
                  filter:`drop-shadow(0 3px 8px rgba(0,0,0,.7))`,
                  overflow:"visible",
                }}
              >
                {/* ── Gants gauche ── */}
                <ellipse cx="1" cy="28" rx="5" ry="4.5" fill="#E8A020"/>
                <ellipse cx="1" cy="28" rx="3.5" ry="3" fill="#C8820A"/>
                {/* Doigts gauche */}
                <rect x="-3" y="24" width="2" height="5" rx="1" fill="#E8A020"/>
                <rect x="-1" y="23" width="2" height="6" rx="1" fill="#E8A020"/>
                <rect x="1" y="23" width="2" height="6" rx="1" fill="#E8A020"/>
                <rect x="3" y="24" width="2" height="5" rx="1" fill="#E8A020"/>

                {/* ── Bras gauche ── */}
                <path d="M8 26 Q4 27 1 28" stroke="#8B4513" strokeWidth="4" strokeLinecap="round" fill="none"/>

                {/* ── Bras droit ── */}
                <path d="M30 26 Q34 27 37 28" stroke="#8B4513" strokeWidth="4" strokeLinecap="round" fill="none"/>

                {/* ── Gants droit ── */}
                <ellipse cx="37" cy="28" rx="5" ry="4.5" fill="#E8A020"/>
                <ellipse cx="37" cy="28" rx="3.5" ry="3" fill="#C8820A"/>
                {/* Doigts droit */}
                <rect x="33" y="24" width="2" height="5" rx="1" fill="#E8A020"/>
                <rect x="35" y="23" width="2" height="6" rx="1" fill="#E8A020"/>
                <rect x="37" y="23" width="2" height="6" rx="1" fill="#E8A020"/>
                <rect x="39" y="24" width="2" height="5" rx="1" fill="#E8A020"/>

                {/* ── Corps (maillot turquoise) ── */}
                <rect x="10" y="24" width="18" height="22" rx="4" fill="#00B4C8"/>
                {/* Numéro 1 sur le maillot */}
                <text x="19" y="38" textAnchor="middle"
                  fontFamily="'Bebas Neue',sans-serif" fontSize="10"
                  fill="white" fontWeight="bold">1</text>
                {/* Rayures épaules */}
                <rect x="10" y="24" width="18" height="5" rx="4" fill="#0091A8"/>
                <rect x="10" y="24" width="6" height="22" rx="4" fill="#0091A8" opacity="0.4"/>

                {/* ── Cou ── */}
                <rect x="16" y="16" width="6" height="10" rx="2" fill="#8B4513"/>

                {/* ── Tête ── */}
                <ellipse cx="19" cy="13" rx="9" ry="10" fill="#8B4513"/>
                {/* Cheveux */}
                <ellipse cx="19" cy="5" rx="9" ry="5" fill="#1A0A00"/>
                <rect x="10" y="5" width="18" height="5" fill="#1A0A00"/>
                {/* Visage */}
                {/* Yeux */}
                <ellipse cx="15" cy="13" rx="2" ry="2.2" fill="white"/>
                <ellipse cx="23" cy="13" rx="2" ry="2.2" fill="white"/>
                <ellipse cx="15.5" cy="13.5" rx="1.2" ry="1.4" fill="#1A1A1A"/>
                <ellipse cx="23.5" cy="13.5" rx="1.2" ry="1.4" fill="#1A1A1A"/>
                {/* Sourcils concentrés */}
                <path d="M13 10.5 Q15 9.5 17 10.5" stroke="#1A0A00" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                <path d="M21 10.5 Q23 9.5 25 10.5" stroke="#1A0A00" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                {/* Bouche */}
                <path d="M16 18 Q19 16.5 22 18" stroke="#5A2A0A" strokeWidth="1.2" fill="none" strokeLinecap="round"/>

                {/* ── Shorts ── */}
                <rect x="10" y="44" width="8" height="12" rx="2" fill="#00253A"/>
                <rect x="20" y="44" width="8" height="12" rx="2" fill="#00253A"/>

                {/* ── Jambes ── */}
                <rect x="11" y="54" width="6" height="11" rx="2" fill="#8B4513"/>
                <rect x="21" y="54" width="6" height="11" rx="2" fill="#8B4513"/>

                {/* ── Chaussures ── */}
                <ellipse cx="14" cy="66" rx="6" ry="3.5" fill="#1A1A1A"/>
                <ellipse cx="24" cy="66" rx="6" ry="3.5" fill="#1A1A1A"/>
                {/* Lacets */}
                <line x1="11" y1="65" x2="17" y2="65" stroke="#F0A500" strokeWidth="1"/>
                <line x1="21" y1="65" x2="27" y2="65" stroke="#F0A500" strokeWidth="1"/>
              </svg>
            </div>
          )}

          {/* Viseur */}
          {phase==="aiming"&&(
            <div style={{
              position:"absolute",
              left:`${cursorX}%`,top:"7%",height:"73%",
              width:4,transform:"translateX(-50%)",
              background:`linear-gradient(180deg,${cursorColor}88,${cursorColor})`,
              boxShadow:`0 0 10px ${cursorColor},0 0 24px ${cursorColor}80`,
              zIndex:15,borderRadius:2,
              animation:"cursorPulse .35s ease infinite",
              transition:"background .08s,box-shadow .08s",
            }}>
              <div style={{position:"absolute",bottom:-8,left:"50%",transform:"translateX(-50%)",width:0,height:0,
                borderLeft:"7px solid transparent",borderRight:"7px solid transparent",
                borderTop:`9px solid ${cursorColor}`,filter:`drop-shadow(0 0 4px ${cursorColor})`}}/>
              <div style={{position:"absolute",top:-6,left:"50%",transform:"translateX(-50%)",width:0,height:0,
                borderLeft:"5px solid transparent",borderRight:"5px solid transparent",
                borderBottom:`7px solid ${cursorColor}`,filter:`drop-shadow(0 0 3px ${cursorColor})`}}/>
            </div>
          )}

          {/* Fenêtre libre */}
          {phase==="aiming"&&wouldScore&&(
            <div style={{
              position:"absolute",
              left:`${Math.max(GOAL_LEFT,gkX<50?gkX+KEEPER_HALF:GOAL_LEFT)}%`,
              width:`${Math.min(GOAL_RIGHT,gkX<50?GOAL_RIGHT:gkX-KEEPER_HALF)-Math.max(GOAL_LEFT,gkX<50?gkX+KEEPER_HALF:GOAL_LEFT)}%`,
              top:"7%",height:"73%",
              background:G.teal+"0A",
              borderLeft:gkX<50?`1px dashed ${G.teal}40`:"none",
              borderRight:gkX>=50?`1px dashed ${G.teal}40`:"none",
              zIndex:5,pointerEvents:"none",transition:"all .1s",
            }}/>
          )}

          {/* Ballon */}
          {ball.visible&&(
            <div style={{
              position:"absolute",left:`${ball.x}%`,top:`${ball.y}%`,
              width:34,height:34,transform:"translate(-50%,-50%)",
              fontSize:28,lineHeight:"34px",textAlign:"center",
              transition:ball.animating?"left .55s cubic-bezier(.18,.88,.3,1),top .52s cubic-bezier(.2,.85,.3,1)":"none",
              zIndex:20,filter:"drop-shadow(0 2px 8px rgba(0,0,0,.9))",userSelect:"none",
            }}>⚽</div>
          )}

          {/* Flash */}
          {flash&&(
            <div style={{
              position:"absolute",inset:0,
              display:"flex",alignItems:"center",justifyContent:"center",
              background:flash==="goal"?G.teal+"28":"#FF444428",
              borderRadius:8,
              animation:"flashGoal 1.1s ease forwards",zIndex:25,
            }}>
              <span style={{
                fontFamily:"'Bebas Neue',sans-serif",fontSize:72,
                color:flash==="goal"?G.teal:"#FF4444",
                textShadow:`0 0 30px ${flash==="goal"?G.teal:"#FF4444"}`,
                letterSpacing:".05em",
              }}>
                {flash==="goal"?"GOAL !":"RATÉ !"}
              </span>
            </div>
          )}
        </div>

        {/* Mini score */}
        <div style={{
          textAlign:"center",marginTop:7,
          fontFamily:"'Barlow Condensed',sans-serif",
          fontSize:13,color:"#FFFFFF38",fontWeight:600,letterSpacing:".08em",
        }}>
          <span style={{color:G.teal}}>{goals} but{goals!==1?"s":""}</span>
          {" — "}{shots.length} tir{shots.length!==1?"s":""} effectué{shots.length!==1?"s":""}
        </div>
      </div>

      {/* Bouton TIRER */}
      <button className="tap" onClick={onShoot} disabled={!canShoot} style={{
        width:"100%",padding:"22px",
        background:canShoot
          ?`linear-gradient(135deg,${G.teal2},${G.teal},${G.teal2})`
          :`linear-gradient(135deg,#081418,#0D1E24)`,
        borderRadius:16,
        color:canShoot?"#FFF":"#FFFFFF28",
        fontSize:34,letterSpacing:".12em",
        boxShadow:canShoot?`0 0 42px ${G.teal}55,0 5px 22px #00000066`:"none",
      }}>
        {shots.length>=3?"TERMINÉ !":phase==="shooting"?"EN VOL…":`⚽ TIRER ! (${3-shots.length})`}
      </button>
    </div>
  );
}

/* ─── RÉSULTAT ────────────────────────────────────────────────── */
function ResultScreen({ prize, goals, code, onReplay }) {
  const [qrOk, setQrOk] = useState(false);
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(code)}&ecc=H&margin=8&color=00253A&bgcolor=FFF8E7`;

  return (
    <div style={{display:"flex",flexDirection:"column",gap:14,animation:"bounceIn .7s ease both"}}>

      {/* Mini logo */}
      <div style={{textAlign:"center"}}><GwadaLogo size={70}/></div>

      {/* Carte prix */}
      <div style={{
        background:prize.bg,
        border:`2px solid ${prize.color}55`,borderRadius:22,
        padding:"24px 20px 20px",textAlign:"center",
        boxShadow:`0 0 70px ${prize.glow},0 8px 32px #00000066`,
        animation:"prizeReveal .85s cubic-bezier(.34,1.56,.64,1) both",
      }}>
        <div style={{fontSize:58,marginBottom:10}}>{prize.icon}</div>
        <div style={{
          fontFamily:"'Bebas Neue',sans-serif",fontSize:48,
          color:prize.color,
          textShadow:`0 0 24px ${prize.color}99`,
          letterSpacing:".06em",lineHeight:.95,marginBottom:10,
        }}>{prize.label}</div>
        <div style={{
          fontFamily:"'Barlow Condensed',sans-serif",
          fontWeight:700,fontSize:19,color:"#FFF",letterSpacing:".04em",
        }}>{prize.sub}</div>
        <div style={{marginTop:16,display:"flex",justifyContent:"center",gap:12,fontSize:28}}>
          {[0,1,2].map(i=>(
            <span key={i} style={{opacity:i<goals?1:0.15,transition:`opacity .3s ${i*.12}s`}}>⚽</span>
          ))}
        </div>
      </div>

      {/* QR Code */}
      <div style={{
        background:`${G.dark}E0`,
        border:`1px solid ${G.teal}28`,
        borderRadius:20,padding:"20px 20px 16px",textAlign:"center",
        backdropFilter:"blur(6px)",
      }}>
        <div style={{
          fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,
          fontSize:13,color:"#FFFFFF55",letterSpacing:".14em",marginBottom:14,
        }}>🎯 Montre ce QR code au barman</div>

        {/* QR */}
        <div style={{
          display:"inline-flex",alignItems:"center",justifyContent:"center",
          background:G.cream,padding:10,borderRadius:14,
          boxShadow:`0 4px 28px #00000066,0 0 0 3px ${G.gold}40`,
          marginBottom:16,minWidth:180,minHeight:180,
        }}>
          {!qrOk&&<div style={{width:180,height:180,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,color:"#999"}}>Chargement…</div>}
          <img src={qrUrl} alt="QR Code" width={180} height={180}
            style={{display:qrOk?"block":"none",imageRendering:"pixelated",borderRadius:4}}
            onLoad={()=>setQrOk(true)} onError={()=>setQrOk(true)}/>
        </div>

        {/* Code texte */}
        <div style={{
          background:"#FFFFFF08",border:"1px solid #FFFFFF12",
          borderRadius:10,padding:"10px 16px",marginBottom:10,
        }}>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:10,color:"#FFFFFF35",letterSpacing:".14em",marginBottom:4}}>
            CODE UNIQUE
          </div>
          <div style={{fontFamily:"monospace",fontSize:15,color:G.gold,letterSpacing:".12em",fontWeight:700}}>
            {code}
          </div>
        </div>

        {/* Mention */}
        <div style={{
          display:"flex",alignItems:"center",justifyContent:"center",gap:8,
          fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,
          color:"#FFFFFF28",lineHeight:1.5,
        }}>
          <GwadaLogo size={22}/>
          <span>Code à usage unique • Valable aujourd'hui uniquement</span>
        </div>
      </div>

      {/* Rejouer */}
      <button className="tap" onClick={onReplay} style={{
        width:"100%",padding:"16px",
        background:`linear-gradient(135deg,${G.darker},${G.dark})`,
        border:`1px solid ${G.teal}30`,
        borderRadius:14,color:G.teal,
        fontSize:26,letterSpacing:".1em",
      }}>↺ REJOUER</button>

      <p style={{
        fontFamily:"'Barlow Condensed',sans-serif",fontSize:10,
        color:"#FFFFFF18",textAlign:"center",letterSpacing:".04em",
      }}>
        L'abus d'alcool est dangereux pour la santé — À consommer avec modération
      </p>
    </div>
  );
}

/* ─── APP ─────────────────────────────────────────────────────── */
const BALL_START = {x:50,y:93,visible:false,animating:false};

export default function GwadaBeerChallenge() {
  const [screen,setScreen]       = useState("intro");
  const [shots,setShots]         = useState([]);
  const [phase,setPhase]         = useState("idle");
  const [ball,setBall]           = useState(BALL_START);
  const [flash,setFlash]         = useState(null);
  const [cursorX,setCursorX]     = useState(50);
  const [keeperX,setKeeperX]     = useState(50);
  const [frozenKeeperX,setFrz]   = useState(50);
  const [shotIndex,setShotIndex] = useState(0);
  const [code,setCode]           = useState("");
  const [confetti,setConfetti]   = useState(false);

  const animRef      = useRef(null);
  const startTimeRef = useRef(null);
  const cursorXRef   = useRef(50);
  const keeperXRef   = useRef(50);
  const shotsRef     = useRef([]);
  const shotIdxRef   = useRef(0);

  const goals = shots.filter(s=>s.isGoal).length;
  const prize = PRIZES[goals]??PRIZES[0];

  useEffect(()=>()=>{if(animRef.current)cancelAnimationFrame(animRef.current)},[]);

  const startAiming = () => {
    if(animRef.current)cancelAnimationFrame(animRef.current);
    startTimeRef.current=null;
    const loop=(ts)=>{
      if(!startTimeRef.current)startTimeRef.current=ts;
      const t=(ts-startTimeRef.current)/1000;
      const si=shotIdxRef.current;
      const cx=50+(CURSOR_AMP[si]??60)*Math.sin(t*(CURSOR_SPEED[si]??2.9));
      const kx=50+(KEEPER_AMP[si]??34)*Math.sin(t*(KEEPER_SPEED[si]??2.1)+(KEEPER_PHASE[si]??2.4));
      cursorXRef.current=cx; keeperXRef.current=kx;
      setCursorX(cx); setKeeperX(kx);
      animRef.current=requestAnimationFrame(loop);
    };
    animRef.current=requestAnimationFrame(loop);
  };

  const stopAiming = () => {
    if(animRef.current){cancelAnimationFrame(animRef.current);animRef.current=null;}
  };

  const startGame = () => {
    stopAiming();
    shotsRef.current=[]; shotIdxRef.current=0;
    setShots([]); setShotIndex(0); setPhase("aiming");
    setBall(BALL_START); setFlash(null);
    setCursorX(50); setKeeperX(50);
    setCode(""); setConfetti(false);
    setScreen("game");
    setTimeout(startAiming,80);
  };

  const handleShoot = () => {
    if(phase!=="aiming"||shotsRef.current.length>=3)return;
    const cx=cursorXRef.current; const kx=keeperXRef.current;
    stopAiming(); setFrz(kx); setPhase("shooting");
    const isInGoal=cx>=GOAL_LEFT&&cx<=GOAL_RIGHT;
    const isBlocked=isInGoal&&Math.abs(cx-kx)<KEEPER_HALF;
    const isGoal=isInGoal&&!isBlocked;
    let tx,ty;
    if(isGoal){tx=cx;ty=42;}
    else if(isBlocked){tx=kx;ty=50;}
    else{tx=cx<50?-22:122;ty=48;}
    setBall({x:50,y:93,visible:true,animating:false});
    setTimeout(()=>setBall({x:tx,y:ty,visible:true,animating:true}),65);
    setTimeout(()=>setFlash(isGoal?"goal":"miss"),700);
    setTimeout(()=>{
      setFlash(null); setBall(BALL_START);
      const ns=[...shotsRef.current,{isGoal}];
      shotsRef.current=ns; setShots(ns);
      if(ns.length>=3){
        const fg=ns.filter(s=>s.isGoal).length;
        setCode(makeCode(fg));
        if(fg>=2)setConfetti(true);
        setTimeout(()=>setScreen("result"),350);
      }else{
        const ni=ns.length;
        shotIdxRef.current=ni; setShotIndex(ni);
        startTimeRef.current=null; setPhase("aiming"); startAiming();
      }
    },1640);
  };

  return (
    <>
      <style>{CSS}</style>
      <TropicalBg/>
      {confetti&&<Confetti/>}
      <div style={{
        minHeight:"100vh",
        display:"flex",alignItems:"center",justifyContent:"center",
        padding:"16px",position:"relative",zIndex:1,
      }}>
        <div style={{width:"100%",maxWidth:420,position:"relative"}}>
          {screen==="intro"  && <IntroScreen onStart={startGame}/>}
          {screen==="game"   && (
            <GameScreen
              shots={shots} phase={phase} ball={ball} flash={flash} goals={goals}
              cursorX={cursorX} keeperX={keeperX} frozenKeeperX={frozenKeeperX}
              shotIndex={shotIndex} onShoot={handleShoot}
            />
          )}
          {screen==="result" && (
            <ResultScreen prize={prize} goals={goals} code={code} onReplay={startGame}/>
          )}
        </div>
      </div>
    </>
  );
}
