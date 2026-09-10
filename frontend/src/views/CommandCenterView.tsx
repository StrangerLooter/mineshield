import React from 'react';
import { useTelemetry } from '../context/TelemetryContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { HeroRiskPanel } from '../components/dashboard/HeroRiskPanel';
import { MineMap } from '../components/map/MineMap';
import { InteractiveCharts } from '../components/dashboard/InteractiveCharts';
import { FusionPanel } from '../components/dashboard/FusionPanel';
import { AlertTimeline } from '../components/dashboard/AlertTimeline';
import { SimulationControls } from '../components/common/SimulationControls';
import { MonitorPlay, Radio, AlertOctagon, Flame, Camera, Brain, Activity } from 'lucide-react';

interface CommandCenterViewProps {
  onNavigate: (route: string) => void;
}

export const CommandCenterView: React.FC<CommandCenterViewProps> = ({ onNavigate }) => {
  const { sensors, zones, alerts, currentScenario } = useTelemetry();

  const isCritical = currentScenario === 'CRITICAL_SUBSIDENCE';

  return (
    <div className="space-y-4">
      {/* Command Wall Top Bar */}
      <div className="bg-mine-surface border border-mine-border rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400 font-mono font-bold">
            CC
          </div>
          <div>
            <h2 className="text-base font-display font-bold text-white tracking-wide">
              SURFACE CONTROL ROOM TACTICAL COMMAND WALL
            </h2>
            <p className="text-[10px] font-mono text-mine-muted">
              MULTI-MONITOR AGGREGATED DISPLAY • 24/7 STATUTORY STRATA SURVEILLANCE
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="flex items-center gap-1.5 text-emerald-400 bg-emerald-950/50 px-2.5 py-1 rounded border border-emerald-800">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>MESH SYNC: 100%</span>
          </div>
          <button
            onClick={() => onNavigate('/dashboard')}
            className="px-3 py-1 rounded bg-mine-elevated text-mine-secondary hover:text-white border border-mine-border"
          >
            Exit Tactical Mode
          </button>
        </div>
      </div>

      {/* Guided presentation controls */}
      <SimulationControls />

      {/* High-density grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Col (4 Cols): Dominant Hero Risk & Fusion */}
        <div className="lg:col-span-4 space-y-4">
          <HeroRiskPanel />
          <FusionPanel />
        </div>

        {/* Center Col (5 Cols): Live Map & Kinematic Chart */}
        <div className="lg:col-span-5 space-y-4">
          <MineMap
            onSelectZone={() => onNavigate('/map')}
            onSelectSensor={(s) => onNavigate(`/sensors/${s.id}`)}
          />
          <InteractiveCharts />
        </div>

        {/* Right Col (3 Cols): Active Incident, Camera Snapshot & Timeline */}
        <div className="lg:col-span-3 space-y-4 font-mono text-xs">
          {/* Subterranean Camera Feed Snippet */}
          <div className="bg-mine-surface border border-mine-border rounded-xl p-3.5 shadow-md space-y-2">
            <div className="flex items-center justify-between pb-1.5 border-b border-mine-border">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-cyan-400" />
                ESP32-CAM FEED
              </span>
              <span className="text-[9px] text-cyan-400">ZONE B STOPE</span>
            </div>
            <div className="relative h-28 bg-black rounded overflow-hidden flex items-center justify-center">
              <svg viewBox="0 0 300 150" className="w-full h-full object-cover">
                <rect width="300" height="150" fill="#11171B" />
                <path d="M 50 40 L 90 70 L 140 65 L 180 95 L 230 85" stroke="#EF4444" strokeWidth="2.5" fill="none" className="animate-pulse" />
                <rect x="70" y="50" width="120" height="50" fill="rgba(239, 68, 68, 0.2)" stroke="#EF4444" strokeDasharray="3 2" />
                <text x="75" y="45" fill="#EF4444" fontSize="8" fontWeight="bold">ROOF CRACK (91.4%)</text>
              </svg>
              <div className="absolute bottom-1 right-1 bg-black/80 text-[8px] px-1 rounded text-mine-muted">
                EVENT: 14:28:41
              </div>
            </div>
          </div>

          {/* Incident Timeline */}
          <AlertTimeline onOpenIncident={(id) => onNavigate(`/alerts/${id}`)} />
        </div>
      </div>
    </div>
  );
};
