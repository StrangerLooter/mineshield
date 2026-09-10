import React from 'react';
import { useTelemetry } from '../../context/TelemetryContext';
import {
  LayoutDashboard,
  Map,
  Radio,
  TriangleAlert,
  Camera,
  Brain,
  LineChart,
  Layers,
  Cpu,
  Workflow,
  Glasses,
  MonitorPlay,
  Settings,
  ChevronLeft,
  ChevronRight,
  Globe,
  ExternalLink
} from 'lucide-react';

interface SidebarProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentRoute,
  onNavigate,
  isCollapsed,
  onToggleCollapse
}) => {
  const { alerts } = useTelemetry();
  const activeAlertsCount = alerts.filter(a => a.status === 'ACTIVE').length;

  const navItems = [
    { section: 'OPERATIONS' },
    { route: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { route: '/command-center', label: 'Command Center', icon: MonitorPlay, badge: 'TACTICAL' },
    { route: '/map', label: 'Digital Mine Map', icon: Map },
    { 
      route: '/alerts', 
      label: 'Alerts & Incidents', 
      icon: TriangleAlert, 
      count: activeAlertsCount > 0 ? activeAlertsCount : undefined,
      isAlert: activeAlertsCount > 0
    },
    { route: '/sensors', label: 'Sensor Telemetry', icon: Radio },
    
    { section: 'INTELLIGENCE' },
    { route: '/camera', label: 'Camera & AI CV', icon: Camera },
    { route: '/predictions', label: 'AI Trend Predict', icon: Brain },
    { route: '/analytics', label: 'Strata Analytics', icon: LineChart },
    { route: '/ar', label: 'AR Spatial View', icon: Glasses },

    { section: 'ENGINEERING & SIH' },
    { route: '/architecture', label: 'Architecture', icon: Layers },
    { route: '/hardware', label: 'Hardware Specs', icon: Cpu },
    { route: '/pipeline', label: 'Data Pipeline', icon: Workflow },
    { route: '/', label: 'Product Landing', icon: Globe },
    { route: '/settings', label: 'Thresholds & Config', icon: Settings },
  ];

  return (
    <aside
      className={`bg-mine-surface border-r border-mine-border flex flex-col justify-between transition-all duration-300 select-none z-20 ${
        isCollapsed ? 'w-16' : 'w-60'
      }`}
    >
      <div className="flex-1 overflow-y-auto py-3">
        <nav className="space-y-0.5 px-2">
          {navItems.map((item, idx) => {
            if (item.section) {
              if (isCollapsed) return <div key={idx} className="h-2 border-b border-mine-border/60 my-2" />;
              return (
                <div
                  key={idx}
                  className="px-3 pt-3.5 pb-1 text-[10px] font-mono text-mine-muted uppercase tracking-wider font-semibold"
                >
                  {item.section}
                </div>
              );
            }

            const Icon = item.icon!;
            const isActive = currentRoute === item.route;

            return (
              <button
                key={item.route}
                onClick={() => onNavigate(item.route!)}
                title={isCollapsed ? item.label : undefined}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium transition-all group ${
                  isActive
                    ? 'bg-cyan-950/60 text-cyan-300 border border-cyan-800/60 font-semibold shadow-sm shadow-cyan-950/40'
                    : 'text-mine-secondary hover:text-mine-text hover:bg-mine-elevated border border-transparent'
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive ? 'text-cyan-400' : 'text-mine-secondary group-hover:text-white'
                  }`}
                />

                {!isCollapsed && (
                  <span className="truncate flex-1 text-left">{item.label}</span>
                )}

                {!isCollapsed && item.count !== undefined && (
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full font-bold ${
                      item.isAlert
                        ? 'bg-red-900/60 text-red-300 border border-red-700/60 animate-pulse'
                        : 'bg-mine-elevated text-mine-secondary'
                    }`}
                  >
                    {item.count}
                  </span>
                )}

                {!isCollapsed && item.badge && (
                  <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-orange-950/80 text-orange-400 border border-orange-800/80 font-semibold">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Collapse toggle at bottom */}
      <div className="p-2 border-t border-mine-border hidden lg:block">
        <button
          onClick={onToggleCollapse}
          className="w-full flex items-center justify-center p-2 rounded-md text-mine-secondary hover:text-white hover:bg-mine-elevated transition-colors text-xs font-mono"
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <div className="flex items-center gap-2">
              <ChevronLeft className="w-4 h-4" />
              <span>COLLAPSE RAIL</span>
            </div>
          )}
        </button>
      </div>
    </aside>
  );
};
