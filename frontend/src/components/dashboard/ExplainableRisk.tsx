import React from 'react';
import { useTelemetry } from '../../context/TelemetryContext';
import { StatusBadge } from '../common/StatusBadge';
import { HelpCircle, Brain, CheckCircle2 } from 'lucide-react';

export const ExplainableRisk: React.FC = () => {
  const { selectedZone, zones, currentScenario } = useTelemetry();
  const zone = selectedZone || zones.find(z => z.id === 'ZONE_B') || zones[0];

  // Calibrated weights based on scenario
  let tiltWeight = 82;
  let dispWeight = 76;
  let vibWeight = 51;
  let camWeight = 88;
  let histWeight = 71;
  let confidenceScore = 94;

  if (currentScenario === 'NORMAL') {
    tiltWeight = 12;
    dispWeight = 15;
    vibWeight = 8;
    camWeight = 0;
    histWeight = 14;
    confidenceScore = 96;
  } else if (currentScenario === 'SENSOR_FAULT') {
    tiltWeight = 10;
    dispWeight = 12;
    vibWeight = 6;
    camWeight = 0;
    histWeight = 15;
    confidenceScore = 52;
  } else if (currentScenario === 'ELEVATED_TILT') {
    tiltWeight = 64;
    dispWeight = 58;
    vibWeight = 34;
    camWeight = 10;
    histWeight = 52;
    confidenceScore = 89;
  } else if (currentScenario === 'CRITICAL_SUBSIDENCE') {
    tiltWeight = 96;
    dispWeight = 94;
    vibWeight = 88;
    camWeight = 95;
    histWeight = 91;
    confidenceScore = 98;
  }

  const contributors = [
    { label: 'Tilt Angular Drift (MPU6050)', value: tiltWeight, color: 'from-orange-500 to-amber-500' },
    { label: 'Roof Convergence Displacement (VL53L0X)', value: dispWeight, color: 'from-orange-500 to-red-500' },
    { label: 'Acoustic / Micro-Seismic Vibration', value: vibWeight, color: 'from-amber-500 to-yellow-500' },
    { label: 'ESP32-CAM Optical Fracture Confirmation', value: camWeight, color: 'from-cyan-500 to-blue-500' },
    { label: 'Historical Strata Deformation Trend', value: histWeight, color: 'from-purple-500 to-indigo-500' },
  ];

  return (
    <div className="bg-mine-surface border border-mine-border rounded-xl p-5 shadow-lg">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-mine-border">
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4 text-cyan-400" />
          <h3 className="font-display font-semibold text-sm text-white tracking-wide">
            EXPLAINABLE AI RISK ASSESSMENT
          </h3>
        </div>
        <span className="text-[10px] font-mono text-mine-muted uppercase">
          WHY IS {zone.name} CLASSIFIED AS {zone.status}?
        </span>
      </div>

      <p className="text-xs text-mine-secondary mb-4 leading-relaxed">
        MineShield combines physical sensor kinematics with computer vision to prevent single-point false alarms. Below is the multi-modal evidence attribution breakdown:
      </p>

      {/* Progress Bars */}
      <div className="space-y-3 font-mono">
        {contributors.map((item, idx) => (
          <div key={idx}>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-mine-text text-[11px] truncate max-w-[80%]">
                {item.label}
              </span>
              <span className="text-cyan-300 font-semibold">{item.value}%</span>
            </div>
            <div className="w-full bg-mine-elevated h-2 rounded-full overflow-hidden border border-mine-border/80">
              <div
                className={`h-full bg-gradient-to-r ${item.color} transition-all duration-700`}
                style={{ width: `${item.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Summary Footer */}
      <div className="mt-5 pt-3.5 border-t border-mine-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs text-mine-secondary font-mono">FINAL RISK:</span>
          <StatusBadge status={zone.status} size="sm" />
        </div>
        <div className="flex items-center gap-1.5 font-mono text-xs">
          <span className="text-mine-secondary">CONFIDENCE:</span>
          <span className="text-cyan-300 font-bold">{confidenceScore}%</span>
        </div>
      </div>
    </div>
  );
};
