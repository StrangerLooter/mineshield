import React from 'react';
import { useTelemetry } from '../../context/TelemetryContext';
import { LayoutDashboard, Map, TriangleAlert, Radio, Menu } from 'lucide-react';

interface MobileNavProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  onOpenDrawer: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  currentRoute,
  onNavigate,
  onOpenDrawer
}) => {
  const { alerts } = useTelemetry();
  const activeAlertsCount = alerts.filter(a => a.status === 'ACTIVE').length;

  const tabs = [
    { route: '/dashboard', label: 'Home', icon: LayoutDashboard },
    { route: '/map', label: 'Map', icon: Map },
    { 
      route: '/alerts', 
      label: 'Alerts', 
      icon: TriangleAlert, 
      count: activeAlertsCount > 0 ? activeAlertsCount : undefined 
    },
    { route: '/sensors', label: 'Sensors', icon: Radio },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-mine-surface/95 backdrop-blur border-t border-mine-border h-14 px-2 flex items-center justify-around z-40 select-none">
      {tabs.map(tab => {
        const Icon = tab.icon;
        const isActive = currentRoute === tab.route;

        return (
          <button
            key={tab.route}
            onClick={() => onNavigate(tab.route)}
            className={`flex flex-col items-center justify-center flex-1 py-1 relative transition-colors ${
              isActive ? 'text-cyan-400' : 'text-mine-secondary hover:text-white'
            }`}
          >
            <div className="relative">
              <Icon className="w-5 h-5" />
              {tab.count !== undefined && (
                <span className="absolute -top-1 -right-2 bg-red-600 text-white font-mono text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center animate-pulse">
                  {tab.count}
                </span>
              )}
            </div>
            <span className="text-[10px] font-mono tracking-wider mt-0.5">{tab.label}</span>
          </button>
        );
      })}

      <button
        onClick={onOpenDrawer}
        className="flex flex-col items-center justify-center flex-1 py-1 text-mine-secondary hover:text-white transition-colors"
      >
        <Menu className="w-5 h-5" />
        <span className="text-[10px] font-mono tracking-wider mt-0.5">More</span>
      </button>
    </nav>
  );
};
