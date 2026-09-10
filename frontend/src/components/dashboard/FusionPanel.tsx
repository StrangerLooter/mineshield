import React from 'react';
import { useTelemetry } from '../../context/TelemetryContext';
import { StatusBadge } from '../common/StatusBadge';
import { Radio, Camera, Cpu, ArrowDown, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';

export const FusionPanel: React.FC = () => {
  const { currentScenario, selectedZone, zones } = useTelemetry();
  const zone = selectedZone || zones.find(z => z.id === 'ZONE_B') || zones[0];

  const isNormal = currentScenario === 'NORMAL';
  const isFault = currentScenario === 'SENSOR_FAULT';
  const isTiltOnly = currentScenario === 'ELEVATED_TILT';
  const isCritical = currentScenario === 'CRITICAL_SUBSIDENCE';

  return (
    <div className="bg-mine-surface border border-mine-border rounded-xl p-5 shadow-lg flex flex-col justify-between">
      <div className="pb-3 mb-3 border-b border-mine-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-cyan-400" />
          <h3 className="font-display font-semibold text-sm text-white tracking-wide">
            SENSOR + CAMERA FUSION PIPELINE
          </h3>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/80">
          DUAL-MODALITY VERIFICATION
        </span>
      </div>

      <div className="space-y-3 font-mono text-xs">
        {/* Step 1: Subterranean Physical Sensors */}
        <div className="bg-mine-elevated/80 border border-mine-border rounded-lg p-3">
          <div className="flex items-center justify-between text-mine-secondary mb-2">
            <span className="flex items-center gap-1.5 text-cyan-300 font-semibold">
              <Radio className="w-3.5 h-3.5 text-cyan-400" />
              1. PHYSICAL SENSOR EVIDENCE
            </span>
            <span className="text-[10px] text-mine-muted">MPU6050 + EXTENSOMETER</span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-[11px]">
            <div className="bg-mine-surface p-2 rounded border border-mine-border/80">
              <span className="text-mine-muted block text-[10px]">TILT</span>
              <div className="flex items-center gap-1 mt-0.5 font-bold">
                {isNormal || isFault ? (
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Nominal
                  </span>
                ) : (
                  <span className="text-orange-400 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> Abnormal
                  </span>
                )}
              </div>
            </div>

            <div className="bg-mine-surface p-2 rounded border border-mine-border/80">
              <span className="text-mine-muted block text-[10px]">DISPLACEMENT</span>
              <div className="flex items-center gap-1 mt-0.5 font-bold">
                {isNormal || isFault ? (
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Stable
                  </span>
                ) : (
                  <span className="text-orange-400 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> Increasing
                  </span>
                )}
              </div>
            </div>

            <div className="bg-mine-surface p-2 rounded border border-mine-border/80">
              <span className="text-mine-muted block text-[10px]">VIBRATION</span>
              <div className="flex items-center gap-1 mt-0.5 font-bold">
                {isNormal || isFault || isTiltOnly ? (
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Nominal
                  </span>
                ) : (
                  <span className="text-orange-400 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> Abnormal
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Down Arrow */}
        <div className="flex justify-center text-mine-muted -my-1">
          <ArrowDown className="w-4 h-4 animate-bounce text-cyan-400" />
        </div>

        {/* Step 2: Optical Verification */}
        <div className="bg-mine-elevated/80 border border-mine-border rounded-lg p-3">
          <div className="flex items-center justify-between text-mine-secondary mb-2">
            <span className="flex items-center gap-1.5 text-cyan-300 font-semibold">
              <Camera className="w-3.5 h-3.5 text-cyan-400" />
              2. ESP32-CAM VISUAL EVIDENCE
            </span>
            <span className="text-[10px] text-mine-muted">OPTICAL EDGE AI</span>
          </div>

          <div className="flex items-center justify-between bg-mine-surface p-2.5 rounded border border-mine-border/80 text-[11px]">
            <div>
              <span className="text-mine-muted block text-[10px]">SURFACE ANOMALY DETECTION</span>
              <span className="font-bold text-white">
                {isNormal || isFault || isTiltOnly ? 'No Roof Fissures Detected' : 'Roof Fissure & Pillar Spalling Confirmed'}
              </span>
            </div>
            <div className="text-right">
              <span className="text-mine-muted block text-[10px]">CV CONFIDENCE</span>
              <span className="text-cyan-300 font-bold">
                {isNormal || isFault ? '96.0%' : isTiltOnly ? '84.0%' : '91.4%'}
              </span>
            </div>
          </div>
        </div>

        {/* Down Arrow */}
        <div className="flex justify-center text-mine-muted -my-1">
          <ArrowDown className="w-4 h-4 text-cyan-400" />
        </div>

        {/* Step 3: Fusion Engine Output */}
        <div className="bg-gradient-to-r from-mine-elevated to-mine-highlight border border-cyan-500/40 rounded-lg p-3 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-cyan-400 uppercase font-semibold block">
              FUSION ENGINE OUTPUT
            </span>
            <div className="flex items-center gap-2 mt-1">
              <StatusBadge status={zone.status} size="sm" pulse={isCritical} />
              <span className="text-xs text-white">
                {isNormal ? 'Stable Strata' : isFault ? 'Fault Isolated' : isCritical ? 'Critical Evacuation Event' : 'Corroborated High Risk'}
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-mine-muted uppercase block">FUSION CONFIDENCE</span>
            <span className="text-base font-bold text-cyan-300 font-mono">
              {isNormal ? '96%' : isFault ? '52%' : isCritical ? '98%' : '94%'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
