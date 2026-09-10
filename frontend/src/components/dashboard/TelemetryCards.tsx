import React from 'react';
import { useTelemetry } from '../../context/TelemetryContext';
import { StatusBadge } from '../common/StatusBadge';
import { Compass, MoveDown, Activity, Thermometer, Droplets, Wind, AlertCircle } from 'lucide-react';

interface TelemetryCardsProps {
  onSelectSensor?: (sensorId: string) => void;
}

export const TelemetryCards: React.FC<TelemetryCardsProps> = ({ onSelectSensor }) => {
  const { sensors, selectedSensor } = useTelemetry();

  // Focus sensor (default S03)
  const primarySensor = selectedSensor || sensors.find(s => s.id === 'S03') || sensors[0];
  const s04 = sensors.find(s => s.id === 'S04');

  const reading = primarySensor.currentReading;
  const isStale = reading.isStale || (Date.now() - primarySensor.lastHeartbeat > 15000);

  return (
    <div className="space-y-4">
      {/* Structural Sensors (PRIMARY) */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              PRIMARY STRUCTURAL KINEMATICS
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/80">
              NODE {primarySensor.id} ({primarySensor.nodeId})
            </span>
          </div>
          <span className="text-[10px] font-mono text-mine-muted">
            LAST HEARTBEAT: {isStale ? '28s ago (DEGRADED)' : '2s ago (LIVE)'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Card 1: Tilt */}
          <div
            onClick={() => onSelectSensor?.(primarySensor.id)}
            className="bg-mine-surface border border-mine-border hover:border-cyan-500/50 rounded-xl p-4 transition-all cursor-pointer shadow-md group"
          >
            <div className="flex items-center justify-between text-xs text-mine-secondary mb-2">
              <span className="font-mono text-[11px] text-mine-text font-semibold flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-orange-400" />
                TILT / INCLINATION
              </span>
              <span className="text-[10px] font-mono text-mine-muted">MPU6050</span>
            </div>

            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-2xl sm:text-3xl font-bold font-mono text-white tracking-tight">
                  {reading.tilt > 0 ? `+${reading.tilt.toFixed(2)}` : reading.tilt.toFixed(2)}
                  <span className="text-sm font-normal text-mine-muted ml-1">°</span>
                </span>
                <p className="text-[11px] font-mono text-orange-400 mt-1 flex items-center gap-1">
                  <span>↑ +0.61° / 30m</span>
                  <span className="text-mine-muted">• Rate anomalous</span>
                </p>
              </div>
              <StatusBadge status={primarySensor.status} size="sm" />
            </div>

            <div className="mt-3 pt-2.5 border-t border-mine-border/60 flex items-center justify-between text-[10px] font-mono text-mine-muted">
              <span>Threshold: 1.5° (Warn)</span>
              <span className="text-orange-400">Breached</span>
            </div>
          </div>

          {/* Card 2: Displacement */}
          <div
            onClick={() => onSelectSensor?.(primarySensor.id)}
            className="bg-mine-surface border border-mine-border hover:border-cyan-500/50 rounded-xl p-4 transition-all cursor-pointer shadow-md group"
          >
            <div className="flex items-center justify-between text-xs text-mine-secondary mb-2">
              <span className="font-mono text-[11px] text-mine-text font-semibold flex items-center gap-1.5">
                <MoveDown className="w-4 h-4 text-orange-400" />
                ROOF CONVERGENCE
              </span>
              <span className="text-[10px] font-mono text-mine-muted">VL53L0X / DISP</span>
            </div>

            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-2xl sm:text-3xl font-bold font-mono text-white tracking-tight">
                  {reading.displacement.toFixed(1)}
                  <span className="text-sm font-normal text-mine-muted ml-1">mm</span>
                </span>
                <p className="text-[11px] font-mono text-orange-400 mt-1 flex items-center gap-1">
                  <span>↑ +1.7 mm / 30m</span>
                  <span className="text-mine-muted">• Extrapolating</span>
                </p>
              </div>
              <StatusBadge status={primarySensor.status} size="sm" />
            </div>

            <div className="mt-3 pt-2.5 border-t border-mine-border/60 flex items-center justify-between text-[10px] font-mono text-mine-muted">
              <span>Threshold: 3.0mm (Warn)</span>
              <span className="text-orange-400">High Risk</span>
            </div>
          </div>

          {/* Card 3: Vibration */}
          <div
            onClick={() => onSelectSensor?.(primarySensor.id)}
            className="bg-mine-surface border border-mine-border hover:border-cyan-500/50 rounded-xl p-4 transition-all cursor-pointer shadow-md group"
          >
            <div className="flex items-center justify-between text-xs text-mine-secondary mb-2">
              <span className="font-mono text-[11px] text-mine-text font-semibold flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-orange-400" />
                ACOUSTIC EMISSION
              </span>
              <span className="text-[10px] font-mono text-mine-muted">PIEZO / VIB</span>
            </div>

            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-2xl sm:text-3xl font-bold font-mono text-white tracking-tight">
                  {reading.vibration.toFixed(2)}
                  <span className="text-sm font-normal text-mine-muted ml-1">g</span>
                </span>
                <p className="text-[11px] font-mono text-orange-400 mt-1 flex items-center gap-1">
                  <span>ABNORMAL WAVE</span>
                  <span className="text-mine-muted">• Micro-fractures</span>
                </p>
              </div>
              <StatusBadge status={primarySensor.status} size="sm" />
            </div>

            <div className="mt-3 pt-2.5 border-t border-mine-border/60 flex items-center justify-between text-[10px] font-mono text-mine-muted">
              <span>Baseline: 0.05 g</span>
              <span className="text-orange-400">Elevated</span>
            </div>
          </div>
        </div>
      </div>

      {/* Environmental Sensors (SECONDARY - Visually subdued per Section 3) */}
      <div className="bg-mine-elevated/40 border border-mine-border/80 rounded-xl p-3.5">
        <div className="flex items-center justify-between mb-2 text-xs">
          <span className="text-[10px] font-mono text-mine-muted uppercase tracking-wider font-semibold">
            SUPPORTING ENVIRONMENTAL TELEMETRY (SECONDARY PARAMETERS)
          </span>
          <span className="text-[10px] font-mono text-emerald-400">
            ATMOSPHERIC CONDITIONS NOMINAL
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono">
          <div className="bg-mine-surface/80 p-2 rounded border border-mine-border/60 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Thermometer className="w-3.5 h-3.5 text-cyan-400" />
              <div>
                <span className="text-[10px] text-mine-muted block">TEMPERATURE</span>
                <span className="font-bold text-white">{reading.temperature.toFixed(1)} °C</span>
              </div>
            </div>
            <span className="text-[10px] text-emerald-400">Nominal</span>
          </div>

          <div className="bg-mine-surface/80 p-2 rounded border border-mine-border/60 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Droplets className="w-3.5 h-3.5 text-cyan-400" />
              <div>
                <span className="text-[10px] text-mine-muted block">HUMIDITY</span>
                <span className="font-bold text-white">{reading.humidity}% RH</span>
              </div>
            </div>
            <span className="text-[10px] text-emerald-400">Normal</span>
          </div>

          <div className="bg-mine-surface/80 p-2 rounded border border-mine-border/60 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wind className="w-3.5 h-3.5 text-cyan-400" />
              <div>
                <span className="text-[10px] text-mine-muted block">GAS / MQ-2</span>
                <span className="font-bold text-white">{reading.gasPpm} ppm</span>
              </div>
            </div>
            <span className="text-[10px] text-emerald-400">Safe Range</span>
          </div>

          <div className="bg-mine-surface/80 p-2 rounded border border-mine-border/60 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-mine-muted block">RF RSSI / BATTERY</span>
              <span className="font-bold text-white">{reading.signalQuality}% • {reading.batteryLevel}%</span>
            </div>
            <span className="text-[10px] text-emerald-400">3.18V</span>
          </div>
        </div>
      </div>
    </div>
  );
};
