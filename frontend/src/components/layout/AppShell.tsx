import React, { useState, ReactNode } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';
import { EmergencyBanner } from './EmergencyBanner';
import { DisclaimerBanner } from '../common/DisclaimerBanner';
import { X, Layers, Cpu, Workflow, Glasses, Settings, Globe, HelpCircle } from 'lucide-react';

interface AppShellProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  children: ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({
  currentRoute,
  onNavigate,
  children
}) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // Check if current route is landing page or login page which don't use internal dashboard shell
  const isPublicPage = currentRoute === '/' || currentRoute === '/login';

  if (isPublicPage) {
    return (
      <div className="min-h-screen bg-mine-bg text-mine-text flex flex-col">
        <DisclaimerBanner />
        <main className="flex-1">{children}</main>
      </div>
    );
  }

  const secondaryNavItems = [
    { route: '/architecture', label: 'Architecture & SIH Diagram', icon: Layers },
    { route: '/hardware', label: 'Hardware Spec Sheet', icon: Cpu },
    { route: '/pipeline', label: 'Data Processing Pipeline', icon: Workflow },
    { route: '/ar', label: 'AR Spatial Inspection', icon: Glasses },
    { route: '/command-center', label: 'Tactical Command Center', icon: HelpCircle },
    { route: '/', label: 'MineShield Product Landing', icon: Globe },
    { route: '/settings', label: 'Threshold & System Config', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-mine-bg text-mine-text flex flex-col antialiased">
      {/* Disclaimer Banner */}
      <DisclaimerBanner />

      {/* Global Emergency Banner */}
      <EmergencyBanner onNavigateToAlerts={(alertId) => onNavigate('/alerts')} />

      {/* Global Header */}
      <Header
        currentRoute={currentRoute}
        onNavigate={onNavigate}
        isSidebarOpen={isMobileDrawerOpen}
        onToggleSidebar={() => setIsMobileDrawerOpen(!isMobileDrawerOpen)}
      />

      {/* Main Workspace Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Collapsible Sidebar */}
        <div className="hidden lg:block shrink-0">
          <Sidebar
            currentRoute={currentRoute}
            onNavigate={onNavigate}
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          />
        </div>

        {/* Mobile Slide-out Drawer for secondary pages */}
        {isMobileDrawerOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <div
              className="fixed inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setIsMobileDrawerOpen(false)}
            />
            <div className="relative w-72 max-w-[80vw] bg-mine-surface border-r border-mine-border h-full flex flex-col py-4 px-3 z-50">
              <div className="flex items-center justify-between pb-3 border-b border-mine-border mb-3">
                <span className="font-mono text-xs font-semibold text-mine-secondary uppercase tracking-wider">
                  SYSTEM DIRECTORY
                </span>
                <button
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className="p-1 rounded text-mine-muted hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-1">
                <p className="px-2 pt-2 text-[10px] font-mono text-mine-muted uppercase">
                  Primary Views
                </p>
                <button
                  onClick={() => { onNavigate('/dashboard'); setIsMobileDrawerOpen(false); }}
                  className="w-full text-left px-3 py-2 text-xs font-medium text-mine-text hover:bg-mine-elevated rounded"
                >
                  Dashboard
                </button>
                <button
                  onClick={() => { onNavigate('/map'); setIsMobileDrawerOpen(false); }}
                  className="w-full text-left px-3 py-2 text-xs font-medium text-mine-text hover:bg-mine-elevated rounded"
                >
                  Digital Mine Map
                </button>
                <button
                  onClick={() => { onNavigate('/alerts'); setIsMobileDrawerOpen(false); }}
                  className="w-full text-left px-3 py-2 text-xs font-medium text-mine-text hover:bg-mine-elevated rounded"
                >
                  Active Alerts & Incidents
                </button>
                <button
                  onClick={() => { onNavigate('/sensors'); setIsMobileDrawerOpen(false); }}
                  className="w-full text-left px-3 py-2 text-xs font-medium text-mine-text hover:bg-mine-elevated rounded"
                >
                  Sensor Telemetry
                </button>
                <button
                  onClick={() => { onNavigate('/camera'); setIsMobileDrawerOpen(false); }}
                  className="w-full text-left px-3 py-2 text-xs font-medium text-mine-text hover:bg-mine-elevated rounded"
                >
                  ESP32-CAM & Computer Vision
                </button>
                <button
                  onClick={() => { onNavigate('/predictions'); setIsMobileDrawerOpen(false); }}
                  className="w-full text-left px-3 py-2 text-xs font-medium text-mine-text hover:bg-mine-elevated rounded"
                >
                  Time-Series AI Forecasting
                </button>
                <button
                  onClick={() => { onNavigate('/analytics'); setIsMobileDrawerOpen(false); }}
                  className="w-full text-left px-3 py-2 text-xs font-medium text-mine-text hover:bg-mine-elevated rounded"
                >
                  Geological Analytics
                </button>

                <p className="px-2 pt-4 text-[10px] font-mono text-mine-muted uppercase">
                  Engineering & Innovation
                </p>
                {secondaryNavItems.map(item => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.route}
                      onClick={() => {
                        onNavigate(item.route);
                        setIsMobileDrawerOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-mine-secondary hover:text-white hover:bg-mine-elevated rounded transition-colors"
                    >
                      <Icon className="w-4 h-4 text-cyan-400" />
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="pt-3 border-t border-mine-border text-center">
                <span className="text-[10px] font-mono text-mine-muted">
                  Edge Square • SIH26025
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto pb-16 lg:pb-6 p-3 sm:p-5 lg:p-6 bg-mine-bg bg-mine-dots">
          <div className="max-w-[1600px] mx-auto space-y-5">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav
        currentRoute={currentRoute}
        onNavigate={onNavigate}
        onOpenDrawer={() => setIsMobileDrawerOpen(true)}
      />
    </div>
  );
};
