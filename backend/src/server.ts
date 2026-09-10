import express, { Request, Response } from 'express';
import cors from 'cors';
import { INITIAL_ZONES, SYSTEM_METADATA, PROTOTYPE_THRESHOLDS } from '../../shared/constants';
import { calculateZoneRisk } from './riskEngine';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-memory state store for live updates and simulation synchronization
let activeZones = [...INITIAL_ZONES];

let sensorNodes = [
  {
    id: 'S01',
    nodeId: 'ESP32-NODE-01',
    zoneId: 'ZONE_A',
    zoneName: 'Main Shaft & Haulage Drift',
    type: 'TILT',
    status: 'HEALTHY',
    location: { panel: 'Panel 01', tunnel: 'Shaft 1 North', depthMeters: 280, x: 80, y: 110 },
    lastHeartbeat: Date.now() - 2000,
    currentReading: {
      timestamp: Date.now(),
      tilt: 0.12,
      displacement: 0.4,
      vibration: 0.04,
      temperature: 24.5,
      humidity: 58,
      gasPpm: 12,
      signalQuality: 92,
      batteryLevel: 94
    },
    healthMetrics: { heartbeatIntervalSec: 2, packetDropRate: 0.2, voltage: 3.28, temperatureDrift: 0.1 }
  },
  {
    id: 'S02',
    nodeId: 'ESP32-NODE-02',
    zoneId: 'ZONE_A',
    zoneName: 'Main Shaft & Haulage Drift',
    type: 'DISPLACEMENT',
    status: 'HEALTHY',
    location: { panel: 'Panel 01', tunnel: 'Shaft 1 South', depthMeters: 285, x: 190, y: 120 },
    lastHeartbeat: Date.now() - 1500,
    currentReading: {
      timestamp: Date.now(),
      tilt: 0.08,
      displacement: 0.35,
      vibration: 0.03,
      temperature: 24.8,
      humidity: 59,
      gasPpm: 14,
      signalQuality: 89,
      batteryLevel: 91
    },
    healthMetrics: { heartbeatIntervalSec: 2, packetDropRate: 0.4, voltage: 3.26, temperatureDrift: 0.2 }
  },
  {
    id: 'S03',
    nodeId: 'ESP32-NODE-03',
    zoneId: 'ZONE_B',
    zoneName: 'Depillaring Panel 03 South',
    type: 'TILT',
    status: 'HEALTHY',
    location: { panel: 'Panel 03-S', tunnel: 'Stope 3 Pillar Head', depthMeters: 340, x: 360, y: 120 },
    lastHeartbeat: Date.now() - 1200,
    currentReading: {
      timestamp: Date.now(),
      tilt: 2.84,
      displacement: 5.2,
      vibration: 0.72,
      temperature: 29.4,
      humidity: 62,
      gasPpm: 38,
      signalQuality: 78,
      batteryLevel: 82
    },
    healthMetrics: { heartbeatIntervalSec: 2, packetDropRate: 1.1, voltage: 3.18, temperatureDrift: 1.4 }
  },
  {
    id: 'S04',
    nodeId: 'ESP32-NODE-04',
    zoneId: 'ZONE_B',
    zoneName: 'Depillaring Panel 03 South',
    type: 'DISPLACEMENT',
    status: 'DEGRADED',
    location: { panel: 'Panel 03-S', tunnel: 'Stope 3 Mid Roof', depthMeters: 345, x: 440, y: 140 },
    lastHeartbeat: Date.now() - 28000,
    currentReading: {
      timestamp: Date.now() - 28000,
      tilt: 2.1,
      displacement: 4.8,
      vibration: 0.45,
      temperature: 29.8,
      humidity: 64,
      gasPpm: 40,
      signalQuality: 42,
      batteryLevel: 68,
      isStale: true
    },
    healthMetrics: {
      heartbeatIntervalSec: 28,
      packetDropRate: 18.5,
      voltage: 2.95,
      temperatureDrift: 2.8,
      faultReason: 'Intermittent RF packet loss. Suspected antenna attenuation behind stope barrier.'
    }
  },
  {
    id: 'S05',
    nodeId: 'ESP32-NODE-05',
    zoneId: 'ZONE_B',
    zoneName: 'Depillaring Panel 03 South',
    type: 'VIBRATION',
    status: 'HEALTHY',
    location: { panel: 'Panel 03-S', tunnel: 'Return Drift Gate', depthMeters: 342, x: 520, y: 110 },
    lastHeartbeat: Date.now() - 1800,
    currentReading: {
      timestamp: Date.now(),
      tilt: 2.45,
      displacement: 4.9,
      vibration: 0.68,
      temperature: 29.1,
      humidity: 61,
      gasPpm: 36,
      signalQuality: 84,
      batteryLevel: 87
    },
    healthMetrics: { heartbeatIntervalSec: 2, packetDropRate: 0.8, voltage: 3.22, temperatureDrift: 0.9 }
  },
  {
    id: 'S06',
    nodeId: 'ESP32-NODE-06',
    zoneId: 'ZONE_C',
    zoneName: 'Longwall Return Airway',
    type: 'TILT',
    status: 'HEALTHY',
    location: { panel: 'Panel 04-LW', tunnel: 'Return Airway 2', depthMeters: 310, x: 220, y: 310 },
    lastHeartbeat: Date.now() - 2100,
    currentReading: {
      timestamp: Date.now(),
      tilt: 1.62,
      displacement: 3.1,
      vibration: 0.22,
      temperature: 27.2,
      humidity: 68,
      gasPpm: 24,
      signalQuality: 88,
      batteryLevel: 90
    },
    healthMetrics: { heartbeatIntervalSec: 2, packetDropRate: 0.5, voltage: 3.25, temperatureDrift: 0.4 }
  }
];

