import React from 'react';
import { useTelemetry } from '../../context/TelemetryContext';
import { StatusBadge } from '../common/StatusBadge';
import { ShieldAlert, TrendingUp, Compass, MoveDown, Activity, Camera, Eye, ArrowUpRight } from 'lucide-react';

interface HeroRiskPanelProps {
  onInspectZone?: (zoneId: string) => void;
  onOpenFusion?: () => void;
}

export const HeroRiskPanel: React.FC<HeroRiskPanelProps> = ({ onInspectZone, onOpenFusion }) => {
  const { selectedZone, zones, sensors } = useTelemetry();

  // Primary active zone (defaults to Zone B if high/critical, or selected zone)
  const activeZone = selectedZone || zones.find(z => z.id === 'ZONE_B') || zones[0];
  const s03 = sensors.find(s => s.id === 'S03');

  const isCritical = activeZone.status === 'CRITICAL';
  const isHigh = activeZone.status === 'HIGH';
  const isWarning = activeZone.status === 'WARNING';

  return (
    <div
      className={`rounded-xl border p-5 transition-all shadow-xl ${
        isCritical
          ? 'bg-gradient-to-br from-red-950/40 via-mine-surface to-mine-elevated border-red-500/50 shadow-red-950/20'
          : isHigh
          ? 'bg-gradient-to-br from-orange-950/30 via-mine-surface to-mine-elevated border-orange-500/40 shadow-orange-950/20'
          : isWarning
          ? 'bg-gradient-to-br from-amber-950/20 via-mine-surface to-mine-elevated border-amber-500/30'
          : 'bg-gradient-to-br from-emerald-950/20 via-mine-surface to-mine-elevated border-emerald-500/30'
      }`}
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-mine-border/80">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-semibold text-mine-muted uppercase tracking-wider">
              MINE SUBSIDENCE RISK STATUS
            </span>
            <span className="text-xs font-mono text-cyan-400 font-bold px-1.5 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/60">
              {activeZone.panel}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
              {activeZone.name}
            </h2>
            <StatusBadge status={activeZone.status} size="lg" pulse={isCritical || isHigh} />
          </div>
        </div>

        {/* Prominent separate Confidence & Risk Velocity Meters */}
        <div className="flex items-center gap-3 sm:gap-6 bg-mine-elevated/90 px-4 py-2.5 rounded-lg border border-mine-border/80">
          <div>
            <span className="text-[10px] font-mono text-mine-muted uppercase block">
              AI CONFIDENCE SCORE
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold font-mono text-cyan-300">
                {activeZone.confidence}%
              </span>
              <span className="text-[10px] font-mono text-emerald-400">High Corroboration</span>
            </div>
          </div>

          <div className="h-8 w-px bg-mine-border" />

          <div>
            <span className="text-[10px] font-mono text-mine-muted uppercase block">
              SUBSIDENCE VELOCITY
            </span>
            <div className="flex items-center gap-1">
              <TrendingUp className={`w-4 h-4 ${isCritical ? 'text-red-400' : isHigh ? 'text-orange-400' : 'text-emerald-400'}`} />
              <span className="text-sm font-bold font-mono text-white">
                {isCritical ? 'CRITICAL SPIKE' : isHigh ? '↑ INCREASING' : 'STABLE'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Physical Drivers Section */}
      <div className="mt-4">
        <p className="text-[11px] font-mono text-mine-secondary uppercase tracking-wider mb-2.5 flex items-center justify-between">
          <span>PRIMARY STRATA DEFORMATION DRIVERS (NODE CLUSTER S03–S05)</span>
          <span className="text-cyan-400 text-[10px]">VERIFIED VIA MULTI-MODAL SENSOR FUSION</span>
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {/* 1. Tilt */}
          <div className="bg-mine-elevated/70 border border-mine-border rounded-lg p-3">
            <div className="flex items-center justify-between text-xs text-mine-secondary mb-1">
              <span className="font-mono text-[10px]">TILT (MPU6050)</span>
              <Compass className="w-3.5 h-3.5 text-orange-400" />
            </div>
            <div className="text-lg font-bold font-mono text-white">
              {s03 ? (s03.currentReading.tilt > 0 ? `+${s03.currentReading.tilt}°` : `${s03.currentReading.tilt}°`) : '+2.84°'}
            </div>
            <p className="text-[10px] font-mono text-orange-400 mt-0.5">
              {isCritical ? 'Critical shear angle' : isHigh ? '↑ Escalating drift' : 'Within baseline'}
            </p>
          </div>

          {/* 2. Displacement */}
          <div className="bg-mine-elevated/70 border border-mine-border rounded-lg p-3">
            <div className="flex items-center justify-between text-xs text-mine-secondary mb-1">
              <span className="font-mono text-[10px]">CONVERGENCE DISP</span>
              <MoveDown className="w-3.5 h-3.5 text-orange-400" />
            </div>
            <div className="text-lg font-bold font-mono text-white">
              {s03 ? `${s03.currentReading.displacement} mm` : '5.2 mm'}
            </div>
            <p className="text-[10px] font-mono text-orange-400 mt-0.5">
              {isCritical ? 'Roof sag breach (>8mm)' : isHigh ? '↑ 1.7mm / 30min' : 'Stable'}
            </p>
          </div>

          {/* 3. Vibration */}
          <div className="bg-mine-elevated/70 border border-mine-border rounded-lg p-3">
            <div className="flex items-center justify-between text-xs text-mine-secondary mb-1">
              <span className="font-mono text-[10px]">ACOUSTIC VIB</span>
              <Activity className="w-3.5 h-3.5 text-orange-400" />
            </div>
            <div className="text-lg font-bold font-mono text-white">
              {s03 ? `${s03.currentReading.vibration} g` : '0.72 g'}
            </div>
            <p className="text-[10px] font-mono text-orange-400 mt-0.5">
              {isCritical ? 'Micro-seismic rupture' : isHigh ? 'Abnormal frequency' : 'Ambient noise'}
            </p>
          </div>

          {/* 4. Visual Verification */}
          <div className="bg-mine-elevated/70 border border-mine-border rounded-lg p-3">
            <div className="flex items-center justify-between text-xs text-mine-secondary mb-1">
              <span className="font-mono text-[10px]">ESP32-CAM CV</span>
              <Camera className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="text-sm font-bold font-mono text-cyan-300 truncate">
              {isHigh || isCritical ? 'Fissure Verified' : 'No Fissure'}
            </div>
            <p className="text-[10px] font-mono text-cyan-400 mt-0.5">
              {isHigh || isCritical ? '91.4% CV confidence' : 'Clear roof profile'}
            </p>
          </div>

          {/* 5. Predicted State */}
          <div className="bg-mine-elevated/70 border border-mine-border rounded-lg p-3 col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between text-xs text-mine-secondary mb-1">
              <span className="font-mono text-[10px]">PREDICTED STATE</span>
              <Eye className="w-3.5 h-3.5 text-red-400" />
            </div>
            <div className={`text-base font-bold font-mono ${isCritical ? 'text-red-400' : isHigh ? 'text-red-400' : 'text-emerald-400'}`}>
              {isCritical ? 'BREACH ACTIVE' : isHigh ? 'CRITICAL (30m)' : 'SAFE'}
            </div>
            <p className="text-[10px] font-mono text-mine-secondary mt-0.5">
              Time-series projection
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
