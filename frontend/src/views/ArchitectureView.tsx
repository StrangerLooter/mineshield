import React, { useState } from 'react';
import { Layers, Cpu, ArrowRight, ArrowDown, Database, Radio, Brain, Camera, MonitorPlay, CheckCircle2 } from 'lucide-react';

interface ArchNode {
  id: string;
  name: string;
  category: 'HARDWARE' | 'COMMUNICATION' | 'BACKEND' | 'AI_ML' | 'INTERFACE';
  tech: string;
  role: string;
  input: string;
  output: string;
}

export const ArchitectureView: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<ArchNode | null>(null);

  const nodes: ArchNode[] = [
    {
      id: 'MPU6050',
      name: 'Kinematic Sensors',
      category: 'HARDWARE',
      tech: 'MPU6050 (6-DoF I2C) + VL53L0X ToF + Piezo',
      role: 'Continuous subterranean angular inclination, convergence distance, and micro-acoustic vibration measurement.',
      input: 'Rock mass strata mechanical stress and beam flexure',
      output: 'Raw I2C angular drift (±0.01°), laser distance (mm), acoustic amplitude (g)'
    },
    {
      id: 'ESP32_EDGE',
      name: 'ESP32 Subterranean Node',
      category: 'HARDWARE',
      tech: 'ESP32 Dual-Core Xtensa 240MHz + FreeRTOS',
      role: 'Edge sensor sampling, Kalman noise filtering, local Flash ring buffering, and anomaly threshold triggering.',
      input: 'Raw I2C/ADC sensor telemetry pulses',
      output: 'Pre-processed JSON telemetry packets & Camera trigger interrupts'
    },
    {
      id: 'ESP32_CAM',
      name: 'ESP32-CAM Optical Node',
      category: 'HARDWARE',
      tech: 'ESP32-CAM + OV2640 2MP + IR Illuminator',
      role: 'Captures high-resolution optical frames of roof and pillar stopes upon edge kinematic interrupt.',
      input: 'Hardware interrupt trigger from ESP32 sensor node',
      output: 'Base64 JPEG event snapshot routed over local Sub-GHz/WiFi mesh'
    },
    {
      id: 'COMM_MESH',
      name: 'Underground Comm Link',
      category: 'COMMUNICATION',
      tech: 'MQTT / HTTP REST with Local Mesh Gateway Buffer',
      role: 'Transmits buffered packets from deep stopes (300m below) to pit-bottom optical fiber gateway.',
      input: 'Serialized edge telemetry and optical snapshots',
      output: 'Surface cloud ingestion feed with zero packet loss during link outage'
    },
    {
      id: 'NODE_BACKEND',
      name: 'Node/Express Gateway',
      category: 'BACKEND',
      tech: 'Node.js v24 + Express + WebSocket Engine',
      role: 'Real-time telemetry ingestion, active alert routing, and bidirectional operator dispatch socket broadcast.',
      input: 'Incoming MQTT packets and operator acknowledgment requests',
      output: 'REST API endpoints and sub-second WebSocket telemetry streams'
    },
    {
      id: 'MONGODB',
      name: 'MongoDB Strata Store',
      category: 'BACKEND',
      tech: 'MongoDB / Time-Series Collections',
      role: 'Persistent archival of high-frequency sensor readings, incident dossiers, and optical crack evidence.',
      input: 'Cleaned sensor documents, alert schemas, and CV inference records',
      output: 'Queryable historical datasets for trend analysis and DGMS audits'
    },
    {
      id: 'PYTHON_ML',
      name: 'Python Time-Series Forecaster',
      category: 'AI_ML',
      tech: 'Python 3.13 + NumPy + Scikit-Learn Subsidence Engine',
      role: 'Calculates 15m/30m/1h/24h subsidence displacement vectors and velocity acceleration curves.',
      input: 'Historical 20-sample kinematic sequences from Node S01–S08',
      output: 'Predicted risk classification, confidence grade, and breach horizon'
    },
    {
      id: 'CV_ENGINE',
      name: 'Computer Vision Anomaly Detector',
      category: 'AI_ML',
      tech: 'Python OpenCV + Convolutional Feature Extractor',
      role: 'Performs optical fissure segmentation and pillar spalling bounding box inference.',
      input: 'Event optical frames from ESP32-CAM',
      output: 'Crack classification, bounding box coordinates, and visual confidence'
    },
    {
      id: 'FUSION_ENGINE',
      name: 'Multi-Modal Risk Fusion Core',
      category: 'AI_ML',
      tech: 'Weighted Bayesian Evidence Fusion Module',
      role: 'Fuses physical sensor kinematics with optical confirmation to compute definitive risk grade (94% conf).',
      input: 'Kinematic vectors + CV inference + historical trend rate',
      output: 'Unified explainable risk score, early warning trigger, and siren dispatch'
    },
    {
      id: 'COMMAND_DASH',
      name: 'Operator Command & AR View',
      category: 'INTERFACE',
      tech: 'React 19 + TypeScript + Tailwind + SVG Map + WebXR',
      role: 'Provides safety officers with mission control monitoring, interactive mine maps, and spatial AR overlay.',
      input: 'Real-time WebSocket telemetry and early warning alerts',
      output: 'Statutory emergency decision support and incident mitigation'
    }
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-mine-surface border border-mine-border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <h2 className="text-lg font-display font-bold text-white">
              MINESHIELD HARDWARE-TO-CLOUD ARCHITECTURE (SIH26025)
            </h2>
          </div>
          <p className="text-xs font-mono text-mine-muted mt-0.5">
            Full engineering stack: from subterranean microcontrollers to surface AI fusion and AR visualization.
          </p>
        </div>
      </div>

      {/* Interactive System Diagram */}
      <div className="bg-mine-surface border border-mine-border rounded-xl p-5 shadow-lg space-y-5">
        <p className="text-xs font-mono text-mine-secondary">
          Click any architecture component below to inspect its technical specifications, hardware interfaces, and data payloads:
        </p>

        {/* Visual Architecture Flowchart */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 font-mono text-xs">
          {nodes.map(n => {
            const isSelected = selectedNode?.id === n.id;
            return (
              <div
                key={n.id}
                onClick={() => setSelectedNode(n)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all shadow-sm flex flex-col justify-between ${
                  isSelected
                    ? 'bg-cyan-950/60 border-cyan-400 shadow-cyan-950/50 scale-[1.02]'
                    : 'bg-mine-elevated/70 border-mine-border hover:border-mine-borderLight hover:bg-mine-elevated'
                }`}
              >
                <div>
                  <span className="text-[9px] font-bold text-cyan-400 uppercase tracking-wider block mb-1">
                    {n.category}
                  </span>
                  <h4 className="font-display font-bold text-white text-sm leading-tight">
                    {n.name}
                  </h4>
                  <p className="text-[10px] text-mine-muted mt-1 leading-snug truncate">
                    {n.tech}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-mine-border/60 flex items-center justify-between text-[10px] text-mine-secondary">
                  <span>Inspect Spec</span>
                  <ArrowRight className="w-3 h-3 text-cyan-400" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Component Deep-Dive Inspector */}
        {selectedNode && (
          <div className="bg-mine-elevated border border-cyan-500/40 rounded-xl p-5 shadow-xl space-y-3 font-mono text-xs animate-fadeIn">
            <div className="flex items-center justify-between pb-2 border-b border-mine-border">
              <div>
                <span className="text-[10px] text-cyan-400 font-bold uppercase">
                  COMPONENT SPECIFICATION INSPECTOR
                </span>
                <h3 className="text-base font-display font-bold text-white">
                  {selectedNode.name} ({selectedNode.tech})
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 text-[10px] font-bold">
                {selectedNode.category}
              </span>
            </div>

            <p className="text-mine-text leading-relaxed">
              <strong>Engineering Role:</strong> {selectedNode.role}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="bg-mine-surface p-3 rounded border border-mine-border">
                <span className="text-[10px] text-mine-muted uppercase block font-semibold mb-1">
                  INPUT DATA / TRIGGER:
                </span>
                <span className="text-mine-secondary text-xs">{selectedNode.input}</span>
              </div>
              <div className="bg-mine-surface p-3 rounded border border-mine-border">
                <span className="text-[10px] text-mine-muted uppercase block font-semibold mb-1">
                  OUTPUT TELEMETRY / PAYLOAD:
                </span>
                <span className="text-cyan-300 text-xs font-semibold">{selectedNode.output}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
