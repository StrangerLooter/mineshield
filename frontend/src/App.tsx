import React, { useState, useEffect } from 'react';
import { TelemetryProvider } from './context/TelemetryContext';
import { AuthProvider } from './context/AuthContext';
import { AppShell } from './components/layout/AppShell';

// Views
import { DashboardView } from './views/DashboardView';
import { MineMapView } from './views/MineMapView';
import { SensorsView } from './views/SensorsView';
import { SensorDetailView } from './views/SensorDetailView';
import { AlertsView } from './views/AlertsView';
import { IncidentDetailView } from './views/IncidentDetailView';
import { CameraView } from './views/CameraView';
import { PredictionsView } from './views/PredictionsView';
import { AnalyticsView } from './views/AnalyticsView';
import { ArchitectureView } from './views/ArchitectureView';
import { HardwareView } from './views/HardwareView';
import { PipelineView } from './views/PipelineView';
import { ARView } from './views/ARView';
import { CommandCenterView } from './views/CommandCenterView';
import { LandingView } from './views/LandingView';
import { LoginView } from './views/LoginView';
import { SettingsView } from './views/SettingsView';

export function App() {
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    const path = window.location.pathname;
    const hash = window.location.hash.replace('#', '');
    return hash || path || '/dashboard';
  });

  // Handle browser popstate
  useEffect(() => {
    const handlePopState = () => {
      const hash = window.location.hash.replace('#', '');
      setCurrentRoute(hash || window.location.pathname || '/dashboard');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (route: string) => {
    setCurrentRoute(route);
    window.location.hash = route;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Route matching helper
  const renderCurrentView = () => {
    if (currentRoute === '/') {
      return (
        <LandingView
          onEnterDashboard={() => navigate('/dashboard')}
          onExploreArchitecture={() => navigate('/architecture')}
        />
      );
    }

    if (currentRoute === '/login') {
      return <LoginView onLoginSuccess={() => navigate('/dashboard')} />;
    }

    if (currentRoute === '/dashboard') {
      return <DashboardView onNavigate={navigate} />;
    }

    if (currentRoute === '/map') {
      return <MineMapView onNavigate={navigate} />;
    }

    if (currentRoute === '/sensors') {
      return <SensorsView onNavigateToSensor={(id) => navigate(`/sensors/${id}`)} />;
    }

    if (currentRoute.startsWith('/sensors/')) {
      const sensorId = currentRoute.split('/')[2] || 'S03';
      return (
        <SensorDetailView
          sensorId={sensorId}
          onBack={() => navigate('/sensors')}
          onNavigateToCamera={() => navigate('/camera')}
        />
      );
    }

    if (currentRoute === '/alerts') {
      return (
        <AlertsView
          onNavigateToIncident={(id) => navigate(`/alerts/${id}`)}
          onNavigateToZone={() => navigate('/map')}
        />
      );
    }

    if (currentRoute.startsWith('/alerts/')) {
      const incidentId = currentRoute.split('/')[2] || 'INC-2026-0042';
      return (
        <IncidentDetailView
          incidentId={incidentId}
          onBack={() => navigate('/alerts')}
          onNavigateToCamera={() => navigate('/camera')}
        />
      );
    }

    if (currentRoute === '/camera') {
      return <CameraView />;
    }

    if (currentRoute === '/predictions') {
      return <PredictionsView />;
    }

    if (currentRoute === '/analytics') {
      return <AnalyticsView />;
    }

    if (currentRoute === '/architecture') {
      return <ArchitectureView />;
    }

    if (currentRoute === '/hardware') {
      return <HardwareView />;
    }

    if (currentRoute === '/pipeline') {
      return <PipelineView />;
    }

    if (currentRoute === '/ar') {
      return <ARView />;
    }

    if (currentRoute === '/command-center') {
      return <CommandCenterView onNavigate={navigate} />;
    }

    if (currentRoute === '/settings') {
      return <SettingsView />;
    }

    // Default fallback to dashboard
    return <DashboardView onNavigate={navigate} />;
  };

  return (
    <AuthProvider>
      <TelemetryProvider>
        <AppShell currentRoute={currentRoute} onNavigate={navigate}>
          {renderCurrentView()}
        </AppShell>
      </TelemetryProvider>
    </AuthProvider>
  );
}

export default App;
