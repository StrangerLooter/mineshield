import React from 'react';
import { useTelemetry } from '../../context/TelemetryContext';
import { AlertOctagon, Flame, ArrowRight } from 'lucide-react';

interface EmergencyBannerProps {
  onNavigateToAlerts?: (alertId?: string) => void;
}

export const EmergencyBanner: React.FC<EmergencyBannerProps> = ({ onNavigateToAlerts }) => {
  const { alerts } = useTelemetry();

  // Find most severe active alert
  const criticalAlert = alerts.find(a => a.status === 'ACTIVE' && a.severity === 'CRITICAL');
  const highAlert = alerts.find(a => a.status === 'ACTIVE' && a.severity === 'HIGH');
  const activeAlert = criticalAlert || highAlert;

  if (!activeAlert) return null;

  const isCritical = activeAlert.severity === 'CRITICAL';

  return (
    <div
      className={`px-4 py-2.5 flex items-center justify-between transition-all border-b ${
        isCritical
          ? 'bg-status-criticalBg border-status-criticalBorder text-red-100 shadow-lg shadow-red-950/40'
          : 'bg-status-highBg border-status-highBorder text-orange-100 shadow-md shadow-orange-950/30'
      }`}
    >
      <div className="flex items-center gap-3 overflow-hidden">
        <span className="relative flex h-3 w-3 shrink-0">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
            isCritical ? 'bg-red-400' : 'bg-orange-400'
          }`}></span>
          <span className={`relative inline-flex rounded-full h-3 w-3 ${
            isCritical ? 'bg-red-500' : 'bg-orange-500'
          }`}></span>
        </span>

        <div className="flex items-center gap-2 text-sm font-semibold tracking-wide truncate">
          {isCritical ? (
            <AlertOctagon className="w-4 h-4 text-red-400 shrink-0" />
          ) : (
            <Flame className="w-4 h-4 text-orange-400 shrink-0" />
          )}
          <span className="font-mono uppercase text-xs sm:text-sm font-bold">
            {isCritical ? '🚨 CRITICAL SUBSIDENCE INCIDENT' : '⚠ HIGH RISK STRATA ANOMALY'}:
          </span>
          <span className="font-mono text-xs sm:text-sm font-normal text-white truncate">
            {activeAlert.zoneName} / SENSORS {activeAlert.sensorIds.join('–')}
          </span>
        </div>

        <div className="hidden md:flex items-center gap-2 pl-3 border-l border-white/20 text-xs font-mono text-mine-text/90">
          <span>Confidence: <strong>{activeAlert.confidence}%</strong></span>
          <span>•</span>
          <span>Predicted State: <strong className={isCritical ? 'text-red-300' : 'text-orange-300'}>{isCritical ? 'IMMEDIATE EVACUATION' : 'ESCALATING'}</strong></span>
        </div>
      </div>

      <button
        onClick={() => onNavigateToAlerts?.(activeAlert.id)}
        className={`shrink-0 ml-3 flex items-center gap-1.5 px-3 py-1 rounded text-xs font-mono font-medium transition-colors border ${
          isCritical
            ? 'bg-red-600/80 hover:bg-red-600 border-red-500 text-white'
            : 'bg-orange-600/80 hover:bg-orange-600 border-orange-500 text-white'
        }`}
      >
        <span>View Incident</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
