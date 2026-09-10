import React, { useState } from 'react';
import { useTelemetry } from '../context/TelemetryContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { Camera, Eye, Cpu, AlertTriangle, CheckCircle2, SplitSquareVertical, Sparkles, ShieldAlert } from 'lucide-react';

export const CameraView: React.FC = () => {
  const { cameraEvents, currentScenario } = useTelemetry();
  const [activeTab, setActiveTab] = useState<'DIFF' | 'CURRENT' | 'BASELINE'>('DIFF');

  const event = cameraEvents[0];
  const isCrackDetected = currentScenario !== 'NORMAL' && currentScenario !== 'SENSOR_FAULT';

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="bg-mine-surface border border-mine-border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
        <div>
          <div className="flex items-center gap-2">
            <Camera className="w-4 h-4 text-cyan-400" />
            <h2 className="text-lg font-display font-bold text-white">
              ESP32-CAM OPTICAL SURVEILLANCE & COMPUTER VISION
            </h2>
          </div>
          <p className="text-xs font-mono text-mine-muted mt-0.5">
            Secondary optical verification triggered by kinematic threshold anomalies (SIH26025).
          </p>
        </div>

        {/* Demo status label per Section 30/31 */}
        <div className="flex items-center gap-2 bg-mine-elevated px-3 py-1.5 rounded border border-mine-border text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
          <span className="text-cyan-300 font-semibold">SIMULATED OPTICAL CAPTURE</span>
        </div>
      </div>

      {/* Main Grid: Left Camera Feed & Right AI Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left 2 Cols: Optical Image Viewer & Diff Analyzer */}
        <div className="lg:col-span-2 bg-mine-surface border border-mine-border rounded-xl p-5 shadow-lg space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-mine-border">
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="font-bold text-white">NODE: {event.cameraId}</span>
              <span className="text-mine-muted">•</span>
              <span className="text-cyan-400">{event.zoneName}</span>
            </div>

            {/* View Mode Toggle */}
            <div className="flex bg-mine-elevated p-0.5 rounded border border-mine-border font-mono text-xs">
              <button
                onClick={() => setActiveTab('DIFF')}
                className={`px-3 py-1 rounded transition-colors ${
                  activeTab === 'DIFF' ? 'bg-cyan-950 text-cyan-300 font-semibold' : 'text-mine-secondary hover:text-white'
                }`}
              >
                AI Bounding Diff
              </button>
              <button
                onClick={() => setActiveTab('CURRENT')}
                className={`px-3 py-1 rounded transition-colors ${
                  activeTab === 'CURRENT' ? 'bg-cyan-950 text-cyan-300 font-semibold' : 'text-mine-secondary hover:text-white'
                }`}
              >
                Event Capture
              </button>
              <button
                onClick={() => setActiveTab('BASELINE')}
                className={`px-3 py-1 rounded transition-colors ${
                  activeTab === 'BASELINE' ? 'bg-cyan-950 text-cyan-300 font-semibold' : 'text-mine-secondary hover:text-white'
                }`}
              >
                Pre-Shift Baseline
              </button>
            </div>
          </div>

          {/* Photographic Subterranean Stope Canvas with Bounding Boxes */}
          <div className="relative w-full h-[320px] sm:h-[400px] bg-black rounded-lg overflow-hidden border border-mine-border flex items-center justify-center select-none">
            {/* High-res subterranean rock / mine ceiling texture simulation */}
            <svg viewBox="0 0 600 400" className="w-full h-full object-cover">
              {/* Dark mine gallery background */}
              <defs>
                <radialGradient id="tunnel-light" cx="50%" cy="40%" r="60%">
                  <stop offset="0%" stopColor="#2A353D" />
                  <stop offset="60%" stopColor="#12181C" />
                  <stop offset="100%" stopColor="#080B0D" />
                </radialGradient>
              </defs>

              <rect width="600" height="400" fill="url(#tunnel-light)" />

              {/* Subterranean rock strata layers and rough textures */}
              <path d="M 0 120 Q 150 110 300 135 T 600 125" stroke="#3D4B54" strokeWidth="3" fill="none" opacity="0.6" />
              <path d="M 0 240 Q 200 230 400 250 T 600 235" stroke="#3D4B54" strokeWidth="2" fill="none" opacity="0.5" />
              
              {/* Roof bolts and support plates */}
              <circle cx="160" cy="110" r="10" fill="#1C262C" stroke="#4B5E6B" strokeWidth="2" />
              <circle cx="340" cy="120" r="10" fill="#1C262C" stroke="#4B5E6B" strokeWidth="2" />
              <circle cx="500" cy="115" r="10" fill="#1C262C" stroke="#4B5E6B" strokeWidth="2" />

              {/* Physical Crack Fracture (Visible when anomaly detected) */}
              {isCrackDetected && (
                <g>
                  {/* Jagged crack line */}
                  <path
                    d="M 170 140 L 195 160 L 220 155 L 245 185 L 270 175 L 290 205"
                    stroke="#EF4444"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                    className="animate-pulse"
                  />
                  {/* Secondary fissure branching */}
                  <path
                    d="M 220 155 L 240 140 L 260 145"
                    stroke="#F97316"
                    strokeWidth="2"
                    fill="none"
                  />

                  {/* AI Bounding Box 1 */}
                  <rect
                    x="150"
                    y="125"
                    width="160"
                    height="95"
                    fill="rgba(239, 68, 68, 0.15)"
                    stroke="#EF4444"
                    strokeWidth="1.5"
                    strokeDasharray="4 2"
                  />
                  <rect x="150" y="105" width="160" height="20" fill="#EF4444" rx="2" />
                  <text x="156" y="119" fill="#FFFFFF" fontSize="10" fontWeight="bold" fontFamily="monospace">
                    ROOF FISSURE (91.4%)
                  </text>

                  {/* AI Bounding Box 2 (Pillar spalling) */}
                  <rect
                    x="350"
                    y="220"
                    width="120"
                    height="90"
                    fill="rgba(249, 115, 22, 0.15)"
                    stroke="#F97316"
                    strokeWidth="1.5"
                    strokeDasharray="4 2"
                  />
                  <rect x="350" y="200" width="120" height="20" fill="#F97316" rx="2" />
                  <text x="356" y="214" fill="#FFFFFF" fontSize="10" fontWeight="bold" fontFamily="monospace">
                    SPALLING SHEAR (88.2%)
                  </text>
                </g>
              )}

              {/* Edge AI crosshair overlay */}
              <g stroke="#06B6D4" strokeWidth="1" opacity="0.4">
                <line x1="20" y1="20" x2="50" y2="20" />
                <line x1="20" y1="20" x2="20" y2="50" />
                <line x1="580" y1="20" x2="550" y2="20" />
                <line x1="580" y1="20" x2="580" y2="50" />
                <line x1="20" y1="380" x2="50" y2="380" />
                <line x1="20" y1="380" x2="20" y2="350" />
                <line x1="580" y1="380" x2="550" y2="380" />
                <line x1="580" y1="380" x2="580" y2="350" />
              </g>
            </svg>

            {/* Bottom HUD metadata */}
            <div className="absolute bottom-3 left-3 bg-mine-surface/90 backdrop-blur border border-mine-border px-3 py-1.5 rounded font-mono text-[11px] text-white flex items-center gap-3">
              <span className="flex items-center gap-1 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span> 30 FPS
              </span>
              <span>RES: 800x600 (OV2640)</span>
              <span>EXPOSURE: LOW-LIGHT IR BOOST</span>
            </div>
          </div>

          <p className="text-xs font-mono text-mine-muted">
            *ESP32-CAM frames are captured only upon physical kinematic deviation trigger to preserve subterranean battery and mesh bandwidth.
          </p>
        </div>

        {/* Right Col: Computer Vision Inference Metrics */}
        <div className="space-y-4">
          <div className="bg-mine-surface border border-mine-border rounded-xl p-5 shadow-lg space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-mine-border">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-cyan-400" />
                <h3 className="font-display font-semibold text-sm text-white">
                  CV INFERENCE DOSSIER
                </h3>
              </div>
              <StatusBadge status={isCrackDetected ? 'HIGH' : 'SAFE'} size="sm" />
            </div>

            <div className="space-y-2.5">
              <div className="bg-mine-elevated p-2.5 rounded border border-mine-border flex items-center justify-between">
                <span className="text-mine-muted text-[11px]">ANOMALY STATUS</span>
                <span className={`font-bold ${isCrackDetected ? 'text-red-400' : 'text-emerald-400'}`}>
                  {isCrackDetected ? 'CRACK DETECTED' : 'CLEAR PROFILE'}
                </span>
              </div>

              <div className="bg-mine-elevated p-2.5 rounded border border-mine-border flex items-center justify-between">
                <span className="text-mine-muted text-[11px]">AI CONFIDENCE</span>
                <span className="font-bold text-cyan-300">
                  {isCrackDetected ? '91.4%' : '96.0%'}
                </span>
              </div>

              <div className="bg-mine-elevated p-2.5 rounded border border-mine-border flex items-center justify-between">
                <span className="text-mine-muted text-[11px]">CLASSIFIED ANOMALY</span>
                <span className="font-bold text-white">
                  {isCrackDetected ? 'Longitudinal Roof Fissure' : 'None'}
                </span>
              </div>

              <div className="bg-mine-elevated p-2.5 rounded border border-mine-border flex items-center justify-between">
                <span className="text-mine-muted text-[11px]">EVENT CAPTURE TIME</span>
                <span className="font-bold text-mine-text">14:28:41 IST</span>
              </div>
            </div>

            <div className="pt-3 border-t border-mine-border space-y-2">
              <span className="text-[10px] text-mine-muted uppercase block">
                FUSION CORROBORATION:
              </span>
              <p className="text-mine-secondary leading-relaxed text-[11px]">
                {isCrackDetected
                  ? 'Optical fracture pixels directly match MPU6050 +2.84° tilt vector. Structural deformation verified with high multi-modal certainty.'
                  : 'No surface fracture or pillar spalling detected. Strata profile nominal.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
