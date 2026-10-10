import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { IconButton } from './IconButton';

interface PageHeaderProps {
  title: string;
  /** Shows a back arrow before the title. */
  onBack?: () => void;
  backLabel?: string;
  /** Right-hand controls: search, notifications, etc. */
  actions?: React.ReactNode;
}

/** Glass title bar across the top of an in-app page. */
export const PageHeader: React.FC<PageHeaderProps> = ({ title, onBack, backLabel = 'Back', actions }) => (
  <div className="relative z-20 flex justify-between items-center gap-4 p-6 border-b border-white/5 bg-black/20 backdrop-blur-sm">
    <div className="flex items-center gap-4">
      {onBack && <IconButton icon={ArrowLeft} label={backLabel} onClick={onBack} />}
      <h1 className="text-2xl font-bold text-white tracking-tight">{title}</h1>
    </div>
    {actions && <div className="flex gap-4">{actions}</div>}
  </div>
);
