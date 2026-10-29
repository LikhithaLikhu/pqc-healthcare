import React from 'react';

/**
 * Friendly Doctor and Patient Illustration (Vector SVG)
 * Warm, approachable healthcare theme with sky blue, turquoise, and coral accents.
 */
export const DoctorPatientIllustration: React.FC<{ className?: string }> = ({ className = "w-full h-auto" }) => (
  <svg viewBox="0 0 500 380" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="bgGlow" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.18" />
        <stop offset="50%" stopColor="#818CF8" stopOpacity="0.12" />
        <stop offset="100%" stopColor="#2DD4BF" stopOpacity="0.15" />
      </linearGradient>
      <linearGradient id="coatGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="100%" stopColor="#E0F2FE" />
      </linearGradient>
      <linearGradient id="skinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FCD34D" />
        <stop offset="100%" stopColor="#F59E0B" />
      </linearGradient>
      <linearGradient id="patientSkin" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FBBF24" />
        <stop offset="100%" stopColor="#D97706" />
      </linearGradient>
      <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#0EA5E9" />
        <stop offset="100%" stopColor="#14B8A6" />
      </linearGradient>
      <filter id="softShadow" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#0F172A" floodOpacity="0.08" />
      </filter>
    </defs>

    {/* Soft Decorative Ambient Background */}
    <circle cx="250" cy="190" r="160" fill="url(#bgGlow)" />
    <circle cx="90" cy="80" r="14" fill="#38BDF8" fillOpacity="0.3" className="animate-pulse" />
    <circle cx="420" cy="90" r="10" fill="#34D399" fillOpacity="0.4" />
    <circle cx="400" cy="290" r="18" fill="#F472B6" fillOpacity="0.25" />
    <circle cx="70" cy="270" r="12" fill="#A78BFA" fillOpacity="0.3" />

    {/* Floating Cross & Pulse Icons */}
    <g transform="translate(70, 130)" fill="#0284C7" fillOpacity="0.8">
      <rect x="8" y="0" width="6" height="22" rx="3" />
      <rect x="0" y="8" width="22" height="6" rx="3" />
    </g>
    <g transform="translate(410, 160)" fill="#10B981" fillOpacity="0.8">
      <rect x="6" y="0" width="5" height="18" rx="2.5" />
      <rect x="0" y="6.5" width="17" height="5" rx="2.5" />
    </g>

    {/* Doctor Character (Left) */}
    <g filter="url(#softShadow)">
      {/* Body / Doctor Coat */}
      <path d="M120 340 L120 220 Q120 180 160 170 L195 170 Q235 180 235 220 L235 340 Z" fill="url(#coatGrad)" />
      {/* Inner Shirt & Tie */}
      <path d="M165 170 L190 170 L195 240 L160 240 Z" fill="#0284C7" />
      <path d="M175 185 L180 185 L182 220 L173 220 Z" fill="#0369A1" />
      {/* Stethoscope */}
      <path d="M152 195 Q150 250 177 265 Q205 250 203 195" stroke="#0F172A" strokeWidth="4" fill="none" strokeLinecap="round" />
      <circle cx="177" cy="272" r="7" fill="#38BDF8" stroke="#0F172A" strokeWidth="3" />
      
      {/* Doctor Head & Friendly Expression */}
      <circle cx="177" cy="125" r="38" fill="url(#skinGrad)" />
      {/* Hair */}
      <path d="M142 120 Q150 85 180 85 Q212 85 215 115 Q215 95 195 90 Q160 88 142 120 Z" fill="#1E293B" />
      {/* Glasses */}
      <circle cx="166" cy="125" r="9" stroke="#0369A1" strokeWidth="2.5" fill="#E0F2FE" fillOpacity="0.6" />
      <circle cx="188" cy="125" r="9" stroke="#0369A1" strokeWidth="2.5" fill="#E0F2FE" fillOpacity="0.6" />
      <line x1="175" y1="125" x2="179" y2="125" stroke="#0369A1" strokeWidth="2.5" />
      {/* Smile */}
      <path d="M170 142 Q177 149 184 142" stroke="#B45309" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      {/* Doctor Clipboard */}
      <rect x="200" y="225" width="46" height="64" rx="6" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="2.5" transform="rotate(-10 200 225)" />
      <rect x="210" y="235" width="26" height="5" rx="2" fill="#0EA5E9" transform="rotate(-10 210 235)" />
      <line x1="208" y1="248" x2="232" y2="244" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="206" y1="258" x2="230" y2="254" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="204" y1="268" x2="225" y2="265" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" />
    </g>

    {/* Patient Character (Right) */}
    <g filter="url(#softShadow)">
      {/* Patient Body / Casual Coral Shirt */}
      <path d="M275 340 L275 240 Q275 195 315 190 L345 190 Q385 195 385 240 L385 340 Z" fill="#FB7185" />
      <path d="M305 190 L355 190 L345 220 L315 220 Z" fill="#FDA4AF" />
      {/* Patient Head */}
      <circle cx="330" cy="140" r="35" fill="url(#patientSkin)" />
      {/* Hair */}
      <path d="M295 135 Q300 100 330 100 Q365 100 365 130 Q355 110 330 110 Q305 110 295 135 Z" fill="#475569" />
      {/* Eyes & Smile */}
      <circle cx="320" cy="138" r="3" fill="#1E293B" />
      <circle cx="340" cy="138" r="3" fill="#1E293B" />
      <path d="M322 153 Q330 160 338 153" stroke="#92400E" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      {/* Cheerful Blush */}
      <circle cx="314" cy="147" r="4.5" fill="#F43F5E" fillOpacity="0.4" />
      <circle cx="346" cy="147" r="4.5" fill="#F43F5E" fillOpacity="0.4" />
    </g>

    {/* Central Floating Post-Quantum Shield Graphic */}
    <g transform="translate(225, 120)" filter="url(#softShadow)">
      <path d="M25 0 L50 10 L50 35 Q50 60 25 72 Q0 60 0 35 L0 10 Z" fill="url(#shieldGrad)" />
      <path d="M25 6 L43 14 L43 33 Q43 53 25 63 Q7 53 7 33 L7 14 Z" fill="#0A192F" fillOpacity="0.4" />
      {/* Lock Symbol inside shield */}
      <rect x="18" y="32" width="14" height="12" rx="2.5" fill="#F8FAFC" />
      <path d="M21 32 L21 27 Q21 21 25 21 Q29 21 29 27 L29 32" stroke="#F8FAFC" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* Quantum Sparkle */}
      <circle cx="25" cy="14" r="2" fill="#38BDF8" className="animate-ping" />
    </g>
  </svg>
);

