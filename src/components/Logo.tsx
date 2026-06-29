import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'circle' | 'transparent' | 'minimal';
  size?: number | string;
}

export default function Logo({ className = '', variant = 'circle', size = '100%' }: LogoProps) {
  return (
    <svg 
      id="the-wine-spot-logo"
      viewBox="0 0 500 500" 
      width={size} 
      height={size} 
      className={`select-none ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Elegant premium gold gradient used for the logo lines and fills */}
        <linearGradient id="goldLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f5edcc" />
          <stop offset="45%" stopColor="#D4AF37" />
          <stop offset="70%" stopColor="#C5A028" />
          <stop offset="100%" stopColor="#8a6f27" />
        </linearGradient>

        {/* Liquid reflection gradient */}
        <linearGradient id="wineGoldLiquid" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#8a6f27" />
          <stop offset="60%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#fbf8eb" />
        </linearGradient>
      </defs>

      {/* Dark background circle variant */}
      {variant === 'circle' && (
        <circle cx="250" cy="250" r="240" fill="#000000" />
      )}

      {/* Main vector glass and text content */}
      <g>
        {/* Tilted Wine Glass Group (Rotated counter-clockwise precisely to match the user's emblem) */}
        <g transform="translate(185, 205) rotate(-36)">
          
          {/* Wine Liquid inside the glass bowl */}
          <path 
            d="M -39.2 -14 C -39.2 -14, -20 -32, 0 -14 C 20 4, 39.2 -14, 39.2 -14 C 39.2 15, 30 40, 0 40 C -30 40, -39.2 15, -39.2 -14 Z" 
            fill="url(#wineGoldLiquid)" 
            opacity="0.95"
          />

          {/* Liquid Top Wave Surface highlight */}
          <path 
            d="M -39.2 -14 Q -20 -32 0 -14 Q 20 4 39.2 -14 Q 20 -20 0 -22 Q -20 -20 -39.2 -14 Z" 
            fill="#fbf8eb" 
            opacity="0.3"
          />

          {/* Outward Glass Bowl Contour */}
          <path 
            d="M -40 -45 C -40 -45, -42 15, 0 41 C 42 15, 40 -45, 40 -45" 
            fill="none" 
            stroke="url(#goldLogoGrad)" 
            strokeWidth="12" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />

          {/* Glass Stem */}
          <line 
            x1="0" 
            y1="41" 
            x2="-48" 
            y2="89" 
            stroke="url(#goldLogoGrad)" 
            strokeWidth="11" 
            strokeLinecap="round"
          />

          {/* Tilted Glass Base Foot */}
          <path 
            d="M -78 69 L -18 109" 
            stroke="url(#goldLogoGrad)" 
            strokeWidth="11" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </g>

        {/* "The Wine Spot" Elegant Brand Text */}
        {variant !== 'minimal' && (
          <text 
            x="250" 
            y="360" 
            fill="url(#goldLogoGrad)" 
            fontFamily="'Inter', system-ui, -apple-system, sans-serif"
            fontWeight="500" 
            fontSize="43.5" 
            letterSpacing="0.035em"
            textAnchor="middle"
          >
            The Wine Spot
          </text>
        )}
      </g>
    </svg>
  );
}
