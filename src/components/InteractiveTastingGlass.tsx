import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'motion/react';
import { Sparkles, RefreshCw, GlassWater, Flame, Plus, Minus } from 'lucide-react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
}

export default function InteractiveTastingGlass() {
  const [wineStyle, setWineStyle] = useState<'ruby' | 'gold' | 'rose' | 'logo'>('logo');
  const [fillLevel, setFillLevel] = useState<number>(65); // percentage 0 - 100
  const [isSwirling, setIsSwirling] = useState(false);
  const [glowMode, setGlowMode] = useState(true);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState<Particle[]>([]);
  const [sipMessage, setSipMessage] = useState<string>('');

  // Control slosh path based on swirl state and mouse hover tilt
  const getLiquidPath = () => {
    // Liquid curves inside the bowl
    // The bowl center is roughly y=120, bottom y=210
    const baseHeight = 210 - (fillLevel / 100) * 110; // y goes from 210 (empty) to 100 (full)
    
    if (fillLevel === 0) return '';

    const amplitude = isSwirling ? 12 : 3;
    const wave1 = Math.sin(Date.now() / 200) * amplitude;
    const wave2 = Math.cos(Date.now() / 250) * amplitude;

    // Control liquid curvature to match glass shape
    return `M 38 ${baseHeight + wave1} 
            Q 50 ${baseHeight - 5 + wave2} 62 ${baseHeight + wave1} 
            Q 67 ${baseHeight + 15} 67 170 
            Q 67 210 50 215 
            Q 33 210 33 170 
            Q 33 125 38 ${baseHeight + wave1} Z`;
  };

  // Generate elegant rising micro-bubbles inside the glowing wine
  useEffect(() => {
    if (fillLevel === 0) {
      setParticles([]);
      return;
    }
    const newParticles = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      x: 38 + Math.random() * 24, // restrict to glass width
      y: 110 + Math.random() * 90,
      size: 1.5 + Math.random() * 2.5,
      delay: Math.random() * 2,
      duration: 3 + Math.random() * 4,
    }));
    setParticles(newParticles);
  }, [fillLevel, wineStyle]);

  // Handle continuous physics frame update for sloshing
  const [, setFrame] = useState(0);
  useEffect(() => {
    let animationFrameId: number;
    const update = () => {
      setFrame((prev) => prev + 1);
      animationFrameId = requestAnimationFrame(update);
    };
    animationFrameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const triggerSwirl = () => {
    if (isSwirling) return;
    setIsSwirling(true);
    setTimeout(() => setIsSwirling(false), 2200);
  };

  const handlePour = () => {
    if (fillLevel >= 100) {
      setSipMessage("The glass is perfectly filled with luxury reserve.");
      return;
    }
    setSipMessage("Pouring curated vintage...");
    const interval = setInterval(() => {
      setFillLevel((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setSipMessage("Perfect pour complete.");
          return 100;
        }
        return prev + 5;
      });
    }, 60);
    triggerSwirl();
  };

  const handleSip = () => {
    if (fillLevel <= 0) {
      setSipMessage("The glass is empty. Request another pour.");
      return;
    }
    setSipMessage("Savoring dynamic terroir notes...");
    const interval = setInterval(() => {
      setFillLevel((prev) => {
        if (prev <= 0) {
          clearInterval(interval);
          setSipMessage("An elegant finish.");
          return 0;
        }
        return prev - 5;
      });
    }, 60);
  };

  // Get color configurations
  const getColors = () => {
    switch (wineStyle) {
      case 'logo':
        return {
          glow: 'rgba(212, 175, 55, 0.75)', // radiant luxury brand gold glow
          liquidGrad: 'url(#logoGoldGrad)',
          topGrad: 'url(#logoGoldTop)',
          accentText: 'text-[#D4AF37]',
          label: 'The Wine Spot Liquid Gold',
          desc: 'Our trademark golden nectar, matching our brand identity.'
        };
      case 'ruby':
        return {
          glow: 'rgba(153, 27, 27, 0.6)', // deep ruby red glow
          liquidGrad: 'url(#rubyWineGrad)',
          topGrad: 'url(#rubyWineTop)',
          accentText: 'text-red-500',
          label: 'Reserve Pinotage',
          desc: 'Curated deep berry crimson'
        };
      case 'gold':
        return {
          glow: 'rgba(212, 175, 55, 0.6)', // warm honey gold
          liquidGrad: 'url(#goldWineGrad)',
          topGrad: 'url(#goldWineTop)',
          accentText: 'text-[#D4AF37]',
          label: 'Heritage Chenin Blanc',
          desc: 'Sun-kissed honeyed mineral glow'
        };
      case 'rose':
        return {
          glow: 'rgba(225, 120, 150, 0.6)', // rose gold
          liquidGrad: 'url(#roseWineGrad)',
          topGrad: 'url(#roseWineTop)',
          accentText: 'text-pink-400',
          label: 'Summer Sunset Cap Classique',
          desc: 'Delicate floral blush petal'
        };
    }
  };

  const colorConfig = getColors();

  // Mouse moves create 3D tilt perspective
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setRotation({ x: x * 15, y: y * -15 });
  };

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
  };

  return (
    <div id="interactive-tasting-glass" className="editorial-double-border shadow-md rounded-none w-full bg-white relative flex flex-col md:flex-row gap-6 p-4 md:p-6 transition-all duration-300">
      <div className="absolute inset-0.5 editorial-double-border-inner pointer-events-none" />
      
      {/* 3D Glass Showcase Screen */}
      <div 
        className="relative flex-1 min-h-[320px] bg-neutral-950 border border-neutral-900 overflow-hidden flex items-center justify-center p-4 cursor-grab active:cursor-grabbing group"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={triggerSwirl}
      >
        {/* Glow Halo Layer */}
        {glowMode && fillLevel > 0 && (
          <motion.div 
            className="absolute w-44 h-44 rounded-full blur-[64px]"
            style={{ 
              backgroundColor: colorConfig.glow,
              top: '30%',
              left: '30%',
            }}
            animate={{
              scale: isSwirling ? [1, 1.2, 1] : [1, 1.05, 0.95, 1],
              opacity: isSwirling ? [0.6, 0.8, 0.6] : [0.5, 0.6, 0.5]
            }}
            transition={{
              duration: isSwirling ? 2.2 : 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}

        {/* Floating Ambient Text Grid */}
        <div className="absolute top-4 left-4 z-10 font-mono text-[8px] uppercase tracking-widest text-neutral-500 space-y-1">
          <div>MODEL: WINE_POT_GLASS_3D</div>
          <div>ESTATE: HERITAGE_SHOWCASE</div>
          <div className="text-[#D4AF37]">LEVEL: {fillLevel}%</div>
        </div>

        <div className="absolute top-4 right-4 z-10 font-mono text-[8px] uppercase tracking-widest text-neutral-500 text-right space-y-1">
          <div>SLOSH_SLIP: {isSwirling ? "ACTIVE" : "STANDBY"}</div>
          <div>SWIVEL: {rotation.x.toFixed(1)}° / {rotation.y.toFixed(1)}°</div>
        </div>

        {/* 3D-Tilt Frame */}
        <motion.div
          style={{
            transformStyle: 'preserve-3d',
            perspective: 800,
          }}
          animate={{
            rotateY: rotation.x,
            rotateX: rotation.y,
            rotateZ: isSwirling ? [0, 4, -4, 3, -2, 0] : 0,
            scale: isSwirling ? 1.03 : 1
          }}
          transition={isSwirling ? { duration: 2.2, ease: "easeInOut" } : { type: 'spring', stiffness: 120, damping: 20 }}
          className="relative w-48 h-72 flex items-center justify-center"
        >
          {/* Main SVG Render Engine */}
          <svg viewBox="0 0 100 280" className="w-full h-full drop-shadow-[0_8px_24px_rgba(0,0,0,0.5)]">
            <defs>
              {/* Brand Logo Liquid Gold Gradients */}
              <linearGradient id="logoGoldGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#fbf8eb" stopOpacity="0.85" />
                <stop offset="45%" stopColor="#D4AF37" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#8a6f27" stopOpacity="1" />
              </linearGradient>
              <linearGradient id="logoGoldTop" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
                <stop offset="50%" stopColor="#f5edcc" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.9" />
              </linearGradient>

              {/* Ruby Wine Gradients */}
              <linearGradient id="rubyWineGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
                <stop offset="40%" stopColor="#991b1b" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#450a0a" stopOpacity="1" />
              </linearGradient>
              <linearGradient id="rubyWineTop" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f87171" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#dc2626" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#991b1b" stopOpacity="0.8" />
              </linearGradient>

              {/* Gold Wine Gradients */}
              <linearGradient id="goldWineGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.8" />
                <stop offset="40%" stopColor="#d97706" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#78350f" stopOpacity="1" />
              </linearGradient>
              <linearGradient id="goldWineTop" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#fef08a" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#eab308" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#ca8a04" stopOpacity="0.8" />
              </linearGradient>

              {/* Rose Wine Gradients */}
              <linearGradient id="roseWineGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#f472b6" stopOpacity="0.8" />
                <stop offset="40%" stopColor="#db2777" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#831843" stopOpacity="1" />
              </linearGradient>
              <linearGradient id="roseWineTop" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#fbcfe8" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#ec4899" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#db2777" stopOpacity="0.8" />
              </linearGradient>

              {/* Glass Rim Reflection */}
              <linearGradient id="glassRim" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.5" />
                <stop offset="30%" stopColor="#D4AF37" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#ffffff" stopOpacity="0.9" />
                <stop offset="70%" stopColor="#D4AF37" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0.5" />
              </linearGradient>

              {/* Glass Stem Shader */}
              <linearGradient id="stemShader" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.1" />
                <stop offset="50%" stopColor="#ffffff" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#000000" stopOpacity="0.4" />
              </linearGradient>
            </defs>

            {/* Behind reflection card to sell depth */}
            <rect x="25" y="60" width="50" height="160" fill="url(#glassRim)" opacity="0.03" rx="10" />

            {/* Liquid Fill Element */}
            {fillLevel > 0 && (
              <g>
                <path 
                  d={getLiquidPath()} 
                  fill={colorConfig.liquidGrad}
                  className="transition-all duration-300"
                />
                
                {/* Liquid Surface Top Oval to sell 3D cylinder depth */}
                <ellipse 
                  cx="50" 
                  cy={210 - (fillLevel / 100) * 110} 
                  rx={12 + (fillLevel / 100) * 15} 
                  ry="4" 
                  fill={colorConfig.topGrad}
                  className="transition-all duration-300"
                />
              </g>
            )}

            {/* Sparkles / Bubbles rising */}
            {fillLevel > 0 && particles.map((p) => (
              <circle
                key={p.id}
                cx={p.x}
                cy={p.y}
                r={p.size}
                fill="#ffffff"
                opacity={0.3 + Math.random() * 0.4}
                className="transition-all duration-300 animate-pulse"
              />
            ))}

            {/* Glass Wireframe Geometry */}
            {/* Lip / Rim of the Glass */}
            <ellipse cx="50" cy="90" rx="12" ry="3.5" fill="none" stroke="url(#glassRim)" strokeWidth="0.8" />

            {/* Glass Bowl Body */}
            <path 
              d="M 38 90 C 38 135 33 170 33 170 C 33 210 50 215 50 215 C 50 215 67 210 67 170 C 67 170 62 135 62 90" 
              fill="none" 
              stroke="url(#glassRim)" 
              strokeWidth="0.8" 
              strokeOpacity="0.55"
            />

            {/* Stem */}
            <line x1="50" y1="215" x2="50" y2="255" stroke="url(#glassRim)" strokeWidth="2.5" />
            <line x1="50" y1="215" x2="50" y2="255" stroke="url(#stemShader)" strokeWidth="1" />

            {/* Base */}
            <ellipse cx="50" cy="255" rx="20" ry="4" fill="none" stroke="url(#glassRim)" strokeWidth="1.2" />
            <ellipse cx="50" cy="255" rx="15" ry="2.5" fill="none" stroke="url(#glassRim)" strokeWidth="0.6" strokeOpacity="0.5" />

            {/* Highlights and Glass Reflections (Overlay) */}
            <path 
              d="M 36 100 Q 35 150 36 180" 
              fill="none" 
              stroke="#ffffff" 
              strokeWidth="1.2" 
              strokeLinecap="round" 
              opacity="0.25" 
            />
            <path 
              d="M 64 110 Q 65 140 64 170" 
              fill="none" 
              stroke="#ffffff" 
              strokeWidth="0.6" 
              strokeLinecap="round" 
              opacity="0.15" 
            />
          </svg>
        </motion.div>

        {/* Swirl Sparkle Helper Icon Overlay on Hover */}
        <div className="absolute bottom-4 left-4 z-10 flex items-center gap-1.5 text-[9px] font-mono tracking-widest text-[#D4AF37]/80 bg-neutral-900/90 border border-[#D4AF37]/30 px-2 py-1 rounded-none select-none opacity-80 group-hover:opacity-100 transition-opacity">
          <RefreshCw className={`w-3 h-3 ${isSwirling ? 'animate-spin' : ''}`} />
          <span>{isSwirling ? "SWIRLING..." : "CLICK TO SWIRL"}</span>
        </div>
      </div>

      {/* Control Deck (Aesthetic Editorial Deck) */}
      <div className="flex-1 flex flex-col justify-between">
        <div className="space-y-4">
          <div>
            <span className="text-[9px] font-mono tracking-widest uppercase text-gray-400 font-semibold">interactive laboratory</span>
            <h4 className="font-serif text-xl font-medium text-[#1A1A1A] mt-1">3D Sommelier Chamber</h4>
            <p className="text-xs text-gray-500 font-light mt-1">
              Visualize the glowing body, viscosity, and color intensity of our master flights using real-time liquid physics.
            </p>
          </div>

          {/* Color Selection Swatches */}
          <div className="space-y-2">
            <span className="block text-[8px] font-mono tracking-widest uppercase text-gray-400 font-semibold">Select Flight Profile</span>
            <div className="grid grid-cols-4 gap-1.5">
              <button 
                onClick={() => { setWineStyle('logo'); triggerSwirl(); }}
                className={`py-2 px-1 text-left border flex flex-col justify-between transition-all duration-300 rounded-none ${
                  wineStyle === 'logo' ? 'border-[#D4AF37] bg-amber-50/50' : 'border-gray-200 bg-[#FDFBF7] hover:border-gray-300'
                }`}
              >
                <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-[#8a6f27] to-[#fbf8eb] border border-[#D4AF37] shadow-inner animate-pulse" />
                <span className="block text-[9px] font-bold text-gray-800 tracking-tight mt-1">TWS Gold</span>
              </button>

              <button 
                onClick={() => { setWineStyle('ruby'); triggerSwirl(); }}
                className={`py-2 px-1 text-left border flex flex-col justify-between transition-all duration-300 rounded-none ${
                  wineStyle === 'ruby' ? 'border-[#991b1b] bg-[#fef2f2]' : 'border-gray-200 bg-[#FDFBF7] hover:border-gray-300'
                }`}
              >
                <div className="w-3.5 h-3.5 rounded-full bg-red-800 border border-red-950 shadow-inner" />
                <span className="block text-[9px] font-bold text-gray-800 tracking-tight mt-1">Pinotage</span>
              </button>

              <button 
                onClick={() => { setWineStyle('gold'); triggerSwirl(); }}
                className={`py-2 px-1 text-left border flex flex-col justify-between transition-all duration-300 rounded-none ${
                  wineStyle === 'gold' ? 'border-[#ca8a04] bg-[#fef9c3]' : 'border-gray-200 bg-[#FDFBF7] hover:border-gray-300'
                }`}
              >
                <div className="w-3.5 h-3.5 rounded-full bg-amber-500 border border-amber-600 shadow-inner" />
                <span className="block text-[9px] font-bold text-gray-800 tracking-tight mt-1">Chenin</span>
              </button>

              <button 
                onClick={() => { setWineStyle('rose'); triggerSwirl(); }}
                className={`py-2 px-1 text-left border flex flex-col justify-between transition-all duration-300 rounded-none ${
                  wineStyle === 'rose' ? 'border-[#db2777] bg-[#fce7f3]' : 'border-gray-200 bg-[#FDFBF7] hover:border-gray-300'
                }`}
              >
                <div className="w-3.5 h-3.5 rounded-full bg-pink-500 border border-pink-600 shadow-inner" />
                <span className="block text-[9px] font-bold text-gray-800 tracking-tight mt-1">Rose Blush</span>
              </button>
            </div>
          </div>

          {/* Interactive Sliders */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[8px] font-mono tracking-widest uppercase text-gray-400 font-semibold">Tasting Pour Depth</span>
              <span className="text-xs font-serif font-semibold text-[#D4AF37] font-mono">{fillLevel}%</span>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setFillLevel(prev => Math.max(0, prev - 10))}
                className="w-8 h-8 flex items-center justify-center bg-[#FDFBF7] border border-gray-200 text-gray-600 hover:bg-[#1A1A1A] hover:text-[#FDFBF7] transition-all"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={fillLevel}
                onChange={(e) => setFillLevel(Number(e.target.value))}
                className="flex-1 h-1 bg-gray-200 appearance-none cursor-pointer accent-[#D4AF37]"
              />
              <button 
                onClick={() => setFillLevel(prev => Math.min(100, prev + 10))}
                className="w-8 h-8 flex items-center justify-center bg-[#FDFBF7] border border-gray-200 text-gray-600 hover:bg-[#1A1A1A] hover:text-[#FDFBF7] transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Status logs */}
          <div className="bg-[#FDFBF7] border border-[#E5E5E5] p-3 text-center min-h-[48px] flex items-center justify-center">
            {sipMessage ? (
              <span className="text-[11px] font-mono text-gray-700 uppercase tracking-widest">{sipMessage}</span>
            ) : (
              <span className="text-[11px] text-gray-400 italic">Select an action below to begin sensory study.</span>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-gray-100">
          <button 
            onClick={handlePour}
            className="bg-[#1A1A1A] hover:bg-[#D4AF37] text-[#FDFBF7] py-2.5 px-4 text-[10px] uppercase font-bold tracking-[0.15em] transition-all duration-300 flex items-center justify-center gap-2"
          >
            <GlassWater className="w-3.5 h-3.5" />
            <span>Pour Vintage</span>
          </button>
          
          <button 
            onClick={handleSip}
            className="bg-white hover:bg-[#1A1A1A] text-[#1A1A1A] hover:text-white border border-[#1A1A1A] py-2.5 px-4 text-[10px] uppercase font-bold tracking-[0.15em] transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Sip & Analyze</span>
          </button>
        </div>

        {/* Glow Halo Toggle */}
        <div className="flex items-center justify-between mt-4">
          <span className="text-[9px] font-mono tracking-widest uppercase text-gray-400">Radiant Cellar Backlight</span>
          <button 
            onClick={() => setGlowMode(!glowMode)}
            className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-all duration-300 ${
              glowMode ? 'bg-[#D4AF37]' : 'bg-gray-200'
            }`}
          >
            <div className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform duration-300 ${
              glowMode ? 'translate-x-5' : 'translate-x-0'
            }`} />
          </button>
        </div>
      </div>
    </div>
  );
}
