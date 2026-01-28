import { useEffect, useState } from "react";
import clTrophy from "@/assets/cl-trophy.gif";

interface SplashScreenProps {
  onComplete: () => void;
  duration?: number;
}

export function SplashScreen({ onComplete, duration = 4000 }: SplashScreenProps) {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, duration - 800);

    const completeTimer = setTimeout(() => {
      onComplete();
    }, duration);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [duration, onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-[#0a0014] transition-all duration-800 ${
        fadeOut ? "opacity-0 scale-110" : "opacity-100 scale-100"
      }`}
      data-testid="splash-screen"
    >
      <div className={`flex flex-col items-center transition-transform duration-500 ${fadeOut ? "scale-95" : "scale-100"}`}>
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-[#0a0014] pointer-events-none" />
          <img
            src={clTrophy}
            alt="UEFA Champions League"
            className="w-[90vw] h-[60vh] md:w-[70vw] md:h-[70vh] object-contain mix-blend-lighten"
            style={{ 
              filter: 'brightness(1.1) contrast(1.05)',
              background: 'transparent'
            }}
          />
        </div>
        <div className={`mt-2 transition-all duration-500 ${fadeOut ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"}`}>
          <h1 className="text-3xl md:text-5xl font-black text-center bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent tracking-wider animate-pulse">
            UCL MATCH PREDICTOR
          </h1>
          <p className="text-center text-purple-300/50 mt-3 text-sm md:text-base tracking-widest">
            POWERED BY MONTE CARLO SIMULATION
          </p>
        </div>
      </div>
    </div>
  );
}
