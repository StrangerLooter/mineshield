import React, { useState } from 'react';
import { SYSTEM_METADATA } from '../../constants';
import { ShieldAlert, Info, X } from 'lucide-react';

export const DisclaimerBanner: React.FC = () => {
  const [isDismissed, setIsDismissed] = useState<boolean>(false);

  if (isDismissed) return null;

  return (
    <aside aria-label="Prototype Notice" className="bg-mine-surface border-b border-mine-border/80 px-4 py-2 text-xs text-mine-secondary flex items-center justify-between gap-3">
      <div className="flex items-center gap-2 max-w-5xl">
        <ShieldAlert className="w-4 h-4 text-cyan-400 shrink-0" />
        <span>
          <strong className="text-cyan-300 font-mono">SIH26025 BENCH PROTOTYPE:</strong> {SYSTEM_METADATA.regulatoryDisclaimer}
        </span>
      </div>
      <button
        onClick={() => setIsDismissed(true)}
        className="text-mine-muted hover:text-mine-text p-1 transition-colors"
        title="Dismiss notice for this session"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </aside>
  );
};
