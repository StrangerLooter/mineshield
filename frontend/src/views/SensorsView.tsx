import React, { useState } from 'react';
import { useTelemetry } from '../context/TelemetryContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { Radio, Filter, Cpu, Battery, Wifi, Activity, ArrowRight, AlertTriangle } from 'lucide-react';

interface SensorsViewProps {
  onNavigateToSensor: (sensorId: string) => void;
}

export const SensorsView: React.FC<SensorsViewProps> = ({ onNavigateToSensor }) => {
  const { sensors, setSelectedSensor } = useTelemetry();
  const [filterType, setFilterType] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const filteredSensors = sensors.filter(s => {
    const matchType = filterType === 'ALL' || s.type === filterType;
    const matchStatus = filterStatus === 'ALL' || s.status === filterStatus;
    return matchType && matchStatus;
  });

  return (
    <div className="space-y-4">
      {/* Top Header & Filter Controls */}
      <div className="bg-mine-surface border border-mine-border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
        <div>
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-cyan-400" />
            <h2 className="text-lg font-display font-bold text-white">
              SUBTERRANEAN SENSOR TELEMETRY NODES
            </h2>
          </div>
          <p className="text-xs font-mono text-mine-muted mt-0.5">
            Distributed MPU6050 inclination, VL53L0X displacement, and acoustic monitoring mesh.
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2 text-xs font-mono">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-mine-elevated border border-mine-border text-mine-text px-2.5 py-1 rounded text-xs focus:outline-none"
          >
            <option value="ALL">All Types</option>
            <option value="TILT">Tilt (MPU6050)</option>
            <option value="DISPLACEMENT">Displacement</option>
            <option value="VIBRATION">Acoustic Vib</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-mine-elevated border border-mine-border text-mine-text px-2.5 py-1 rounded text-xs focus:outline-none"
          >
            <option value="ALL">All Status</option>
            <option value="HEALTHY">Healthy</option>
            <option value="DEGRADED">Degraded</option>
            <option value="FAULT">Fault</option>
          </select>
        </div>
      </div>

      {/* Sensor Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredSensors.map(sensor => {
          const isFault = sensor.status === 'FAULT' || sensor.status === 'DEGRADED';
          const reading = sensor.currentReading;

          return (
            <div
              key={sensor.id}
              onClick={() => {
                setSelectedSensor(sensor);
                onNavigateToSensor(sensor.id);
              }}
              className="bg-mine-surface border border-mine-border hover:border-cyan-500/60 rounded-xl p-4 cursor-pointer transition-all shadow-sm hover:shadow-cyan-950/30 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 font-mono">
                    <span className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {sensor.id}
                    </span>
                    <span className="text-[10px] text-mine-muted">({sensor.nodeId})</span>
                  </div>
                  <StatusBadge status={sensor.status} size="sm" />
                </div>

                <p className="text-xs text-mine-secondary font-medium truncate">
                  {sensor.zoneName}
                </p>
                <p className="text-[10px] font-mono text-cyan-400 mt-0.5">
                  {sensor.location.tunnel} • Depth: {sensor.location.depthMeters}m
                </p>

                {/* Primary Metric Display */}
                <div className="mt-3 bg-mine-elevated p-3 rounded-lg border border-mine-border/80">
                  <div className="flex items-baseline justify-between font-mono">
                    <span className="text-[10px] text-mine-muted uppercase">
                      {sensor.type === 'TILT' ? 'INCLINATION TILT' : sensor.type === 'DISPLACEMENT' ? 'CONVERGENCE' : 'ACOUSTIC VIB'}
                    </span>
                    <span className="text-xl font-bold text-white">
                      {sensor.type === 'TILT'
                        ? `${reading.tilt > 0 ? `+${reading.tilt.toFixed(2)}` : reading.tilt.toFixed(2)}°`
                        : sensor.type === 'DISPLACEMENT'
                        ? `${reading.displacement.toFixed(1)} mm`
                        : `${reading.vibration.toFixed(2)} g`}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-mono text-mine-secondary mt-1 pt-1 border-t border-mine-border/60">
                    <span>Temp: {reading.temperature.toFixed(1)}°C</span>
                    <span>Gas: {reading.gasPpm} ppm</span>
                  </div>
                </div>

                {/* Sensor Health Indicator */}
                {isFault && (
                  <div className="mt-2 text-[10px] font-mono text-amber-400 bg-amber-950/40 p-1.5 rounded border border-amber-800/40 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 shrink-0" />
                    <span className="truncate">{sensor.healthMetrics.faultReason || 'Degraded packet reception.'}</span>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="mt-4 pt-2.5 border-t border-mine-border/60 flex items-center justify-between text-[10px] font-mono text-mine-muted">
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-0.5">
                    <Wifi className="w-3 h-3 text-cyan-400" />
                    {reading.signalQuality}%
                  </span>
                  <span className="flex items-center gap-0.5">
                    <Battery className="w-3 h-3 text-emerald-400" />
                    {reading.batteryLevel}%
                  </span>
                </div>
                <div className="flex items-center gap-1 text-cyan-400 group-hover:translate-x-0.5 transition-transform">
                  <span>Inspect</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