/**
 * Lab Scientist / Technician Illustration (Vector SVG)
 * Laboratory microscope, beaker, colorful chemical reagents, and DNA helix.
 */
export const LabScientistIllustration: React.FC<{ className?: string }> = ({ className = "w-full h-auto" }) => (
  <svg viewBox="0 0 500 380" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="labBgGlow" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#10B981" stopOpacity="0.18" />
        <stop offset="50%" stopColor="#06B6D4" stopOpacity="0.12" />
        <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.15" />
      </linearGradient>
      <linearGradient id="flaskLiquid" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#2DD4BF" />
        <stop offset="100%" stopColor="#0D9488" />
      </linearGradient>
    </defs>

    {/* Backdrop Aura */}
    <circle cx="250" cy="190" r="160" fill="url(#labBgGlow)" />

    {/* Floating Molecules & DNA Nodes */}
    <g opacity="0.6">
      <circle cx="100" cy="90" r="9" fill="#0D9488" />
      <circle cx="130" cy="110" r="6" fill="#38BDF8" />
      <line x1="100" y1="90" x2="130" y2="110" stroke="#0D9488" strokeWidth="2" />
      <circle cx="410" cy="100" r="10" fill="#8B5CF6" />
      <circle cx="390" cy="130" r="7" fill="#C084FC" />
      <line x1="410" y1="100" x2="390" y2="130" stroke="#8B5CF6" strokeWidth="2" />
    </g>

    {/* Laboratory Work Bench */}
    <rect x="60" y="300" width="380" height="18" rx="6" fill="#1E293B" />
    <rect x="70" y="318" width="16" height="50" rx="3" fill="#334155" />
    <rect x="414" y="318" width="16" height="50" rx="3" fill="#334155" />

    {/* Lab Flask with Bubbling Liquid */}
    <g transform="translate(100, 210)">
      <path d="M22 0 L28 0 L28 30 L45 75 Q48 85 38 85 L12 85 Q2 85 5 75 L22 30 Z" fill="#F1F5F9" stroke="#94A3B8" strokeWidth="2" />
      <path d="M8 68 Q25 62 42 68 L44 76 Q46 83 38 83 L12 83 Q4 83 6 76 Z" fill="url(#flaskLiquid)" fillOpacity="0.85" />
      <circle cx="20" cy="72" r="2.5" fill="#CCFBF1" />
      <circle cx="32" cy="74" r="1.8" fill="#CCFBF1" />
      <circle cx="25" cy="50" r="2" fill="#2DD4BF" className="animate-bounce" />
    </g>

    {/* Test Tube Rack */}
    <g transform="translate(160, 235)">
      <rect x="0" y="45" width="70" height="20" rx="4" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="2" />
      {/* Test Tubes */}
      <rect x="10" y="10" width="12" height="48" rx="6" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="1.5" />
      <rect x="12" y="28" width="8" height="28" rx="4" fill="#F43F5E" fillOpacity="0.8" />
      <rect x="28" y="5" width="12" height="53" rx="6" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="1.5" />
      <rect x="30" y="20" width="8" height="36" rx="4" fill="#38BDF8" fillOpacity="0.8" />
      <rect x="46" y="15" width="12" height="43" rx="6" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="1.5" />
      <rect x="48" y="32" width="8" height="24" rx="4" fill="#10B981" fillOpacity="0.8" />
    </g>

    {/* Lab Scientist Character (Center) */}
    <g transform="translate(220, 90)">
      {/* Body / Lab Coat */}
      <path d="M25 210 L25 120 Q25 90 55 85 L75 85 Q105 90 105 120 L105 210 Z" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="2" />
      {/* Scientist Collar & Badge */}
      <path d="M50 85 L80 85 L75 125 L55 125 Z" fill="#0D9488" />
      <rect x="35" y="130" width="14" height="20" rx="2" fill="#E2E8F0" stroke="#94A3B8" />
      {/* Head */}
      <circle cx="65" cy="45" r="32" fill="#FCD34D" />
      {/* Lab Safety Glasses / Goggles */}
      <rect x="42" y="36" width="46" height="18" rx="8" fill="#38BDF8" fillOpacity="0.3" stroke="#0284C7" strokeWidth="2.5" />
      <circle cx="53" cy="45" r="5" fill="#0369A1" />
      <circle cx="77" cy="45" r="5" fill="#0369A1" />
      {/* Hair */}
      <path d="M35 40 Q45 15 65 15 Q85 15 95 35 Q90 20 65 20 Q42 20 35 40 Z" fill="#334155" />
      {/* Smile */}
      <path d="M58 60 Q65 66 72 60" stroke="#B45309" strokeWidth="2" fill="none" strokeLinecap="round" />
    </g>

    {/* Precision Digital Microscope (Right) */}
    <g transform="translate(340, 175)">
      {/* Stand & Base */}
      <rect x="25" y="115" width="55" height="10" rx="3" fill="#334155" />
      <path d="M55 115 L55 35 Q55 20 40 20 L25 20" stroke="#475569" strokeWidth="9" fill="none" strokeLinecap="round" />
      {/* Eyepiece */}
      <rect x="10" y="10" width="22" height="18" rx="4" fill="#0284C7" transform="rotate(35 10 10)" />
      {/* Objective Turret */}
      <circle cx="28" cy="65" r="8" fill="#0D9488" />
      <rect x="25" y="73" width="6" height="14" rx="2" fill="#14B8A6" />
      {/* Stage */}
      <rect x="10" y="87" width="42" height="6" rx="2" fill="#1E293B" />
      {/* Specimen Slide with Quantum Tag */}
      <rect x="18" y="84" width="26" height="3" fill="#A78BFA" />
    </g>
  </svg>
);

