export type RiskLevel = 'SAFE' | 'WARNING' | 'HIGH' | 'CRITICAL';

export type SensorStatus = 'HEALTHY' | 'DEGRADED' | 'FAULT' | 'OFFLINE';

export type SensorType = 'TILT' | 'DISPLACEMENT' | 'VIBRATION' | 'ENVIRONMENTAL';

export interface TelemetryReading {
  timestamp: number;
  tilt: number; // degrees deviation from baseline
  displacement: number; // mm
  vibration: number; // normalized 0-1
  temperature: number; // deg C
  humidity: number; // %
  gasPpm: number; // ppm (CO/CH4 indicator)
  signalQuality: number; // dBm / %
  batteryLevel: number; // %
  isStale?: boolean;
}

export interface SensorNode {
  id: string; // e.g. "S01", "S02", "S03", "S04", "S05", "S06"
  nodeId: string; // e.g. "ESP32-NODE-03"
  zoneId: string; // "ZONE_A", "ZONE_B", "ZONE_C", "ZONE_D"
  zoneName: string;
  type: SensorType;
  status: SensorStatus;
  location: {
    panel: string;
    tunnel: string;
    depthMeters: number;
    x: number; // 2D map coordinate
    y: number;
  };
  lastHeartbeat: number;
  currentReading: TelemetryReading;
  healthMetrics: {
    heartbeatIntervalSec: number;
    packetDropRate: number; // %
    voltage: number;
    temperatureDrift: number;
    faultReason?: string;
  };
}

export interface ZoneData {
  id: string;
  name: string;
  code: string;
  panel: string;
  status: RiskLevel;
  riskScore: number; // 0 to 100
  confidence: number; // 0 to 100
  sensorIds: string[];
  activeAlertsCount: number;
  primaryDrivers: {
    tilt: string;
    displacement: string;
    vibration: string;
    visualVerification: string;
  };
  coordinates: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface AlertIncident {
  id: string;
  zoneId: string;
  zoneName: string;
  sensorIds: string[];
  severity: RiskLevel;
  title: string;
  description: string;
  timestamp: number;
  confidence: number;
  status: 'ACTIVE' | 'ACKNOWLEDGED' | 'RESOLVED';
  acknowledgedBy?: string;
  acknowledgedAt?: number;
  resolutionNotes?: string;
  evidenceContributors: {
    tiltIncrease: number; // e.g. 82%
    displacementIncrease: number; // 76%
    vibrationAnomaly: number; // 51%
    cameraEvidence: number; // 88%
    historicalTrend: number; // 71%
  };
  recommendedActions: string[];
  timeline: {
    timestamp: number;
    phase: string;
    description: string;
  }[];
}

export interface CameraEvent {
  id: string;
  cameraId: string;
  zoneId: string;
  zoneName: string;
  timestamp: number;
  status: 'ANALYZED' | 'PROCESSING' | 'FLAGGED';
  imageBeforeUrl: string;
  imageAfterUrl: string;
  anomalyDetected: boolean;
  anomalyType: 'ROOF_CRACK' | 'PILLAR_SPALLING' | 'DISPLACEMENT_FRACTURE' | 'NONE';
  confidence: number;
  boundingDetails: {
    x: number;
    y: number;
    width: number;
    height: number;
    label: string;
  }[];
  isSimulated: boolean;
}

export interface AIPredictionHorizon {
  horizonLabel: '15m' | '30m' | '1h' | '6h' | '24h';
  predictedRisk: RiskLevel;
  confidence: number;
  predictedTiltDelta: number;
  predictedDisplacementDelta: number;
  trendVelocity: 'STABLE' | 'MODERATE_INCREASE' | 'RAPID_INCREASE' | 'CRITICAL_ACCELERATION';
  explanation: string;
}

export type DemoScenario = 
  | 'NORMAL'
  | 'SENSOR_FAULT'
  | 'ELEVATED_TILT'
  | 'CAMERA_CONFIRMED'
  | 'CRITICAL_SUBSIDENCE';
