import React from 'react';
import { Button as AntdButton } from 'antd';

type AntdButtonProps = React.ComponentProps<typeof AntdButton>;

interface CustomButtonProps extends Omit<AntdButtonProps, 'variant'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  glow?: boolean;
}

export const Button: React.FC<CustomButtonProps> = ({ 
  children, 
  variant = 'primary', 
  glow = false,
  className = '',
  ...props 
}) => {
  const baseClasses = "flex items-center justify-center font-medium rounded-lg transition-all duration-300";
  
  const variants = {
    primary: "bg-emerald-500 hover:bg-emerald-400 text-white border-none",
    secondary: "bg-white hover:bg-gray-100 text-gray-900 border-none",
    outline: "bg-transparent border border-gray-600 hover:border-gray-400 text-white",
    ghost: "bg-transparent hover:bg-white/10 text-white border-none"
  };

  const glowClass = glow && variant === 'primary' ? "glow-button" : "";

  return (
    <AntdButton 
      className={`${baseClasses} ${variants[variant]} ${glowClass} ${className} h-11 px-6`}
      {...props}
    >
      {children}
    </AntdButton>
  );
};
