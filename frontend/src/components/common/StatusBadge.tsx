import React from 'react';
import { RiskLevel, SensorStatus } from '../../types';
import { ShieldCheck, AlertTriangle, Flame, AlertOctagon, HelpCircle, Activity } from 'lucide-react';

interface StatusBadgeProps {
  status: RiskLevel | SensorStatus | string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  pulse?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  showIcon = true,
  pulse = false
}) => {
  const norm = status.toUpperCase();

  let bg = 'bg-slate-800/80';
  let border = 'border-slate-700';
  let text = 'text-slate-300';
  let icon = <Activity className="w-3.5 h-3.5" />;
  let label = norm;

  if (norm === 'SAFE' || norm === 'HEALTHY' || norm === 'NORMAL') {
    bg = 'bg-status-safeBg';
    border = 'border-status-safeBorder';
    text = 'text-emerald-400';
    icon = <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />;
    label = norm === 'HEALTHY' ? 'HEALTHY' : 'SAFE';
  } else if (norm === 'WARNING') {
    bg = 'bg-status-warningBg';
    border = 'border-status-warningBorder';
    text = 'text-amber-400';
    icon = <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />;
    label = 'WARNING';
  } else if (norm === 'HIGH' || norm === 'DEGRADED') {
    bg = 'bg-status-highBg';
    border = 'border-status-highBorder';
    text = 'text-orange-400';
    icon = <Flame className="w-3.5 h-3.5 text-orange-400" />;
    label = norm === 'DEGRADED' ? 'DEGRADED' : 'HIGH RISK';
  } else if (norm === 'CRITICAL' || norm === 'FAULT') {
    bg = 'bg-status-criticalBg';
    border = 'border-status-criticalBorder';
    text = 'text-red-400';
    icon = <AlertOctagon className="w-3.5 h-3.5 text-red-400" />;
    label = norm === 'FAULT' ? 'FAULT' : 'CRITICAL';
  } else if (norm === 'OFFLINE') {
    bg = 'bg-zinc-900';
    border = 'border-zinc-700';
    text = 'text-zinc-400';
    icon = <HelpCircle className="w-3.5 h-3.5 text-zinc-500" />;
    label = 'OFFLINE';
  }

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-2.5 py-1 text-xs gap-1.5 font-medium',
    lg: 'px-3.5 py-1.5 text-sm gap-2 font-semibold'
  };

  return (
    <span
      className={`inline-flex items-center rounded-md border font-mono uppercase tracking-wider ${bg} ${border} ${text} ${sizeClasses[size]} ${
        pulse && (norm === 'CRITICAL' || norm === 'HIGH') ? 'animate-pulse' : ''
      }`}
    >
      {showIcon && icon}
      <span>{label}</span>
    </span>
  );
};
