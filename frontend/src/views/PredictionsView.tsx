import React, { useState } from 'react';
import { useTelemetry } from '../context/TelemetryContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { Brain, TrendingUp, Clock, AlertTriangle, ArrowRight, ShieldCheck } from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

export const PredictionsView: React.FC = () => {
  const { zones, currentScenario } = useTelemetry();
  const [selectedHorizon, setSelectedHorizon] = useState<'15m' | '30m' | '1h' | '6h' | '24h'>('30m');

  const zoneB = zones.find(z => z.id === 'ZONE_B') || zones[1];
  const isCritical = currentScenario === 'CRITICAL_SUBSIDENCE';

  // Zone trajectory projection matrix
  const zoneMatrix = [
    { zone: 'Zone A (Main Shaft)', current: 'SAFE', predicted: 'SAFE', velocity: 'STABLE', conf: 96, delta: '+0.04 mm' },
    {
      zone: 'Zone B (Depillaring Panel 03)',
      current: isCritical ? 'CRITICAL' : 'HIGH',
      predicted: 'CRITICAL',
      velocity: isCritical ? 'CRITICAL ACCELERATION' : 'RAPID INCREASE',
      conf: 94,
      delta: isCritical ? '+4.20 mm' : '+1.85 mm'
    },
    { zone: 'Zone C (Return Airway)', current: 'WARNING', predicted: 'WARNING', velocity: 'MODERATE INCREASE', conf: 91, delta: '+0.45 mm' },
    { zone: 'Zone D (Intake Drift)', current: 'SAFE', predicted: 'SAFE', velocity: 'STABLE', conf: 95, delta: '+0.08 mm' },
  ];

  // Predictive curve points
  const forecastPoints = [
    { time: 'T-30m', actual: 1.2, predicted: 1.2 },
    { time: 'T-20m', actual: 1.9, predicted: 1.9 },
    { time: 'T-10m', actual: 3.1, predicted: 3.1 },
    { time: 'NOW', actual: 5.2, predicted: 5.2 },
    { time: '+10m', actual: null, predicted: 6.4 },
    { time: '+20m', actual: null, predicted: 7.8 },
    { time: '+30m', actual: null, predicted: 9.1 },
    { time: '+45m', actual: null, predicted: 11.2 },
    { time: '+60m', actual: null, predicted: 13.5 },
  ];

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="bg-mine-surface border border-mine-border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
        <div>
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-cyan-400" />
            <h2 className="text-lg font-display font-bold text-white">
              AI TIME-SERIES SUBSIDENCE DEFORMATION PREDICTIONS
            </h2>
          </div>
          <p className="text-xs font-mono text-mine-muted mt-0.5">
            Short and medium-horizon forecasting powered by exponential strata velocity models (SIH26025).
          </p>
        </div>

        {/* Horizon selector buttons */}
        <div className="flex items-center gap-1.5 font-mono text-xs">
          <span className="text-mine-muted text-[10px] mr-1 hidden md:inline">HORIZON:</span>
          {(['15m', '30m', '1h', '6h', '24h'] as const).map(h => (
            <button
              key={h}
              onClick={() => setSelectedHorizon(h)}
              className={`px-2.5 py-1 rounded transition-colors ${
                selectedHorizon === h
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-800/80 font-bold'
                  : 'bg-mine-elevated text-mine-secondary hover:text-white border border-mine-border'
              }`}
            >
              {h}
            </button>
          ))}
        </div>
      </div>

      {/* Zone Trajectory Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {zoneMatrix.map((item, idx) => (
          <div
            key={idx}
            className={`bg-mine-surface border rounded-xl p-4 shadow-sm space-y-3 font-mono text-xs ${
              item.predicted === 'CRITICAL' ? 'border-red-500/50 bg-red-950/10' : 'border-mine-border'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-white truncate">{item.zone.split(' ')[0]} {item.zone.split(' ')[1]}</span>
              <span className="text-[10px] text-cyan-300">{item.conf}% Conf</span>
            </div>

            <div className="flex items-center justify-between bg-mine-elevated p-2.5 rounded border border-mine-border text-[11px]">
              <div>
                <span className="text-mine-muted block text-[9px]">CURRENT</span>
                <StatusBadge status={item.current} size="sm" showIcon={false} />
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-mine-muted" />
              <div>
                <span className="text-mine-muted block text-[9px]">PREDICTED</span>
                <StatusBadge status={item.predicted} size="sm" showIcon={false} />
              </div>
            </div>

            <div className="pt-2 border-t border-mine-border/60 flex items-center justify-between text-[10px]">
              <span className="text-mine-muted">Deformation Delta:</span>
              <span className="text-orange-400 font-bold">{item.delta}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Forecast Curve & Explanation Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-mine-surface border border-mine-border rounded-xl p-5 shadow-lg space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-mine-border">
            <span className="text-xs font-mono font-bold text-white uppercase">
              ZONE B CONVERGENCE TRAJECTORY EXTRAPOLATION ({selectedHorizon})
            </span>
            <span className="text-[10px] font-mono text-orange-400 font-semibold">
              CRITICAL BREACH POINT: T+28 MIN
            </span>
          </div>

          <div className="h-64 font-mono text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={forecastPoints}>
                <defs>
                  <linearGradient id="predGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F97316" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#F97316" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#273036" vertical={false} />
                <XAxis dataKey="time" stroke="#69767B" />
                <YAxis stroke="#69767B" label={{ value: 'Displacement (mm)', angle: -90, position: 'insideLeft', fill: '#69767B', fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#11171B', borderColor: '#273036' }}
                  labelStyle={{ color: '#F1F5F5' }}
                />
                <Area type="monotone" dataKey="predicted" stroke="#F97316" strokeWidth={2.5} fillOpacity={1} fill="url(#predGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Explainable Prediction Card */}
        <div className="bg-mine-surface border border-mine-border rounded-xl p-5 shadow-lg space-y-3 font-mono text-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-2 mb-2 border-b border-mine-border">
              <TrendingUp className="w-4 h-4 text-orange-400" />
              <h3 className="font-display font-semibold text-sm text-white">
                PREDICTION NARRATIVE
              </h3>
            </div>

            <p className="text-mine-secondary leading-relaxed text-xs">
              Recent steepening in tilt rate (+0.61°/30min) coupled with high-frequency micro-acoustic bursts indicates accelerating roof beam flexure in <strong>Depillaring Panel 03 South</strong>.
            </p>

            <div className="mt-4 bg-mine-elevated p-3 rounded-lg border border-mine-border space-y-2 text-[11px]">
              <div className="flex justify-between">
                <span className="text-mine-muted">Projected Horizon:</span>
                <span className="text-white font-bold">{selectedHorizon}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-mine-muted">Target State:</span>
                <span className="text-red-400 font-bold">CRITICAL COLLAPSE RISK</span>
              </div>
              <div className="flex justify-between">
                <span className="text-mine-muted">Model Confidence:</span>
                <span className="text-cyan-300 font-bold">94% Corroborated</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-mine-border text-[10px] text-mine-muted">
            *Calibrated with DGMS (Directorate General of Mines Safety) subsidence baseline guidelines.
          </div>
        </div>
      </div>
    </div>
  );
};
