import React from 'react';
import { useTelemetry } from '../../context/TelemetryContext';
import { StatusBadge } from '../common/StatusBadge';
import { X, ArrowRight, Radio, Compass, MoveDown, Activity, Camera, ShieldAlert, CheckCircle } from 'lucide-react';

interface ZoneDetailDrawerProps {
  onClose: () => void;
  onNavigateToSensor?: (sensorId: string) => void;
  onNavigateToAlert?: (alertId: string) => void;
}

export const ZoneDetailDrawer: React.FC<ZoneDetailDrawerProps> = ({
  onClose,
  onNavigateToSensor,
  onNavigateToAlert
}) => {
  const { selectedZone, selectedSensor, sensors, alerts } = useTelemetry();

  if (!selectedZone) return null;

  const zoneSensors = sensors.filter(s => selectedZone.sensorIds.includes(s.id));
  const activeAlert = alerts.find(a => a.zoneId === selectedZone.id && a.status === 'ACTIVE');

  return (
    <div className="bg-mine-surface border border-mine-border rounded-xl p-5 shadow-2xl space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-mine-border">
        <div>
          <span className="text-[10px] font-mono text-cyan-400 font-semibold uppercase">
            GEOLOGICAL ZONE INSPECTOR
          </span>
          <h3 className="font-display font-bold text-lg text-white">
            {selectedZone.name}
          </h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded text-mine-muted hover:text-white hover:bg-mine-elevated transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Risk & Confidence Overview */}
      <div className="flex items-center justify-between bg-mine-elevated p-3 rounded-lg border border-mine-border">
        <div>
          <span className="text-[10px] font-mono text-mine-muted uppercase block">
            CURRENT ZONE STATUS
          </span>
          <StatusBadge status={selectedZone.status} size="md" pulse={selectedZone.status === 'HIGH' || selectedZone.status === 'CRITICAL'} />
        </div>

        <div className="text-right">
          <span className="text-[10px] font-mono text-mine-muted uppercase block">
            AI CONFIDENCE
          </span>
          <span className="text-lg font-bold font-mono text-cyan-300">
            {selectedZone.confidence}%
          </span>
        </div>
      </div>

      {/* Primary Kinematic Readings */}
      <div className="space-y-2">
        <span className="text-[10px] font-mono text-mine-secondary uppercase tracking-wider block font-semibold">
          ACTIVE DEFORMATION TELEMETRY
        </span>

        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
          <div className="bg-mine-elevated/70 p-2.5 rounded border border-mine-border/80">
            <span className="text-mine-muted text-[10px] block">TILT DEVIATION</span>
            <span className="font-bold text-white text-sm">{selectedZone.primaryDrivers.tilt}</span>
          </div>
          <div className="bg-mine-elevated/70 p-2.5 rounded border border-mine-border/80">
            <span className="text-mine-muted text-[10px] block">ROOF CONVERGENCE</span>
            <span className="font-bold text-white text-sm">{selectedZone.primaryDrivers.displacement}</span>
          </div>
          <div className="bg-mine-elevated/70 p-2.5 rounded border border-mine-border/80">
            <span className="text-mine-muted text-[10px] block">ACOUSTIC FREQUENCY</span>
            <span className="font-bold text-white text-sm">{selectedZone.primaryDrivers.vibration}</span>
          </div>
          <div className="bg-mine-elevated/70 p-2.5 rounded border border-mine-border/80">
            <span className="text-mine-muted text-[10px] block">OPTICAL CV VERIFY</span>
            <span className="font-bold text-cyan-300 text-sm truncate">{selectedZone.primaryDrivers.visualVerification}</span>
          </div>
        </div>
      </div>

      {/* Associated Sensors in this Zone */}
      <div className="space-y-2">
        <span className="text-[10px] font-mono text-mine-secondary uppercase tracking-wider block font-semibold">
          ATTACHED TELEMETRY NODES ({zoneSensors.length})
        </span>

        <div className="space-y-1.5 font-mono text-xs">
          {zoneSensors.map(sensor => (
            <div
              key={sensor.id}
              onClick={() => onNavigateToSensor?.(sensor.id)}
              className="bg-mine-elevated/80 hover:bg-mine-highlight p-2 rounded border border-mine-border flex items-center justify-between cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-2">
                <Radio className="w-3.5 h-3.5 text-cyan-400" />
                <span className="font-bold text-white">{sensor.id}</span>
                <span className="text-[10px] text-mine-muted">({sensor.type})</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-mine-secondary text-[11px]">
                  {sensor.type === 'TILT' ? `${sensor.currentReading.tilt}°` : `${sensor.currentReading.displacement}mm`}
                </span>
                <StatusBadge status={sensor.status} size="sm" showIcon={false} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Incident Warning if present */}
      {activeAlert && (
        <div className="bg-red-950/40 border border-red-500/40 p-3 rounded-lg text-xs space-y-2">
          <div className="flex items-center gap-1.5 text-red-400 font-semibold font-mono">
            <ShieldAlert className="w-4 h-4" />
            <span>ACTIVE INCIDENT: {activeAlert.id}</span>
          </div>
          <p className="text-mine-secondary text-[11px]">
            {activeAlert.description}
          </p>
          <button
            onClick={() => onNavigateToAlert?.(activeAlert.id)}
            className="w-full bg-red-600/80 hover:bg-red-600 text-white font-mono text-xs py-1.5 rounded transition-colors flex items-center justify-center gap-1"
          >
            <span>Open Incident Dispatch</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
