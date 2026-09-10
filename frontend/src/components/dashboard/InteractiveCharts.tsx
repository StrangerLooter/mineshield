import React, { useState } from 'react';
import { useTelemetry } from '../../context/TelemetryContext';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ReferenceLine,
  AreaChart,
  Area
} from 'recharts';
import { LineChart as ChartIcon, Eye, Compass, MoveDown, Activity } from 'lucide-react';

export const InteractiveCharts: React.FC = () => {
  const { sensors, selectedSensor, currentScenario } = useTelemetry();
  const [activeMetric, setActiveMetric] = useState<'tilt' | 'displacement' | 'vibration'>('tilt');
  const [timeHorizon, setTimeHorizon] = useState<'1h' | '6h' | '24h' | '7d'>('1h');

  const sensor = selectedSensor || sensors.find(s => s.id === 'S03') || sensors[0];

  // Build combined Historical (solid) + Predicted (dashed) data points
  const baseTilt = sensor.currentReading.tilt;
  const baseDisp = sensor.currentReading.displacement;
  const baseVib = sensor.currentReading.vibration;

  // Generate 12 past points
  const pastPoints = Array.from({ length: 12 }).map((_, i) => {
    const minAgo = (12 - i) * 2;
    const factor = i / 11;
    return {
      time: `-${minAgo}m`,
      tiltActual: Number((baseTilt * (0.6 + 0.4 * factor) - (11 - i) * 0.08).toFixed(2)),
      dispActual: Number((baseDisp * (0.5 + 0.5 * factor) - (11 - i) * 0.15).toFixed(2)),
      vibActual: Number((baseVib * (0.7 + 0.3 * factor)).toFixed(2)),
      tiltPredicted: null,
      dispPredicted: null,
      type: 'HISTORICAL'
    };
  });

  // Current point
  const currentPoint = {
    time: 'NOW',
    tiltActual: baseTilt,
    dispActual: baseDisp,
    vibActual: baseVib,
    tiltPredicted: baseTilt, // connects dashed line
    dispPredicted: baseDisp,
    type: 'CURRENT'
  };

  // 6 Future prediction points
  const futurePoints = Array.from({ length: 6 }).map((_, i) => {
    const minAhead = (i + 1) * 5;
    const accel = (i + 1) * 0.25;
    const projectedTilt = Number((baseTilt + accel * 0.4).toFixed(2));
    const projectedDisp = Number((baseDisp + accel * 0.8).toFixed(2));
    return {
      time: `+${minAhead}m`,
      tiltActual: null,
      dispActual: null,
      vibActual: null,
      tiltPredicted: projectedTilt,
      dispPredicted: projectedDisp,
      type: 'PREDICTED'
    };
  });

  const chartData = [...pastPoints, currentPoint, ...futurePoints];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const isPred = data.type === 'PREDICTED';
      return (
        <div className="bg-mine-surface border border-mine-border p-3 rounded-lg shadow-xl font-mono text-xs z-50">
          <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-mine-border text-[11px]">
            <span className="text-white font-bold">{label}</span>
            <span className={isPred ? 'text-orange-400 font-semibold' : 'text-cyan-400'}>
              {isPred ? 'AI PREDICTION HORIZON' : 'MEASURED TELEMETRY'}
            </span>
          </div>

          <div className="space-y-1">
            {data.tiltActual !== null && (
              <p className="text-mine-secondary">
                Measured Tilt: <span className="text-white font-bold">{data.tiltActual}°</span>
              </p>
            )}
            {data.tiltPredicted !== null && (
              <p className="text-orange-300">
                Predicted Tilt: <span className="font-bold">{data.tiltPredicted}°</span>
              </p>
            )}
            {data.dispActual !== null && (
              <p className="text-mine-secondary">
                Measured Disp: <span className="text-white font-bold">{data.dispActual} mm</span>
              </p>
            )}
            {data.dispPredicted !== null && (
              <p className="text-orange-300">
                Predicted Disp: <span className="font-bold">{data.dispPredicted} mm</span>
              </p>
            )}
            <div className="pt-1 mt-1 border-t border-mine-border/60 flex items-center justify-between text-[10px]">
              <span className="text-mine-muted">Risk Level:</span>
              <span className="text-orange-400 font-bold">
                {currentScenario === 'CRITICAL_SUBSIDENCE' ? 'CRITICAL' : 'HIGH'}
              </span>
            </div>
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-mine-muted">Model Confidence:</span>
              <span className="text-cyan-300 font-bold">94%</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-mine-surface border border-mine-border rounded-xl p-5 shadow-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-3 border-b border-mine-border">
        <div>
          <div className="flex items-center gap-2">
            <ChartIcon className="w-4 h-4 text-cyan-400" />
            <h3 className="font-display font-semibold text-sm text-white tracking-wide">
              MULTI-HORIZON DEFORMATION KINEMATICS
            </h3>
          </div>
          <p className="text-[10px] font-mono text-mine-muted mt-0.5">
            NODE {sensor.id} ({sensor.nodeId}) • SOLID = HISTORICAL MEASURED | DASHED = AI 30-MIN PREDICTION
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          {/* Metric Selector */}
          <div className="flex bg-mine-elevated p-0.5 rounded border border-mine-border text-xs font-mono">
            <button
              onClick={() => setActiveMetric('tilt')}
              className={`px-2 py-1 rounded transition-colors ${
                activeMetric === 'tilt' ? 'bg-cyan-950 text-cyan-300 font-semibold' : 'text-mine-secondary hover:text-white'
              }`}
            >
              Tilt (°)
            </button>
            <button
              onClick={() => setActiveMetric('displacement')}
              className={`px-2 py-1 rounded transition-colors ${
                activeMetric === 'displacement' ? 'bg-cyan-950 text-cyan-300 font-semibold' : 'text-mine-secondary hover:text-white'
              }`}
            >
              Disp (mm)
            </button>
            <button
              onClick={() => setActiveMetric('vibration')}
              className={`px-2 py-1 rounded transition-colors ${
                activeMetric === 'vibration' ? 'bg-cyan-950 text-cyan-300 font-semibold' : 'text-mine-secondary hover:text-white'
              }`}
            >
              Vib (g)
            </button>
          </div>

          {/* Time range selector */}
          <div className="flex bg-mine-elevated p-0.5 rounded border border-mine-border text-xs font-mono">
            {(['1h', '6h', '24h', '7d'] as const).map(h => (
              <button
                key={h}
                onClick={() => setTimeHorizon(h)}
                className={`px-2 py-1 rounded transition-colors ${
                  timeHorizon === h ? 'bg-mine-highlight text-white font-semibold' : 'text-mine-muted hover:text-mine-text'
                }`}
              >
                {h}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Recharts Canvas */}
      <div className="h-64 sm:h-72 w-full font-mono text-xs">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#273036" vertical={false} />
            <XAxis dataKey="time" stroke="#69767B" tick={{ fill: '#9BA8AD', fontSize: 11 }} />
            <YAxis stroke="#69767B" tick={{ fill: '#9BA8AD', fontSize: 11 }} domain={['dataMin - 0.5', 'dataMax + 1']} />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine x="NOW" stroke="#06B6D4" strokeDasharray="2 2" label={{ value: 'NOW', fill: '#06B6D4', fontSize: 10 }} />
            {activeMetric === 'tilt' && (
              <ReferenceLine y={1.5} stroke="#F59E0B" strokeDasharray="4 4" label={{ value: 'Warn 1.5°', fill: '#F59E0B', fontSize: 10 }} />
            )}
            {activeMetric === 'displacement' && (
              <ReferenceLine y={3.0} stroke="#F59E0B" strokeDasharray="4 4" label={{ value: 'Warn 3.0mm', fill: '#F59E0B', fontSize: 10 }} />
            )}

            {/* Historical Solid Line */}
            <Line
              type="monotone"
              dataKey={activeMetric === 'tilt' ? 'tiltActual' : activeMetric === 'displacement' ? 'dispActual' : 'vibActual'}
              name="Historical Measured"
              stroke="#06B6D4"
              strokeWidth={2.5}
              dot={{ fill: '#06B6D4', r: 3 }}
              activeDot={{ r: 6, fill: '#38BDF8' }}
              isAnimationActive={false}
            />

            {/* AI Predicted Dashed Line */}
            {activeMetric !== 'vibration' && (
              <Line
                type="monotone"
                dataKey={activeMetric === 'tilt' ? 'tiltPredicted' : 'dispPredicted'}
                name="AI Predicted Trend"
                stroke="#F97316"
                strokeWidth={2.5}
                strokeDasharray="5 5"
                dot={{ fill: '#F97316', r: 3 }}
                activeDot={{ r: 6, fill: '#FB923C' }}
                isAnimationActive={false}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-wrap items-center justify-between text-[11px] font-mono text-mine-muted pt-3 border-t border-mine-border mt-2">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-cyan-400">
            <span className="w-3 h-0.5 bg-cyan-400 inline-block"></span>
            Measured Historical
          </span>
          <span className="flex items-center gap-1.5 text-orange-400">
            <span className="w-3 h-0.5 border-b border-dashed border-orange-400 inline-block"></span>
            AI Predicted Horizon
          </span>
        </div>
        <span className="text-[10px] text-mine-muted">
          *Research prototype kinematics extrapolator (SIH26025)
        </span>
      </div>
    </div>
  );
};
