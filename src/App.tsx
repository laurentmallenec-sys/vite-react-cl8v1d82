// @ts-nocheck
import { useState, useEffect, useRef } from 'react';

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@400;600;700;900&display=swap');
  *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
  @keyframes flashGoal { 0%{opacity:0;transform:scale(0.5)} 30%{opacity:1;transform:scale(1.18)} 65%{opacity:1;transform:scale(1)} 100%{opacity:0;transform:scale(0.9)} }
  @keyframes confettiFall { from{transform:translateY(-6vh) rotate(0deg) scale(1);opacity:1} to{transform:translateY(108vh) rotate(var(--rot)) scale(0.5);opacity:0} }
  @keyframes prizeReveal { 0%{transform:scale(0.25) translateY(50px);opacity:0;filter:blur(12px)} 55%{transform:scale(1.07) translateY(-4px);opacity:1;filter:blur(0)} 100%{transform:scale(1) translateY(0);opacity:1} }
  @keyframes bounceIn { 0%{transform:scale(0.7) translateY(24px);opacity:0} 65%{transform:scale(1.04) translateY(-3px);opacity:1} 100%{transform:scale(1) translateY(0);opacity:1} }
  @keyframes slideUp { from{transform:translateY(14px);opacity:0} to{transform:translateY(0);opacity:1} }
  @keyframes cursorPulse { 0%,100%{opacity:1} 50%{opacity:0.65} }
  @keyframes keeperBob { 0%,100%{transform:scaleY(1)} 50%{transform:scaleY(0.94) scaleX(1.04)} }
  @keyframes statusFlash { 0%{opacity:0;transform:scale(0.8)} 30%{opacity:1;transform:scale(1.05)} 100%{opacity:1;transform:scale(1)} }
  .tap { cursor:pointer;border:none;background:transparent;padding:0;user-select:none;font-family:'Bebas Neue',sans-serif;transition:transform .12s ease,filter .12s ease,box-shadow .12s ease;-webkit-tap-highlight-color:transparent; }
  .tap:not(:disabled):hover{transform:scale(1.03) translateY(-2px);filter:brightness(1.12)}
  .tap:not(:disabled):active{transform:scale(0.95);filter:brightness(0.88)}
  .tap:disabled{opacity:0.25;cursor:not-allowed;transform:none!important}
