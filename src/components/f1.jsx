import React, { useState, useEffect } from 'react';

export default function MagicalIntro({ onFinish }) {
  const [hatLanded, setHatLanded] = useState(false);
  const [hatFlipped, setHatFlipped] = useState(false);
  const [hatClickable, setHatClickable] = useState(false);
  const [showScrolls, setShowScrolls] = useState(false);
  const [scrollsDisappear, setScrollsDisappear] = useState(false);
  const [slideNumber, setSlideNumber] = useState(1);

  useEffect(() => {
    const landTimer = setTimeout(() => setHatLanded(true), 2500);
    const flipTimer = setTimeout(() => setHatFlipped(true), 2700);
    const scrollTimer = setTimeout(() => setShowScrolls(true), 3500);
    const clickableTimer = setTimeout(() => {
  setHatClickable(true);
}, 2800);

    return () => {
      clearTimeout(landTimer);
      clearTimeout(flipTimer);
      clearTimeout(scrollTimer);
      clearTimeout(clickableTimer);
    };
  }, []);

  const handleHatClick = () => {
  if (hatClickable && hatFlipped && !scrollsDisappear) {
    setScrollsDisappear(true);
    setTimeout(() => {
      setSlideNumber(2);
      if (onFinish) onFinish();
    }, 1000);
  }
};

  if (slideNumber === 2) {
  // Call onFinish to go to creepy slide
  if (onFinish) onFinish();
  return null; // Return null while transitioning
}

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
      background: 'linear-gradient(to bottom, #1e293b, #334155, #1e293b)',
    }}>
      {/* Animated Clouds - top 20% */}
      <div style={{
        position: 'absolute', top: 0, left: 0,
        width: '100%', height: '20%',
        overflow: 'hidden', zIndex: 10
      }}>
        <Cloud delay={0} speed={25} top="5%" />
        <Cloud delay={3} speed={30} top="2%" />
        <Cloud delay={6} speed={20} top="10%" />
        <Cloud delay={9} speed={28} top="4%" isDark={true} />
        <Cloud delay={12} speed={22} top="8%" />
        <Cloud delay={15} speed={26} top="12%" isDark={true} />
        <Cloud delay={18} speed={24} top="3%" />
        <Cloud delay={21} speed={27} top="9%" isDark={true} />
      </div>

      {/* Lightning */}
      <Lightning delay={0} leftPos="50%" />
      <Lightning delay={2} leftPos="30%" />
      <Lightning delay={3.5} leftPos="70%" />
      <Lightning delay={5} leftPos="20%" />
      <Lightning delay={6.5} leftPos="80%" />
      <Lightning delay={7} leftPos="45%" />
      <Lightning delay={9} leftPos="60%" />
      <Lightning delay={10.5} leftPos="15%" />
      <Lightning delay={11} leftPos="85%" />

      {/* Left Castle - anchored to bottom-left */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '28vw',
        height: '65vh',
        zIndex: 20,
        maxWidth: '420px',
      }}>
        <Castle side="left" />
      </div>

      {/* Right Castle - anchored to bottom-right */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: '28vw',
        height: '65vh',
        zIndex: 20,
        maxWidth: '420px',
      }}>
        <Castle side="right" />
      </div>

      {/* Magic Hat */}
      <div
        onClick={handleHatClick}
        style={{
          position: 'absolute',
          zIndex: 30,
          cursor: hatClickable ? 'pointer' : 'default',
          width: 'clamp(130px, 13vw, 220px)',
          height: 'clamp(130px, 13vw, 220px)',
          animation: hatLanded ? 'none' : 'swooshPath 2.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
          top: hatLanded ? '50%' : '-400px',
          left: hatLanded ? '50%' : '20%',
          transform: 'translate(-50%, -50%)',
          transition: hatLanded ? 'top 0.5s, left 0.5s' : 'none',
        }}
      >
        <div style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          transition: 'transform 0.7s',
          transform: hatFlipped ? 'rotateX(180deg)' : 'rotateX(0deg)',
          filter: hatFlipped ? 'drop-shadow(0 0 30px rgba(147, 51, 234, 0.8))' : 'none',
        }}>
          <MagicHat showSparkles={hatFlipped} />
        </div>
      </div>

      {/* Scrolls */}
      {hatClickable && !scrollsDisappear && (
  <div style={{
    position: 'absolute',
    bottom: '20%',
    left: '50%',
    transform: 'translateX(-50%)',
    color: '#f0c040',
    fontSize: 'clamp(20px, 3.2vw, 28px)',
    fontFamily: '"Cinzel Decorative", "Palatino Linotype", "Book Antiqua", serif',
    fontWeight: '400',
    letterSpacing: '0.08em',
    textShadow: '0 0 18px rgba(240, 192, 64, 0.55), 0 0 6px rgba(240, 192, 64, 0.3)',
    zIndex: 40,
    animation: 'pulseText 1.5s ease-in-out infinite',
    whiteSpace: 'nowrap',
    pointerEvents: 'none',
  }}>
    Tap on the Hat to Explore
  </div>
)}
      {showScrolls && !scrollsDisappear && (
        <>
          <ClosedScroll delay={0} position="far-left" />
          <ClosedScroll delay={0.1} position="left-2" />
          <ClosedScroll delay={0.2} position="left-1" />
          <ClosedScroll delay={0.3} position="center-left" />
          <ClosedScroll delay={0.4} position="center" />
          <ClosedScroll delay={0.5} position="center-right" />
          <ClosedScroll delay={0.6} position="right-1" />
          <ClosedScroll delay={0.7} position="right-2" />
          <ClosedScroll delay={0.8} position="far-right" />
          <ClosedScroll delay={0.9} position="top-center" />
        </>
      )}

      {showScrolls && scrollsDisappear && (
        <>
          <ClosedScrollDisappear delay={0} position="far-left" />
          <ClosedScrollDisappear delay={0.05} position="left-2" />
          <ClosedScrollDisappear delay={0.1} position="left-1" />
          <ClosedScrollDisappear delay={0.15} position="center-left" />
          <ClosedScrollDisappear delay={0.2} position="center" />
          <ClosedScrollDisappear delay={0.25} position="center-right" />
          <ClosedScrollDisappear delay={0.3} position="right-1" />
          <ClosedScrollDisappear delay={0.35} position="right-2" />
          <ClosedScrollDisappear delay={0.4} position="far-right" />
          <ClosedScrollDisappear delay={0.45} position="top-center" />
        </>
      )}

      <style>{`
      @keyframes pulseText {
  0%, 100% { opacity: 0.7; transform: translateX(-50%) scale(1); }
  50% { opacity: 1; transform: translateX(-50%) scale(1.05); }
}
        @keyframes swooshPath {
          0% {
            top: -400px;
            left: 20%;
            transform: translate(-50%, -50%) scale(0.6);
          }
          25% {
            top: 20%;
            left: 35%;
            transform: translate(-50%, -50%) scale(0.8);
          }
          50% {
            top: 35%;
            left: 55%;
            transform: translate(-50%, -50%) scale(1);
          }
          75% {
            top: 45%;
            left: 48%;
            transform: translate(-50%, -50%) scale(1.05);
          }
          100% {
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(1);
          }
        }

        @keyframes sparkle {
          0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
          50% { opacity: 1; transform: scale(1) rotate(180deg); }
        }

        @keyframes scrollUnfurl {
          0% { transform: translateY(0) scale(0.2) rotate(720deg); opacity: 0; }
          60% { transform: translateY(-50px) scale(1.15) rotate(-8deg); }
          100% { transform: translateY(-80px) scale(1) rotate(0deg); opacity: 1; }
        }

        @keyframes scrollDisappear {
          0% { transform: translateY(-80px) scale(1) rotate(0deg); opacity: 1; }
          50% { transform: translateY(-180px) scale(1.1) rotate(15deg); opacity: 0.8; }
          100% { transform: translateY(-300px) scale(0.3) rotate(360deg); opacity: 0; }
        }

        @keyframes lightning {
          0%, 10%, 20%, 100% { opacity: 0; }
          5%, 15% { opacity: 1; }
        }

        @keyframes drift {
          0% { transform: translateX(-150px); }
          100% { transform: translateX(100vw); }
        }
      `}</style>
    </div>
  );
}

