import React, { useState } from 'react';
import { useTelemetry } from '../context/TelemetryContext';
import { StatusBadge } from '../components/common/StatusBadge';
import {
  ArrowLeft,
  ShieldAlert,
  CheckCircle2,
  Clock,
  Compass,
  MoveDown,
  Activity,
  Camera,
  UserCheck,
  Send
} from 'lucide-react';

interface IncidentDetailViewProps {
  incidentId: string;
  onBack: () => void;
  onNavigateToCamera?: () => void;
}

export const IncidentDetailView: React.FC<IncidentDetailViewProps> = ({
  incidentId,
  onBack,
  onNavigateToCamera
}) => {
  const { alerts, acknowledgeAlert } = useTelemetry();
  const alert = alerts.find(a => a.id.toLowerCase() === incidentId.toLowerCase()) || alerts[0];

  const [notesInput, setNotesInput] = useState<string>('Strata control inspection team dispatched with portable borehole extensometer.');

  const isAck = alert.status === 'ACKNOWLEDGED';

  const handleAck = () => {
    acknowledgeAlert(alert.id, notesInput);
  };

  return (
    <div className="space-y-4">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>BACK TO INCIDENT CENTER</span>
      </button>

      {/* Incident Hero Header */}
      <div className="bg-mine-surface border border-mine-border rounded-xl p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-cyan-400 font-bold px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800/80">
              OFFICIAL INCIDENT DOSSIER
            </span>
            <span className="text-xs font-mono text-mine-muted">
              REF: {alert.id}
            </span>
          </div>

          <h2 className="text-2xl font-display font-bold text-white">
            {alert.title}
          </h2>
          <p className="text-xs font-mono text-mine-secondary mt-1">
            Location: {alert.zoneName} • SENSORS {alert.sensorIds.join(', ')}
          </p>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <StatusBadge status={alert.severity} size="lg" pulse={alert.status === 'ACTIVE'} />
          <div className="bg-mine-elevated px-3 py-2 rounded-lg border border-mine-border text-right">
            <span className="text-[10px] text-mine-muted block">AI FUSION CONFIDENCE</span>
            <span className="text-lg font-bold text-cyan-300">{alert.confidence}%</span>
          </div>
        </div>
      </div>

      {/* Multi-Column Layout: Evidence & Timeline vs Dispatch Workflow */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left 2 Cols: Evidence & Timeline */}
        <div className="lg:col-span-2 space-y-5">
          {/* Multi-modal Evidence Grid */}
          <div className="bg-mine-surface border border-mine-border rounded-xl p-5 shadow-md">
            <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider mb-3">
              CORROBORATED MULTI-SENSOR EVIDENCE BREAKDOWN
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
              <div className="bg-mine-elevated p-3 rounded-lg border border-mine-border">
                <div className="flex items-center justify-between text-mine-secondary mb-1">
                  <span className="flex items-center gap-1.5 font-semibold text-white">
                    <Compass className="w-4 h-4 text-orange-400" />
                    Tilt Rate (+2.84°)
                  </span>
                  <span className="text-orange-400 font-bold">
                    {alert.evidenceContributors.tiltIncrease}% weight
                  </span>
                </div>
                <p className="text-[11px] text-mine-secondary">
                  Accelerated angular shear detected across pillar heads.
                </p>
              </div>

              <div className="bg-mine-elevated p-3 rounded-lg border border-mine-border">
                <div className="flex items-center justify-between text-mine-secondary mb-1">
                  <span className="flex items-center gap-1.5 font-semibold text-white">
                    <MoveDown className="w-4 h-4 text-orange-400" />
                    Displacement (5.2 mm)
                  </span>
                  <span className="text-orange-400 font-bold">
                    {alert.evidenceContributors.displacementIncrease}% weight
                  </span>
                </div>
                <p className="text-[11px] text-mine-secondary">
                  Convergence velocity exceeded 1.7 mm/30min threshold.
                </p>
              </div>

              <div className="bg-mine-elevated p-3 rounded-lg border border-mine-border">
                <div className="flex items-center justify-between text-mine-secondary mb-1">
                  <span className="flex items-center gap-1.5 font-semibold text-white">
                    <Activity className="w-4 h-4 text-orange-400" />
                    Acoustic Vib (0.72 g)
                  </span>
                  <span className="text-orange-400 font-bold">
                    {alert.evidenceContributors.vibrationAnomaly}% weight
                  </span>
                </div>
                <p className="text-[11px] text-mine-secondary">
                  Micro-seismic crack acoustic emissions registered.
                </p>
              </div>

              <div className="bg-mine-elevated p-3 rounded-lg border border-mine-border">
                <div className="flex items-center justify-between text-mine-secondary mb-1">
                  <span className="flex items-center gap-1.5 font-semibold text-white">
                    <Camera className="w-4 h-4 text-cyan-400" />
                    ESP32-CAM Anomaly
                  </span>
                  <span className="text-cyan-300 font-bold">
                    {alert.evidenceContributors.cameraEvidence}% weight
                  </span>
                </div>
                <p className="text-[11px] text-mine-secondary">
                  Visual confirmation of longitudinal roof crack in stope.
                </p>
              </div>
            </div>
          </div>

          {/* Incident Timeline */}
          <div className="bg-mine-surface border border-mine-border rounded-xl p-5 shadow-md">
            <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider mb-4">
              INCIDENT CHRONOLOGY & ESCALATION SEQUENCE
            </h3>

            <div className="space-y-3 font-mono text-xs">
              {alert.timeline.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 bg-mine-elevated/70 p-2.5 rounded border border-mine-border">
                  <Clock className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-white">{item.phase}</span>
                      <span className="text-mine-muted">{new Date(item.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <p className="text-mine-secondary mt-0.5">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Statutory Action Protocols & Operator Acknowledgment */}
        <div className="space-y-5">
          {/* Statutory Standard Operating Procedures */}
          <div className="bg-mine-surface border border-mine-border rounded-xl p-5 shadow-md space-y-3">
            <h3 className="text-xs font-mono font-bold text-orange-300 uppercase tracking-wider">
              DGMS STATUTORY RESPONSE DIRECTIVES
            </h3>

            <ul className="space-y-2 font-mono text-xs text-mine-secondary">
              {alert.recommendedActions.map((act, idx) => (
                <li key={idx} className="bg-mine-elevated p-2.5 rounded border border-mine-border/80 flex items-start gap-2">
                  <span className="text-cyan-400 font-bold">•</span>
                  <span>{act}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Acknowledgment & Dispatch Console */}
          <div className="bg-mine-surface border border-mine-border rounded-xl p-5 shadow-md space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-mine-border">
              <span className="font-bold text-white uppercase">OPERATOR LOG & ACTION</span>
              <span className={isAck ? 'text-emerald-400' : 'text-orange-400'}>
                {isAck ? '✓ ACKNOWLEDGED' : 'PENDING ACTION'}
              </span>
            </div>

            {isAck ? (
              <div className="bg-emerald-950/30 border border-emerald-800/50 p-3 rounded-lg space-y-1.5">
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                  <UserCheck className="w-4 h-4" />
                  <span>ACKNOWLEDGED BY: {alert.acknowledgedBy || 'Safety Officer'}</span>
                </div>
                <p className="text-mine-secondary text-[11px]">
                  <strong>Resolution Notes:</strong> {alert.resolutionNotes || 'Inspection team deployed to Panel 03-S.'}
                </p>
                <span className="text-[10px] text-mine-muted block">
                  Timestamp: {alert.acknowledgedAt ? new Date(alert.acknowledgedAt).toLocaleString() : 'Just now'}
                </span>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="text-[10px] text-mine-muted uppercase block mb-1">
                    DISPATCH & MITIGATION NOTES:
                  </label>
                  <textarea
                    rows={3}
                    value={notesInput}
                    onChange={(e) => setNotesInput(e.target.value)}
                    className="w-full bg-mine-elevated border border-mine-border rounded p-2 text-white text-xs focus:outline-none focus:border-cyan-500"
                    placeholder="Enter dispatch order or inspection note..."
                  />
                </div>

                <button
                  onClick={handleAck}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2 rounded transition-colors flex items-center justify-center gap-1.5 shadow-md"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Acknowledge & Sign Log</span>
                </button>
              </div>
            )}

            <button
              onClick={onNavigateToCamera}
              className="w-full bg-mine-elevated hover:bg-mine-highlight text-cyan-300 border border-mine-border py-2 rounded transition-colors flex items-center justify-center gap-1.5"
            >
              <Camera className="w-4 h-4 text-cyan-400" />
              <span>Inspect ESP32-CAM Evidence</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
