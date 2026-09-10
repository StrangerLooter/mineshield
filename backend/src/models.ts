/**
 * MongoDB Data Models and TypeScript Schemas
 * Designed per MineShield Telemetry Specification (SIH26025)
 */

export interface ISensorDocument {
  sensorId: string;
  nodeId: string;
  zoneId: string;
  type: 'TILT' | 'DISPLACEMENT' | 'VIBRATION' | 'ENVIRONMENTAL';
  status: 'HEALTHY' | 'DEGRADED' | 'FAULT' | 'OFFLINE';
  location: {
    panel: string;
    tunnel: string;
    depthMeters: number;
    x: number;
    y: number;
  };
  lastHeartbeat: Date;
  createdAt: Date;
}

export interface ISensorReadingDocument {
  sensorId: string;
  timestamp: Date;
  tilt: number;
  displacement: number;
  vibration: number;
  temperature: number;
  humidity: number;
  gas: number;
  signalQuality: number;
  batteryLevel: number;
}

export interface IRiskAssessmentDocument {
  zoneId: string;
  timestamp: Date;
  riskLevel: 'SAFE' | 'WARNING' | 'HIGH' | 'CRITICAL';
  riskScore: number; // 0 - 100
  confidence: number; // 0 - 100
  contributors: {
    tiltWeight: number;
    displacementWeight: number;
    vibrationWeight: number;
    cameraWeight: number;
    trendWeight: number;
  };
  predictedRisk: 'SAFE' | 'WARNING' | 'HIGH' | 'CRITICAL';
  predictionHorizon: string; // e.g. "30 min"
}

export interface IAlertDocument {
  alertId: string;
  zoneId: string;
  severity: 'SAFE' | 'WARNING' | 'HIGH' | 'CRITICAL';
  type: string;
  message: string;
  confidence: number;
  evidence: Record<string, unknown>;
  status: 'ACTIVE' | 'ACKNOWLEDGED' | 'RESOLVED';
  createdAt: Date;
  acknowledgedAt?: Date;
  acknowledgedBy?: string;
  resolutionNotes?: string;
}

export interface ICameraEventDocument {
  eventId: string;
  cameraId: string;
  zoneId: string;
  timestamp: Date;
  imageUrl: string;
  eventType: string;
  confidence: number;
  aiResult: {
    anomalyDetected: boolean;
    anomalyType: string;
    boundingDetails: Array<{ x: number; y: number; width: number; height: number; label: string }>;
  };
}
