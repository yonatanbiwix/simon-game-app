/**
 * Simon Logo Component
 * 
 * Animated circular logo with 4 colored quadrants.
 * Uses CSS animations for pulsing glow effect.
 */

interface SimonLogoProps {
  size?: 'sm' | 'md' | 'lg';
  animate?: boolean;
}

export const SimonLogo: React.FC<SimonLogoProps> = ({ 
  size = 'md',
  animate = true 
}) => {
  const sizeClasses = {
    sm: 'w-24 h-24',
    md: 'w-36 h-36 sm:w-44 sm:h-44',
    lg: 'w-48 h-48 sm:w-56 sm:h-56',
  };

  const quadrantSize = {
    sm: 'w-11 h-11',
    md: 'w-[4.25rem] h-[4.25rem] sm:w-[5.25rem] sm:h-[5.25rem]',
    lg: 'w-[5.75rem] h-[5.75rem] sm:w-[6.75rem] sm:h-[6.75rem]',
  };

  return (
    <div className={`${sizeClasses[size]} relative ${animate ? 'animate-float' : ''}`}>
      <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-1 p-1">
        {/* Red - Top Left */}
        <div 
          className={`
            simon-logo-quadrant
            ${quadrantSize[size]}
            rounded-tl-full
            bg-[var(--simon-red)]
            ${animate ? '' : 'opacity-90'}
          `}
          style={{ 
            boxShadow: animate ? '0 0 15px var(--simon-red-glow)' : 'none'
          }}
        />
        
        {/* Blue - Top Right */}
        <div 
          className={`
            simon-logo-quadrant
            ${quadrantSize[size]}
            rounded-tr-full
            bg-[var(--simon-blue)]
            ${animate ? '' : 'opacity-90'}
          `}
          style={{ 
            boxShadow: animate ? '0 0 15px var(--simon-blue-glow)' : 'none'
          }}
        />
        
        {/* Yellow - Bottom Left */}
        <div 
          className={`
            simon-logo-quadrant
            ${quadrantSize[size]}
            rounded-bl-full
            bg-[var(--simon-yellow)]
            ${animate ? '' : 'opacity-90'}
          `}
          style={{ 
            boxShadow: animate ? '0 0 15px var(--simon-yellow-glow)' : 'none'
          }}
        />
        
        {/* Green - Bottom Right */}
        <div 
          className={`
            simon-logo-quadrant
            ${quadrantSize[size]}
            rounded-br-full
            bg-[var(--simon-green)]
            ${animate ? '' : 'opacity-90'}
          `}
          style={{ 
            boxShadow: animate ? '0 0 15px var(--simon-green-glow)' : 'none'
          }}
        />
      </div>
      
      {/* Center circle overlay */}
      <div 
        className="absolute inset-0 flex items-center justify-center"
        style={{ pointerEvents: 'none' }}
      >
        <div 
          className="w-1/4 h-1/4 rounded-full bg-[var(--bg-dark)] border-2 border-slate-700"
          style={{ 
            boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.5)'
          }}
        />
      </div>
    </div>
  );
};

export default SimonLogo;
