import React, { useState } from 'react';

interface ToggleProps {
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
}

/** Compact on/off switch. Uncontrolled; pass `onChange` to hear about flips. */
export const Toggle: React.FC<ToggleProps> = ({ defaultChecked = true, onChange }) => {
  const [checked, setChecked] = useState(defaultChecked);

  const flip = () => {
    setChecked((c) => !c);
    onChange?.(!checked);
  };

  return (
    <div
      role="switch"
      aria-checked={checked}
      className={`w-10 h-5 flex items-center rounded-full p-1 cursor-pointer transition-colors ${checked ? 'bg-emerald-500' : 'bg-gray-600'}`}
      onClick={flip}
    >
      <div className={`bg-white w-3.5 h-3.5 rounded-full shadow-md transform transition-transform ${checked ? 'translate-x-4.5' : ''}`}></div>
    </div>
  );
};
