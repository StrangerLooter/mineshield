import { ZoneData } from './types';

export const SYSTEM_METADATA = {
  name: 'MineShield',
  version: '2.4-PROTOTYPE',
  tagline: 'MONITOR. PREDICT. PROTECT.',
  subTagline: 'AI-Enabled Real-Time Mine Subsidence Monitoring, Prediction & Early Warning System',
  sihProblemId: 'SIH26025',
  theme: 'Smart Automation',
  category: 'Hardware',
  team: 'Edge Square',
  mineSite: 'Central Coal Block (Underground Seam 4)',
  regulatoryDisclaimer: 'PROTOTYPE DEMONSTRATION ENVIRONMENT: Telemetry thresholds and algorithms are research-grade demonstrations for SIH26025. Production underground mine deployment requires DGMS-certified flameproof/intrinsically safe instrumentation and site-specific geomechanical calibration.',
  hardwareDisclaimer: 'Hardware modules (MPU6050, VL53L0X, Piezo, MQ-2, ESP32) are bench prototype implementations. Commercial installations require certified borehole extensometers, intrinsically safe optical transducers, and explosion-proof enclosures compliant with Indian Coal Mines Regulations (CMR 2017).'
};

export const PROTOTYPE_THRESHOLDS = {
  tilt: {
    warning: 1.5,
    high: 2.2,
    critical: 3.0,
    unit: '°'
  },
  displacement: {
    warning: 3.0,
    high: 5.0,
    critical: 8.0,
    unit: 'mm'
  },
  vibration: {
    warning: 0.40,
    high: 0.65,
    critical: 0.85,
    unit: 'g'
  }
};

export const INITIAL_ZONES: ZoneData[] = [
  {
    id: 'ZONE_A',
    name: 'Main Shaft & Haulage Drift',
    code: 'ZN-A',
    panel: 'Panel 01',
    status: 'SAFE',
    riskScore: 14,
    confidence: 96,
    sensorIds: ['S01', 'S02'],
    activeAlertsCount: 0,
    primaryDrivers: {
      tilt: '+0.12° (Nominal)',
      displacement: '0.4 mm (Stable)',
      vibration: '0.04 g (Ambient)',
      visualVerification: 'Clear'
    },
    coordinates: { x: 50, y: 70, width: 220, height: 140 }
  },
  {
    id: 'ZONE_B',
    name: 'Depillaring Panel 03 South',
    code: 'ZN-B',
    panel: 'Panel 03-S',
    status: 'HIGH',
    riskScore: 82,
    confidence: 94,
    sensorIds: ['S03', 'S04', 'S05'],
    activeAlertsCount: 1,
    primaryDrivers: {
      tilt: '+2.84° (Escalating)',
      displacement: '5.2 mm (Critical rate)',
      vibration: '0.72 g (Abnormal acoustic)',
      visualVerification: 'Roof fissure verified'
    },
    coordinates: { x: 310, y: 70, width: 260, height: 160 }
  },
  {
    id: 'ZONE_C',
    name: 'Longwall Return Airway',
    code: 'ZN-C',
    panel: 'Panel 04-LW',
    status: 'WARNING',
    riskScore: 48,
    confidence: 91,
    sensorIds: ['S06'],
    activeAlertsCount: 0,
    primaryDrivers: {
      tilt: '+1.62° (Slight drift)',
      displacement: '3.1 mm (Elevated)',
      vibration: '0.22 g (Nominal)',
      visualVerification: 'No fissures detected'
    },
    coordinates: { x: 120, y: 260, width: 240, height: 140 }
  },
  {
    id: 'ZONE_D',
    name: 'Sub-Level Intake Drift',
    code: 'ZN-D',
    panel: 'Panel 02-N',
    status: 'SAFE',
    riskScore: 18,
    confidence: 95,
    sensorIds: ['S07', 'S08'],
    activeAlertsCount: 0,
    primaryDrivers: {
      tilt: '+0.25° (Nominal)',
      displacement: '0.8 mm (Nominal)',
      vibration: '0.05 g (Ambient)',
      visualVerification: 'Nominal'
    },
    coordinates: { x: 400, y: 260, width: 220, height: 140 }
  }
];
