import React from 'react';
import { Shield, ArrowRight, Activity, Radio, Cpu, Layers, Camera, Brain, Glasses, CheckCircle2, ChevronRight } from 'lucide-react';
import { SYSTEM_METADATA } from '../constants';

interface LandingViewProps {
  onEnterDashboard: () => void;
  onExploreArchitecture: () => void;
}

export const LandingView: React.FC<LandingViewProps> = ({
  onEnterDashboard,
  onExploreArchitecture
}) => {
  const steps = [
    { num: '01', title: 'MONITOR', desc: 'Distributed ESP32 nodes sample MPU6050 inclination and extensometer convergence across deep panels.' },
    { num: '02', title: 'DETECT', desc: 'Edge algorithms filter machine vibration noise to detect genuine strata angular drifts (>1.5°).' },
    { num: '03', title: 'VERIFY', desc: 'ESP32-CAM optical capture triggers automatically to verify visual roof fissures and pillar spalling.' },
    { num: '04', title: 'PREDICT', desc: 'Time-series machine learning models forecast 15m/30m subsidence displacement curves and breach horizons.' },
    { num: '05', title: 'WARN', desc: 'Multi-modal fusion engine issues explainable high-confidence early warnings and siren dispatch.' },
  ];

  const techBadges = [
    'ESP32 Edge Node',
    'MPU6050 IMU',
    'VL53L0X ToF Extensometer',
    'ESP32-CAM (OV2640)',
    'Node.js v24',
    'Express REST/WebSocket',
    'MongoDB Time-Series',
    'Python 3.13 AI/ML',
    'OpenCV Computer Vision',
    'Bayesian Risk Fusion',
    'Sub-GHz Mesh Buffering',
    'WebXR Spatial AR'
  ];

  return (
    <div className="bg-mine-bg text-mine-text min-h-screen flex flex-col font-sans select-none">
      {/* Top Navigation Bar */}
      <header className="border-b border-mine-border/80 bg-mine-surface/90 backdrop-blur sticky top-0 z-50 px-5 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-cyan-600 to-slate-900 border border-cyan-500/50 flex items-center justify-center">
            <Shield className="w-4 h-4 text-cyan-200 fill-cyan-400/20" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-lg text-white tracking-tight">
                MineShield
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                SIH26025
              </span>
            </div>
            <p className="text-[10px] font-mono text-mine-muted">
              TEAM EDGE SQUARE • SMART AUTOMATION
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <button
            onClick={onExploreArchitecture}
            className="text-mine-secondary hover:text-white px-3 py-1.5 transition-colors hidden sm:block"
          >
            Engineering Architecture
          </button>
          <button
            onClick={onEnterDashboard}
            className="bg-cyan-600 hover:bg-cyan-500 text-white font-semibold px-4 py-1.5 rounded-lg transition-all flex items-center gap-1.5 shadow-md shadow-cyan-950/40"
          >
            <span>Open Live Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-5 py-16 lg:py-24 max-w-7xl mx-auto flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 bg-mine-surface border border-mine-border px-3 py-1 rounded-full text-xs font-mono text-cyan-300 mb-6 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>SIH26025 HARDWARE DEMO READY • SEAM 04 ACTIVE</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-display font-extrabold text-white tracking-tight max-w-4xl leading-tight">
          AI-Powered Real-Time Mine Subsidence Monitoring & Early Warning
        </h1>

        <p className="mt-5 text-lg sm:text-xl text-mine-secondary max-w-2xl font-normal leading-relaxed">
          Monitor strata deformation. Detect kinematic anomalies. Predict collapse risk. Respond earlier with multi-modal sensor and camera fusion.
        </p>

        {/* CTA Actions */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 font-mono text-sm">
          <button
            onClick={onEnterDashboard}
            className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-bold px-6 py-3 rounded-lg shadow-xl shadow-orange-950/50 hover:shadow-orange-900/70 transition-all flex items-center gap-2 active:scale-95"
          >
            <span>LAUNCH MISSION CONTROL DASHBOARD</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onExploreArchitecture}
            className="bg-mine-surface hover:bg-mine-elevated text-mine-text border border-mine-border px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
          >
            <span>Explore Hardware Architecture</span>
            <ChevronRight className="w-4 h-4 text-cyan-400" />
          </button>
        </div>

        {/* Hero Visual Schematic per Section 78 */}
        <div className="mt-14 w-full max-w-4xl bg-mine-surface border border-mine-border rounded-2xl p-4 sm:p-6 shadow-2xl relative overflow-hidden">
          <div className="flex items-center justify-between pb-3 border-b border-mine-border font-mono text-xs text-mine-muted">
            <span className="text-white font-bold flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-cyan-400" />
              SUBTERRANEAN STRATA WIREFRAME (300M DEPTH)
            </span>
            <span className="text-orange-400 font-semibold">ZONE B: HIGH RISK (94% CONF)</span>
          </div>

          <div className="relative h-64 sm:h-80 bg-black rounded-lg overflow-hidden border border-mine-border/80 flex items-center justify-center">
            <svg viewBox="0 0 600 300" className="w-full h-full object-cover">
              {/* Mine tunnels */}
              <path d="M 50 150 L 550 150" stroke="#273036" strokeWidth="16" strokeLinecap="round" />
              <path d="M 200 150 L 200 250 L 400 250 L 400 150" stroke="#273036" strokeWidth="16" fill="none" />

              {/* Tunnels interior */}
              <path d="M 50 150 L 550 150" stroke="#0E1418" strokeWidth="10" strokeLinecap="round" />
              <path d="M 200 150 L 200 250 L 400 250 L 400 150" stroke="#0E1418" strokeWidth="10" fill="none" />

              {/* Zone B Highlighted Risk Region */}
              <circle cx="360" cy="150" r="70" fill="rgba(249, 115, 22, 0.25)" stroke="#F97316" strokeWidth="1.5" strokeDasharray="4 2" />
              <text x="315" y="110" fill="#F97316" fontSize="10" fontWeight="bold" fontFamily="monospace">
                ZONE B: HIGH SUBSIDENCE
              </text>
              <text x="315" y="125" fill="#EF4444" fontSize="9" fontFamily="monospace">
                PREDICTED: CRITICAL IN 30M
              </text>

              {/* Sensor Nodes */}
              <circle cx="120" cy="150" r="5" fill="#10B981" />
              <circle cx="200" cy="200" r="5" fill="#10B981" />
              <circle cx="360" cy="150" r="7" fill="#F97316" className="animate-ping opacity-75" />
              <circle cx="360" cy="150" r="5" fill="#F97316" />
              <circle cx="480" cy="150" r="5" fill="#10B981" />
            </svg>

            <div className="absolute bottom-3 right-3 bg-mine-surface/90 border border-mine-border p-2 rounded text-[10px] font-mono text-cyan-300">
              DUAL SENSOR + CAMERA FUSION ACTIVE
            </div>
          </div>
        </div>
      </section>

      {/* 5-Step Process Section */}
      <section className="bg-mine-surface border-y border-mine-border py-16 px-5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
              OPERATIONAL CYCLE
            </span>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-white mt-1">
              How MineShield Safeguards Underground Coal Mines
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {steps.map(s => (
              <div key={s.num} className="bg-mine-elevated border border-mine-border rounded-xl p-4 flex flex-col justify-between font-mono text-xs">
                <div>
                  <span className="text-2xl font-bold text-cyan-400 block mb-2">{s.num}</span>
                  <h3 className="font-display font-bold text-white text-base mb-1">{s.title}</h3>
                  <p className="text-mine-secondary text-xs leading-relaxed font-sans mt-2">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-16 px-5 max-w-5xl mx-auto text-center">
        <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
          TECHNICAL STACK & PROTOCOLS
        </span>
        <h2 className="text-2xl sm:text-3xl font-display font-bold text-white mt-1 mb-8">
          Engineered for Low-Cost, Real-Time Industrial Rigor
        </h2>

        <div className="flex flex-wrap items-center justify-center gap-2.5 font-mono text-xs">
          {techBadges.map(b => (
            <span
              key={b}
              className="bg-mine-surface border border-mine-border text-mine-text px-3 py-1.5 rounded-lg hover:border-cyan-500/50 transition-colors"
            >
              {b}
            </span>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-mine-border py-6 px-5 text-center text-xs font-mono text-mine-muted">
        <p>MineShield • SIH Problem Statement SIH26025 • Team Edge Square</p>
        <p className="mt-1 text-[10px]">
          {SYSTEM_METADATA.regulatoryDisclaimer}
        </p>
      </footer>
    </div>
  );
};
