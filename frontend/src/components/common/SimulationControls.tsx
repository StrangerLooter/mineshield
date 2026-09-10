import React from 'react';
import { useTelemetry } from '../../context/TelemetryContext';
import { DemoScenario } from '../../types';
import { Play, Pause, RotateCcw, Zap, Sparkles, Activity, AlertCircle } from 'lucide-react';

export const SimulationControls: React.FC = () => {
  const {
    currentScenario,
    isSimulating,
    demoProgress,
    demoStepText,
    isAutomatedDemoRunning,
    setScenario,
    toggleSimulation,
    runAutomatedIncidentDemo,
    resetAll
  } = useTelemetry();

  const scenarios: { id: DemoScenario; label: string }[] = [
    { id: 'NORMAL', label: '1. Normal Base' },
    { id: 'SENSOR_FAULT', label: '2. Sensor Fault (No False Alarm)' },
    { id: 'ELEVATED_TILT', label: '3. Elevated Tilt' },
    { id: 'CAMERA_CONFIRMED', label: '4. Camera Confirmed' },
    { id: 'CRITICAL_SUBSIDENCE', label: '5. Critical Warning' },
  ];

  return (
    <div className="bg-mine-surface border border-mine-border rounded-lg p-3.5 shadow-lg">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Left: Simulation State & Automated Trigger */}
        <div className="flex items-center flex-wrap gap-2.5">
          <div className="flex items-center gap-2 bg-mine-elevated px-2.5 py-1.5 rounded border border-mine-border">
            <span className="relative flex h-2.5 w-2.5">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                isSimulating ? 'bg-cyan-400' : 'bg-zinc-500'
              }`}></span>
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                isSimulating ? 'bg-cyan-500' : 'bg-zinc-600'
              }`}></span>
            </span>
            <span className="text-xs font-mono font-medium text-mine-text">
              {isSimulating ? 'TELEMETRY PULSE ACTIVE' : 'TELEMETRY PAUSED'}
            </span>
            <button
              onClick={toggleSimulation}
              className="ml-1 text-mine-secondary hover:text-white p-1 rounded hover:bg-mine-highlight transition-colors"
              title={isSimulating ? 'Pause live jitter' : 'Resume live jitter'}
            >
              {isSimulating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-cyan-400" />}
            </button>
          </div>

          <button
            onClick={runAutomatedIncidentDemo}
            disabled={isAutomatedDemoRunning}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md font-medium text-xs transition-all shadow-md ${
              isAutomatedDemoRunning
                ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40 cursor-not-allowed'
                : 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white shadow-orange-950/40 hover:shadow-orange-900/60 active:scale-95'
            }`}
          >
            <Zap className={`w-3.5 h-3.5 ${isAutomatedDemoRunning ? 'animate-bounce' : ''}`} />
            <span>{isAutomatedDemoRunning ? 'RUNNING INCIDENT DEMO...' : 'RUN INCIDENT DEMO'}</span>
          </button>

          <button
            onClick={resetAll}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-mine-elevated hover:bg-mine-highlight text-mine-secondary hover:text-mine-text border border-mine-border text-xs transition-colors"
            title="Reset simulation to default baseline"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>

        {/* Right: Manual Scenario Selectors */}
        <div className="flex items-center flex-wrap gap-1.5">
          <span className="text-xs text-mine-muted font-mono mr-1 hidden sm:inline">SCENARIOS:</span>
          {scenarios.map(s => {
            const isActive = currentScenario === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setScenario(s.id)}
                disabled={isAutomatedDemoRunning}
                className={`text-xs px-2 py-1 rounded transition-colors font-mono ${
                  isActive
                    ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-700/60 font-medium'
                    : 'bg-mine-elevated/80 text-mine-secondary hover:text-mine-text hover:bg-mine-highlight border border-mine-border/60'
                }`}
              >
                {s.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Progress & Narrative readout */}
      {(isAutomatedDemoRunning || currentScenario !== 'NORMAL') && (
        <div className="mt-2.5 pt-2 border-t border-mine-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-mine-secondary">
            <Activity className="w-3.5 h-3.5 text-orange-400 shrink-0" />
            <span className="font-mono text-cyan-300">{demoStepText}</span>
          </div>
          {isAutomatedDemoRunning && (
            <div className="w-full sm:w-48 bg-mine-elevated rounded-full h-1.5 overflow-hidden border border-mine-border">
              <div
                className="bg-gradient-to-r from-cyan-500 to-orange-500 h-full transition-all duration-500"
                style={{ width: `${demoProgress}%` }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