function Cloud({ delay = 0, speed = 30, top = "10%", isDark = false }) {
  return (
    <div style={{
      position: 'absolute',
      top,
      animation: `drift ${speed}s linear infinite`,
      animationDelay: `${delay}s`,
    }}>
      <svg width="120" height="60" viewBox="0 0 120 60">
        <path
          d="M20,40 Q20,25 35,25 Q35,15 50,15 Q65,15 65,25 Q80,25 80,40 Q80,55 65,55 L35,55 Q20,55 20,40"
          fill={isDark ? "#475569" : "#64748b"}
          opacity="0.8"
        />
        {!isDark && (
          <path
            d="M25,42 Q25,30 37,30 Q37,22 48,22 Q60,22 60,30 Q72,30 72,42 Q72,52 60,52 L37,52 Q25,52 25,42"
            fill="#94a3b8"
            opacity="0.6"
          />
        )}
      </svg>
    </div>
  );
}

function Lightning({ delay = 0, leftPos = "50%" }) {
  return (
    <div style={{
      position: 'absolute',
      top: '5%',
      left: leftPos,
      transform: 'translateX(-50%)',
      animation: `lightning 6s ease-in-out infinite`,
      animationDelay: `${delay}s`,
      pointerEvents: 'none',
      zIndex: 15,
    }}>
      <svg width="40" height="120" viewBox="0 0 40 120">
        <path
          d="M20,0 L15,45 L25,45 L18,120 L30,50 L20,50 Z"
          fill="#fbbf24"
          stroke="#f59e0b"
          strokeWidth="1"
          opacity="0.9"
        />
      </svg>
    </div>
  );
}

