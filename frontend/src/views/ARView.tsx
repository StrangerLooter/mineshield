import React, { useState } from 'react';
import { useTelemetry } from '../context/TelemetryContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { Glasses, Eye, Compass, MoveDown, Radio, Sparkles, Box, ShieldAlert } from 'lucide-react';

export const ARView: React.FC = () => {
  const { currentScenario } = useTelemetry();
  const [isARActive, setIsARActive] = useState<boolean>(false);

  const isCritical = currentScenario === 'CRITICAL_SUBSIDENCE';

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="bg-mine-surface border border-mine-border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
        <div>
          <div className="flex items-center gap-2">
            <Glasses className="w-4 h-4 text-cyan-400" />
            <h2 className="text-lg font-display font-bold text-white">
              AUGMENTED REALITY (AR) SPATIAL STRATA INSPECTION
            </h2>
          </div>
          <p className="text-xs font-mono text-mine-muted mt-0.5">
            Spatial overlay extension for subterranean mine walk-throughs & in-situ pillar stress inspection (SIH26025).
          </p>
        </div>

        <button
          onClick={() => setIsARActive(!isARActive)}
          className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold transition-colors flex items-center gap-2 shadow-md"
        >
          <Box className="w-4 h-4" />
          <span>{isARActive ? 'EXIT AR SIMULATOR' : 'ENTER AR VIEW (SIMULATOR)'}</span>
        </button>
      </div>

      {/* AR Simulation Viewport */}
      <div className="relative w-full h-[420px] sm:h-[480px] bg-black rounded-xl overflow-hidden border border-cyan-500/40 shadow-2xl flex items-center justify-center select-none font-mono text-xs">
        {/* 3D Perspective Wireframe Mine Drift */}
        <svg viewBox="0 0 800 500" className="w-full h-full object-cover">
          <defs>
            <linearGradient id="tunnelGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0B0F12" />
              <stop offset="50%" stopColor="#161D21" />
              <stop offset="100%" stopColor="#070A0C" />
            </linearGradient>
          </defs>

          <rect width="800" height="500" fill="url(#tunnelGrad)" />

          {/* Vanishing point tunnel perspective lines */}
          <g stroke="#273036" strokeWidth="1.5" opacity="0.7">
            {/* Ceiling perspective */}
            <line x1="0" y1="50" x2="400" y2="230" />
            <line x1="800" y1="50" x2="400" y2="230" />
            {/* Floor perspective */}
            <line x1="0" y1="450" x2="400" y2="270" />
            <line x1="800" y1="450" x2="400" y2="270" />
            {/* Cross frames */}
            <rect x="100" y="80" width="600" height="340" rx="20" fill="none" stroke="#273036" strokeWidth="2" />
            <rect x="220" y="130" width="360" height="240" rx="14" fill="none" stroke="#273036" strokeWidth="1.5" />
            <rect x="320" y="180" width="160" height="140" rx="10" fill="none" stroke="#273036" strokeWidth="1" />
          </g>

          {/* Roof Strata Stress Overlay Heatmap */}
          <ellipse
            cx="400"
            cy="110"
            rx="220"
            ry="40"
            fill={isCritical ? '#EF4444' : '#F97316'}
            opacity="0.3"
            className="animate-pulse"
          />

          {/* Floating AR Sensor Marker S03 */}
          <g transform="translate(480, 160)" className="cursor-pointer">
            <line x1="0" y1="0" x2="60" y2="-40" stroke="#06B6D4" strokeWidth="1.5" strokeDasharray="3 2" />
            
            {/* Pulsing Beacon */}
            <circle r="12" fill="rgba(6, 182, 212, 0.2)" stroke="#06B6D4" strokeWidth="1.5" className="animate-ping" />
            <circle r="6" fill="#06B6D4" stroke="#FFFFFF" strokeWidth="2" />

            {/* AR Hologram Card */}
            <g transform="translate(60, -80)">
              <rect width="180" height="90" rx="6" fill="rgba(17, 23, 27, 0.9)" stroke="#06B6D4" strokeWidth="1.5" />
              <text x="12" y="20" fill="#38BDF8" fontSize="11" fontWeight="bold" fontFamily="monospace">
                NODE S03 (BEAM HEAD)
              </text>
              <text x="12" y="38" fill="#F1F5F5" fontSize="10" fontFamily="monospace">
                TILT: +2.84° (CRITICAL DRIFT)
              </text>
              <text x="12" y="54" fill="#F97316" fontSize="10" fontWeight="bold" fontFamily="monospace">
                CONVERGENCE: 5.2 mm
              </text>
              <text x="12" y="70" fill="#EF4444" fontSize="10" fontWeight="bold" fontFamily="monospace">
                PREDICTED: CRITICAL (30M)
              </text>
            </g>
          </g>

          {/* AR Reticle in Center */}
          <g transform="translate(400, 250)" stroke="#06B6D4" strokeWidth="1" opacity="0.6">
            <circle r="20" fill="none" strokeDasharray="4 2" />
            <line x1="-30" y1="0" x2="-10" y2="0" />
            <line x1="10" y1="0" x2="30" y2="0" />
            <line x1="0" y1="-30" x2="0" y2="-10" />
            <line x1="0" y1="10" x2="0" y2="30" />
          </g>
        </svg>

        {/* Top-left HUD status */}
        <div className="absolute top-4 left-4 bg-mine-surface/90 backdrop-blur border border-mine-border p-3 rounded-lg text-xs space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-bold text-white">SPATIAL TRACKING: LOCKED</span>
          </div>
          <p className="text-mine-muted text-[10px]">FOV: 84° • GYRO STABILIZED • SLAM RUNNING</p>
        </div>

        {/* Bottom banner note */}
        <div className="absolute bottom-4 left-4 right-4 bg-mine-surface/90 backdrop-blur border border-mine-border p-2.5 rounded-lg text-center text-mine-muted text-[11px]">
          *Desktop Simulation Mode: On supported WebXR Android/AR glasses devices, camera passthrough renders real-time stress vectors directly onto mine gallery rock face.
        </div>
      </div>
    </div>
  );
};
