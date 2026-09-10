"""
MineShield Sensor + Camera Multi-Modal Fusion Engine (SIH26025)
Team: Edge Square
Combines Time-Series ML predictions with Computer Vision optical confirmation.
"""

from typing import Dict, Any
from time_series_predictor import SubsidencePredictor
from vision_anomaly_detector import OpticalAnomalyDetector

class FusionService:
    def __init__(self):
        self.predictor = SubsidencePredictor()
        self.vision = OpticalAnomalyDetector()

    def evaluate_zone(self, zone_id: str, sensor_history: list, camera_frame_id: str) -> Dict[str, Any]:
        latest_sensor = sensor_history[-1] if sensor_history else {"tilt": 0.0, "displacement": 0.0, "vibration": 0.0}
        
        # 1. Run Time-Series Prediction
        prediction_result = self.predictor.predict_horizon(sensor_history, horizon_minutes=30)
        
        # 2. Run Computer Vision Verification
        vision_result = self.vision.analyze_event_frame(camera_frame_id, latest_sensor)
        
        # 3. Multi-Modal Corroboration
        tilt = latest_sensor.get("tilt", 0.0)
        disp = latest_sensor.get("displacement", 0.0)
        vib = latest_sensor.get("vibration", 0.0)
        
        has_sensor_anomaly = (tilt > 1.8 or disp > 3.5 or vib > 0.5)
        has_visual_anomaly = vision_result["anomaly_detected"]
        
        # Dual-check prevents false positives from single dust/vibration spikes
        if has_sensor_anomaly and has_visual_anomaly:
            final_risk = "CRITICAL" if (tilt > 2.5 or disp > 5.0) else "HIGH"
            fusion_confidence = 94.2
            early_warning_status = "TRIGGER_OPERATOR_DISPATCH"
        elif has_sensor_anomaly and not has_visual_anomaly:
            final_risk = "WARNING"
            fusion_confidence = 82.0
            early_warning_status = "MONITOR_SECONDARY_INSPECTION"
        else:
            final_risk = "SAFE"
            fusion_confidence = 96.0
            early_warning_status = "NORMAL_SURVEILLANCE"

        return {
            "zone_id": zone_id,
            "final_risk": final_risk,
            "fusion_confidence": fusion_confidence,
            "early_warning_status": early_warning_status,
            "sensor_evidence": {
                "tilt_deg": tilt,
                "displacement_mm": disp,
                "vibration_g": vib,
                "anomaly_flag": has_sensor_anomaly
            },
            "vision_evidence": {
                "detected": has_visual_anomaly,
                "type": vision_result["anomaly_type"],
                "confidence": vision_result["confidence"]
            },
            "predictive_forecasting": prediction_result
        }

if __name__ == "__main__":
    service = FusionService()
    history = [{"tilt": 1.2 + i * 0.18, "displacement": 1.5 + i * 0.4, "vibration": 0.1 + i * 0.06} for i in range(10)]
    assessment = service.evaluate_zone("ZONE_B", history, "cam_event_1428.jpg")
    print("Multi-Modal Fusion Assessment:", assessment)