function Castle({ side }) {
  return (
    <svg
      viewBox="0 0 400 600"
      style={{ width: '100%', height: '100%', filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.6))' }}
      preserveAspectRatio="xMidYMax meet"
    >
      <rect x="150" y="80" width="100" height="520" fill="#6b7280" />
      <rect x="155" y="85" width="90" height="510" fill="#4b5563" />
      <rect x="145" y="60" width="20" height="25" fill="#6b7280" />
      <rect x="170" y="60" width="20" height="25" fill="#6b7280" />
      <rect x="195" y="60" width="20" height="25" fill="#6b7280" />
      <rect x="220" y="60" width="20" height="25" fill="#6b7280" />
      <polygon points="150,60 200,20 250,60" fill="#4a4238" />
      <rect x="195" y="10" width="10" height="15" fill="#d97706" />
      <polygon points="200,0 195,10 205,10" fill="#fbbf24" />
      <rect x="50" y="180" width="90" height="420" fill="#6b7280" />
      <rect x="55" y="185" width="80" height="410" fill="#4b5563" />
      <rect x="45" y="165" width="18" height="20" fill="#6b7280" />
      <rect x="68" y="165" width="18" height="20" fill="#6b7280" />
      <rect x="91" y="165" width="18" height="20" fill="#6b7280" />
      <rect x="114" y="165" width="18" height="20" fill="#6b7280" />
      <polygon points="50,165 95,135 140,165" fill="#4a4238" />
      <rect x="260" y="180" width="90" height="420" fill="#6b7280" />
      <rect x="265" y="185" width="80" height="410" fill="#4b5563" />
      <rect x="258" y="165" width="18" height="20" fill="#6b7280" />
      <rect x="281" y="165" width="18" height="20" fill="#6b7280" />
      <rect x="304" y="165" width="18" height="20" fill="#6b7280" />
      <rect x="327" y="165" width="18" height="20" fill="#6b7280" />
      <polygon points="260,165 305,135 350,165" fill="#4a4238" />
      <line x1="150" y1="150" x2="250" y2="150" stroke="#9ca3af" strokeWidth="1.5" opacity="0.4" />
      <line x1="150" y1="220" x2="250" y2="220" stroke="#9ca3af" strokeWidth="1.5" opacity="0.4" />
      <line x1="150" y1="290" x2="250" y2="290" stroke="#9ca3af" strokeWidth="1.5" opacity="0.4" />
      <line x1="150" y1="360" x2="250" y2="360" stroke="#9ca3af" strokeWidth="1.5" opacity="0.4" />
      <line x1="150" y1="430" x2="250" y2="430" stroke="#9ca3af" strokeWidth="1.5" opacity="0.4" />
      <line x1="150" y1="500" x2="250" y2="500" stroke="#9ca3af" strokeWidth="1.5" opacity="0.4" />
      <line x1="50" y1="250" x2="140" y2="250" stroke="#9ca3af" strokeWidth="1.5" opacity="0.4" />
      <line x1="50" y1="330" x2="140" y2="330" stroke="#9ca3af" strokeWidth="1.5" opacity="0.4" />
      <line x1="50" y1="410" x2="140" y2="410" stroke="#9ca3af" strokeWidth="1.5" opacity="0.4" />
      <line x1="50" y1="490" x2="140" y2="490" stroke="#9ca3af" strokeWidth="1.5" opacity="0.4" />
      <line x1="260" y1="250" x2="350" y2="250" stroke="#9ca3af" strokeWidth="1.5" opacity="0.4" />
      <line x1="260" y1="330" x2="350" y2="330" stroke="#9ca3af" strokeWidth="1.5" opacity="0.4" />
      <line x1="260" y1="410" x2="350" y2="410" stroke="#9ca3af" strokeWidth="1.5" opacity="0.4" />
      <line x1="260" y1="490" x2="350" y2="490" stroke="#9ca3af" strokeWidth="1.5" opacity="0.4" />
      <rect x="170" y="120" width="20" height="35" fill="#1e293b" rx="10" />
      <rect x="210" y="120" width="20" height="35" fill="#1e293b" rx="10" />
      <rect x="170" y="200" width="20" height="35" fill="#1e293b" rx="10" />
      <rect x="210" y="200" width="20" height="35" fill="#1e293b" rx="10" />
      <rect x="170" y="280" width="20" height="35" fill="#1e293b" rx="10" />
      <rect x="210" y="280" width="20" height="35" fill="#1e293b" rx="10" />
      <rect x="170" y="360" width="20" height="35" fill="#1e293b" rx="10" />
      <rect x="210" y="360" width="20" height="35" fill="#1e293b" rx="10" />
      <rect x="170" y="440" width="20" height="35" fill="#1e293b" rx="10" />
      <rect x="210" y="440" width="20" height="35" fill="#1e293b" rx="10" />
      <rect x="70" y="230" width="18" height="30" fill="#1e293b" rx="9" />
      <rect x="102" y="230" width="18" height="30" fill="#1e293b" rx="9" />
      <rect x="70" y="310" width="18" height="30" fill="#1e293b" rx="9" />
      <rect x="102" y="310" width="18" height="30" fill="#1e293b" rx="9" />
      <rect x="70" y="390" width="18" height="30" fill="#1e293b" rx="9" />
      <rect x="102" y="390" width="18" height="30" fill="#1e293b" rx="9" />
      <rect x="70" y="470" width="18" height="30" fill="#1e293b" rx="9" />
      <rect x="102" y="470" width="18" height="30" fill="#1e293b" rx="9" />
      <rect x="280" y="230" width="18" height="30" fill="#1e293b" rx="9" />
      <rect x="312" y="230" width="18" height="30" fill="#1e293b" rx="9" />
      <rect x="280" y="310" width="18" height="30" fill="#1e293b" rx="9" />
      <rect x="312" y="310" width="18" height="30" fill="#1e293b" rx="9" />
      <rect x="280" y="390" width="18" height="30" fill="#1e293b" rx="9" />
      <rect x="312" y="390" width="18" height="30" fill="#1e293b" rx="9" />
      <rect x="280" y="470" width="18" height="30" fill="#1e293b" rx="9" />
      <rect x="312" y="470" width="18" height="30" fill="#1e293b" rx="9" />
      <path d="M 170,550 Q 170,520 200,520 Q 230,520 230,550 L 230,600 L 170,600 Z" fill="#422006" />
      <rect x="195" y="540" width="10" height="15" fill="#1e293b" />
      <circle cx="198" cy="560" r="3" fill="#d97706" />
      <circle cx="202" cy="560" r="3" fill="#d97706" />
      <line x1="175" y1="530" x2="175" y2="595" stroke="#1e293b" strokeWidth="2" />
      <line x1="185" y1="525" x2="185" y2="595" stroke="#1e293b" strokeWidth="2" />
      <line x1="200" y1="522" x2="200" y2="595" stroke="#1e293b" strokeWidth="2" />
      <line x1="215" y1="525" x2="215" y2="595" stroke="#1e293b" strokeWidth="2" />
      <line x1="225" y1="530" x2="225" y2="595" stroke="#1e293b" strokeWidth="2" />
      <path d="M 160,200 L 165,250" stroke="#374151" strokeWidth="1" opacity="0.3" />
      <path d="M 240,180 L 245,220" stroke="#374151" strokeWidth="1" opacity="0.3" />
      <path d="M 90,300 L 85,350" stroke="#374151" strokeWidth="1" opacity="0.3" />
      <path d="M 310,320 L 315,370" stroke="#374151" strokeWidth="1" opacity="0.3" />
    </svg>
  );
}

