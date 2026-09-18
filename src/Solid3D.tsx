import React from 'react';

type SVGOmit = Omit<React.SVGProps<SVGSVGElement>, 'viewBox'>;

interface SolidIconProps extends SVGOmit {
  size?: number;
}

const colors = {
  top: '#f5f5f4',      // stone-100
  left: '#a8a29e',     // stone-400
  right: '#d6d3d1',    // stone-300
  darkLeft: '#78716c', // stone-500
  stroke: '#292524',   // stone-800
  dash: '#a8a29e'      // stone-400
};

export const Cubo3D = ({ size = 64, ...props }: SolidIconProps) => (
  <svg width={size} height={size} viewBox="0 0 100 100" {...props}>
    <polyline points="20,70 50,55 80,70" fill="none" stroke={colors.dash} strokeWidth="2" strokeDasharray="4 4" />
    <line x1="50" y1="15" x2="50" y2="55" stroke={colors.dash} strokeWidth="2" strokeDasharray="4 4" />
    <polygon points="50,15 80,30 50,45 20,30" fill={colors.top} stroke={colors.stroke} strokeWidth="3" strokeLinejoin="round" />
    <polygon points="20,30 50,45 50,85 20,70" fill={colors.left} stroke={colors.stroke} strokeWidth="3" strokeLinejoin="round" />
    <polygon points="50,45 80,30 80,70 50,85" fill={colors.right} stroke={colors.stroke} strokeWidth="3" strokeLinejoin="round" />
  </svg>
);

export const Cilindro3D = ({ size = 64, ...props }: SolidIconProps) => (
  <svg width={size} height={size} viewBox="0 0 100 100" {...props}>
    <path d="M 20 70 A 30 15 0 0 1 80 70" fill="none" stroke={colors.dash} strokeWidth="2" strokeDasharray="4 4" />
    <path d="M 20 30 L 20 70 A 30 15 0 0 0 80 70 L 80 30 Z" fill={colors.right} stroke={colors.stroke} strokeWidth="3" strokeLinejoin="round" />
    <path d="M 20 30 L 20 70 A 30 15 0 0 0 50 85 L 50 45 Z" fill={colors.left} opacity="0.5" />
    <ellipse cx="50" cy="30" rx="30" ry="15" fill={colors.top} stroke={colors.stroke} strokeWidth="3" />
  </svg>
);

export const Paralelepipedo3D = ({ size = 64, ...props }: SolidIconProps) => (
  <svg width={size} height={size} viewBox="0 0 100 100" {...props}>
    <polyline points="20,75 70,50 90,60" fill="none" stroke={colors.dash} strokeWidth="2" strokeDasharray="4 4" />
    <line x1="70" y1="20" x2="70" y2="50" stroke={colors.dash} strokeWidth="2" strokeDasharray="4 4" />
    <polygon points="70,20 90,30 40,55 20,45" fill={colors.top} stroke={colors.stroke} strokeWidth="3" strokeLinejoin="round" />
    <polygon points="20,45 40,55 40,85 20,75" fill={colors.left} stroke={colors.stroke} strokeWidth="3" strokeLinejoin="round" />
    <polygon points="40,55 90,30 90,60 40,85" fill={colors.right} stroke={colors.stroke} strokeWidth="3" strokeLinejoin="round" />
  </svg>
);

export const Piramide3D = ({ size = 64, ...props }: SolidIconProps) => (
  <svg width={size} height={size} viewBox="0 0 100 100" {...props}>
    {/* Base shadow/floor for depth */}
    <polygon points="15,60 50,80 85,60 50,40" fill={colors.darkLeft} fillOpacity="0.2" stroke="none" />
    
    {/* Hidden edges (back base and back vertical string) */}
    <polyline points="15,60 50,40 85,60" fill="none" stroke={colors.dash} strokeWidth="2" strokeDasharray="4 4" />
    <line x1="50" y1="15" x2="50" y2="40" stroke={colors.dash} strokeWidth="2" strokeDasharray="4 4" />
    
    {/* Internal Height line */}
    <line x1="50" y1="15" x2="50" y2="60" stroke={colors.dash} strokeWidth="2" strokeDasharray="4 4" opacity="0.6" />
    
    {/* Front visible faces with enhanced transparency */}
    <polygon points="50,15 15,60 50,80" fill={colors.left} fillOpacity="0.65" stroke={colors.stroke} strokeWidth="3" strokeLinejoin="round" />
    <polygon points="50,15 50,80 85,60" fill={colors.right} fillOpacity="0.65" stroke={colors.stroke} strokeWidth="3" strokeLinejoin="round" />
  </svg>
);

export const Esfera3D = ({ size = 64, ...props }: SolidIconProps) => (
  <svg width={size} height={size} viewBox="0 0 100 100" {...props}>
    <defs>
      <radialGradient id="sphereGrad" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="50%" stopColor={colors.top} />
        <stop offset="100%" stopColor={colors.darkLeft} />
      </radialGradient>
    </defs>
    <circle cx="50" cy="50" r="40" fill="url(#sphereGrad)" stroke={colors.stroke} strokeWidth="3" />
    <path d="M 10 50 A 40 15 0 0 1 90 50" fill="none" stroke={colors.dash} strokeWidth="2" strokeDasharray="4 4" />
    <path d="M 10 50 A 40 15 0 0 0 90 50" fill="none" stroke={colors.stroke} strokeWidth="1" strokeDasharray="6 3" opacity="0.3" />
  </svg>
);

