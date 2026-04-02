import React, { useState, useEffect, useRef } from 'react';

export default function CreepySlide({ onFinish }) {
  const [userName, setUserName] = useState('');
  const [error, setError] = useState('');
  const [titleVisible, setTitleVisible] = useState(false);
  const [subtitleVisible, setSubtitleVisible] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [lightningActive, setLightningActive] = useState(false);
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animFrameRef = useRef(null);

  useEffect(() => {
    const t1 = setTimeout(() => setTitleVisible(true), 400);
    const t2 = setTimeout(() => setSubtitleVisible(true), 1200);
    const t3 = setTimeout(() => setFormVisible(true), 2000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  useEffect(() => {
    const flash = () => {
      setLightningActive(true);
      setTimeout(() => setLightningActive(false), 120);
      setTimeout(() => {
        setLightningActive(true);
        setTimeout(() => setLightningActive(false), 80);
      }, 200);
    };
    const interval = setInterval(() => {
      if (Math.random() > 0.5) flash();
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#ffd700', '#ff6600', '#c0a0ff', '#00ccff', '#ff4444'];

    for (let i = 0; i < 80; i++) {
      particlesRef.current.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: -Math.random() * 0.8 - 0.2,
        r: Math.random() * 2.5 + 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random(),
        decay: Math.random() * 0.005 + 0.002,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particlesRef.current.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;
        if (p.alpha <= 0 || p.y < 0) {
          p.x = Math.random() * canvas.width;
          p.y = canvas.height + 10;
          p.alpha = 1;
          p.vy = -Math.random() * 0.8 - 0.2;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      animFrameRef.current = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);
    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleStart = () => {
    const trimmed = userName.trim();
    if (!trimmed) {
      setError('The Sorting Hat demands a name...');
      return;
    }
    if (trimmed.length < 2) {
      setError('Surely your name is longer than that, young wizard...');
      return;
    }
    onFinish && onFinish(trimmed);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleStart();
  };

  return (
    <div style={styles.wrapper}>
      {lightningActive && <div style={styles.lightning} />}

      <canvas ref={canvasRef} style={styles.canvas} />

      <div style={{ ...styles.fog, ...styles.fog1 }} />
      <div style={{ ...styles.fog, ...styles.fog2 }} />
      <div style={{ ...styles.fog, ...styles.fog3 }} />

      {/* Cobwebs corners only */}
      <div style={{ ...styles.cobweb, top: 0, left: 0 }}>🕸️</div>
      <div style={{ ...styles.cobweb, top: 0, right: 0, transform: 'scaleX(-1)' }}>🕸️</div>

      <div style={styles.content}>

        <div style={{
          ...styles.crest,
          opacity: titleVisible ? 1 : 0,
          transform: titleVisible ? 'scale(1)' : 'scale(0.4)',
        }}>
          ⚡
        </div>

        <h1 style={{
          ...styles.title,
          opacity: titleVisible ? 1 : 0,
          transform: titleVisible ? 'translateY(0)' : 'translateY(-30px)',
        }}>
          The Sorting Begins
        </h1>

        <p style={{
          ...styles.subtitle,
          opacity: subtitleVisible ? 1 : 0,
          transform: subtitleVisible ? 'translateY(0)' : 'translateY(20px)',
        }}>
          The ancient magic stirs within these walls.<br />
          <span style={styles.accent}>Dare you reveal your name to the Hat?</span>
        </p>

        <div style={{
          ...styles.formBox,
          opacity: formVisible ? 1 : 0,
          transform: formVisible ? 'translateY(0)' : 'translateY(30px)',
        }}>

          <div style={styles.runeRow}>
            {['ᚠ','ᚢ','ᚦ','ᚨ','ᚱ','ᚲ','ᚷ','ᚹ','ᚺ','ᚾ'].map((r, i) => (
              <span key={i} style={{ ...styles.rune, animationDelay: `${i * 0.15}s` }}>{r}</span>
            ))}
          </div>

          <p style={styles.formPrompt}>
            Speak your name, young wizard...
          </p>

          <div style={styles.inputWrap}>
            <input
              type="text"
              value={userName}
              onChange={(e) => { setUserName(e.target.value); setError(''); }}
              onKeyDown={handleKeyDown}
              placeholder="Your name, if you dare..."
              style={styles.input}
              maxLength={30}
              autoFocus
            />
          </div>

          {error && <p style={styles.error}>{error}</p>}

          <button
            onClick={handleStart}
            style={styles.btn}
            onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.04)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
          >
            <span style={styles.btnText}>Enter the Realm</span>
          </button>

          <p style={styles.warning}>
            * The Sorting Hat sees all. There is no turning back. *
          </p>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700&family=Crimson+Text:ital,wght@0,400;0,600;1,400&display=swap');

        @keyframes fogDrift {
          0%,100% { transform: translate(0,0) scale(1); }
          33%     { transform: translate(60px,-30px) scale(1.1); }
          66%     { transform: translate(-40px,20px) scale(0.95); }
        }
        @keyframes crestPulse {
          0%,100% { text-shadow: 0 0 20px #ffd700, 0 0 40px #ff8800; filter: drop-shadow(0 0 10px #ffd700); }
          50%     { text-shadow: 0 0 40px #ffd700, 0 0 80px #ff4400; filter: drop-shadow(0 0 30px #ff8800); }
        }
        @keyframes runeGlow {
          0%,100% { opacity: 0.3; }
          50%     { opacity: 1; color: #ffd700; }
        }
        @keyframes titleReveal {
  from { letter-spacing: 0.6em; opacity: 0; }
  to   { letter-spacing: 0.35em; opacity: 1; }
}
        @keyframes btnPulse {
          0%,100% { box-shadow: 0 0 15px rgba(139,0,0,0.5), inset 0 0 15px rgba(0,0,0,0.3); }
          50%     { box-shadow: 0 0 40px rgba(180,0,0,0.8), 0 0 70px rgba(255,80,0,0.25), inset 0 0 20px rgba(0,0,0,0.4); }
        }
        @keyframes inputGlow {
          0%,100% { border-color: rgba(200,160,50,0.3); }
          50%     { border-color: rgba(200,160,50,0.85); box-shadow: 0 0 14px rgba(200,160,50,0.25); }
        }
      `}</style>
    </div>
  );
}

const styles = {
  wrapper: {
    position: 'fixed',
    top: 0, left: 0,
    width: '100vw',
    height: '100vh',
    background: 'radial-gradient(ellipse at 50% 0%, #1a0a2e 0%, #0a0510 40%, #000000 100%)',
    overflow: 'hidden',
    fontFamily: "'Crimson Text', Georgia, serif",
    zIndex: 9999,
  },
  lightning: {
    position: 'absolute',
    inset: 0,
    background: 'rgba(180,180,255,0.06)',
    zIndex: 50,
    pointerEvents: 'none',
  },
  canvas: {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
    zIndex: 1,
  },
  fog: {
    position: 'absolute',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(100,80,180,0.07), transparent 70%)',
    filter: 'blur(40px)',
    pointerEvents: 'none',
    zIndex: 2,
    animation: 'fogDrift 20s ease-in-out infinite',
  },
  fog1: { width: 600, height: 600, top: '-10%', left: '-15%', animationDelay: '0s' },
  fog2: { width: 500, height: 500, bottom: '0%', right: '-10%', animationDelay: '7s' },
  fog3: { width: 400, height: 400, top: '40%', left: '30%', animationDelay: '14s' },
  cobweb: {
    position: 'absolute',
    fontSize: 140,
    opacity: 0.22,
    zIndex: 3,
    pointerEvents: 'none',
  },
  content: {
    position: 'relative',
    zIndex: 10,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: '40px 20px',
    textAlign: 'center',
  },
  crest: {
    fontSize: 70,
    marginBottom: 10,
    transition: 'opacity 0.9s ease, transform 0.9s ease',
    animation: 'crestPulse 3s ease-in-out infinite',
    display: 'block',
  },
  title: {
    fontFamily: "'Cinzel Decorative', serif",
    fontSize: 'clamp(1.8rem, 4.5vw, 3.2rem)',
    color: '#d4af37',
    margin: '0 0 10px',
    letterSpacing: '0.20em',
    textShadow: '0 0 20px rgba(212,175,55,0.6), 0 2px 10px rgba(0,0,0,0.9)',
    transition: 'opacity 0.9s ease, transform 0.9s ease',
    animation: 'titleReveal 1.2s ease forwards',
  },
  subtitle: {
    fontFamily: "'Crimson Text', serif",
    fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
    color: 'rgba(220,200,180,0.82)',
    lineHeight: 1.75,
    maxWidth: 500,
    margin: '0 auto 32px',
    transition: 'opacity 0.9s ease, transform 0.9s ease',
  },
  accent: {
    color: '#c8a050',
    fontStyle: 'italic',
    fontWeight: 600,
  },
  formBox: {
    background: 'linear-gradient(145deg, rgba(18,6,38,0.94), rgba(8,3,18,0.97))',
    border: '1px solid rgba(212,175,55,0.3)',
    borderRadius: 18,
    padding: 'clamp(22px, 5vw, 38px)',
    maxWidth: 460,
    width: '90%',
    boxShadow: '0 0 80px rgba(80,0,180,0.12), 0 20px 70px rgba(0,0,0,0.7)',
    transition: 'opacity 0.9s ease, transform 0.9s ease',
  },
  runeRow: {
    display: 'flex',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 18,
  },
  rune: {
    color: '#c8a050',
    fontSize: 15,
    animation: 'runeGlow 3s ease-in-out infinite',
    opacity: 0.35,
  },
  formPrompt: {
    fontFamily: "'Crimson Text', serif",
    fontSize: '1.1rem',
    color: 'rgba(220,200,180,0.88)',
    fontStyle: 'italic',
    margin: '0 0 18px',
  },
  inputWrap: {
    marginBottom: 14,
  },
  input: {
    width: '100%',
    padding: '13px 18px',
    background: 'rgba(0,0,0,0.55)',
    border: '1px solid rgba(200,160,50,0.35)',
    borderRadius: 10,
    color: '#f0e6cc',
    fontSize: '1.05rem',
    fontFamily: "'Crimson Text', serif",
    letterSpacing: '0.03em',
    outline: 'none',
    boxSizing: 'border-box',
    animation: 'inputGlow 2.5s ease-in-out infinite',
  },
  error: {
    color: '#ff6060',
    fontSize: '0.9rem',
    fontStyle: 'italic',
    margin: '0 0 12px',
  },
  btn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    padding: '13px 24px',
    background: 'linear-gradient(135deg, #3d0000, #7a0000, #5c0000)',
    border: '1px solid rgba(212,175,55,0.45)',
    borderRadius: 50,
    cursor: 'pointer',
    marginTop: 8,
    animation: 'btnPulse 2.5s ease-in-out infinite',
    transition: 'transform 0.15s ease',
  },
  btnText: {
    fontFamily: "'Cinzel Decorative', serif",
    fontSize: '0.95rem',
    color: '#f0e6cc',
    letterSpacing: '0.05em',
  },
  warning: {
    fontFamily: "'Crimson Text', serif",
    fontSize: '0.82rem',
    color: 'rgba(180,140,100,0.45)',
    fontStyle: 'italic',
    marginTop: 18,
    marginBottom: 0,
  },
};