function MagicHat({ showSparkles }) {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <svg width="100%" height="100%" viewBox="0 0 200 200" preserveAspectRatio="xMidYMid meet">
        <ellipse cx="100" cy="140" rx="90" ry="20" fill="#581c87" />
        <ellipse cx="100" cy="140" rx="85" ry="18" fill="#6b21a8" />
        <rect x="30" y="130" width="140" height="15" fill="#d97706" rx="3" />
        <rect x="35" y="132" width="130" height="11" fill="#fbbf24" rx="2" />
        <path d="M 50,130 Q 70,50 100,30 Q 130,50 150,130 Z" fill="#6b21a8" />
        <path d="M 55,130 Q 73,55 100,37 Q 127,55 145,130 Z" fill="#7c3aed" />
        <rect x="85" y="125" width="30" height="20" fill="#d97706" rx="3" />
        <rect x="88" y="127" width="24" height="16" fill="#fbbf24" rx="2" />
        <rect x="92" y="130" width="16" height="10" fill="#6b21a8" rx="1" />
        <polygon points="100,25 103,32 110,33 104,38 106,45 100,41 94,45 96,38 90,33 97,32" fill="#fbbf24" />
      </svg>
      {showSparkles && (
        <>
          <Sparkle top="-10%" left="10%" delay={0} />
          <Sparkle top="-15%" left="40%" delay={0.2} />
          <Sparkle top="-12%" left="70%" delay={0.4} />
          <Sparkle top="20%" left="0%" delay={0.1} />
          <Sparkle top="20%" left="80%" delay={0.3} />
          <Sparkle top="40%" left="15%" delay={0.5} />
          <Sparkle top="40%" left="65%" delay={0.15} />
        </>
      )}
    </div>
  );
}

