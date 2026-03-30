import React, { useState, useEffect } from 'react';

export default function MagicalIntro() {
  const [hatLanded, setHatLanded] = useState(false);
  const [hatFlipped, setHatFlipped] = useState(false);
  const [showScrolls, setShowScrolls] = useState(false);
  const [scrollsDisappear, setScrollsDisappear] = useState(false);
  const [slideNumber, setSlideNumber] = useState(1);

  useEffect(() => {
    // Hat lands after 2.5 seconds
    const landTimer = setTimeout(() => setHatLanded(true), 2500);
    // Hat flips after landing
    const flipTimer = setTimeout(() => setHatFlipped(true), 2700);
    // Scrolls appear after flip
    const scrollTimer = setTimeout(() => setShowScrolls(true), 3500);
    // Scrolls disappear
    const disappearTimer = setTimeout(() => setScrollsDisappear(true), 6000);
    
    return () => {
      clearTimeout(landTimer);
      clearTimeout(flipTimer);
      clearTimeout(scrollTimer);
      clearTimeout(disappearTimer);
    };
  }, []);

  const handleHatClick = () => {
    if (hatFlipped && !scrollsDisappear) {
      setScrollsDisappear(true);
      setTimeout(() => {
        setSlideNumber(2);
      }, 1000);
    }
  };

  if (slideNumber === 2) {
    return (
      <div className="w-full h-screen bg-gradient-to-b from-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white text-4xl font-bold">
          Slide 2 - Ready for your next design!
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-gradient-to-b from-slate-800 via-slate-700 to-slate-900 overflow-hidden relative">
      {/* Animated Clouds */}
      <div className="absolute top-0 left-0 w-full h-1/3 overflow-hidden">
        <Cloud delay={0} speed={25} top="10%" />
        <Cloud delay={3} speed={30} top="5%" />
        <Cloud delay={6} speed={20} top="15%" />
        <Cloud delay={9} speed={28} top="8%" isDark={true} />
        <Cloud delay={12} speed={22} top="12%" />
        <Cloud delay={15} speed={26} top="18%" isDark={true} />
        <Cloud delay={18} speed={24} top="6%" />
        <Cloud delay={21} speed={27} top="14%" isDark={true} />
      </div>

      {/* Thunder Lightning - More frequent and scattered */}
      <Lightning />
      <Lightning delay={2} leftPos="30%" />
      <Lightning delay={3.5} leftPos="70%" />
      <Lightning delay={5} leftPos="20%" />
      <Lightning delay={6.5} leftPos="80%" />
      <Lightning delay={7} leftPos="45%" />
      <Lightning delay={9} leftPos="60%" />
      <Lightning delay={10.5} leftPos="15%" />
      <Lightning delay={11} leftPos="85%" />

      {/* Left Castle */}
      <div className="absolute bottom-0 left-0 w-1/3">
        <Castle side="left" />
      </div>

      {/* Right Castle */}
      <div className="absolute bottom-0 right-0 w-1/3">
        <Castle side="right" />
      </div>

      {/* Magic Hat with animations */}
      <div
        className={`absolute cursor-pointer transition-all ${
          hatLanded ? 'duration-500' : 'duration-0'
        }`}
        style={{
          animation: hatLanded ? 'none' : 'swooshPath 2.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
          top: hatLanded ? '50%' : '-400px',
          left: hatLanded ? '50%' : '20%',
          transform: hatLanded 
            ? 'translate(-50%, -50%)' 
            : 'translate(-50%, -50%)',
        }}
        onClick={handleHatClick}
      >
        <div
  className="relative transition-transform duration-700"
  style={{
    transform: hatFlipped ? 'rotateX(180deg)' : 'rotateX(0deg)',
    transformStyle: 'preserve-3d',
    filter: hatFlipped ? 'drop-shadow(0 0 30px rgba(147, 51, 234, 0.8))' : 'none',
  }}
>
          <MagicHat showSparkles={hatFlipped} />
        </div>
      </div>

      {/* Scrolls appearing from hat */}
      {showScrolls && !scrollsDisappear && (
        <>
          {showScrolls &&
  [...Array(10)].map((_, i) => (
    <FlyingScroll
      key={i}
      delay={i * 0.12}
      xOffset={Math.random() * 300 - 150}
      rotate={Math.random() * 60 - 30}
      scale={0.8 + Math.random() * 0.5}
      duration={2 + Math.random()}
    />
  ))}
        </>
      )}

      {showScrolls && scrollsDisappear && (
        <>
          {showScrolls &&
  [...Array(10)].map((_, i) => (
    <FlyingScroll
      key={i}
      delay={i * 0.12}
      xOffset={Math.random() * 300 - 150}
      rotate={Math.random() * 60 - 30}
      scale={0.8 + Math.random() * 0.5}
      duration={2 + Math.random()}
    />
  ))}
     

      <style jsx>{`
      @keyframes flyToSky {
  0% {
    transform: translate(-50%, 0) scale(0.3);
    opacity: 0;
  }
  20% {
    opacity: 1;
  }
  100% {
    transform: translate(
      calc(-50% + var(--xOffset)),
      -500px
    ) rotate(var(--rotate)) scale(var(--scale));
    opacity: 0;
  }
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
          0%, 100% {
            opacity: 0;
            transform: scale(0) rotate(0deg);
          }
          50% {
            opacity: 1;
            transform: scale(1) rotate(180deg);
          }
        }

        @keyframes scrollUnfurl {
          0% {
            transform: translateY(-80px) scale(0.2) rotate(720deg);
            opacity: 0;
          }
          60% {
            transform: translateY(0) scale(1.15) rotate(-8deg);
          }
          100% {
            transform: translateY(0) scale(1) rotate(0deg);
            opacity: 1;
          }
        }

        @keyframes scrollDisappear {
          0% {
            transform: translateY(0) scale(1) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(-100px) scale(0) rotate(360deg);
            opacity: 0;
          }
        }

        @keyframes lightning {
          0%, 10%, 20%, 100% {
            opacity: 0;
          }
          5%, 15% {
            opacity: 1;
          }
        }

        @keyframes drift {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100vw);
          }
        }
      `}</style>
    </div>
  );
}

// Cloud Component
function Cloud({ delay = 0, speed = 30, top = "10%", isDark = false }) {
  return (
    <div
      className="absolute"
      style={{
        top,
        animation: `drift ${speed}s linear infinite`,
        animationDelay: `${delay}s`,
      }}
    >
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

// Lightning Component
function Lightning({ delay = 0, leftPos = "50%" }) {
  return (
    <div
      className="absolute top-10 pointer-events-none"
      style={{
        left: leftPos,
        transform: 'translateX(-50%)',
        animation: `lightning 6s ease-in-out infinite`,
        animationDelay: `${delay}s`,
      }}
    >
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

// Castle Component
function Castle({ side }) {
  const isLeft = side === 'left';
  
  return (
    <svg
      viewBox="0 0 400 600"
      className="w-full h-auto"
      style={{ filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.6))' }}
    >
      {/* Central keep - tallest tower */}
      <rect x="150" y="80" width="100" height="520" fill="#6b7280" />
      <rect x="155" y="85" width="90" height="510" fill="#4b5563" />
      
      {/* Battlements on main tower */}
      <rect x="145" y="60" width="20" height="25" fill="#6b7280" />
      <rect x="170" y="60" width="20" height="25" fill="#6b7280" />
      <rect x="195" y="60" width="20" height="25" fill="#6b7280" />
      <rect x="220" y="60" width="20" height="25" fill="#6b7280" />
      
      {/* Main tower roof */}
      <polygon points="150,60 200,20 250,60" fill="#4a4238" />
      <rect x="195" y="10" width="10" height="15" fill="#d97706" />
      <polygon points="200,0 195,10 205,10" fill="#fbbf24" />
      
      {/* Left tower */}
      <rect x="50" y="180" width="90" height="420" fill="#6b7280" />
      <rect x="55" y="185" width="80" height="410" fill="#4b5563" />
      
      {/* Left tower battlements */}
      <rect x="45" y="165" width="18" height="20" fill="#6b7280" />
      <rect x="68" y="165" width="18" height="20" fill="#6b7280" />
      <rect x="91" y="165" width="18" height="20" fill="#6b7280" />
      <rect x="114" y="165" width="18" height="20" fill="#6b7280" />
      
      {/* Left tower roof */}
      <polygon points="50,165 95,135 140,165" fill="#4a4238" />
      
      {/* Right tower */}
      <rect x="260" y="180" width="90" height="420" fill="#6b7280" />
      <rect x="265" y="185" width="80" height="410" fill="#4b5563" />
      
      {/* Right tower battlements */}
      <rect x="258" y="165" width="18" height="20" fill="#6b7280" />
      <rect x="281" y="165" width="18" height="20" fill="#6b7280" />
      <rect x="304" y="165" width="18" height="20" fill="#6b7280" />
      <rect x="327" y="165" width="18" height="20" fill="#6b7280" />
      
      {/* Right tower roof */}
      <polygon points="260,165 305,135 350,165" fill="#4a4238" />
      
      {/* Stone texture - horizontal lines */}
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
      
      {/* Windows - main tower */}
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
      
      {/* Windows - left tower */}
      <rect x="70" y="230" width="18" height="30" fill="#1e293b" rx="9" />
      <rect x="102" y="230" width="18" height="30" fill="#1e293b" rx="9" />
      
      <rect x="70" y="310" width="18" height="30" fill="#1e293b" rx="9" />
      <rect x="102" y="310" width="18" height="30" fill="#1e293b" rx="9" />
      
      <rect x="70" y="390" width="18" height="30" fill="#1e293b" rx="9" />
      <rect x="102" y="390" width="18" height="30" fill="#1e293b" rx="9" />
      
      <rect x="70" y="470" width="18" height="30" fill="#1e293b" rx="9" />
      <rect x="102" y="470" width="18" height="30" fill="#1e293b" rx="9" />
      
      {/* Windows - right tower */}
      <rect x="280" y="230" width="18" height="30" fill="#1e293b" rx="9" />
      <rect x="312" y="230" width="18" height="30" fill="#1e293b" rx="9" />
      
      <rect x="280" y="310" width="18" height="30" fill="#1e293b" rx="9" />
      <rect x="312" y="310" width="18" height="30" fill="#1e293b" rx="9" />
      
      <rect x="280" y="390" width="18" height="30" fill="#1e293b" rx="9" />
      <rect x="312" y="390" width="18" height="30" fill="#1e293b" rx="9" />
      
      <rect x="280" y="470" width="18" height="30" fill="#1e293b" rx="9" />
      <rect x="312" y="470" width="18" height="30" fill="#1e293b" rx="9" />
      
      {/* Main gate */}
      <path
        d="M 170,550 Q 170,520 200,520 Q 230,520 230,550 L 230,600 L 170,600 Z"
        fill="#422006"
      />
      
      {/* Gate details */}
      <rect x="195" y="540" width="10" height="15" fill="#1e293b" />
      <circle cx="198" cy="560" r="3" fill="#d97706" />
      <circle cx="202" cy="560" r="3" fill="#d97706" />
      
      {/* Portcullis lines */}
      <line x1="175" y1="530" x2="175" y2="595" stroke="#1e293b" strokeWidth="2" />
      <line x1="185" y1="525" x2="185" y2="595" stroke="#1e293b" strokeWidth="2" />
      <line x1="200" y1="522" x2="200" y2="595" stroke="#1e293b" strokeWidth="2" />
      <line x1="215" y1="525" x2="215" y2="595" stroke="#1e293b" strokeWidth="2" />
      <line x1="225" y1="530" x2="225" y2="595" stroke="#1e293b" strokeWidth="2" />
      
      {/* Weathering and cracks */}
      <path d="M 160,200 L 165,250" stroke="#374151" strokeWidth="1" opacity="0.3" />
      <path d="M 240,180 L 245,220" stroke="#374151" strokeWidth="1" opacity="0.3" />
      <path d="M 90,300 L 85,350" stroke="#374151" strokeWidth="1" opacity="0.3" />
      <path d="M 310,320 L 315,370" stroke="#374151" strokeWidth="1" opacity="0.3" />
    </svg>
  );
}

// Magic Hat Component
function MagicHat({ showSparkles }) {
  return (
    <div className="relative">
      <svg width="200" height="200" viewBox="0 0 200 200">
        {/* Hat brim */}
        <ellipse cx="100" cy="140" rx="90" ry="20" fill="#581c87" />
        <ellipse cx="100" cy="140" rx="85" ry="18" fill="#6b21a8" />
        
        {/* Gold band */}
        <rect x="30" y="130" width="140" height="15" fill="#d97706" rx="3" />
        <rect x="35" y="132" width="130" height="11" fill="#fbbf24" rx="2" />
        
        {/* Hat cone */}
        <path
          d="M 50,130 Q 70,50 100,30 Q 130,50 150,130 Z"
          fill="#6b21a8"
        />
        <path
          d="M 55,130 Q 73,55 100,37 Q 127,55 145,130 Z"
          fill="#7c3aed"
        />
        
        {/* Gold buckle */}
        <rect x="85" y="125" width="30" height="20" fill="#d97706" rx="3" />
        <rect x="88" y="127" width="24" height="16" fill="#fbbf24" rx="2" />
        <rect x="92" y="130" width="16" height="10" fill="#6b21a8" rx="1" />
        
        {/* Hat tip star */}
        <polygon
          points="100,25 103,32 110,33 104,38 106,45 100,41 94,45 96,38 90,33 97,32"
          fill="#fbbf24"
        />
      </svg>

      {/* Sparkles */}
      {showSparkles && (
        <>
          <Sparkle top="-20px" left="20px" delay={0} />
          <Sparkle top="-30px" left="80px" delay={0.2} />
          <Sparkle top="-25px" left="140px" delay={0.4} />
          <Sparkle top="40px" left="0px" delay={0.1} />
          <Sparkle top="40px" left="160px" delay={0.3} />
          <Sparkle top="80px" left="30px" delay={0.5} />
          <Sparkle top="80px" left="130px" delay={0.15} />
        </>
      )}
    </div>
  );
}

// Sparkle Component
function Sparkle({ top, left, delay }) {
  return (
    <div
      className="absolute pointer-events-none"
      style={{
        top,
        left,
        animation: `sparkle 1.5s ease-in-out infinite`,
        animationDelay: `${delay}s`,
      }}
    >
      <svg width="20" height="20" viewBox="0 0 20 20">
        <polygon
          points="10,0 11,8 20,10 11,12 10,20 9,12 0,10 9,8"
          fill="#fbbf24"
        />
        <polygon
          points="10,2 10.5,8.5 18,10 10.5,11.5 10,18 9.5,11.5 2,10 9.5,8.5"
          fill="#fef3c7"
        />
      </svg>
    </div>
  );
}
function FlyingScroll({
  delay,
  xOffset,
  rotate,
  scale,
  duration,
}) {
  return (
    <div
      className="absolute left-1/2 top-[45%] pointer-events-none"
      style={{
        animation: `flyToSky ${duration}s ease-out forwards`,
        animationDelay: `${delay}s`,
        "--xOffset": `${xOffset}px`,
        "--rotate": `${rotate}deg`,
        "--scale": scale,
      }}
    >
      <div
        style={{
          transform: `translateX(${xOffset}px) rotate(${rotate}deg) scale(${scale})`,
        }}
      >
        <svg width="120" height="80" viewBox="0 0 140 100">
          <rect
            x="20"
            y="25"
            width="100"
            height="50"
            rx="8"
            fill="#d6b98c"
            stroke="#8b7355"
            strokeWidth="2"
          />

          <circle cx="20" cy="50" r="15" fill="#b8935c" />
          <circle cx="20" cy="50" r="8" fill="#8b7355" />

          <circle cx="120" cy="50" r="15" fill="#b8935c" />
          <circle cx="120" cy="50" r="8" fill="#8b7355" />

          <rect x="65" y="20" width="10" height="60" fill="#7c2d12" rx="2" />
        </svg>
      </div>
    </div>
  );
}
// Closed Scroll Component (rolled up)
function ClosedScroll({ delay, position }) {
  const positions = {
    left: "left-1/4",
    center: "left-1/2 -translate-x-1/2",
    right: "right-1/4",
  };

  return (
    <div
      className={`absolute top-1/2 ${positions[position]}`}
      style={{
        animation: `scrollUnfurl 1s ease-out forwards`,
        animationDelay: `${delay}s`,
      }}
    >
      <svg width="140" height="100" viewBox="0 0 140 100">
        {/* Main parchment */}
        <rect
          x="20"
          y="25"
          width="100"
          height="50"
          rx="8"
          fill="#d6b98c"
          stroke="#8b7355"
          strokeWidth="2"
        />

        {/* Top rolled edge */}
        <circle cx="20" cy="50" r="15" fill="#b8935c" />
        <circle cx="20" cy="50" r="8" fill="#8b7355" />

        {/* Bottom rolled edge */}
        <circle cx="120" cy="50" r="15" fill="#b8935c" />
        <circle cx="120" cy="50" r="8" fill="#8b7355" />

        {/* Ribbon tie */}
        <rect x="65" y="20" width="10" height="60" fill="#7c2d12" rx="2" />
        <path
          d="M70 80 L64 92 L70 86 L76 92 Z"
          fill="#7c2d12"
        />

        {/* Ancient texture lines */}
        <line x1="35" y1="38" x2="105" y2="38" stroke="#8b7355" opacity="0.3" />
        <line x1="35" y1="50" x2="95" y2="50" stroke="#8b7355" opacity="0.3" />
        <line x1="35" y1="62" x2="100" y2="62" stroke="#8b7355" opacity="0.3" />
      </svg>
    </div>
  );
}

// Disappearing Closed Scroll Component
function ClosedScrollDisappear({ delay, position }) {
  const positions = {
    left: "left-1/4",
    center: "left-1/2 -translate-x-1/2",
    right: "right-1/4",
  };

  return (
    <div
      className={`absolute top-1/2 ${positions[position]}`}
      style={{
        animation: `scrollDisappear 0.8s ease-in forwards`,
        animationDelay: `${delay}s`,
      }}
    >
      <svg width="140" height="100" viewBox="0 0 140 100">
        <rect
          x="20"
          y="25"
          width="100"
          height="50"
          rx="8"
          fill="#d6b98c"
          stroke="#8b7355"
          strokeWidth="2"
        />

        <circle cx="20" cy="50" r="15" fill="#b8935c" />
        <circle cx="20" cy="50" r="8" fill="#8b7355" />

        <circle cx="120" cy="50" r="15" fill="#b8935c" />
        <circle cx="120" cy="50" r="8" fill="#8b7355" />

        <rect x="65" y="20" width="10" height="60" fill="#7c2d12" rx="2" />
        <path
          d="M70 80 L64 92 L70 86 L76 92 Z"
          fill="#7c2d12"
        />
      </svg>
    </div>
  );
}