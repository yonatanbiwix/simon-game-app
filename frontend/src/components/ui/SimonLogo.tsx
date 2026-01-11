interface SimonLogoProps {
  size?: 'sm' | 'md' | 'lg';
  animate?: boolean;
}

export const SimonLogo: React.FC<SimonLogoProps> = ({ 
  size = 'md',
  animate = true 
}) => {
  const dimensions = {
    sm: 80,
    md: 120,
    lg: 160,
  };

  const dim = dimensions[size];
  const half = dim / 2;
  const gap = 2;
  const quadrantSize = half - gap;

  return (
    <div 
      className={`relative ${animate ? 'animate-float' : ''}`}
      style={{ width: dim, height: dim }}
    >
      {/* Green - Top Left (Classic Simon) */}
      <div 
        className="absolute simon-logo-quadrant"
        style={{
          top: 0,
          left: 0,
          width: quadrantSize,
          height: quadrantSize,
          backgroundColor: 'var(--simon-green)',
          borderTopLeftRadius: '100%',
          boxShadow: animate ? '0 0 15px var(--simon-green-glow)' : 'none',
        }}
      />
      
      {/* Red - Top Right (Classic Simon) */}
      <div 
        className="absolute simon-logo-quadrant"
        style={{
          top: 0,
          right: 0,
          width: quadrantSize,
          height: quadrantSize,
          backgroundColor: 'var(--simon-red)',
          borderTopRightRadius: '100%',
          boxShadow: animate ? '0 0 15px var(--simon-red-glow)' : 'none',
        }}
      />
      
      {/* Yellow - Bottom Left (Classic Simon) */}
      <div 
        className="absolute simon-logo-quadrant"
        style={{
          bottom: 0,
          left: 0,
          width: quadrantSize,
          height: quadrantSize,
          backgroundColor: 'var(--simon-yellow)',
          borderBottomLeftRadius: '100%',
          boxShadow: animate ? '0 0 15px var(--simon-yellow-glow)' : 'none',
        }}
      />
      
      {/* Blue - Bottom Right (Classic Simon) */}
      <div 
        className="absolute simon-logo-quadrant"
        style={{
          bottom: 0,
          right: 0,
          width: quadrantSize,
          height: quadrantSize,
          backgroundColor: 'var(--simon-blue)',
          borderBottomRightRadius: '100%',
          boxShadow: animate ? '0 0 15px var(--simon-blue-glow)' : 'none',
        }}
      />
      
      {/* Center circle */}
      <div 
        className="absolute"
        style={{
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: dim * 0.25,
          height: dim * 0.25,
          borderRadius: '50%',
          backgroundColor: 'var(--bg-dark)',
          border: '2px solid #334155',
          boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.5)',
        }}
      />
    </div>
  );
};

export default SimonLogo;
