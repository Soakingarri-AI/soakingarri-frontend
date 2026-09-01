import React from 'react';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  padding?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  padding = 'p-8',
  ...rest
}) => {
  return (
    <div className={`glass-panel rounded-2xl ${padding} ${className}`} {...rest}>
      {children}
    </div>
  );
};