/**
 * Quantum Lattice Security Graphic (Vector SVG)
 * Futuristic dark navy, cyan, and violet lattice node shield.
 */
export const QuantumShieldIllustration: React.FC<{ className?: string }> = ({ className = "w-full h-auto" }) => (
  <svg viewBox="0 0 500 380" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="quantumGlow" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.3" />
        <stop offset="50%" stopColor="#818CF8" stopOpacity="0.2" />
        <stop offset="100%" stopColor="#2DD4BF" stopOpacity="0.3" />
      </linearGradient>
      <linearGradient id="shieldFill" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#0B132B" />
        <stop offset="50%" stopColor="#1C2541" />
        <stop offset="100%" stopColor="#0A192F" />
      </linearGradient>
      <linearGradient id="beamGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#38BDF8" />
        <stop offset="50%" stopColor="#A855F7" />
        <stop offset="100%" stopColor="#14B8A6" />
      </linearGradient>
      <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="8" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>

    {/* Radiant Background Nebula */}
    <circle cx="250" cy="190" r="150" fill="url(#quantumGlow)" filter="url(#neonGlow)" />

    {/* Orbital Quantum Trajectory Rings */}
    <ellipse cx="250" cy="190" rx="190" ry="65" stroke="#38BDF8" strokeWidth="1.5" strokeOpacity="0.4" strokeDasharray="6 6" transform="rotate(-25 250 190)" />
    <ellipse cx="250" cy="190" rx="190" ry="65" stroke="#A855F7" strokeWidth="1.5" strokeOpacity="0.4" strokeDasharray="6 6" transform="rotate(35 250 190)" />

    {/* Orbiting Quantum Particles */}
    <circle cx="95" cy="120" r="6" fill="#38BDF8" filter="url(#neonGlow)" />
    <circle cx="395" cy="270" r="5" fill="#A855F7" filter="url(#neonGlow)" />
    <circle cx="410" cy="130" r="6" fill="#14B8A6" filter="url(#neonGlow)" />

    {/* Central Post-Quantum Lattice Shield */}
    <g filter="url(#neonGlow)">
      <path 
        d="M250 50 L340 90 L340 190 Q340 280 250 325 Q160 280 160 190 L160 90 Z" 
        fill="url(#shieldFill)" 
        stroke="url(#beamGrad)" 
        strokeWidth="4" 
      />
    </g>

    {/* Inner Lattice Nodes & Vectors (Module-LWE Graphic) */}
    <g stroke="#38BDF8" strokeWidth="1.5" strokeOpacity="0.6">
      {/* Lattice Grid Points */}
      <line x1="200" y1="130" x2="250" y2="105" />
      <line x1="250" y1="105" x2="300" y2="130" />
      <line x1="200" y1="130" x2="200" y2="185" />
      <line x1="200" y1="185" x2="250" y2="210" />
      <line x1="250" y1="210" x2="300" y2="185" />
      <line x1="300" y1="185" x2="300" y2="130" />
      
      {/* Central Cross Vector */}
      <line x1="250" y1="105" x2="250" y2="210" />
      <line x1="200" y1="130" x2="300" y2="185" />
      <line x1="200" y1="185" x2="300" y2="130" />

      {/* Nodes */}
      <circle cx="200" cy="130" r="4.5" fill="#38BDF8" />
      <circle cx="250" cy="105" r="5" fill="#2DD4BF" />
      <circle cx="300" cy="130" r="4.5" fill="#38BDF8" />
      <circle cx="200" cy="185" r="4.5" fill="#A855F7" />
      <circle cx="250" cy="210" r="5.5" fill="#38BDF8" />
      <circle cx="300" cy="185" r="4.5" fill="#A855F7" />
      <circle cx="250" cy="158" r="6.5" fill="#FFFFFF" />
    </g>

    {/* Cryptographic Standards Label Plaque */}
    <g transform="translate(195, 245)">
      <rect x="0" y="0" width="110" height="24" rx="12" fill="#0F172A" stroke="#38BDF8" strokeWidth="1.5" />
      <text x="55" y="16" fill="#38BDF8" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
        ML-KEM-768
      </text>
    </g>
  </svg>
);

