import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { SensorNode, ZoneData, AlertIncident, CameraEvent, DemoScenario, RiskLevel } from '../types';
import { INITIAL_ZONES, PROTOTYPE_THRESHOLDS } from '../constants';

interface TelemetryContextType {
  sensors: SensorNode[];
  zones: ZoneData[];
  alerts: AlertIncident[];
  cameraEvents: CameraEvent[];
  selectedZone: ZoneData | null;
  selectedSensor: SensorNode | null;
  currentScenario: DemoScenario;
  isSimulating: boolean;
  demoProgress: number; // 0 to 100
  demoStepText: string;
  isAutomatedDemoRunning: boolean;
  setSelectedZone: (zone: ZoneData | null) => void;
  setSelectedSensor: (sensor: SensorNode | null) => void;
  setScenario: (scenario: DemoScenario) => void;
  toggleSimulation: () => void;
  runAutomatedIncidentDemo: () => void;
  acknowledgeAlert: (alertId: string, operatorNotes?: string) => void;
  resetAll: () => void;
  getSensorById: (id: string) => SensorNode | undefined;
}

const TelemetryContext = createContext<TelemetryContextType | undefined>(undefined);

// Generate 20 historical readings for a baseline
const generateInitialHistory = (baseTilt: number, baseDisp: number, baseVib: number) => {
  const history = [];
  const now = Date.now();
  for (let i = 19; i >= 0; i--) {
    history.push({
      timestamp: now - (i * 3000),
      tilt: Number((baseTilt + (Math.sin(i * 0.5) * 0.05)).toFixed(2)),
      displacement: Number((baseDisp + (Math.cos(i * 0.4) * 0.08)).toFixed(2)),
      vibration: Number((baseVib + (Math.random() * 0.02)).toFixed(2)),
      temperature: 28.5 + Number((Math.random() * 0.5).toFixed(1)),
      humidity: 62 + Math.floor(Math.random() * 3),
      gasPpm: 22 + Math.floor(Math.random() * 4),
      signalQuality: 88,
      batteryLevel: 94
    });
  }
  return history;
};

const INITIAL_SENSORS: SensorNode[] = [
  {
    id: 'S01',
    nodeId: 'ESP32-NODE-01',
    zoneId: 'ZONE_A',
    zoneName: 'Main Shaft & Haulage Drift',
    type: 'TILT',
    status: 'HEALTHY',
    location: { panel: 'Panel 01', tunnel: 'Shaft 1 North', depthMeters: 280, x: 80, y: 110 },
    lastHeartbeat: Date.now() - 1200,
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
    history: generateInitialHistory(0.12, 0.4, 0.04),
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
    history: generateInitialHistory(0.08, 0.35, 0.03),
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
    lastHeartbeat: Date.now() - 1100,
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
    history: generateInitialHistory(2.84, 5.2, 0.72),
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
    history: generateInitialHistory(2.1, 4.8, 0.45),
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
    lastHeartbeat: Date.now() - 1400,
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
    history: generateInitialHistory(2.45, 4.9, 0.68),
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
    history: generateInitialHistory(1.62, 3.1, 0.22),
    healthMetrics: { heartbeatIntervalSec: 2, packetDropRate: 0.5, voltage: 3.25, temperatureDrift: 0.4 }
  },
  {
    id: 'S07',
    nodeId: 'ESP32-NODE-07',
    zoneId: 'ZONE_D',
    zoneName: 'Sub-Level Intake Drift',
    type: 'DISPLACEMENT',
    status: 'HEALTHY',
    location: { panel: 'Panel 02-N', tunnel: 'Intake Cross-Cut', depthMeters: 260, x: 440, y: 300 },
    lastHeartbeat: Date.now() - 1700,
    currentReading: {
      timestamp: Date.now(),
      tilt: 0.25,
      displacement: 0.8,
      vibration: 0.05,
      temperature: 23.9,
      humidity: 55,
      gasPpm: 15,
      signalQuality: 91,
      batteryLevel: 96
    },
    history: generateInitialHistory(0.25, 0.8, 0.05),
    healthMetrics: { heartbeatIntervalSec: 2, packetDropRate: 0.3, voltage: 3.30, temperatureDrift: 0.1 }
  },
  {
    id: 'S08',
    nodeId: 'ESP32-NODE-08',
    zoneId: 'ZONE_D',
    zoneName: 'Sub-Level Intake Drift',
    type: 'TILT',
    status: 'HEALTHY',
    location: { panel: 'Panel 02-N', tunnel: 'Intake Sump', depthMeters: 265, x: 550, y: 320 },
    lastHeartbeat: Date.now() - 1900,
    currentReading: {
      timestamp: Date.now(),
      tilt: 0.18,
      displacement: 0.65,
      vibration: 0.04,
      temperature: 24.1,
      humidity: 56,
      gasPpm: 16,
      signalQuality: 93,
      batteryLevel: 95
    },
    history: generateInitialHistory(0.18, 0.65, 0.04),
    healthMetrics: { heartbeatIntervalSec: 2, packetDropRate: 0.3, voltage: 3.29, temperatureDrift: 0.1 }
  }
];