`;

const GOAL_LEFT = 5,
  GOAL_RIGHT = 95,
  KEEPER_HALF = 11;
const CURSOR_AMP = [55, 57, 60],
  CURSOR_SPEED = [1.2, 1.9, 2.9];
const KEEPER_AMP = [30, 32, 34],
  KEEPER_SPEED = [0.8, 1.35, 2.1],
  KEEPER_PHASE = [1.7, 0.85, 2.4];
const PRIZES = {
  3: {
    label: 'GROS CADEAU',
    sub: '1 fût de Gwada Beer offert !',
    icon: '🏆',
    color: '#FFD700',
    glow: '#FFD70044',
    bg: 'radial-gradient(ellipse at 20% 20%,#6A4800,#1C1000)',
  },
  2: {
    label: 'CADEAU MOYEN',
    sub: '6 bières Gwada Beer offertes !',
    icon: '🎁',
    color: '#D0D0D0',
    glow: '#C0C0C033',
    bg: 'radial-gradient(ellipse at 20% 20%,#4A4A4A,#141414)',
  },
  1: {
    label: 'PETIT CADEAU',
    sub: '1 bière Gwada Beer offerte !',
    icon: '🍺',
    color: '#CD7F32',
    glow: '#CD7F3233',
    bg: 'radial-gradient(ellipse at 20% 20%,#5A3010,#1A0A00)',
  },
  0: {
    label: 'REJOUEZ !',
    sub: 'Retentez votre chance !',
    icon: '🔄',
    color: '#00C853',
    glow: '#00C85333',
    bg: 'radial-gradient(ellipse at 20% 20%,#1A4A1A,#061006)',
  },
};

function makeCode(g) {
  const a = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const r = Array.from(
    { length: 6 },
    () => a[Math.floor(Math.random() * a.length)]
  ).join('');
  const t = Date.now().toString(36).toUpperCase().slice(-4);
  return `GWADA-WC26-${g}G-${t}${r}`;
}

const CONFETTI = Array.from({ length: 80 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  delay: Math.random() * 2.5,
  dur: 2.5 + Math.random() * 2.5,
  rot: Math.random() * 800 - 400,
  color: [
    '#FFD700',
    '#00C853',
    '#FF3D00',
    '#2979FF',
    '#E040FB',
    '#FF9100',
    '#FFF',
    '#00E5FF',
  ][i % 8],
  w: 6 + Math.random() * 9,
  h: 8 + Math.random() * 12,
  round: Math.random() > 0.45,
}));
function Confetti() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 999,
        overflow: 'hidden',
      }}
    >
      {CONFETTI.map((p) => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            top: -20,
            width: p.w,
            height: p.h,
            borderRadius: p.round ? '50%' : 2,
            background: p.color,
            '--rot': `${p.rot}deg`,
            animation: `confettiFall ${p.dur}s ${p.delay}s ease-in both`,
          }}
        />
      ))}
    </div>
  );
}

function GoalSVG() {
  return (
    <svg viewBox="0 0 300 200" style={{ width: '100%', display: 'block' }}>
      <defs>
        <linearGradient id="pg" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#FFFFFF30" />
          <stop offset="50%" stopColor="#FFFFFF88" />
          <stop offset="100%" stopColor="#FFFFFF10" />
        </linearGradient>
        <radialGradient id="ng" cx="50%" cy="0%" r="100%">
          <stop offset="0%" stopColor="#00001500" />
          <stop offset="100%" stopColor="#00003355" />
        </radialGradient>
      </defs>
      <rect x={0} y={160} width={300} height={40} fill="#0D2606" />
      <rect x={0} y={160} width={300} height={6} fill="#153009" opacity={0.8} />
      <line
        x1={150}
        y1={163}
        x2={150}
        y2={200}
        stroke="#FFFFFF22"
        strokeWidth={1}
        strokeDasharray="5,5"
      />
      <rect x={14} y={14} width={272} height={146} fill="url(#ng)" />
      {Array.from({ length: 15 }, (_, i) => (
        <line
          key={`v${i}`}
          x1={14 + i * (272 / 14)}
          y1={14}
          x2={14 + i * (272 / 14)}
          y2={160}
          stroke="#FFFFFF16"
          strokeWidth={0.8}
        />
      ))}
      {Array.from({ length: 9 }, (_, i) => (
        <line
          key={`h${i}`}
          x1={14}
          y1={14 + i * (146 / 8)}
          x2={286}
          y2={14 + i * (146 / 8)}
          stroke="#FFFFFF16"
          strokeWidth={0.8}
        />
      ))}
      <rect x={8} y={8} width={9} height={155} rx={3} fill="#D0D0D0" />
      <rect x={8} y={8} width={9} height={155} rx={3} fill="url(#pg)" />
      <rect x={283} y={8} width={9} height={155} rx={3} fill="#D0D0D0" />
      <rect x={283} y={8} width={9} height={155} rx={3} fill="url(#pg)" />
      <rect x={8} y={8} width={284} height={9} rx={3} fill="#E0E0E0" />
      <rect x={8} y={8} width={284} height={9} rx={3} fill="url(#pg)" />
      <rect x={14} y={158} width={272} height={2} fill="#FFFFFF28" />
    </svg>
  );
}

function IntroScreen({ onStart }) {
  return (
    <div style={{ animation: 'bounceIn .6s ease both' }}>
      <div
        style={{
          background: 'linear-gradient(155deg,#091609,#040C04)',
          border: '1px solid #00C85328',
          borderRadius: 24,
          padding: '30px 22px 26px',
          marginBottom: 12,
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 18 }}>
          <span
            style={{
              display: 'inline-block',
              background: 'linear-gradient(135deg,#7B6000,#FFD700,#7B6000)',
              borderRadius: 100,
              padding: '5px 20px',
              fontFamily: "'Barlow Condensed',sans-serif",
              fontWeight: 700,
              fontSize: 11,
              color: '#040C04',
              letterSpacing: '0.2em',
            }}
          >
            🌍 FIFA WORLD CUP 2026
          </span>
        </div>
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div
            style={{
              fontFamily: "'Bebas Neue',sans-serif",
              fontSize: 76,
              lineHeight: 0.82,
              color: '#00C853',
              letterSpacing: '.04em',
            }}
          >
            GWADA
          </div>
          <div
            style={{
              fontFamily: "'Bebas Neue',sans-serif",
              fontSize: 42,
              color: '#FFD700',
              letterSpacing: '.2em',
              marginBottom: 12,
            }}
          >
            BEER
          </div>
          <div
            style={{
              fontFamily: "'Barlow Condensed',sans-serif",
              fontWeight: 700,
              fontSize: 20,
              color: '#FFF',
              letterSpacing: '.1em',
            }}
          >
            ⚽ PENALTY CHALLENGE ⚽
          </div>
        </div>
        <div
          style={{
            background: '#FFFFFF08',
            border: '1px solid #00C85328',
            borderRadius: 14,
            padding: '14px 16px',
            marginBottom: 16,
          }}
        >
          <div
            style={{
              fontFamily: "'Bebas Neue',sans-serif",
              fontSize: 18,
              color: '#FFD700',
              letterSpacing: '.08em',
              marginBottom: 8,
            }}
          >
            COMMENT JOUER ?
          </div>
          <div
            style={{
              fontFamily: "'Barlow Condensed',sans-serif",
              fontSize: 14,
              color: '#FFFFFF80',
              lineHeight: 1.75,
            }}
          >
            🎯 La <span style={{ color: '#FFF', fontWeight: 700 }}>visée</span>{' '}
            se déplace de gauche à droite
            <br />
            🧤 Le{' '}
            <span style={{ color: '#FF9100', fontWeight: 700 }}>
              gardien
            </span>{' '}
            protège une zone du but
            <br />
            👆 Appuie sur{' '}
            <span style={{ color: '#00C853', fontWeight: 700 }}>
              TIRER !
            </span>{' '}
            au bon moment
            <br />✅ Visée entre les poteaux + sans toucher le gardien
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 7,
            marginBottom: 22,
          }}
        >
          {[
            { g: 3, l: '3 BUTS →', p: 'GROS CADEAU 🏆', c: '#FFD700' },
            { g: 2, l: '2 BUTS →', p: 'CADEAU MOYEN 🎁', c: '#D0D0D0' },
            { g: 1, l: '1 BUT →', p: 'PETIT CADEAU 🍺', c: '#CD7F32' },
            { g: 0, l: '0 BUT →', p: 'REJOUE ! 🔄', c: '#00C853' },
          ].map((r) => (
            <div
              key={r.g}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '9px 14px',
                background: '#FFFFFF07',
                border: `1px solid ${r.c}26`,
                borderRadius: 10,
              }}
            >
              <span
                style={{
                  fontFamily: "'Bebas Neue',sans-serif",
                  fontSize: 24,
                  color: r.c,
                  letterSpacing: '.06em',
                }}
              >
                {r.l}
              </span>
              <span
                style={{
                  fontFamily: "'Barlow Condensed',sans-serif",
                  fontWeight: 700,
                  fontSize: 14,
                  color: '#FFF',
                }}
              >
                {r.p}
              </span>
            </div>
          ))}
        </div>
        <button
          className="tap"
          onClick={onStart}
          style={{
            width: '100%',
            padding: '20px',
            background: 'linear-gradient(135deg,#009E3F,#00C853,#009E3F)',
            borderRadius: 16,
            color: '#FFF',
            fontSize: 30,
            letterSpacing: '.1em',
            boxShadow: '0 0 42px #00C85340,0 6px 24px #00000066',
          }}
        >
          JOUER →
        </button>
      </div>
      <p
        style={{
          fontFamily: "'Barlow Condensed',sans-serif",
          fontSize: 11,
          color: '#FFFFFF22',
          textAlign: 'center',
          letterSpacing: '.06em',
        }}
      >
        Jeu sans obligation d'achat • À consommer avec modération
      </p>
    </div>
  );
}

function GameScreen({
  shots,
  phase,
  ball,
  flash,
  goals,
  cursorX,
  keeperX,
  frozenKeeperX,
  shotIndex,
  onShoot,
}) {
  const canShoot = phase === 'aiming';
  const isInGoal = cursorX >= GOAL_LEFT && cursorX <= GOAL_RIGHT;
  const isBlocked = isInGoal && Math.abs(cursorX - keeperX) < KEEPER_HALF;
  const wouldScore = isInGoal && !isBlocked;
  const cursorColor = wouldScore
    ? '#00C853'
    : isBlocked
    ? '#FF9100'
    : '#FF3D00';
  const statusLabel = wouldScore
    ? 'TIREZ !'
    : isBlocked
    ? 'GARDIEN !'
    : 'HORS BUT !';
  const gkX = phase === 'aiming' ? keeperX : frozenKeeperX;
  const gkL = Math.max(GOAL_LEFT, gkX - KEEPER_HALF);
  const gkR = Math.min(GOAL_RIGHT, gkX + KEEPER_HALF);
  const diffLabels = ['NORMAL', 'RAPIDE', 'TRÈS RAPIDE'];
  const diffColors = ['#00C853', '#FF9100', '#FF3D00'];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ textAlign: 'center', animation: 'slideUp .4s ease both' }}>
        <div
          style={{
            fontFamily: "'Bebas Neue',sans-serif",
            fontSize: 34,
            color: '#00C853',
            letterSpacing: '.06em',
          }}
        >
          PENALTY CHALLENGE
        </div>
        <div
          style={{
            fontFamily: "'Barlow Condensed',sans-serif",
            fontWeight: 700,
            fontSize: 12,
            color: '#FFFFFF38',
            letterSpacing: '.14em',
          }}
        >
          GWADA BEER × WORLD CUP 2026
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 10,
          alignItems: 'center',
        }}
      >
        {[0, 1, 2].map((i) => {
          const s = shots[i];
          const active = !s && i === shots.length;
          return (
            <div
              key={i}
              style={{
                width: 58,
                height: 58,
                borderRadius: 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 26,
                border: `2px solid ${
                  s
                    ? s.isGoal
                      ? '#00C853'
                      : '#FF3D00'
                    : active
                    ? '#FFD700'
                    : '#FFFFFF18'
                }`,
                background: s
                  ? s.isGoal
                    ? '#00C85318'
                    : '#FF3D0018'
                  : '#FFFFFF05',
                boxShadow: s
                  ? s.isGoal
                    ? '0 0 16px #00C85448'
                    : '0 0 16px #FF3D0030'
                  : active
                  ? '0 0 18px #FFD70045'
                  : 'none',
                transition: 'all .3s ease',
              }}
            >
              {s ? (s.isGoal ? '⚽' : '❌') : active ? '🎯' : '●'}
            </div>
          );
        })}
        <div
          style={{
            marginLeft: 6,
            padding: '5px 11px',
            background: '#FFFFFF08',
            borderRadius: 9,
            border: `1px solid ${diffColors[shotIndex]}40`,
            textAlign: 'center',
            minWidth: 72,
          }}
        >
          <div
            style={{
              fontFamily: "'Barlow Condensed',sans-serif",
              fontSize: 10,
              color: '#FFFFFF40',
              letterSpacing: '.1em',
            }}
          >
            TIR {shotIndex + 1}/3
          </div>
          <div
            style={{
              fontFamily: "'Bebas Neue',sans-serif",
              fontSize: 14,
              color: diffColors[shotIndex],
              letterSpacing: '.05em',
            }}
          >
            {diffLabels[shotIndex]}
          </div>
        </div>
      </div>
      <div
        style={{
          background: 'linear-gradient(160deg,#091609,#040C04)',
          border: '1px solid #00C85322',
          borderRadius: 20,
          padding: '10px 10px 8px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            textAlign: 'center',
            marginBottom: 7,
            fontFamily: "'Bebas Neue',sans-serif",
            fontSize: 22,
            color: phase === 'aiming' ? cursorColor : '#FFFFFF30',
            letterSpacing: '.1em',
            textShadow: phase === 'aiming' ? `0 0 14px ${cursorColor}` : 'none',
            transition: 'color .08s,text-shadow .08s',
            minHeight: 28,
          }}
        >
          {phase === 'aiming'
            ? statusLabel
            : phase === 'shooting'
            ? 'EN VOL…'
            : ''}
        </div>
        <div style={{ position: 'relative', overflow: 'hidden' }}>
          <GoalSVG />
          {phase !== 'idle' && (
            <div
              style={{
                position: 'absolute',
                left: `${gkL}%`,
                width: `${gkR - gkL}%`,
                top: '36%',
                height: '30%',
                background:
                  'linear-gradient(180deg,#BF360C,#E64A19 45%,#BF360C)',
                borderRadius: '7px 7px 4px 4px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
                boxShadow:
                  '0 3px 18px rgba(0,0,0,.75),inset 0 1px 0 rgba(255,150,50,.3)',
                zIndex: 8,
                animation:
                  phase === 'aiming' ? 'keeperBob .75s ease infinite' : 'none',
                transition: 'left .06s linear,width .06s linear',
              }}
            >
              <span style={{ fontSize: 15, lineHeight: 1 }}>🧤</span>
              <span
                style={{
                  fontFamily: "'Bebas Neue',sans-serif",
                  fontSize: 9,
                  color: 'rgba(255,220,180,.8)',
                  letterSpacing: '.06em',
                }}
              >
                GK
              </span>
            </div>
          )}
          {phase === 'aiming' && (
            <div
              style={{
                position: 'absolute',
                left: `${cursorX}%`,
                top: '7%',
                height: '73%',
                width: 4,
                transform: 'translateX(-50%)',
                background: `linear-gradient(180deg,${cursorColor}88,${cursorColor})`,
                boxShadow: `0 0 10px ${cursorColor},0 0 22px ${cursorColor}80`,
                zIndex: 15,
                borderRadius: 2,
                animation: 'cursorPulse .35s ease infinite',
                transition: 'background .08s,box-shadow .08s',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  bottom: -8,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 0,
                  height: 0,
                  borderLeft: '7px solid transparent',
                  borderRight: '7px solid transparent',
                  borderTop: `9px solid ${cursorColor}`,
                  filter: `drop-shadow(0 0 4px ${cursorColor})`,
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: -6,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 0,
                  height: 0,
                  borderLeft: '5px solid transparent',
                  borderRight: '5px solid transparent',
                  borderBottom: `7px solid ${cursorColor}`,
                  filter: `drop-shadow(0 0 3px ${cursorColor})`,
                }}
              />
            </div>
          )}
          {phase === 'aiming' && wouldScore && (
            <div
              style={{
                position: 'absolute',
                left: `${Math.max(
                  GOAL_LEFT,
                  gkX < 50 ? gkX + KEEPER_HALF : GOAL_LEFT
                )}%`,
                width: `${
                  Math.min(
                    GOAL_RIGHT,
                    gkX < 50 ? GOAL_RIGHT : gkX - KEEPER_HALF
                  ) -
                  Math.max(GOAL_LEFT, gkX < 50 ? gkX + KEEPER_HALF : GOAL_LEFT)
                }%`,
                top: '7%',
                height: '73%',
                background: '#00C85308',
                borderLeft: gkX < 50 ? '1px dashed #00C85330' : 'none',
                borderRight: gkX >= 50 ? '1px dashed #00C85330' : 'none',
                zIndex: 5,
                pointerEvents: 'none',
                transition: 'all .1s',
              }}
            />
          )}
          {ball.visible && (
            <div
              style={{
                position: 'absolute',
                left: `${ball.x}%`,
                top: `${ball.y}%`,
                width: 34,
                height: 34,
                transform: 'translate(-50%,-50%)',
                fontSize: 28,
                lineHeight: '34px',
                textAlign: 'center',
                transition: ball.animating
                  ? 'left .55s cubic-bezier(.18,.88,.3,1),top .52s cubic-bezier(.2,.85,.3,1)'
                  : 'none',
                zIndex: 20,
                filter: 'drop-shadow(0 2px 8px rgba(0,0,0,.9))',
                userSelect: 'none',
              }}
            >
              ⚽
            </div>
          )}
          {flash && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: flash === 'goal' ? '#00C85322' : '#FF3D0022',
                borderRadius: 8,
                animation: 'flashGoal 1.1s ease forwards',
                zIndex: 25,
              }}
            >
              <span
                style={{
                  fontFamily: "'Bebas Neue',sans-serif",
                  fontSize: 72,
                  color: flash === 'goal' ? '#00C853' : '#FF3D00',
                  textShadow: `0 0 30px ${
                    flash === 'goal' ? '#00C853' : '#FF3D00'
                  }`,
                  letterSpacing: '.05em',
                }}
              >
                {flash === 'goal' ? 'GOAL !' : 'RATÉ !'}
              </span>
            </div>
          )}
        </div>
        <div
          style={{
            textAlign: 'center',
            marginTop: 7,
            fontFamily: "'Barlow Condensed',sans-serif",
            fontSize: 13,
            color: '#FFFFFF38',
            fontWeight: 600,
            letterSpacing: '.08em',
          }}
        >
          <span style={{ color: '#00C853' }}>
            {goals} but{goals !== 1 ? 's' : ''}
          </span>
          {' — '}
          {shots.length} tir{shots.length !== 1 ? 's' : ''} effectué
          {shots.length !== 1 ? 's' : ''}
        </div>
      </div>
      <button
        className="tap"
        onClick={onShoot}
        disabled={!canShoot}
        style={{
          width: '100%',
          padding: '22px',
          background: canShoot
            ? 'linear-gradient(135deg,#009E3F,#00C853,#009E3F)'
            : 'linear-gradient(135deg,#101810,#192019)',
          borderRadius: 16,
          color: canShoot ? '#FFF' : '#FFFFFF28',
          fontSize: 34,
          letterSpacing: '.12em',
          boxShadow: canShoot
            ? '0 0 42px #00C85445,0 5px 22px #00000066'
            : 'none',
        }}
      >
        {shots.length >= 3
          ? 'TERMINÉ !'
          : phase === 'shooting'
          ? 'EN VOL…'
          : `⚽ TIRER ! (${3 - shots.length})`}
      </button>
    </div>
  );
}

function ResultScreen({ prize, goals, code, onReplay }) {
  const [qrOk, setQrOk] = useState(false);
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
    code
  )}&ecc=H&margin=8`;
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        animation: 'bounceIn .7s ease both',
      }}
    >
      <div
        style={{
          background: prize.bg,
          border: `2px solid ${prize.color}44`,
          borderRadius: 22,
          padding: '28px 20px 22px',
          textAlign: 'center',
          boxShadow: `0 0 70px ${prize.glow},0 8px 32px #00000066`,
          animation: 'prizeReveal .85s cubic-bezier(.34,1.56,.64,1) both',
        }}
      >
        <div style={{ fontSize: 62, marginBottom: 10 }}>{prize.icon}</div>
        <div
          style={{
            fontFamily: "'Bebas Neue',sans-serif",
            fontSize: 52,
            color: prize.color,
            textShadow: `0 0 24px ${prize.color}99`,
            letterSpacing: '.06em',
            lineHeight: 0.95,
            marginBottom: 10,
          }}
        >
          {prize.label}
        </div>
        <div
          style={{
            fontFamily: "'Barlow Condensed',sans-serif",
            fontWeight: 700,
            fontSize: 20,
            color: '#FFF',
            letterSpacing: '.04em',
          }}
        >
          {prize.sub}
        </div>
        <div
          style={{
            marginTop: 18,
            display: 'flex',
            justifyContent: 'center',
            gap: 12,
            fontSize: 30,
          }}
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              style={{
                opacity: i < goals ? 1 : 0.15,
                transition: `opacity .3s ${i * 0.12}s`,
              }}
            >
              ⚽
            </span>
          ))}
        </div>
      </div>
      <div
        style={{
          background: '#070E07',
          border: '1px solid #00C85320',
          borderRadius: 20,
          padding: '20px 20px 16px',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontFamily: "'Barlow Condensed',sans-serif",
            fontWeight: 700,
            fontSize: 13,
            color: '#FFFFFF55',
            letterSpacing: '.14em',
            marginBottom: 14,
          }}
        >
          🎯 Montre ce QR code au barman
        </div>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#FFF',
            padding: 10,
            borderRadius: 14,
            boxShadow: '0 4px 28px #00000066',
            marginBottom: 16,
            minWidth: 180,
            minHeight: 180,
          }}
        >
          {!qrOk && (
            <div
              style={{
                width: 180,
                height: 180,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 11,
                color: '#999',
              }}
            >
              Chargement…
            </div>
          )}
          <img
            src={qrUrl}
            alt="QR Code"
            width={180}
            height={180}
            style={{
              display: qrOk ? 'block' : 'none',
              imageRendering: 'pixelated',
            }}
            onLoad={() => setQrOk(true)}
            onError={() => setQrOk(true)}
          />
        </div>
        <div
          style={{
            background: '#FFFFFF08',
            border: '1px solid #FFFFFF12',
            borderRadius: 10,
            padding: '10px 16px',
            marginBottom: 10,
          }}
        >
          <div
            style={{
              fontFamily: "'Barlow Condensed',sans-serif",
              fontSize: 10,
              color: '#FFFFFF35',
              letterSpacing: '.14em',
              marginBottom: 4,
            }}
          >
            CODE UNIQUE
          </div>
          <div
            style={{
              fontFamily: 'monospace',
              fontSize: 15,
              color: '#FFD700',
              letterSpacing: '.14em',
              fontWeight: 700,
            }}
          >
            {code}
          </div>
        </div>
        <p
          style={{
            fontFamily: "'Barlow Condensed',sans-serif",
            fontSize: 11,
            color: '#FFFFFF28',
            lineHeight: 1.5,
          }}
        >
          Code à usage unique • Valable aujourd'hui uniquement
        </p>
      </div>
      <button
        className="tap"
        onClick={onReplay}
        style={{
          width: '100%',
          padding: '16px',
          background: 'linear-gradient(135deg,#0B1B0B,#132113)',
          border: '1px solid #00C85325',
          borderRadius: 14,
          color: '#00C853',
          fontSize: 26,
          letterSpacing: '.1em',
        }}
      >
        ↺ REJOUER
      </button>
    </div>
  );
}