/**
 * Empty State Illustration (Vector SVG)
 * Friendly medical clipboard with clean sparkles.
 */
export const MedicalEmptyIllustration: React.FC<{ title?: string; message?: string }> = ({
  title = "No Records Found",
  message = "Your medical history will appear here securely."
}) => (
  <div className="flex flex-col items-center justify-center p-8 text-center space-y-3">
    <svg width="140" height="140" viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="70" cy="70" r="56" fill="#F0FDF4" />
      <rect x="42" y="30" width="56" height="76" rx="8" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2.5" />
      <rect x="54" y="24" width="32" height="12" rx="4" fill="#0D9488" />
      <circle cx="70" cy="30" r="2.5" fill="#FFFFFF" />
      <line x1="52" y1="52" x2="88" y2="52" stroke="#E2E8F0" strokeWidth="3" strokeLinecap="round" />
      <line x1="52" y1="64" x2="88" y2="64" stroke="#E2E8F0" strokeWidth="3" strokeLinecap="round" />
      <line x1="52" y1="76" x2="74" y2="76" stroke="#E2E8F0" strokeWidth="3" strokeLinecap="round" />
      {/* Cheerful Sparkle */}
      <path d="M100 40 L103 48 L111 51 L103 54 L100 62 L97 54 L89 51 L97 48 Z" fill="#FCD34D" />
      <circle cx="36" cy="88" r="4" fill="#38BDF8" />
    </svg>
    <p className="text-sm font-bold text-slate-700">{title}</p>
    <p className="text-xs text-slate-500 max-w-xs">{message}</p>
  </div>
);
