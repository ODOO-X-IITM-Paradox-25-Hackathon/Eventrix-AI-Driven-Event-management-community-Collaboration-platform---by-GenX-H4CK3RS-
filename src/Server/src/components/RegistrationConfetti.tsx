
import React, { useState, useEffect } from "react";

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  rotation: number;
}

const COLORS = ["#9b87f5", "#d6bcfa", "#6e59a5", "#7e69ab", "#4c1d95"];
const CONFETTI_COUNT = 100;

const RegistrationConfetti: React.FC = () => {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Generate confetti pieces
    const newPieces = Array.from({ length: CONFETTI_COUNT }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: -20 - Math.random() * 80, // Start above the viewport
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      size: 5 + Math.random() * 10,
      rotation: Math.random() * 360,
    }));

    setPieces(newPieces);

    // Hide confetti after animation
    const timer = setTimeout(() => {
      setVisible(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className="absolute animate-confetti"
          style={{
            left: `${piece.x}%`,
            top: `${piece.y}%`,
            width: `${piece.size}px`,
            height: `${piece.size * 0.4}px`,
            backgroundColor: piece.color,
            transform: `rotate(${piece.rotation}deg)`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${3 + Math.random() * 2}s`,
          }}
        />
      ))}
      <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white bg-opacity-90 rounded-lg p-6 shadow-lg text-center animate-fade-in">
        <h2 className="text-2xl font-bold text-eventrix mb-2">
          You're already registered!
        </h2>
        <p className="text-gray-700">
          You've successfully registered for this event.
        </p>
      </div>
    </div>
  );
};

export default RegistrationConfetti;
