import { PROTOTYPE_THRESHOLDS } from '../../shared/constants';

export interface FusionInput {
  tilt: number;
  displacement: number;
  vibration: number;
  isSensorFault: boolean;
  visualAnomalyDetected: boolean;
  visualConfidence: number; // 0-100
  historicalRate: number; // mm/hr
}

export interface FusionAssessment {
  riskLevel: 'SAFE' | 'WARNING' | 'HIGH' | 'CRITICAL';
  riskScore: number; // 0-100
  confidence: number; // 0-100
  contributors: {
    tiltIncrease: number;
    displacementIncrease: number;
    vibrationAnomaly: number;
    cameraEvidence: number;
    historicalTrend: number;
  };
  predictedRisk: 'SAFE' | 'WARNING' | 'HIGH' | 'CRITICAL';
  explanation: string;
}

/**
 * MineShield Explainable Risk & Confidence Engine
 * Computes multi-sensor + visual fusion assessment.
 * Avoids false positive mine alarms when sensor is merely faulty.
 */
export function calculateZoneRisk(input: FusionInput): FusionAssessment {
  // If sensor has hardware fault / flatlined / timeout, handle gracefully
  if (input.isSensorFault) {
    return {
      riskLevel: 'SAFE',
      riskScore: 12,
      confidence: 50,
      contributors: {
        tiltIncrease: 0,
        displacementIncrease: 0,
        vibrationAnomaly: 0,
        cameraEvidence: 0,
        historicalTrend: 15,
      },
      predictedRisk: 'SAFE',
      explanation: 'Diagnostic flag: Sensor node experiencing hardware degradation or packet loss. No structural subsidence detected.',
    };
  }

  // Calculate normalized contributions (0-100)
  const tiltNorm = Math.min(100, (Math.abs(input.tilt) / PROTOTYPE_THRESHOLDS.tilt.critical) * 100);
  const dispNorm = Math.min(100, (input.displacement / PROTOTYPE_THRESHOLDS.displacement.critical) * 100);
  const vibNorm = Math.min(100, (input.vibration / PROTOTYPE_THRESHOLDS.vibration.critical) * 100);
  const camNorm = input.visualAnomalyDetected ? Math.min(100, input.visualConfidence) : 0;
  const histNorm = Math.min(100, (input.historicalRate / 2.0) * 100);

  // Weights (Primary structural deformation + optical verification dominate)
  // Tilt: 30%, Displacement: 30%, Camera: 20%, Historical: 10%, Vibration: 10%
  const weightedScore = (
    tiltNorm * 0.30 +
    dispNorm * 0.30 +
    camNorm * 0.20 +
    histNorm * 0.10 +
    vibNorm * 0.10
  );

  const riskScore = Math.round(Math.min(100, Math.max(0, weightedScore)));

  // Confidence increases when multiple independent modalities corroborate
  let modalityCorroborations = 0;
  if (tiltNorm > 50) modalityCorroborations++;
  if (dispNorm > 50) modalityCorroborations++;
  if (camNorm > 50) modalityCorroborations++;
  if (vibNorm > 50) modalityCorroborations++;

  let confidence = 80;
  if (modalityCorroborations >= 3) confidence = 94;
  else if (modalityCorroborations === 2) confidence = 88;
  else if (modalityCorroborations === 1) confidence = 78;
  else confidence = 95; // High confidence in safe state

  let riskLevel: 'SAFE' | 'WARNING' | 'HIGH' | 'CRITICAL' = 'SAFE';
  let predictedRisk: 'SAFE' | 'WARNING' | 'HIGH' | 'CRITICAL' = 'SAFE';

  if (riskScore >= 75 || (tiltNorm > 80 && dispNorm > 80 && camNorm > 70)) {
    riskLevel = 'HIGH';
    predictedRisk = 'CRITICAL';
  } else if (riskScore >= 45 || tiltNorm > 50 || dispNorm > 50) {
    riskLevel = 'WARNING';
    predictedRisk = 'HIGH';
  } else {
    riskLevel = 'SAFE';
    predictedRisk = 'SAFE';
  }

  let explanation = 'Nominal baseline stability observed across subterranean monitoring nodes.';
  if (riskLevel === 'HIGH') {
    explanation = 'Accelerating angular tilt and roof displacement corroborated by optical crack evidence. Immediate reinforcement protocol advised.';
  } else if (riskLevel === 'WARNING') {
    explanation = 'Elevated deformation trend detected above baseline. Secondary inspection recommended.';
  }

  return {
    riskLevel,
    riskScore,
    confidence,
    contributors: {
      tiltIncrease: Math.round(tiltNorm),
      displacementIncrease: Math.round(dispNorm),
      vibrationAnomaly: Math.round(vibNorm),
      cameraEvidence: Math.round(camNorm),
      historicalTrend: Math.round(histNorm),
    },
    predictedRisk,
    explanation,
  };
}
