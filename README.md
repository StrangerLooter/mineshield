# MineShield

> **AI-Enabled Low Cost Real Time Mine Subsidence Monitoring, Prediction and Early Warning System for Underground Coal Mines in India**

**Team:** Edge Square  
**SIH Problem Statement:** SIH26025  
**Theme:** Smart Automation (Hardware)  
**Repository:** [https://github.com/StrangerLooter/mineshield](https://github.com/StrangerLooter/mineshield)

---

## Overview

MineShield is an industrial real-time mine safety intelligence platform. It receives data from distributed subterranean sensor nodes, processes structural and environmental measurements, detects abnormal behavior, uses AI/ML for trend prediction, verifies anomalies using ESP32-CAM computer vision, combines multiple evidence sources into a risk/confidence assessment, and provides early warnings through an operator dashboard, digital mine map, historical analytics, and AR-oriented spatial visualization.

---

## Key System Story

```
Sensors (MPU6050, VL53L0X, Piezo, MQ-2, DHT11)
  ↓
ESP32 Subterranean Edge Node (Sampling & Ring Buffering)
  ↓
Real-Time Ingestion & Kalman Filtering
  ↓
Edge Anomaly Trigger
  ↓
ESP32-CAM Optical Frame Capture
  ↓
Computer Vision + Historical Sensor Data
  ↓
Time-Series ML (15m, 30m, 1h, 24h Horizon Forecasting)
  ↓
Multi-Modal Sensor + Camera Fusion Engine
  ↓
Risk Score + High Confidence Assessment (94%)
  ↓
Early Warning & Siren Dispatch
  ↓
Mission Control Dashboard + Digital Mine Map + AR View
```

---

## Project Structure

```
├── frontend/             # React 19 + TypeScript + Vite + Tailwind CSS + Recharts
│   ├── src/
│   │   ├── components/   # Modular dashboard, map, and layout components
│   │   ├── context/      # Telemetry & Auth state simulation engine
│   │   ├── views/        # All dedicated application pages
│   │   ├── types.ts      # Core data models & interfaces
│   │   └── constants.ts  # Prototype thresholds & metadata
│   └── package.json
├── backend/              # Node.js + Express + MongoDB Schemas + REST API
│   ├── src/
│   │   ├── server.ts     # Telemetry & alert gateway server
│   │   ├── models.ts     # MongoDB data models
│   │   └── riskEngine.ts # Bayesian multi-modal fusion engine
│   └── package.json
├── ml/                   # Python AI/ML microservices
│   ├── time_series_predictor.py
│   ├── vision_anomaly_detector.py
│   └── fusion_service.py
├── shared/               # Shared types and constants
└── README.md
```

---

## Getting Started Locally

### 1. Frontend (Dashboard & Mission Control)
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173/` in your browser.

### 2. Backend (API Gateway)
```bash
cd backend
npm install
npx tsx watch src/server.ts
```
API running on `http://localhost:5000/`.

### 3. Python AI Engine
```bash
cd ml
python fusion_service.py
```

---

## Statutory Notice & Research Disclaimer
> **PROTOTYPE DEMONSTRATION ENVIRONMENT:** Telemetry thresholds and algorithms are research-grade demonstrations for SIH26025. Production underground mine deployment requires DGMS-certified flameproof/intrinsically safe instrumentation and site-specific geomechanical calibration per Indian Coal Mines Regulations (CMR 2017).
