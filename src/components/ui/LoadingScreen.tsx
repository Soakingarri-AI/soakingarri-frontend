import React, { useEffect, useState } from "react";

interface LoadingScreenProps {
  /** Called when the exit animation has fully finished */
  onDone: () => void;
  /** Total visible duration in ms before the exit animation starts (default 2400) */
  duration?: number;
}

// Floating particle positions (deterministic so no layout shift)
const PARTICLES = [
  { top: "18%", left: "12%", size: 6, delay: "0s", color: "#F59E0B" },
  { top: "72%", left: "8%", size: 4, delay: "0.4s", color: "#10B981" },
  { top: "30%", left: "88%", size: 5, delay: "0.8s", color: "#DBFCFF" },
  { top: "65%", left: "82%", size: 7, delay: "0.2s", color: "#F59E0B" },
  { top: "50%", left: "5%", size: 3, delay: "1s", color: "#10B981" },
  { top: "10%", left: "55%", size: 4, delay: "0.6s", color: "#DBFCFF" },
  { top: "85%", left: "50%", size: 5, delay: "0.3s", color: "#F59E0B" },
  { top: "20%", left: "75%", size: 3, delay: "0.9s", color: "#10B981" },
];

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  onDone,
  duration = 2400,
}) => {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    // Start exit animation before calling onDone
    const exitTimer = setTimeout(() => setExiting(true), duration);
    const doneTimer = setTimeout(() => onDone(), duration + 650);
    return () => {
      clearTimeout(exitTimer);
      clearTimeout(doneTimer);
    };
  }, [duration, onDone]);

  return (
    <div
      className={exiting ? "loading-screen-exit" : "loading-screen-enter"}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        overflow: "hidden",
      }}
    >
      {/* Background image */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "url(/loadingbg.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Dark overlay for readability */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(160deg, rgba(1,0,0,0.55) 0%, rgba(15,23,42,0.70) 100%)",
        }}
      />

      {/* Floating particles */}
      {PARTICLES.map((p, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: p.top,
            left: p.left,
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            background: p.color,
            boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
            animationName: "particle-float",
            animationDuration: `${2.6 + i * 0.3}s`,
            animationDelay: p.delay,
            animationTimingFunction: "ease-in-out",
            animationIterationCount: "infinite",
          }}
        />
      ))}

      {/* Centre card */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 0,
        }}
      >
        {/* Pulse ring behind logo */}
        <div
          className="loading-ring"
          style={{
            position: "absolute",
            width: 160,
            height: 160,
            borderRadius: "50%",
            border: "2px solid rgba(245,158,11,0.35)",
            pointerEvents: "none",
          }}
        />

        {/* Logo */}
        <div
          className="loading-logo"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
          }}
        >
          <img
            src="/webapplogo.png"
            alt="SoakinGarri AI"
            style={{
              width: 90,
              height: 90,
              objectFit: "contain",
              filter: "drop-shadow(0 0 18px rgba(245,158,11,0.55))",
            }}
          />

          {/* Brand name */}
          <div style={{ textAlign: "center" }}>
            <p
              style={{
                fontFamily: "'Sora', system-ui, sans-serif",
                fontWeight: 800,
                fontSize: 22,
                letterSpacing: "0.12em",
                color: "#F59E0B",
                textShadow: "0 0 24px rgba(245,158,11,0.6)",
                margin: 0,
              }}
            >
              SOAKINGARRI AI
            </p>
          </div>
        </div>

        {/* Tagline */}
        <p
          className="loading-tagline"
          style={{
            fontFamily: "'Inter', system-ui, sans-serif",
            fontSize: 13,
            color: "rgba(219,252,255,0.65)",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            marginTop: 12,
            marginBottom: 36,
          }}
        >
          The Knowledge Starship
        </p>

        {/* Progress bar track */}
        <div
          style={{
            width: 220,
            height: 3,
            borderRadius: 99,
            background: "rgba(255,255,255,0.1)",
            overflow: "hidden",
          }}
        >
          <div
            className="loading-bar"
            style={{ height: "100%", borderRadius: 99 }}
          />
        </div>
      </div>
    </div>
  );
};