const INITIAL_ALERTS: AlertIncident[] = [
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

const INITIAL_CAMERA_EVENTS: CameraEvent[] = [
  {
    id: 'CAM-EV-9904',
    cameraId: 'ESP32-CAM-01',
    zoneId: 'ZONE_B',
    zoneName: 'Depillaring Panel 03 South',
    timestamp: Date.now() - (8 * 60 * 1000),
    status: 'ANALYZED',
    imageBeforeUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
    imageAfterUrl: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=600&q=80',
    anomalyDetected: true,
    anomalyType: 'ROOF_CRACK',
    confidence: 91.4,
    boundingDetails: [
      { x: 140, y: 110, width: 150, height: 75, label: 'Roof Fissure (Disp: +4.2mm)' },
      { x: 310, y: 180, width: 110, height: 90, label: 'Pillar Spalling Shear' }
    ],
    isSimulated: true
  }
];

export const TelemetryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [sensors, setSensors] = useState<SensorNode[]>(INITIAL_SENSORS);
  const [zones, setZones] = useState<ZoneData[]>(INITIAL_ZONES);
  const [alerts, setAlerts] = useState<AlertIncident[]>(INITIAL_ALERTS);
  const [cameraEvents, setCameraEvents] = useState<CameraEvent[]>(INITIAL_CAMERA_EVENTS);
  const [selectedZone, setSelectedZone] = useState<ZoneData | null>(INITIAL_ZONES[1]); // Default Zone B
  const [selectedSensor, setSelectedSensor] = useState<SensorNode | null>(INITIAL_SENSORS[2]); // Default S03
  const [currentScenario, setCurrentScenario] = useState<DemoScenario>('CAMERA_CONFIRMED');
  const [isSimulating, setIsSimulating] = useState<boolean>(true);
  const [isAutomatedDemoRunning, setIsAutomatedDemoRunning] = useState<boolean>(false);
  const [demoProgress, setDemoProgress] = useState<number>(65);
  const [demoStepText, setDemoStepText] = useState<string>('Step 4/5: Camera Verification Corroborated with Sensor Fusion');

  // Helper to fetch sensor by ID
  const getSensorById = useCallback((id: string) => {
    return sensors.find(s => s.id === id);
  }, [sensors]);

  // Acknowledge alert
  const acknowledgeAlert = useCallback((alertId: string, operatorNotes?: string) => {
    setAlerts(prev => prev.map(a => {
      if (a.id === alertId) {
        return {
          ...a,
          status: 'ACKNOWLEDGED' as const,
          acknowledgedAt: Date.now(),
          acknowledgedBy: 'Safety Officer (Shift Lead)',
          resolutionNotes: operatorNotes || 'Inspection crew deployed to Panel 03-S.'
        };
      }
      return a;
    }));
  }, []);

  // Reset to initial baseline
  const resetAll = useCallback(() => {
    setSensors(INITIAL_SENSORS);
    setZones(INITIAL_ZONES);
    setAlerts(INITIAL_ALERTS);
    setCameraEvents(INITIAL_CAMERA_EVENTS);
    setSelectedZone(INITIAL_ZONES[1]);
    setSelectedSensor(INITIAL_SENSORS[2]);
    setCurrentScenario('CAMERA_CONFIRMED');
    setIsAutomatedDemoRunning(false);
    setDemoProgress(65);
    setDemoStepText('Standard Baseline Restored (Zone B High)');
  }, []);

  // Manual scenario switch
  const setScenario = useCallback((scenario: DemoScenario) => {
    setCurrentScenario(scenario);
    setIsAutomatedDemoRunning(false);

    if (scenario === 'NORMAL') {
      setSensors(prev => prev.map(s => {
        const baseTilt = 0.15;
        const baseDisp = 0.4;
        const baseVib = 0.05;
        return {
          ...s,
          status: 'HEALTHY',
          currentReading: {
            ...s.currentReading,
            timestamp: Date.now(),
            tilt: Number((baseTilt + (Math.random() * 0.05)).toFixed(2)),
            displacement: Number((baseDisp + (Math.random() * 0.05)).toFixed(2)),
            vibration: Number((baseVib + (Math.random() * 0.02)).toFixed(2)),
            isStale: false
          }
        };
      }));
      setZones(prev => prev.map(z => ({
        ...z,
        status: 'SAFE',
        riskScore: 15,
        confidence: 96,
        activeAlertsCount: 0
      })));
      setDemoProgress(20);
      setDemoStepText('Scenario: Normal Operations (All Zones Stable)');
    } else if (scenario === 'SENSOR_FAULT') {
      // S04 has hardware fault/stale, but structural risk remains SAFE
      setSensors(prev => prev.map(s => {
        if (s.id === 'S04') {
          return {
            ...s,
            status: 'FAULT',
            currentReading: {
              ...s.currentReading,
              timestamp: Date.now() - 45000,
              isStale: true
            },
            healthMetrics: {
              ...s.healthMetrics,
              heartbeatIntervalSec: 45,
              packetDropRate: 42.0,
              faultReason: 'Loss of communication packets. Battery level depleted or physical cable severance.'
            }
          };
        }
        return s;
      }));
      setDemoProgress(35);
      setDemoStepText('Scenario: Sensor Hardware Fault (Gracefully Handled without False Mine Alarm)');
    } else if (scenario === 'ELEVATED_TILT') {
      setSensors(prev => prev.map(s => {
        if (s.zoneId === 'ZONE_B') {
          return {
            ...s,
            currentReading: {
              ...s.currentReading,
              timestamp: Date.now(),
              tilt: 1.85,
              displacement: 3.4,
              vibration: 0.38
            }
          };
        }
        return s;
      }));
      setZones(prev => prev.map(z => {
        if (z.id === 'ZONE_B') {
          return { ...z, status: 'WARNING', riskScore: 54, confidence: 91 };
        }
        return z;
      }));
      setDemoProgress(50);
      setDemoStepText('Scenario: Elevated Deformation Anomaly (Warning Threshold Breached)');
    } else if (scenario === 'CAMERA_CONFIRMED') {
      setSensors(prev => prev.map(s => {
        if (s.id === 'S03') {
          return {
            ...s,
            currentReading: {
              ...s.currentReading,
              timestamp: Date.now(),
              tilt: 2.84,
              displacement: 5.2,
              vibration: 0.72
            }
          };
        }
        return s;
      }));
      setZones(prev => prev.map(z => {
        if (z.id === 'ZONE_B') {
          return { ...z, status: 'HIGH', riskScore: 82, confidence: 94, activeAlertsCount: 1 };
        }
        return z;
      }));
      setDemoProgress(75);
      setDemoStepText('Scenario: Sensor + Camera Fusion Verified (High Risk)');
    } else if (scenario === 'CRITICAL_SUBSIDENCE') {
      setSensors(prev => prev.map(s => {
        if (s.zoneId === 'ZONE_B') {
          return {
            ...s,
            currentReading: {
              ...s.currentReading,
              timestamp: Date.now(),
              tilt: 3.42,
              displacement: 8.6,
              vibration: 0.89
            }
          };
        }
        return s;
      }));
      setZones(prev => prev.map(z => {
        if (z.id === 'ZONE_B') {
          return { ...z, status: 'CRITICAL', riskScore: 96, confidence: 98, activeAlertsCount: 1 };
        }
        return z;
      }));
      setAlerts(prev => {
        const exists = prev.find(a => a.severity === 'CRITICAL');
        if (exists) return prev;
        const newAlert: AlertIncident = {
          id: `INC-2026-${Date.now().toString().slice(-4)}`,
          zoneId: 'ZONE_B',
          zoneName: 'Depillaring Panel 03 South',
          sensorIds: ['S03', 'S04', 'S05'],
          severity: 'CRITICAL',
          title: '🚨 CRITICAL ROOF COLLAPSE WARNING',
          description: 'Immediate evacuation required. Subterranean convergence rate exceeded 8.6mm with extensive optical spalling.',
          timestamp: Date.now(),
          confidence: 98,
          status: 'ACTIVE',
          evidenceContributors: {
            tiltIncrease: 94,
            displacementIncrease: 92,
            vibrationAnomaly: 86,
            cameraEvidence: 95,
            historicalTrend: 89
          },
          recommendedActions: [
            'SOUND AUDIBLE EVACUATION SIRENS in Sector 3 immediately.',
            'Cut electrical power to Panel 03-S longwall cutting machinery.',
            'Evacuate all face miners to fresh-air base in Main Shaft Zone A.'
          ],
          timeline: [
            { timestamp: Date.now() - 60000, phase: 'CRITICAL_BREACH', description: 'Extrapolated convergence rate > 8.0mm/hr.' },
            { timestamp: Date.now(), phase: 'EVACUATION_ISSUED', description: 'Automated early warning sirens triggered.' }
          ]
        };
        return [newAlert, ...prev];
      });
      setDemoProgress(100);
      setDemoStepText('Scenario: Critical Subsidence Early Warning (Evacuation Level)');
    }
  }, []);

  // Automated Incident Demo Runner for SIH Presentation
  const runAutomatedIncidentDemo = useCallback(() => {
    setIsAutomatedDemoRunning(true);
    setDemoProgress(0);
    setDemoStepText('Initiating Guided Demo: Starting at Normal Baseline...');

    // Phase 1: Normal (t = 0)
    setScenario('NORMAL');
    setDemoProgress(10);
    setDemoStepText('Phase 1/5: Normal Operations — All sensors within CMR 2017 baseline.');

    // Phase 2: Tilt Deviation (t = 3.5s)
    const t1 = setTimeout(() => {
      setSensors(prev => prev.map(s => {
        if (s.id === 'S03') {
          return {
            ...s,
            currentReading: { ...s.currentReading, tilt: 1.65, displacement: 1.8, vibration: 0.25 }
          };
        }
        return s;
      }));
      setZones(prev => prev.map(z => (z.id === 'ZONE_B' ? { ...z, status: 'WARNING', riskScore: 48 } : z)));
      setDemoProgress(30);
      setDemoStepText('Phase 2/5: Node S03 detects angular tilt deviation (+1.65°). System flags Zone B for monitoring.');
    }, 3500);

    // Phase 3: Displacement and Vibration Acceleration (t = 7.5s)
    const t2 = setTimeout(() => {
      setSensors(prev => prev.map(s => {
        if (s.zoneId === 'ZONE_B') {
          return {
            ...s,
            currentReading: { ...s.currentReading, tilt: 2.3, displacement: 4.2, vibration: 0.58 }
          };
        }
        return s;
      }));
      setZones(prev => prev.map(z => (z.id === 'ZONE_B' ? { ...z, status: 'HIGH', riskScore: 72 } : z)));
      setDemoProgress(55);
      setDemoStepText('Phase 3/5: Convergence velocity reaches 4.2mm. Anomaly engine triggers ESP32-CAM optical capture.');
    }, 7500);

    // Phase 4: Camera Verification & Fusion (t = 11.5s)
    const t3 = setTimeout(() => {
      setScenario('CAMERA_CONFIRMED');
      setDemoProgress(80);
      setDemoStepText('Phase 4/5: ESP32-CAM AI vision detects roof fissure (91.4% conf). Fusion Engine upgrades confidence to 94%.');
    }, 11500);

    // Phase 5: Critical Prediction & Early Warning (t = 15.5s)
    const t4 = setTimeout(() => {
      setScenario('CRITICAL_SUBSIDENCE');
      setDemoProgress(100);
      setIsAutomatedDemoRunning(false);
      setDemoStepText('Phase 5/5: Time-Series ML predicts CRITICAL collapse within 30 min. Global Early Warning Siren engaged!');
    }, 15500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [setScenario]);

  // Live telemetry pulse tick (every 2.5s)
  useEffect(() => {
    if (!isSimulating || isAutomatedDemoRunning) return;

    const interval = setInterval(() => {
      setSensors(prevSensors => {
        return prevSensors.map(sensor => {
          if (sensor.status === 'FAULT' || sensor.status === 'OFFLINE') {
            return sensor;
          }
          const jitter = (Math.random() - 0.5) * 0.04;
          const dispJitter = (Math.random() - 0.5) * 0.05;
          const vibJitter = (Math.random() - 0.5) * 0.02;

          const updatedTilt = Number((sensor.currentReading.tilt + jitter).toFixed(2));
          const updatedDisp = Number((sensor.currentReading.displacement + dispJitter).toFixed(2));
          const updatedVib = Number(Math.max(0.01, (sensor.currentReading.vibration + vibJitter)).toFixed(2));

          const newReading = {
            ...sensor.currentReading,
            timestamp: Date.now(),
            tilt: updatedTilt,
            displacement: updatedDisp,
            vibration: updatedVib,
            temperature: Number((sensor.currentReading.temperature + (Math.random() - 0.5) * 0.1).toFixed(1)),
            humidity: Math.min(95, Math.max(30, sensor.currentReading.humidity + Math.round((Math.random() - 0.5)))),
            gasPpm: Math.max(5, sensor.currentReading.gasPpm + Math.round((Math.random() - 0.5) * 2))
          };

          const newHistory = [...sensor.history.slice(1), newReading];

          return {
            ...sensor,
            lastHeartbeat: Date.now(),
            currentReading: newReading,
            history: newHistory
          };
        });
      });
    }, 2500);

    return () => clearInterval(interval);
  }, [isSimulating, isAutomatedDemoRunning]);

  const toggleSimulation = () => setIsSimulating(prev => !prev);

  return (
    <TelemetryContext.Provider
      value={{
        sensors,
        zones,
        alerts,
        cameraEvents,
        selectedZone,
        selectedSensor,
        currentScenario,
        isSimulating,
        demoProgress,
        demoStepText,
        isAutomatedDemoRunning,
        setSelectedZone,
        setSelectedSensor,
        setScenario,
        toggleSimulation,
        runAutomatedIncidentDemo,
        acknowledgeAlert,
        resetAll,
        getSensorById
      }}
    >
      {children}
    </TelemetryContext.Provider>
  );
};

export const useTelemetry = () => {
  const context = useContext(TelemetryContext);
  if (!context) {
    throw new Error('useTelemetry must be used within a TelemetryProvider');
  }
  return context;
};