let alerts = [
  {
    id: 'INC-2026-0042',
    zoneId: 'ZONE_B',
    zoneName: 'Depillaring Panel 03 South',
    sensorIds: ['S03', 'S04', 'S05'],
    severity: 'HIGH',
    title: 'Predicted Subsidence Risk Escalation',
    description: 'Correlated angular tilt (+2.84°) and convergence rate (+5.2mm) corroborated by ESP32-CAM roof fissure detection.',
    timestamp: Date.now() - (8 * 60 * 1000),
    confidence: 94,
    status: 'ACTIVE',
    evidenceContributors: {
      tiltIncrease: 82,
      displacementIncrease: 76,
      vibrationAnomaly: 51,
      cameraEvidence: 88,
      historicalTrend: 71
    },
    recommendedActions: [
      'Halt mechanized coal-cutting in Depillaring Panel 03-South.',
      'Order immediate inspection of roof-bolted support rows 14 through 22.',
      'Deploy strata control engineer with portable extensometer for manual verification.'
    ],
    timeline: [
      { timestamp: Date.now() - (15 * 60 * 1000), phase: 'NORMAL', description: 'Baseline stability across all node clusters.' },
      { timestamp: Date.now() - (11 * 60 * 1000), phase: 'TILT_DEVIATION', description: 'Node S03 detected 1.5°/hr angular tilt anomaly.' },
      { timestamp: Date.now() - (9 * 60 * 1000), phase: 'DISPLACEMENT_RATE', description: 'Convergence rate exceeded 1.2 mm/10min.' },
      { timestamp: Date.now() - (8 * 60 * 1000), phase: 'CAMERA_TRIGGER', description: 'ESP32-CAM-01 captured optical confirmation of roof fissure.' },
      { timestamp: Date.now() - (7 * 60 * 1000), phase: 'RISK_UPGRADE', description: 'Fusion engine upgraded risk level to HIGH with 94% confidence.' },
      { timestamp: Date.now() - (6 * 60 * 1000), phase: 'PREDICTION_CRITICAL', description: 'AI Time-Series models predict CRITICAL subsidence within 30 min horizon.' }
    ]
  }
];

let cameraEvents = [
  {
    id: 'CAM-EV-9904',
    cameraId: 'ESP32-CAM-01',
    zoneId: 'ZONE_B',
    zoneName: 'Depillaring Panel 03 South',
    timestamp: Date.now() - (8 * 60 * 1000),
    status: 'ANALYZED',
    imageBeforeUrl: '/assets/mine_roof_baseline.jpg',
    imageAfterUrl: '/assets/mine_roof_crack.jpg',
    anomalyDetected: true,
    anomalyType: 'ROOF_CRACK',
    confidence: 91.4,
    boundingDetails: [
      { x: 180, y: 140, width: 120, height: 65, label: 'Roof Fissure (Disp: +4.2mm)' },
      { x: 320, y: 210, width: 95, height: 80, label: 'Pillar Spalling Shear' }
    ],
    isSimulated: true
  }
];

// Routes
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'OK',
    service: 'MineShield Intelligence Gateway',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    activeSensors: sensorNodes.length,
    activeAlerts: alerts.filter(a => a.status === 'ACTIVE').length
  });
});

