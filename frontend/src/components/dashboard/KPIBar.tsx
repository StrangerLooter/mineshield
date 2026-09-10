import React from 'react';
import { useTelemetry } from '../../context/TelemetryContext';
import { Radio, AlertTriangle, Cpu, TrendingUp, Clock, ShieldCheck, Activity } from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';

export const KPIBar: React.FC = () => {
  const { sensors, zones, alerts } = useTelemetry();

  const activeAlerts = alerts.filter(a => a.status === 'ACTIVE');
  const onlineSensors = sensors.filter(s => s.status === 'HEALTHY' || s.status === 'DEGRADED');

  // Overall mine risk is highest zone risk
  const hasCritical = zones.some(z => z.status === 'CRITICAL');
  const hasHigh = zones.some(z => z.status === 'HIGH');
  const hasWarning = zones.some(z => z.status === 'WARNING');

  const overallRisk = hasCritical ? 'CRITICAL' : hasHigh ? 'HIGH' : hasWarning ? 'WARNING' : 'SAFE';
  const overallRiskScore = hasCritical ? 94 : hasHigh ? 82 : hasWarning ? 48 : 14;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {/* 1. System Status */}
      <div className="bg-mine-surface border border-mine-border rounded-lg p-3 flex flex-col justify-between">
        <div className="flex items-center justify-between text-xs text-mine-secondary mb-1">
          <span className="font-mono uppercase text-[10px]">SYSTEM STATUS</span>
          <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
        </div>
        <div>
          <div className="text-sm font-semibold text-white flex items-center gap-1.5 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>
            LIVE
          </div>
          <p className="text-[10px] text-mine-muted truncate mt-0.5">All nodes telemetry linked</p>
        </div>
      </div>

      {/* 2. Overall Mine Risk */}
      <div className="bg-mine-surface border border-mine-border rounded-lg p-3 flex flex-col justify-between">
        <div className="flex items-center justify-between text-xs text-mine-secondary mb-1">
          <span className="font-mono uppercase text-[10px]">MINE STRATA RISK</span>
          <Activity className="w-3.5 h-3.5 text-cyan-400" />
        </div>
        <div className="flex items-baseline justify-between">
          <StatusBadge status={overallRisk} size="sm" pulse={overallRisk === 'CRITICAL' || overallRisk === 'HIGH'} />
          <span className="text-xs font-mono text-mine-secondary">{overallRiskScore}% index</span>
        </div>
      </div>

      {/* 3. Active Alerts */}
      <div className="bg-mine-surface border border-mine-border rounded-lg p-3 flex flex-col justify-between">
        <div className="flex items-center justify-between text-xs text-mine-secondary mb-1">
          <span className="font-mono uppercase text-[10px]">ACTIVE ALERTS</span>
          <AlertTriangle className={`w-3.5 h-3.5 ${activeAlerts.length > 0 ? 'text-orange-400' : 'text-emerald-400'}`} />
        </div>
        <div>
          <span className={`text-xl font-bold font-mono ${activeAlerts.length > 0 ? 'text-orange-400' : 'text-white'}`}>
            {activeAlerts.length < 10 ? `0${activeAlerts.length}` : activeAlerts.length}
          </span>
          <p className="text-[10px] text-mine-muted truncate mt-0.5">
            {activeAlerts.length > 0 ? 'Requires attention' : 'Nominal conditions'}
          </p>
        </div>
      </div>

      {/* 4. Sensors Online */}
      <div className="bg-mine-surface border border-mine-border rounded-lg p-3 flex flex-col justify-between">
        <div className="flex items-center justify-between text-xs text-mine-secondary mb-1">
          <span className="font-mono uppercase text-[10px]">SENSORS ONLINE</span>
          <Cpu className="w-3.5 h-3.5 text-cyan-400" />
        </div>
        <div>
          <span className="text-xl font-bold font-mono text-white">
            {onlineSensors.length} <span className="text-xs font-normal text-mine-muted">/ {sensors.length}</span>
          </span>
          <p className="text-[10px] text-mine-muted truncate mt-0.5">
            {sensors.some(s => s.status === 'DEGRADED') ? '1 Degraded link' : '100% Link health'}
          </p>
        </div>
      </div>

      {/* 5. AI Predictions */}
      <div className="bg-mine-surface border border-mine-border rounded-lg p-3 flex flex-col justify-between">
        <div className="flex items-center justify-between text-xs text-mine-secondary mb-1">
          <span className="font-mono uppercase text-[10px]">AI PREDICTION</span>
          <TrendingUp className="w-3.5 h-3.5 text-orange-400" />
        </div>
        <div>
          <div className="text-xs font-semibold text-orange-300 font-mono truncate">
            {hasCritical ? 'CRITICAL IN 30M' : hasHigh ? 'ESCALATING' : 'STABLE HORIZON'}
          </div>
          <p className="text-[10px] text-mine-muted truncate mt-0.5">Zone B deformation vector</p>
        </div>
      </div>

      {/* 6. Data Latency */}
      <div className="bg-mine-surface border border-mine-border rounded-lg p-3 flex flex-col justify-between">
        <div className="flex items-center justify-between text-xs text-mine-secondary mb-1">
          <span className="font-mono uppercase text-[10px]">DATA LATENCY</span>
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
        </div>
        <div>
          <span className="text-xl font-bold font-mono text-white">
            1.8 <span className="text-xs font-normal text-mine-muted">sec</span>
          </span>
          <p className="text-[10px] text-mine-muted truncate mt-0.5">Mesh to surface hub</p>
        </div>
      </div>
    </div>
  );
};
