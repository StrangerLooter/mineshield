import React, { useState } from 'react';
import { useTelemetry } from '../context/TelemetryContext';
import { StatusBadge } from '../components/common/StatusBadge';
import {
  Radio,
  ArrowLeft,
  Compass,
  MoveDown,
  Activity,
  Thermometer,
  Droplets,
  Wind,
  Battery,
  Wifi,
  Cpu,
  ShieldCheck,
  AlertTriangle,
  History,
  Brain,
  Clock
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

interface SensorDetailViewProps {
  sensorId: string;
  onBack: () => void;
  onNavigateToCamera?: () => void;
}

export const SensorDetailView: React.FC<SensorDetailViewProps> = ({
  sensorId,
  onBack,
  onNavigateToCamera
}) => {
  const { sensors } = useTelemetry();
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'TELEMETRY' | 'HISTORY' | 'HEALTH' | 'AI'>('OVERVIEW');

  const sensor = sensors.find(s => s.id.toUpperCase() === sensorId.toUpperCase()) || sensors[0];
  const reading = sensor.currentReading;

  // Chart data from sensor history
  const historyData = sensor.history.map((h, i) => ({
    time: `-${(sensor.history.length - 1 - i) * 3}s`,
    tilt: h.tilt,
    disp: h.displacement,
    vib: h.vibration
  }));

  return (
    <div className="space-y-4">
      {/* Top Breadcrumb & Actions */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>BACK TO SENSORS INVENTORY</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-mine-muted">LAST PACKET: 2 SEC AGO</span>
          <StatusBadge status={sensor.status} size="sm" />
        </div>
      </div>

      {/* Sensor Header Card */}
      <div className="bg-mine-surface border border-mine-border rounded-xl p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-cyan-400 font-bold px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800/80">
              {sensor.type} MONITOR
            </span>
            <span className="text-xs font-mono text-mine-muted">
              HARDWARE NODE ID: {sensor.nodeId}
            </span>
          </div>

          <h2 className="text-2xl font-display font-bold text-white flex items-center gap-2">
            Sensor Node {sensor.id}
          </h2>
          <p className="text-xs font-mono text-mine-secondary mt-1">
            {sensor.zoneName} • {sensor.location.panel} • {sensor.location.tunnel} (Depth: {sensor.location.depthMeters}m)
          </p>
        </div>

        {/* Quick battery and connection status */}
        <div className="flex items-center gap-4 bg-mine-elevated px-4 py-2.5 rounded-lg border border-mine-border font-mono text-xs">
          <div>
            <span className="text-[10px] text-mine-muted block">RF LINK QUALITY</span>
            <span className="font-bold text-cyan-300 flex items-center gap-1">
              <Wifi className="w-3.5 h-3.5 text-cyan-400" /> {reading.signalQuality}%
            </span>
          </div>
          <div className="h-6 w-px bg-mine-border" />
          <div>
            <span className="text-[10px] text-mine-muted block">NODE VOLTAGE</span>
            <span className="font-bold text-emerald-400 flex items-center gap-1">
              <Battery className="w-3.5 h-3.5 text-emerald-400" /> {sensor.healthMetrics.voltage} V
            </span>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center border-b border-mine-border space-x-1 font-mono text-xs overflow-x-auto">
        {(['OVERVIEW', 'TELEMETRY', 'HISTORY', 'HEALTH', 'AI'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 border-b-2 font-medium transition-colors ${
              activeTab === tab
                ? 'border-cyan-400 text-cyan-300 bg-cyan-950/30'
                : 'border-transparent text-mine-secondary hover:text-white hover:bg-mine-elevated/50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'OVERVIEW' && (
        <div className="space-y-5">
          {/* Primary Kinematic Readings */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
            <div className="bg-mine-surface border border-mine-border rounded-xl p-4">
              <span className="text-[10px] text-mine-muted uppercase block">TILT INCLINATION</span>
              <span className="text-3xl font-bold text-white mt-1 block">
                {reading.tilt > 0 ? `+${reading.tilt.toFixed(2)}` : reading.tilt.toFixed(2)}°
              </span>
              <span className="text-[11px] text-orange-400 mt-1 block">
                MPU6050 Accelerometer/Gyro
              </span>
            </div>

            <div className="bg-mine-surface border border-mine-border rounded-xl p-4">
              <span className="text-[10px] text-mine-muted uppercase block">DISPLACEMENT</span>
              <span className="text-3xl font-bold text-white mt-1 block">
                {reading.displacement.toFixed(2)} mm
              </span>
              <span className="text-[11px] text-orange-400 mt-1 block">
                VL53L0X ToF / Extensometer
              </span>
            </div>

            <div className="bg-mine-surface border border-mine-border rounded-xl p-4">
              <span className="text-[10px] text-mine-muted uppercase block">VIBRATION FREQUENCY</span>
              <span className="text-3xl font-bold text-white mt-1 block">
                {reading.vibration.toFixed(2)} g
              </span>
              <span className="text-[11px] text-orange-400 mt-1 block">
                Piezo Strata Acoustic Sensor
              </span>
            </div>
          </div>

          {/* Environmental Secondary */}
          <div className="bg-mine-surface border border-mine-border rounded-xl p-4">
            <span className="text-xs font-mono text-mine-secondary font-semibold uppercase block mb-3">
              ENVIRONMENTAL CONDITIONS AT NODE
            </span>
            <div className="grid grid-cols-3 gap-3 font-mono text-xs">
              <div className="bg-mine-elevated p-3 rounded-lg border border-mine-border flex items-center gap-3">
                <Thermometer className="w-4 h-4 text-cyan-400" />
                <div>
                  <span className="text-[10px] text-mine-muted block">TEMPERATURE</span>
                  <span className="font-bold text-white">{reading.temperature.toFixed(1)} °C</span>
                </div>
              </div>
              <div className="bg-mine-elevated p-3 rounded-lg border border-mine-border flex items-center gap-3">
                <Droplets className="w-4 h-4 text-cyan-400" />
                <div>
                  <span className="text-[10px] text-mine-muted block">HUMIDITY</span>
                  <span className="font-bold text-white">{reading.humidity} % RH</span>
                </div>
              </div>
              <div className="bg-mine-elevated p-3 rounded-lg border border-mine-border flex items-center gap-3">
                <Wind className="w-4 h-4 text-cyan-400" />
                <div>
                  <span className="text-[10px] text-mine-muted block">MQ GAS LEVEL</span>
                  <span className="font-bold text-white">{reading.gasPpm} ppm</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'TELEMETRY' && (
        <div className="bg-mine-surface border border-mine-border rounded-xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-mine-border">
            <span className="text-xs font-mono font-bold text-white uppercase">
              HIGH-FREQUENCY RECENT BUFFER (LAST 20 SAMPLES)
            </span>
            <span className="text-[10px] font-mono text-cyan-400">PULSE: ~2.5 SEC</span>
          </div>

          <div className="h-64 font-mono text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#273036" vertical={false} />
                <XAxis dataKey="time" stroke="#69767B" />
                <YAxis stroke="#69767B" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#11171B', borderColor: '#273036' }}
                  labelStyle={{ color: '#F1F5F5' }}
                />
                <Line type="monotone" dataKey="tilt" stroke="#06B6D4" strokeWidth={2} name="Tilt (°)" dot={false} />
                <Line type="monotone" dataKey="disp" stroke="#F97316" strokeWidth={2} name="Disp (mm)" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {activeTab === 'HEALTH' && (
        <div className="bg-mine-surface border border-mine-border rounded-xl p-5 shadow-lg space-y-4">
          <div className="pb-2 border-b border-mine-border">
            <h3 className="text-sm font-display font-bold text-white">
              HARDWARE HEALTH & DIAGNOSTICS
            </h3>
            <p className="text-xs font-mono text-mine-muted mt-0.5">
              Distinguishing hardware degradation / packet loss from physical mine subsidence.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
            <div className="bg-mine-elevated p-3.5 rounded-lg border border-mine-border">
              <span className="text-mine-muted block text-[10px]">PACKET LOSS RATE</span>
              <span className={`text-xl font-bold mt-1 block ${sensor.healthMetrics.packetDropRate > 5 ? 'text-amber-400' : 'text-emerald-400'}`}>
                {sensor.healthMetrics.packetDropRate.toFixed(1)}%
              </span>
              <span className="text-[10px] text-mine-muted mt-1 block">
                {sensor.healthMetrics.packetDropRate > 5 ? 'Elevated RF interference' : 'Within tolerance'}
              </span>
            </div>

            <div className="bg-mine-elevated p-3.5 rounded-lg border border-mine-border">
              <span className="text-mine-muted block text-[10px]">SUPPLY VOLTAGE</span>
              <span className="text-xl font-bold text-white mt-1 block">
                {sensor.healthMetrics.voltage} V
              </span>
              <span className="text-[10px] text-emerald-400 mt-1 block">
                Regulated LiFePO4 battery pack
              </span>
            </div>

            <div className="bg-mine-elevated p-3.5 rounded-lg border border-mine-border">
              <span className="text-mine-muted block text-[10px]">SENSOR CALIBRATION DRIFT</span>
              <span className="text-xl font-bold text-white mt-1 block">
                {sensor.healthMetrics.temperatureDrift} °C/drift
              </span>
              <span className="text-[10px] text-cyan-400 mt-1 block">
                Auto-zero compensated
              </span>
            </div>
          </div>

          {sensor.healthMetrics.faultReason && (
            <div className="bg-amber-950/30 border border-amber-800/50 p-3 rounded-lg text-xs font-mono text-amber-300">
              <div className="flex items-center gap-2 font-bold mb-1">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>DIAGNOSTIC ADVISORY (NOT A STRUCTURAL ALARM)</span>
              </div>
              <p>{sensor.healthMetrics.faultReason}</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'AI' && (
        <div className="bg-mine-surface border border-mine-border rounded-xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-mine-border">
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-display font-bold text-white">
                LOCAL TIME-SERIES PREDICTOR FOR NODE {sensor.id}
              </h3>
            </div>
            <span className="text-xs font-mono text-cyan-300">MODEL CONFIDENCE: 94%</span>
          </div>

          <p className="text-xs text-mine-secondary leading-relaxed font-mono">
            Local exponential regression and Kalman filtered velocity forecast indicate current kinematic vector will reach <strong>+3.2° tilt</strong> and <strong>6.1mm displacement</strong> in 30 minutes if excavation pace continues.
          </p>

          <div className="flex items-center gap-3">
            <button
              onClick={onNavigateToCamera}
              className="bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs px-3.5 py-1.5 rounded transition-colors"
            >
              Verify with ESP32-CAM →
            </button>
          </div>
        </div>
      )}

      {activeTab === 'HISTORY' && (
        <div className="bg-mine-surface border border-mine-border rounded-xl p-5 text-center font-mono text-xs text-mine-muted py-12">
          <Clock className="w-8 h-8 text-cyan-400 mx-auto opacity-60 mb-2" />
          <p className="text-white font-semibold">24-Hour Telemetry Historical Archival</p>
          <p className="text-mine-secondary mt-1">Archived in local SQLite / MongoDB cluster buffer.</p>
        </div>
      )}
    </div>
  );
};
