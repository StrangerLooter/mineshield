import React, { useState } from 'react';
import { useTelemetry } from '../context/TelemetryContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { TriangleAlert, Filter, ArrowRight, ShieldCheck, CheckCircle2, Clock } from 'lucide-react';

interface AlertsViewProps {
  onNavigateToIncident: (incidentId: string) => void;
  onNavigateToZone?: (zoneId: string) => void;
}

export const AlertsView: React.FC<AlertsViewProps> = ({
  onNavigateToIncident,
  onNavigateToZone
}) => {
  const { alerts, acknowledgeAlert } = useTelemetry();
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');

  const filteredAlerts = alerts.filter(a => {
    if (filterSeverity === 'ALL') return true;
    if (filterSeverity === 'RESOLVED') return a.status === 'RESOLVED' || a.status === 'ACKNOWLEDGED';
    return a.severity === filterSeverity;
  });

  return (
    <div className="space-y-4">
      {/* Header & Filter */}
      <div className="bg-mine-surface border border-mine-border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
        <div>
          <div className="flex items-center gap-2">
            <TriangleAlert className="w-4 h-4 text-orange-400" />
            <h2 className="text-lg font-display font-bold text-white">
              MINE SUBSIDENCE INCIDENT & EARLY WARNING CENTER
            </h2>
          </div>
          <p className="text-xs font-mono text-mine-muted mt-0.5">
            Real-time incident dispatch, multi-source evidence corroboration, and statutory acknowledgment logs.
          </p>
        </div>

        {/* Severity Filters */}
        <div className="flex items-center gap-1.5 font-mono text-xs">
          {['ALL', 'CRITICAL', 'HIGH', 'WARNING', 'RESOLVED'].map(sev => (
            <button
              key={sev}
              onClick={() => setFilterSeverity(sev)}
              className={`px-2.5 py-1 rounded transition-colors ${
                filterSeverity === sev
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-800/80 font-bold'
                  : 'bg-mine-elevated text-mine-secondary hover:text-white border border-mine-border'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="bg-mine-surface border border-mine-border rounded-xl p-12 text-center text-mine-muted space-y-2">
            <ShieldCheck className="w-8 h-8 text-emerald-400 mx-auto" />
            <h4 className="text-sm font-semibold text-white">NO ACTIVE INCIDENT ALERTS</h4>
            <p className="text-xs text-mine-secondary">
              All monitored underground coal panels are currently operating within nominal baseline parameters.
            </p>
          </div>
        ) : (
          filteredAlerts.map(alert => {
            const isCritical = alert.severity === 'CRITICAL';
            const isAck = alert.status === 'ACKNOWLEDGED';

            return (
              <div
                key={alert.id}
                className={`bg-mine-surface border rounded-xl p-5 transition-all shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  isCritical
                    ? 'border-red-500/50 bg-gradient-to-r from-red-950/20 to-mine-surface'
                    : 'border-orange-500/40 bg-gradient-to-r from-orange-950/15 to-mine-surface'
                }`}
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <StatusBadge status={alert.severity} size="sm" pulse={alert.status === 'ACTIVE'} />
                    <span className="font-mono text-xs font-bold text-white">
                      {alert.id}
                    </span>
                    <span className="text-xs font-mono text-mine-muted">•</span>
                    <span className="text-xs font-mono text-cyan-400">
                      {alert.zoneName} (Nodes {alert.sensorIds.join(', ')})
                    </span>
                  </div>

                  <h3 className="text-base font-display font-bold text-white">
                    {alert.title}
                  </h3>

                  <p className="text-xs text-mine-secondary leading-relaxed max-w-3xl">
                    {alert.description}
                  </p>

                  <div className="flex items-center gap-4 text-[11px] font-mono text-mine-muted pt-1">
                    <span>Detected: {new Date(alert.timestamp).toLocaleTimeString()}</span>
                    <span>AI Confidence: <strong className="text-cyan-300">{alert.confidence}%</strong></span>
                    <span>Status: <strong className={isAck ? 'text-emerald-400' : 'text-orange-400'}>{alert.status}</strong></span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2.5 shrink-0">
                  {alert.status === 'ACTIVE' && (
                    <button
                      onClick={() => acknowledgeAlert(alert.id)}
                      className="px-3 py-1.5 rounded bg-mine-elevated hover:bg-mine-highlight text-emerald-400 border border-emerald-800/60 font-mono text-xs font-semibold transition-colors flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Acknowledge</span>
                    </button>
                  )}

                  <button
                    onClick={() => onNavigateToIncident(alert.id)}
                    className="px-3.5 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
                  >
                    <span>Inspect Incident</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