app.get('/api/system/status', (req: Request, res: Response) => {
  res.json({
    system: SYSTEM_METADATA,
    thresholds: PROTOTYPE_THRESHOLDS,
    gateway: {
      status: 'CONNECTED',
      latencyMs: 42,
      mqttBroker: 'mqtt.mineshield.local:1883 (Simulated)',
      database: 'MongoDB In-Memory / Hybrid (Simulated)',
      aiService: 'Python Subsidence Predictor v2.1'
    }
  });
});

app.get('/api/dashboard', (req: Request, res: Response) => {
  const activeAlerts = alerts.filter(a => a.status === 'ACTIVE');
  const onlineSensors = sensorNodes.filter(s => s.status === 'HEALTHY' || s.status === 'DEGRADED');

  res.json({
    systemStatus: 'LIVE',
    overallRisk: 'HIGH',
    overallRiskScore: 82,
    confidence: 94,
    activeAlertsCount: activeAlerts.length,
    sensorsOnline: `${onlineSensors.length} / ${sensorNodes.length}`,
    predictionSummary: 'Zone B exhibiting accelerating subsidence trajectory towards CRITICAL state within 30 min.',
    telemetryLatency: '1.8 sec',
    primaryZone: activeZones.find(z => z.id === 'ZONE_B'),
    zones: activeZones,
    sensors: sensorNodes,
    recentAlerts: activeAlerts,
    cameraEvent: cameraEvents[0]
  });
});

app.get('/api/sensors', (req: Request, res: Response) => {
  res.json(sensorNodes);
});

app.get('/api/sensors/:id', (req: Request, res: Response) => {
  const sensor = sensorNodes.find(s => s.id.toLowerCase() === req.params.id.toLowerCase());
  if (!sensor) {
    return res.status(404).json({ error: 'Sensor node not found' });
  }
  res.json(sensor);
});

app.get('/api/zones', (req: Request, res: Response) => {
  res.json(activeZones);
});

app.get('/api/alerts', (req: Request, res: Response) => {
  res.json(alerts);
});

app.get('/api/alerts/:id', (req: Request, res: Response) => {
  const alert = alerts.find(a => a.id.toLowerCase() === req.params.id.toLowerCase());
  if (!alert) {
    return res.status(404).json({ error: 'Incident not found' });
  }
  res.json(alert);
});

app.post('/api/alerts/:id/acknowledge', (req: Request, res: Response) => {
  const alert = alerts.find(a => a.id.toLowerCase() === req.params.id.toLowerCase());
  if (!alert) {
    return res.status(404).json({ error: 'Incident not found' });
  }
  alert.status = 'ACKNOWLEDGED';
  alert.acknowledgedAt = Date.now();
  alert.acknowledgedBy = req.body.operatorName || 'Safety Officer #44';
  if (req.body.notes) {
    alert.resolutionNotes = req.body.notes;
  }
  res.json({ success: true, alert });
});

app.get('/api/camera/events', (req: Request, res: Response) => {
  res.json(cameraEvents);
});

app.get('/api/predictions', (req: Request, res: Response) => {
  res.json({
    zonePredictions: [
      {
        zoneId: 'ZONE_A',
        zoneName: 'Main Shaft & Haulage Drift',
        currentRisk: 'SAFE',
        predictedRisk: 'SAFE',
        horizon: '30 min',
        confidence: 96,
        trend: 'STABLE'
      },
      {
        zoneId: 'ZONE_B',
        zoneName: 'Depillaring Panel 03 South',
        currentRisk: 'HIGH',
        predictedRisk: 'CRITICAL',
        horizon: '30 min',
        confidence: 94,
        trend: 'CRITICAL_ACCELERATION',
        explanation: 'Accelerating roof-sag convergence corroborated by optical fissure detection.'
      },
      {
        zoneId: 'ZONE_C',
        zoneName: 'Longwall Return Airway',
        currentRisk: 'WARNING',
        predictedRisk: 'WARNING',
        horizon: '30 min',
        confidence: 91,
        trend: 'MODERATE_INCREASE'
      },
      {
        zoneId: 'ZONE_D',
        zoneName: 'Sub-Level Intake Drift',
        currentRisk: 'SAFE',
        predictedRisk: 'SAFE',
        horizon: '30 min',
        confidence: 95,
        trend: 'STABLE'
      }
    ]
  });
});

app.listen(PORT, () => {
  console.log(`[MineShield] Telemetry Gateway listening on port ${PORT}`);
});
