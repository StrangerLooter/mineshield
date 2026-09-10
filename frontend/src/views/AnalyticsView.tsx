import React from 'react';
import { LineChart as ChartIcon, BarChart3, TrendingUp, Layers, CheckCircle2 } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
  Legend
} from 'recharts';

export const AnalyticsView: React.FC = () => {
  const dailyDeformation = [
    { day: 'Mon', zoneA: 0.1, zoneB: 1.2, zoneC: 0.4, zoneD: 0.1 },
    { day: 'Tue', zoneA: 0.1, zoneB: 1.8, zoneC: 0.6, zoneD: 0.2 },
    { day: 'Wed', zoneA: 0.2, zoneB: 2.6, zoneC: 0.8, zoneD: 0.1 },
    { day: 'Thu', zoneA: 0.1, zoneB: 3.4, zoneC: 1.2, zoneD: 0.2 },
    { day: 'Fri', zoneA: 0.2, zoneB: 4.5, zoneC: 1.9, zoneD: 0.3 },
    { day: 'Sat', zoneA: 0.3, zoneB: 5.2, zoneC: 2.8, zoneD: 0.4 },
    { day: 'Sun', zoneA: 0.2, zoneB: 5.8, zoneC: 3.1, zoneD: 0.3 },
  ];

  const reliabilityMetrics = [
    { node: 'S01', uptime: 99.8, packets: 99.6, drift: '0.02°' },
    { node: 'S02', uptime: 99.9, packets: 99.8, drift: '0.01°' },
    { node: 'S03', uptime: 98.4, packets: 98.1, drift: '0.61° (Kinematic)' },
    { node: 'S04', uptime: 82.5, packets: 79.4, drift: 'Degraded RF' },
    { node: 'S05', uptime: 99.1, packets: 98.9, drift: '0.04°' },
    { node: 'S06', uptime: 99.4, packets: 99.2, drift: '0.08°' },
  ];

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="bg-mine-surface border border-mine-border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
        <div>
          <div className="flex items-center gap-2">
            <ChartIcon className="w-4 h-4 text-cyan-400" />
            <h2 className="text-lg font-display font-bold text-white">
              MINE STRATA ANALYTICS & MULTI-ZONE COMPARISON
            </h2>
          </div>
          <p className="text-xs font-mono text-mine-muted mt-0.5">
            Comparative kinematic velocity trends and sensor telemetry reliability logs.
          </p>
        </div>
      </div>

      {/* Synchronized Comparative Multi-Zone Chart */}
      <div className="bg-mine-surface border border-mine-border rounded-xl p-5 shadow-lg space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-mine-border">
          <span className="text-xs font-mono font-bold text-white uppercase">
            7-DAY DEFORMATION RATE BY ZONE (MM/DAY)
          </span>
          <span className="text-[10px] font-mono text-orange-400">ZONE B ACCELERATING STEEPLY</span>
        </div>

        <div className="h-64 sm:h-72 font-mono text-xs">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dailyDeformation} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#273036" vertical={false} />
              <XAxis dataKey="day" stroke="#69767B" />
              <YAxis stroke="#69767B" />
              <Tooltip
                contentStyle={{ backgroundColor: '#11171B', borderColor: '#273036' }}
                labelStyle={{ color: '#F1F5F5' }}
              />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="zoneA" name="Zone A (Shaft)" fill="#10B981" />
              <Bar dataKey="zoneB" name="Zone B (Panel 03)" fill="#EF4444" />
              <Bar dataKey="zoneC" name="Zone C (Return)" fill="#F59E0B" />
              <Bar dataKey="zoneD" name="Zone D (Intake)" fill="#06B6D4" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Sensor Mesh Reliability Table */}
      <div className="bg-mine-surface border border-mine-border rounded-xl p-5 shadow-lg space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-mine-border">
          <span className="text-xs font-mono font-bold text-white uppercase">
            HARDWARE TELEMETRY RELIABILITY AUDIT
          </span>
          <span className="text-[10px] font-mono text-mine-muted">
            LAST 30 DAYS BUFFER RECOVERY RATE: 99.4%
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-mine-elevated text-mine-muted uppercase text-[10px] border-b border-mine-border">
              <tr>
                <th className="p-2.5">Node ID</th>
                <th className="p-2.5">Telemetry Uptime</th>
                <th className="p-2.5">Packet Success</th>
                <th className="p-2.5">Calibrated Drift</th>
                <th className="p-2.5">Integrity Grade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-mine-border/60">
              {reliabilityMetrics.map(m => (
                <tr key={m.node} className="hover:bg-mine-elevated/50 transition-colors">
                  <td className="p-2.5 font-bold text-white">{m.node}</td>
                  <td className="p-2.5 text-cyan-300">{m.uptime}%</td>
                  <td className="p-2.5 text-mine-secondary">{m.packets}%</td>
                  <td className="p-2.5 text-orange-300">{m.drift}</td>
                  <td className="p-2.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] ${
                      m.uptime > 95 ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-amber-950 text-amber-300 border border-amber-800'
                    }`}>
                      {m.uptime > 95 ? 'OPTIMAL' : 'DEGRADED'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