const BALL_START = { x: 50, y: 93, visible: false, animating: false };

export default function GwadaBeerChallenge() {
  const [screen, setScreen] = useState('intro');
  const [shots, setShots] = useState([]);
  const [phase, setPhase] = useState('idle');
  const [ball, setBall] = useState(BALL_START);
  const [flash, setFlash] = useState(null);
  const [cursorX, setCursorX] = useState(50);
  const [keeperX, setKeeperX] = useState(50);
  const [frozenKeeperX, setFrz] = useState(50);
  const [shotIndex, setShotIndex] = useState(0);
  const [code, setCode] = useState('');
  const [confetti, setConfetti] = useState(false);
  const animRef = useRef(null);
  const startTimeRef = useRef(null);
  const cursorXRef = useRef(50);
  const keeperXRef = useRef(50);
  const shotsRef = useRef([]);
  const shotIdxRef = useRef(0);
  const goals = shots.filter((s) => s.isGoal).length;
  const prize = PRIZES[goals] ?? PRIZES[0];
  useEffect(
    () => () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    },
    []
  );
  const startAiming = () => {
    if (animRef.current) cancelAnimationFrame(animRef.current);
    startTimeRef.current = null;
    const loop = (ts) => {
      if (!startTimeRef.current) startTimeRef.current = ts;
      const t = (ts - startTimeRef.current) / 1000;
      const si = shotIdxRef.current;
      const cx =
        50 + (CURSOR_AMP[si] ?? 60) * Math.sin(t * (CURSOR_SPEED[si] ?? 2.9));
      const kx =
        50 +
        (KEEPER_AMP[si] ?? 34) *
          Math.sin(t * (KEEPER_SPEED[si] ?? 2.1) + (KEEPER_PHASE[si] ?? 2.4));
      cursorXRef.current = cx;
      keeperXRef.current = kx;
      setCursorX(cx);
      setKeeperX(kx);
      animRef.current = requestAnimationFrame(loop);
    };
    animRef.current = requestAnimationFrame(loop);
  };
  const stopAiming = () => {
    if (animRef.current) {
      cancelAnimationFrame(animRef.current);
      animRef.current = null;
    }
  };
  const startGame = () => {
    stopAiming();
    shotsRef.current = [];
    shotIdxRef.current = 0;
    setShots([]);
    setShotIndex(0);
    setPhase('aiming');
    setBall(BALL_START);
    setFlash(null);
    setCursorX(50);
    setKeeperX(50);
    setCode('');
    setConfetti(false);
    setScreen('game');
    setTimeout(startAiming, 80);
  };
  const handleShoot = () => {
    if (phase !== 'aiming' || shotsRef.current.length >= 3) return;
    const cx = cursorXRef.current;
    const kx = keeperXRef.current;
    stopAiming();
    setFrz(kx);
    setPhase('shooting');
    const isInGoal = cx >= GOAL_LEFT && cx <= GOAL_RIGHT;
    const isBlocked = isInGoal && Math.abs(cx - kx) < KEEPER_HALF;
    const isGoal = isInGoal && !isBlocked;
    let tx, ty;
    if (isGoal) {
      tx = cx;
      ty = 42;
    } else if (isBlocked) {
      tx = kx;
      ty = 50;
    } else {
      tx = cx < 50 ? -22 : 122;
      ty = 48;
    }
    setBall({ x: 50, y: 93, visible: true, animating: false });
    setTimeout(
      () => setBall({ x: tx, y: ty, visible: true, animating: true }),
      65
    );
    setTimeout(() => setFlash(isGoal ? 'goal' : 'miss'), 700);
    setTimeout(() => {
      setFlash(null);
      setBall(BALL_START);
      const ns = [...shotsRef.current, { isGoal }];
      shotsRef.current = ns;
      setShots(ns);
      if (ns.length >= 3) {
        const fg = ns.filter((s) => s.isGoal).length;
        setCode(makeCode(fg));
        if (fg >= 2) setConfetti(true);
        setTimeout(() => setScreen('result'), 350);
      } else {
        const ni = ns.length;
        shotIdxRef.current = ni;
        setShotIndex(ni);
        startTimeRef.current = null;
        setPhase('aiming');
        startAiming();
      }
    }, 1640);
  };
  return (
    <>
      <style>{CSS}</style>
      {confetti && <Confetti />}
      <div
        style={{
          minHeight: '100vh',
          background: 'linear-gradient(155deg,#030803,#040C04,#050D05)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'fixed',
            inset: 0,
            pointerEvents: 'none',
            background:
              'radial-gradient(ellipse 55% 40% at 12% 12%,#00C85312,transparent),radial-gradient(ellipse 45% 30% at 88% 88%,#FFD70009,transparent)',
          }}
        />
        <div
          style={{
            width: '100%',
            maxWidth: 420,
            position: 'relative',
            zIndex: 1,
          }}
        >
          {screen === 'intro' && <IntroScreen onStart={startGame} />}
          {screen === 'game' && (
            <GameScreen
              shots={shots}
              phase={phase}
              ball={ball}
              flash={flash}
              goals={goals}
              cursorX={cursorX}
              keeperX={keeperX}
              frozenKeeperX={frozenKeeperX}
              shotIndex={shotIndex}
              onShoot={handleShoot}
            />
          )}
          {screen === 'result' && (
            <ResultScreen
              prize={prize}
              goals={goals}
              code={code}
              onReplay={startGame}
            />
          )}
        </div>
      </div>
    </>
  );
}