function Sparkle({ top, left, delay }) {
  return (
    <div style={{
      position: 'absolute', top, left,
      animation: `sparkle 1.5s ease-in-out infinite`,
      animationDelay: `${delay}s`,
      pointerEvents: 'none',
    }}>
      <svg width="20" height="20" viewBox="0 0 20 20">
        <polygon points="10,0 11,8 20,10 11,12 10,20 9,12 0,10 9,8" fill="#fbbf24" />
        <polygon points="10,2 10.5,8.5 18,10 10.5,11.5 10,18 9.5,11.5 2,10 9.5,8.5" fill="#fef3c7" />
      </svg>
    </div>
  );
}

function ClosedScroll({ delay, position }) {
  const positions = {
    'far-left':     { left: '20%', top: '50%' },
    'left-2':       { left: '28%', top: '45%' },
    'left-1':       { left: '36%', top: '52%' },
    'center-left':  { left: '42%', top: '48%' },
    'center':       { left: '50%', top: '55%' },
    'center-right': { left: '58%', top: '48%' },
    'right-1':      { left: '64%', top: '52%' },
    'right-2':      { left: '72%', top: '45%' },
    'far-right':    { left: '80%', top: '50%' },
    'top-center':   { left: '50%', top: '40%' },
  };
  const pos = positions[position];

  return (
    <div style={{
      position: 'absolute',
      left: pos.left,
      top: pos.top,
      transform: 'translate(-50%, -50%)',
      zIndex: 25,
      animation: `scrollUnfurl 1s ease-out forwards`,
      animationDelay: `${delay}s`,
    }}>
      <ScrollSVG />
    </div>
  );
}

