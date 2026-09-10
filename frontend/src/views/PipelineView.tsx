import React from 'react';
import { Workflow, ArrowRight, Radio, ShieldCheck, Filter, Cpu, Brain, Camera, AlertOctagon, MonitorPlay } from 'lucide-react';

export const PipelineView: React.FC = () => {
  const steps = [
    { num: '01', name: 'Raw Telemetry Ingestion', icon: Radio, desc: 'High-frequency sampling of MPU6050 & extensometer at 10Hz by ESP32.' },
    { num: '02', name: 'Kalman & Spike Filtering', icon: Filter, desc: 'Digital low-pass filtering eliminates mechanical equipment vibration noise.' },
    { num: '03', name: 'Kinematic Feature Extraction', icon: Cpu, desc: 'Calculates rate of angular change (deg/hr) and convergence velocity (mm/10min).' },
    { num: '04', name: 'Edge Anomaly Trigger', icon: ShieldCheck, desc: 'Identifies statistically anomalous trend shifts above Indian CMR baseline.' },
    { num: '05', name: 'Optical Camera Interrupt', icon: Camera, desc: 'Triggers ESP32-CAM optical capture for secondary visual verification.' },
    { num: '06', name: 'AI Computer Vision Segmentation', icon: Brain, desc: 'Classifies roof fracture and pillar spalling bounding boxes.' },
    { num: '07', name: 'Time-Series ML Horizon Forecaster', icon: Brain, desc: 'Predicts 15m, 30m, and 1h structural deformation curves.' },
    { num: '08', name: 'Multi-Modal Risk & Confidence Fusion', icon: Workflow, desc: 'Fuses kinematics with optical evidence into a single explainable risk index.' },
    { num: '09', name: 'Early Warning Siren Dispatch', icon: AlertOctagon, desc: 'Triggers audible sirens and surface safety officer incident alert.' },
    { num: '10', name: 'Mission Control & AR Overlay', icon: MonitorPlay, desc: 'Renders real-time geospatial digital mine map and spatial AR views.' },
  ];

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="bg-mine-surface border border-mine-border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
        <div>
          <div className="flex items-center gap-2">
            <Workflow className="w-4 h-4 text-cyan-400" />
            <h2 className="text-lg font-display font-bold text-white">
              END-TO-END TELEMETRY & AI PROCESSING PIPELINE
            </h2>
          </div>
          <p className="text-xs font-mono text-mine-muted mt-0.5">
            10-stage sequential data pipeline from subterranean bedrock sensors to surface mission control.
          </p>
        </div>
      </div>

      {/* Sequential Pipeline Cards */}
      <div className="space-y-3 font-mono text-xs">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div
              key={step.num}
              className="bg-mine-surface border border-mine-border hover:border-cyan-500/50 rounded-xl p-4 flex items-center justify-between gap-4 transition-all shadow-sm"
            >
              <div className="flex items-center gap-4">
                <span className="w-9 h-9 rounded-lg bg-mine-elevated border border-mine-border text-cyan-400 font-bold flex items-center justify-center shrink-0">
                  {step.num}
                </span>

                <div className="w-8 h-8 rounded bg-mine-elevated flex items-center justify-center text-cyan-300 shrink-0 hidden sm:flex">
                  <Icon className="w-4 h-4" />
                </div>

                <div>
                  <h3 className="font-display font-bold text-white text-sm">
                    {step.name}
                  </h3>
                  <p className="text-xs text-mine-secondary mt-0.5 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>

              {idx < steps.length - 1 && (
                <div className="text-mine-muted shrink-0 hidden md:block">
                  <ArrowRight className="w-4 h-4 text-cyan-400" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
