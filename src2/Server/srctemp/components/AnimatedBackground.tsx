
import React from "react";

const AnimatedBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 opacity-90"></div>
      
      {/* Floating Shapes */}
      <div className="absolute inset-0">
        {/* Large floating circles */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full opacity-30 animate-bounce"></div>
        <div className="absolute bottom-32 left-32 w-20 h-20 bg-gradient-to-r from-green-400 to-teal-400 rounded-full opacity-25 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-28 h-28 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full opacity-20 animate-bounce"></div>
        
        {/* Wave animations */}
        <div className="absolute inset-0">
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="wave1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.1"/>
                <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.3"/>
              </linearGradient>
              <linearGradient id="wave2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.2"/>
                <stop offset="100%" stopColor="#10B981" stopOpacity="0.1"/>
              </linearGradient>
            </defs>
            
            <path 
              d="M0,400 C300,200 600,600 1200,300 L1200,800 L0,800 Z" 
              fill="url(#wave1)"
              className="animate-pulse"
            >
              <animateTransform
                attributeName="transform"
                type="translate"
                values="0,0;50,0;0,0"
                dur="8s"
                repeatCount="indefinite"
              />
            </path>
            
            <path 
              d="M0,600 C400,300 800,700 1200,400 L1200,800 L0,800 Z" 
              fill="url(#wave2)"
              className="animate-pulse"
            >
              <animateTransform
                attributeName="transform"
                type="translate"
                values="0,0;-30,0;0,0"
                dur="6s"
                repeatCount="indefinite"
              />
            </path>
          </svg>
        </div>
        
        {/* Geometric shapes */}
        <div className="absolute top-20 left-1/4 w-16 h-16 border-2 border-purple-400 opacity-30 rotate-45 animate-spin" style={{animationDuration: "20s"}}></div>
        <div className="absolute bottom-40 right-1/3 w-12 h-12 border-2 border-blue-400 opacity-40 rotate-12 animate-pulse"></div>
        <div className="absolute top-1/2 left-20 w-8 h-8 bg-gradient-to-r from-pink-400 to-purple-400 opacity-50 transform rotate-45 animate-bounce"></div>
        
        {/* Particle effect */}
        <div className="absolute inset-0">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full opacity-30 animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            ></div>
          ))}
        </div>
      </div>
      
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black opacity-20"></div>
    </div>
  );
};

export default AnimatedBackground;