function ClosedScrollDisappear({ delay, position }) {
  const positions = {
    'far-left':     { left: '20%', top: '50%' },
    'left-2':       { left: '28%', top: '45%' },
    'left-1':       { left: '36%', top: '52%' },
    'center-left':  { left: '42%', top: '48%' },
    'center':       { left: '50%', top: '55%' },
    'center-right': { left: '58%', top: '48%' },
    'right-1':      { left: '64%', top: '52%' },
    'right-2':      { left: '72%', top: '45%' },
    'far-right':    { left: '80%', top: '50%' },
    'top-center':   { left: '50%', top: '40%' },
  };
  const pos = positions[position];

  return (
    <div style={{
      position: 'absolute',
      left: pos.left,
      top: pos.top,
      transform: 'translate(-50%, -50%)',
      zIndex: 25,
      animation: `scrollDisappear 0.8s ease-in forwards`,
      animationDelay: `${delay}s`,
    }}>
      <ScrollSVG />
    </div>
  );
}

function ScrollSVG() {
  return (
    <svg width="80" height="100" viewBox="0 0 100 120">
      <ellipse cx="50" cy="20" rx="35" ry="12" fill="#b8935c" />
      <rect x="15" y="20" width="70" height="80" fill="#c19a6b" />
      <ellipse cx="50" cy="100" rx="35" ry="12" fill="#8b7355" />
      <ellipse cx="50" cy="20" rx="28" ry="9" fill="#d4a574" />
      <ellipse cx="50" cy="100" rx="28" ry="9" fill="#a0826d" />
      <ellipse cx="50" cy="35" rx="30" ry="8" fill="none" stroke="#a0826d" strokeWidth="1" opacity="0.3" />
      <ellipse cx="50" cy="50" rx="32" ry="9" fill="none" stroke="#a0826d" strokeWidth="1" opacity="0.3" />
      <ellipse cx="50" cy="65" rx="31" ry="8" fill="none" stroke="#a0826d" strokeWidth="1" opacity="0.3" />
      <ellipse cx="50" cy="80" rx="33" ry="9" fill="none" stroke="#a0826d" strokeWidth="1" opacity="0.3" />
      <circle cx="30" cy="45" r="5" fill="#8b7355" opacity="0.3" />
      <circle cx="65" cy="60" r="4" fill="#8b7355" opacity="0.25" />
      <circle cx="45" cy="75" r="6" fill="#8b7355" opacity="0.2" />
      <rect x="10" y="10" width="8" height="100" fill="#654321" rx="4" />
      <rect x="82" y="10" width="8" height="100" fill="#654321" rx="4" />
      <ellipse cx="14" cy="10" rx="4" ry="5" fill="#54321a" />
      <ellipse cx="86" cy="10" rx="4" ry="5" fill="#54321a" />
      <ellipse cx="14" cy="110" rx="4" ry="5" fill="#54321a" />
      <ellipse cx="86" cy="110" rx="4" ry="5" fill="#54321a" />
      <rect x="45" y="55" width="10" height="3" fill="#8b4513" opacity="0.7" />
      <path d="M 50,58 L 45,65 L 50,60 L 55,65 Z" fill="#8b4513" opacity="0.6" />
    </svg>
  );
}
