import React from 'react';
import { Cpu, ShieldAlert, CheckCircle2, AlertTriangle, Radio, Activity, Compass, MoveDown, Camera, Volume2, Lightbulb } from 'lucide-react';
import { SYSTEM_METADATA } from '../constants';

export const HardwareView: React.FC = () => {
  const components = [
    {
      name: 'ESP32 Microcontroller Node',
      role: 'Subterranean Edge Processing & Ingestion',
      data: '240MHz Dual-Core, 520KB SRAM, FreeRTOS',
      connection: 'I2C / SPI / GPIO / Sub-GHz Mesh',
      status: 'Connected (8 Nodes)',
      icon: Cpu,
      disclaimer: 'Bench prototype unit. Commercial mine deployment requires DGMS-approved intrinsically safe flameproof (FLP) enclosure.'
    },
    {
      name: 'MPU6050 6-DoF IMU',
      role: 'Strata Incline & Beam Flexure Monitoring',
      data: '3-Axis Gyro + 3-Axis Accel (16-bit resolution)',
      connection: 'I2C Bus (0x68)',
      status: 'Calibrated & Active',
      icon: Compass,
      disclaimer: 'Consumer MEMS accelerometer used for bench concept. Industrial underground mines require certified borehole tiltmeters.'
    },
    {
      name: 'VL53L0X Time-of-Flight Sensor',
      role: 'Roof-to-Floor Convergence Displacement',
      data: '940nm Laser VCSEL ToF (up to 2000mm)',
      connection: 'I2C Bus (0x29)',
      status: 'Operational',
      icon: MoveDown,
      disclaimer: 'Short-range optical ToF prototype. Real-world mine scale subsidence demands certified multi-point magnetic extensometers.'
    },
    {
      name: 'Piezoelectric Vibration Sensor',
      role: 'Acoustic Micro-Seismic Emission Detection',
      data: 'Analog voltage spike corresponding to rock fracture',
      connection: 'ADC Channel 34',
      status: 'Listening (Active)',
      icon: Activity,
      disclaimer: 'Bench piezo element. Field installation requires geophone arrays with calibrated micro-seismic frequency response.'
    },
    {
      name: 'ESP32-CAM (OV2640 Module)',
      role: 'Optical Roof Fissure & Pillar Verification',
      data: '2 Megapixel, UXGA/SVGA Low-light IR capture',
      connection: 'SPI / 8-bit DVP Camera Bus',
      status: 'Standby / Event-Triggered',
      icon: Camera,
      disclaimer: 'Operates in event-triggered burst mode. Commercial version uses explosion-proof optical lenses with dust wipe actuators.'
    },
    {
      name: 'DHT11 / Environmental Array',
      role: 'Underground Ambient Microclimate',
      data: 'Temperature (0-50°C), Humidity (20-90% RH)',
      connection: 'Single-wire GPIO 4',
      status: 'Nominal',
      icon: Radio,
      disclaimer: 'Secondary environmental indicator only. Strata deformation remains primary safety focus.'
    },
    {
      name: 'MQ-2 Gas Sensor Module',
      role: 'Combustible & Toxic Gas Smoke Indicator',
      data: 'Analog gas concentration PPM index',
      connection: 'ADC Channel 35',
      status: 'Nominal Baseline',
      icon: AlertTriangle,
      disclaimer: 'Prototype educational semiconductor sensor. NEVER presents as certified methanometer for coal mine explosive limits.'
    },
    {
      name: 'Industrial Early Warning Siren & Strobe',
      role: 'Subterranean Sector Evacuation Alarm',
      data: '110dB Piezo Siren + Ultra-bright Red LED Strobe',
      connection: 'Relay / High-side MOSFET GPIO 18',
      status: 'Armed',
      icon: Volume2,
      disclaimer: 'Triggered automatically upon Critical Multi-Modal Risk prediction.'
    }
  ];

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="bg-mine-surface border border-mine-border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <h2 className="text-lg font-display font-bold text-white">
              PHYSICAL HARDWARE SYSTEM & SENSOR INVENTORY
            </h2>
          </div>
          <p className="text-xs font-mono text-mine-muted mt-0.5">
            Engineering bill of materials and instrumentation specifications for SIH26025.
          </p>
        </div>
      </div>

      {/* Critical Statutory Disclaimer Callout */}
      <div className="bg-mine-surface border border-cyan-500/40 rounded-xl p-4 shadow-md flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
        <div className="text-xs font-mono text-mine-secondary leading-relaxed">
          <strong className="text-cyan-300">STATUTORY INSTRUMENTATION NOTICE (SIH26025):</strong> {SYSTEM_METADATA.hardwareDisclaimer}
        </div>
      </div>

      {/* Hardware Components Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {components.map((comp, idx) => {
          const Icon = comp.icon;
          return (
            <div
              key={idx}
              className="bg-mine-surface border border-mine-border rounded-xl p-4 flex flex-col justify-between shadow-sm space-y-3 font-mono text-xs"
            >
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-mine-border mb-2">
                  <div className="w-7 h-7 rounded bg-mine-elevated border border-mine-border flex items-center justify-center text-cyan-400">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] text-emerald-400 font-bold">
                    {comp.status}
                  </span>
                </div>

                <h3 className="font-display font-bold text-white text-sm">
                  {comp.name}
                </h3>
                <p className="text-[11px] text-mine-secondary mt-1">
                  <strong>Role:</strong> {comp.role}
                </p>
                <p className="text-[10px] text-mine-muted mt-1">
                  <strong>Specs:</strong> {comp.data}
                </p>
                <p className="text-[10px] text-cyan-400 mt-0.5">
                  <strong>Interface:</strong> {comp.connection}
                </p>
              </div>

              <div className="pt-2 border-t border-mine-border/60 text-[10px] text-mine-muted leading-tight">
                * {comp.disclaimer}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