export const Cone3D = ({ size = 64, ...props }: SolidIconProps) => (
  <svg width={size} height={size} viewBox="0 0 100 100" {...props}>
    <path d="M 20,75 A 30,12 0 0,1 80,75" fill="none" stroke={colors.dash} strokeWidth="2" strokeDasharray="4 4" />
    <path d="M 50,15 L 20,75 A 30,12 0 0,0 80,75 Z" fill={colors.right} stroke={colors.stroke} strokeWidth="3" strokeLinejoin="round" />
    <path d="M 50,15 L 20,75 A 30,12 0 0,0 50,87 Z" fill={colors.left} opacity="0.5" />
    <line x1="50" y1="15" x2="50" y2="75" stroke={colors.dash} strokeWidth="2" strokeDasharray="4 4" opacity="0.5" />
  </svg>
);

export const Tetraedro3D = ({ size = 64, ...props }: SolidIconProps) => (
  <svg width={size} height={size} viewBox="0 0 100 100" {...props}>
    <line x1="15" y1="60" x2="85" y2="50" stroke={colors.dash} strokeWidth="2" strokeDasharray="4 4" />
    <line x1="45" y1="15" x2="52" y2="65" stroke={colors.dash} strokeWidth="2" strokeDasharray="4 4" />
    <polygon points="45,15 15,60 55,85" fill={colors.left} fillOpacity="0.65" stroke={colors.stroke} strokeWidth="3" strokeLinejoin="round" />
    <polygon points="45,15 55,85 85,50" fill={colors.right} fillOpacity="0.65" stroke={colors.stroke} strokeWidth="3" strokeLinejoin="round" />
  </svg>
);

export const PrismaPentagonal3D = ({ size = 64, ...props }: SolidIconProps) => (
  <svg width={size} height={size} viewBox="0 0 100 100" {...props}>
    <polyline points="25,65 50,55 75,65" fill="none" stroke={colors.dash} strokeWidth="2" strokeDasharray="4 4" />
    <line x1="50" y1="15" x2="50" y2="55" stroke={colors.dash} strokeWidth="2" strokeDasharray="4 4" />
    <polygon points="50,15 75,25 65,45 35,45 25,25" fill={colors.top} stroke={colors.stroke} strokeWidth="3" strokeLinejoin="round" />
    <polygon points="25,25 35,45 35,85 25,65" fill={colors.darkLeft} stroke={colors.stroke} strokeWidth="3" strokeLinejoin="round" />
    <polygon points="35,45 65,45 65,85 35,85" fill={colors.right} stroke={colors.stroke} strokeWidth="3" strokeLinejoin="round" />
    <polygon points="65,45 75,25 75,65 65,85" fill={colors.left} stroke={colors.stroke} strokeWidth="3" strokeLinejoin="round" />
  </svg>
);

export const PrismaHexagonal3D = ({ size = 64, ...props }: SolidIconProps) => (
  <svg width={size} height={size} viewBox="0 0 100 100" {...props}>
    <polyline points="20,80 20,65 50,55 80,65 80,80" fill="none" stroke={colors.dash} strokeWidth="2" strokeDasharray="4 4" />
    <line x1="20" y1="25" x2="20" y2="65" stroke={colors.dash} strokeWidth="2" strokeDasharray="4 4" />
    <line x1="50" y1="15" x2="50" y2="55" stroke={colors.dash} strokeWidth="2" strokeDasharray="4 4" />
    <line x1="80" y1="25" x2="80" y2="65" stroke={colors.dash} strokeWidth="2" strokeDasharray="4 4" />
    <polygon points="50,15 80,25 80,40 50,50 20,40 20,25" fill={colors.top} stroke={colors.stroke} strokeWidth="3" strokeLinejoin="round" />
    <polygon points="20,40 50,50 50,90 20,80" fill={colors.left} stroke={colors.stroke} strokeWidth="3" strokeLinejoin="round" />
    <polygon points="50,50 80,40 80,80 50,90" fill={colors.right} stroke={colors.stroke} strokeWidth="3" strokeLinejoin="round" />
  </svg>
);

export const CilindroCone3D = ({ size = 64, ...props }: SolidIconProps) => (
  <svg width={size} height={size} viewBox="0 0 100 100" {...props}>
    <path d="M 20 85 A 30 12 0 0 1 80 85" fill="none" stroke={colors.dash} strokeWidth="2" strokeDasharray="4 4" />
    <path d="M 20 45 L 20 85 A 30 12 0 0 0 80 85 L 80 45 Z" fill={colors.right} stroke={colors.stroke} strokeWidth="3" strokeLinejoin="round" />
    <path d="M 20 45 L 20 85 A 30 12 0 0 0 50 97 L 50 57 Z" fill={colors.left} opacity="0.5" />
    <path d="M 20 45 A 30 12 0 0 1 80 45" fill="none" stroke={colors.dash} strokeWidth="2" strokeDasharray="4 4" />
    <path d="M 20 45 A 30 12 0 0 0 80 45" fill="none" stroke={colors.stroke} strokeWidth="3" strokeLinejoin="round" />
    <path d="M 50 5 L 20 45 A 30 12 0 0 0 80 45 Z" fill={colors.right} stroke={colors.stroke} strokeWidth="3" strokeLinejoin="round" />
    <path d="M 50 5 L 20 45 A 30 12 0 0 0 50 57 Z" fill={colors.left} opacity="0.5" />
  </svg>
);

