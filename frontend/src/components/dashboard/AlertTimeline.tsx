import React from 'react';
import { useTelemetry } from '../../context/TelemetryContext';
import { Clock, AlertOctagon, Flame, Camera, Radio, TrendingUp, ShieldCheck, ArrowRight } from 'lucide-react';

interface AlertTimelineProps {
  onOpenIncident?: (incidentId: string) => void;
}

export const AlertTimeline: React.FC<AlertTimelineProps> = ({ onOpenIncident }) => {
  const { alerts, currentScenario } = useTelemetry();
  const activeAlert = alerts[0];

  const defaultEvents = [
    { time: '14:21:05', phase: 'NORMAL', title: 'Baseline Nominal', desc: 'All node clusters reporting normal strata kinematics within CMR baseline.', icon: ShieldCheck, color: 'text-emerald-400', border: 'border-emerald-500' },
    { time: '14:25:12', phase: 'TILT_DEVIATION', title: 'Tilt Deviation Detected', desc: 'Node S03 angular drift exceeded +1.5°/hr threshold in Panel 03-S.', icon: Radio, color: 'text-amber-400', border: 'border-amber-500' },
    { time: '14:27:38', phase: 'DISP_RATE', title: 'Convergence Rate Accelerated', desc: 'Displacement rate climbed to 1.7 mm/30min. Correlated with S05 acoustic noise.', icon: TrendingUp, color: 'text-orange-400', border: 'border-orange-500' },
    { time: '14:28:41', phase: 'CAMERA_TRIGGER', title: 'ESP32-CAM Triggered', desc: 'Edge anomaly engine triggered ESP32-CAM-01 optical snapshot of roof stope.', icon: Camera, color: 'text-cyan-400', border: 'border-cyan-500' },
    { time: '14:29:15', phase: 'CV_CONFIRM', title: 'Roof Fissure Confirmed', desc: 'Computer vision detected longitudinal fracture. Anomaly confidence 91.4%.', icon: Flame, color: 'text-orange-400', border: 'border-orange-500' },
    { time: '14:30:02', phase: 'FUSION_UPGRADE', title: 'Risk Upgraded to HIGH', desc: 'Fusion Engine corroboration reached 94% confidence. Operator dispatched.', icon: Flame, color: 'text-orange-400', border: 'border-orange-500' },
    { time: '14:31:22', phase: 'PREDICT_CRITICAL', title: 'AI Predicted CRITICAL State', desc: 'Time-series subsidence model forecasts critical convergence breach within 30 min.', icon: AlertOctagon, color: 'text-red-400', border: 'border-red-500' },
    { time: '14:31:25', phase: 'EARLY_WARNING', title: 'Global Early Warning Generated', desc: 'Sector 3 audible siren protocol active. Evacuation alert routed to surface desk.', icon: AlertOctagon, color: 'text-red-400', border: 'border-red-500' },
  ];

  return (
    <div className="bg-mine-surface border border-mine-border rounded-xl p-5 shadow-lg">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-mine-border">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-cyan-400" />
          <h3 className="font-display font-semibold text-sm text-white tracking-wide">
            SUBTERRANEAN STRATA EVENT TIMELINE
          </h3>
        </div>
        {activeAlert && (
          <button
            onClick={() => onOpenIncident?.(activeAlert.id)}
            className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
          >
            <span>Incident #{activeAlert.id}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-mine-border">
        {defaultEvents.map((evt, idx) => {
          const Icon = evt.icon;
          return (
            <div key={idx} className="relative group">
              {/* Timeline marker node */}
              <div
                className={`absolute -left-6 top-1 w-4 h-4 rounded-full bg-mine-surface border-2 ${evt.border} flex items-center justify-center`}
              >
                <div className={`w-1.5 h-1.5 rounded-full ${evt.color.replace('text-', 'bg-')}`} />
              </div>

              {/* Event Content Card */}
              <div className="bg-mine-elevated/70 border border-mine-border/80 hover:border-mine-borderLight rounded-lg p-3 transition-colors">
                <div className="flex flex-wrap items-center justify-between gap-1 text-xs mb-1">
                  <span className="font-mono text-white font-semibold flex items-center gap-1.5">
                    <Icon className={`w-3.5 h-3.5 ${evt.color}`} />
                    {evt.title}
                  </span>
                  <span className="font-mono text-[11px] text-cyan-400 font-medium">
                    {evt.time}
                  </span>
                </div>
                <p className="text-xs text-mine-secondary leading-relaxed">
                  {evt.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
