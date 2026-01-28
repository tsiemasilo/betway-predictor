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
      className={`fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-b from-[#0a0a1a] via-[#1a0a2e] to-[#0a0a1a] transition-all duration-800 ${
        fadeOut ? "opacity-0 scale-110" : "opacity-100 scale-100"
      }`}
      data-testid="splash-screen"
    >
      <div className={`flex flex-col items-center transition-transform duration-500 ${fadeOut ? "scale-95" : "scale-100"}`}>
        <img
          src={clTrophy}
          alt="UEFA Champions League"
          className="w-80 h-80 md:w-96 md:h-96 object-contain"
        />
        <div className={`mt-6 transition-all duration-500 ${fadeOut ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"}`}>
          <h1 className="text-2xl md:text-3xl font-black text-center bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent tracking-wider animate-pulse">
            UCL MATCH PREDICTOR
          </h1>
          <p className="text-center text-purple-300/50 mt-2 text-sm tracking-widest">
            POWERED BY MONTE CARLO SIMULATION
          </p>
        </div>
      </div>
    </div>
  );
}
