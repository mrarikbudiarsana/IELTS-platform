import React from 'react';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'full' | 'icon' | 'badge';
  theme?: 'dark' | 'light';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  size = 'md',
  variant = 'full',
  theme = 'light',
}) => {
  // Vector Globe + Cap + Wifi Icon Mark
  const IconMark = () => {
    const dim = size === 'sm' ? 28 : size === 'lg' ? 44 : 36;
    return (
      <svg
        width={dim}
        height={dim}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        {/* Outer Globe Circle */}
        <circle
          cx="50"
          cy="50"
          r="44"
          stroke="#084F7D"
          strokeWidth="6"
          fill="none"
        />
        {/* Globe Longitude / Latitude Curves */}
        <ellipse
          cx="50"
          cy="50"
          rx="25"
          ry="44"
          stroke="#084F7D"
          strokeWidth="4"
          fill="none"
        />
        <line
          x1="6"
          y1="50"
          x2="94"
          y2="50"
          stroke="#084F7D"
          strokeWidth="4"
        />
        <line
          x1="18"
          y1="28"
          x2="82"
          y2="28"
          stroke="#084F7D"
          strokeWidth="3.5"
        />
        <line
          x1="18"
          y1="72"
          x2="82"
          y2="72"
          stroke="#084F7D"
          strokeWidth="3.5"
        />

        {/* Graduation Mortarboard Cap */}
        <path
          d="M50 16 L82 32 L50 46 L18 32 Z"
          fill="#084F7D"
        />
        {/* Cap Base */}
        <path
          d="M32 40 L32 50 C32 56 68 56 68 50 L68 40"
          stroke="#084F7D"
          strokeWidth="4"
          fill="#084F7D"
        />
        {/* Tassel */}
        <path
          d="M36 38 L30 46 L30 54"
          stroke="#084F7D"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Wifi / Signal Broadcast Arcs (Amber Orange #FC9F23) */}
        {/* Outer wave */}
        <path
          d="M32 60 C37 54 63 54 68 60"
          stroke="#FC9F23"
          strokeWidth="4.5"
          strokeLinecap="round"
        />
        {/* Inner wave */}
        <path
          d="M39 67 C42 63 58 63 61 67"
          stroke="#FC9F23"
          strokeWidth="4.5"
          strokeLinecap="round"
        />
        {/* Wifi Center Dot */}
        <circle
          cx="50"
          cy="75"
          r="3.5"
          fill="#FC9F23"
        />
      </svg>
    );
  };

  if (variant === 'icon') {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <IconMark />
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      <div className="relative shrink-0 flex items-center justify-center p-1 rounded-xl bg-white shadow-2xs">
        <IconMark />
      </div>
      <div className="flex flex-col">
        <span
          className={`font-bold tracking-tight leading-none ${
            size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-lg' : 'text-base'
          } ${theme === 'dark' ? 'text-white' : 'text-[#084F7D]'}`}
        >
          IELTS with Arik
        </span>
        <span
          className={`font-semibold tracking-normal text-[#FC9F23] leading-tight ${
            size === 'sm' ? 'text-[9px]' : size === 'lg' ? 'text-xs' : 'text-[10px]'
          }`}
        >
          Your Gateway to Global Success
        </span>
      </div>
    </div>
  );
};
