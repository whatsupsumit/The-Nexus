import React from 'react';

const Header = () => {
  return (
    <div style={{
      position: 'absolute',
      top: '32px',
      left: '32px',
      zIndex: 1000,
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: '50px',
      fontWeight: 'bold',
      color: '#ef1a0fff', // Neon Red color
      letterSpacing: '3px',
      // A subtle but cool neon red glow effect
      textShadow: '0 0 8px rgba(202, 12, 12, 0.7), 0 0 20px rgba(255, 59, 48, 0.5)',
    }}>
      NEXUS
    </div>
  );
};

export default Header;
