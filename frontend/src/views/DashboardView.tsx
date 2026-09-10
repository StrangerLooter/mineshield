import React from 'react';
import { KPIBar } from '../components/dashboard/KPIBar';
import { HeroRiskPanel } from '../components/dashboard/HeroRiskPanel';
import { TelemetryCards } from '../components/dashboard/TelemetryCards';
import { InteractiveCharts } from '../components/dashboard/InteractiveCharts';
import { ExplainableRisk } from '../components/dashboard/ExplainableRisk';
import { FusionPanel } from '../components/dashboard/FusionPanel';
import { AlertTimeline } from '../components/dashboard/AlertTimeline';
import { MineMap } from '../components/map/MineMap';
import { SimulationControls } from '../components/common/SimulationControls';

interface DashboardViewProps {
  onNavigate: (route: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-5">
      {/* 1. Simulation Demonstration Controls & Scenario Switcher */}
      <SimulationControls />

      {/* 2. Operational KPI Status Bar */}
      <KPIBar />

      {/* 3. Hero Risk Panel */}
      <HeroRiskPanel
        onInspectZone={(zoneId) => onNavigate('/map')}
        onOpenFusion={() => onNavigate('/camera')}
      />

      {/* 4. Telemetry Kinematic Cards (Primary vs Secondary) */}
      <TelemetryCards onSelectSensor={(id) => onNavigate(`/sensors/${id}`)} />

      {/* 5. Main Double Column: Interactive Deformation Chart & Mine Map Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <InteractiveCharts />
        <MineMap
          onSelectZone={() => onNavigate('/map')}
          onSelectSensor={(sensor) => onNavigate(`/sensors/${sensor.id}`)}
        />
      </div>

      {/* 6. Explainable AI & Multi-Modal Fusion Engine */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <ExplainableRisk />
        <FusionPanel />
      </div>

      {/* 7. Subterranean Incident Event Timeline */}
      <AlertTimeline onOpenIncident={(id) => onNavigate(`/alerts/${id}`)} />
    </div>
  );
};
