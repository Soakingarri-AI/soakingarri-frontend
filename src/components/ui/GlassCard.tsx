import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  padding?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className = '',
  padding = 'p-8'
}) => {
  return (
    <div className={`glass-panel rounded-2xl ${padding} ${className}`}>
      {children}
    </div>
  );
};
