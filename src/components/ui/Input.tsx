import React from 'react';
import { Input as AntdInput } from 'antd';
import { Eye, EyeOff } from 'lucide-react';

type AntdInputProps = React.ComponentProps<typeof AntdInput>;

interface CustomInputProps extends AntdInputProps {
  label?: string;
  isPassword?: boolean;
}

export const Input: React.FC<CustomInputProps> = ({ label, isPassword, className, ...props }) => {
  const containerClass = `flex flex-col gap-1.5 w-full ${className || ''}`;
  const labelClass = "text-sm text-gray-300 font-medium";
  const inputClass = "bg-[#0f172a] border border-gray-700 hover:border-emerald-500 focus:border-emerald-500 text-white rounded-lg px-4 py-2.5 shadow-none transition-colors";

  if (isPassword) {
    return (
      <div className={containerClass}>
        {label && <label className={labelClass}>{label}</label>}
        <AntdInput.Password 
          {...props} 
          classNames={{
            input: "bg-transparent text-white",
          }}
          iconRender={visible => (visible ? <Eye className="w-4 h-4 text-gray-400" /> : <EyeOff className="w-4 h-4 text-gray-400" />)}
          className={inputClass}
        />
      </div>
    );
  }

  return (
    <div className={containerClass}>
      {label && <label className={labelClass}>{label}</label>}
      <AntdInput 
        {...props} 
        className={inputClass} 
      />
    </div>
  );
};
