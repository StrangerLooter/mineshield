import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTelemetry } from '../../context/TelemetryContext';
import { SYSTEM_METADATA } from '../../constants';
import { UserRole } from '../../types';
import { 
  Shield, 
  Radio, 
  Bell, 
  Settings, 
  User, 
  ChevronDown, 
  Check, 
  Cpu, 
  Activity,
  Menu,
  X
} from 'lucide-react';

interface HeaderProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentRoute,
  onNavigate,
  onToggleSidebar,
  isSidebarOpen
}) => {
  const { userName, userRole, userBadge, setUserRole, logout } = useAuth();
  const { alerts, isSimulating } = useTelemetry();
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const activeAlertsCount = alerts.filter(a => a.status === 'ACTIVE').length;

  const roles: { id: UserRole; title: string; desc: string }[] = [
    { id: 'SAFETY_OFFICER', title: 'Safety Officer', desc: 'DGMS Statutory & Risk Protocols' },
    { id: 'MINE_ENGINEER', title: 'Mine Engineer', desc: 'Strata & Extensometer Telemetry' },
    { id: 'OPERATOR', title: 'Control Room Op', desc: 'Surface Shift Monitoring' },
    { id: 'ADMIN', title: 'Mine Manager (Admin)', desc: 'Full System Calibration' }
  ];

  return (
    <header className="bg-mine-surface border-b border-mine-border h-14 px-3 sm:px-5 flex items-center justify-between sticky top-0 z-30 select-none">
      {/* Left: Mobile Toggle & Brand */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-1.5 rounded-md hover:bg-mine-elevated text-mine-secondary hover:text-white transition-colors"
          aria-label="Toggle navigation menu"
        >
          {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        <div
          onClick={() => onNavigate('/dashboard')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          {/* Custom MineShield Icon: Shield with Subterranean Strata lines */}
          <div className="w-8 h-8 rounded bg-gradient-to-br from-cyan-600 to-slate-900 border border-cyan-500/50 flex items-center justify-center shadow-sm shadow-cyan-950/50 group-hover:border-cyan-400 transition-colors">
            <Shield className="w-4 h-4 text-cyan-200 fill-cyan-400/20" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-display font-bold text-base tracking-tight text-white group-hover:text-cyan-300 transition-colors">
                MineShield
              </span>
              <span className="hidden sm:inline text-[10px] font-mono uppercase bg-cyan-950 text-cyan-400 border border-cyan-800/80 px-1 py-0.2 rounded">
                SIH26025
              </span>
            </div>
            <p className="text-[10px] font-mono text-mine-muted hidden md:block leading-none">
              SUBSIDENCE INTEL PLATFORM
            </p>
          </div>
        </div>
      </div>

      {/* Middle: Current Mine / Site Selector */}
      <div className="hidden md:flex items-center gap-2.5 bg-mine-elevated/80 border border-mine-border px-3 py-1.5 rounded-full text-xs">
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="font-mono font-medium text-mine-text tracking-wide">
          CENTRAL COAL BLOCK
        </span>
        <span className="text-mine-muted">|</span>
        <span className="font-mono text-cyan-400 text-[11px]">
          SEAM 04 • CONNECTED
        </span>
      </div>

      {/* Right: Telemetry Health, Notifications, User Role */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Live status badge */}
        <div className="hidden sm:flex items-center gap-1.5 text-xs font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2 py-1 rounded">
          <Radio className="w-3 h-3 animate-pulse text-emerald-400" />
          <span>LIVE</span>
        </div>

        {/* Notifications Icon */}
        <button
          onClick={() => onNavigate('/alerts')}
          className="relative p-2 rounded-md hover:bg-mine-elevated text-mine-secondary hover:text-white transition-colors"
          title="Active Incident Alerts"
        >
          <Bell className="w-4 h-4" />
          {activeAlertsCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-red-600 text-white font-mono text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
              {activeAlertsCount}
            </span>
          )}
        </button>

        {/* Settings button */}
        <button
          onClick={() => onNavigate('/settings')}
          className="p-2 rounded-md hover:bg-mine-elevated text-mine-secondary hover:text-white transition-colors"
          title="Threshold & Calibration Settings"
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* User Role Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="flex items-center gap-2 p-1.5 sm:px-2 sm:py-1 rounded-md hover:bg-mine-elevated border border-mine-border/80 transition-colors"
          >
            <div className="w-6 h-6 rounded bg-mine-highlight border border-mine-border flex items-center justify-center text-xs font-mono text-cyan-300">
              <User className="w-3.5 h-3.5" />
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-xs font-medium text-white leading-tight truncate max-w-[130px]">
                {userName.split(' ')[0]} {userName.split(' ').slice(-1)[0]}
              </p>
              <p className="text-[10px] font-mono text-mine-secondary uppercase leading-none">
                {userRole.replace('_', ' ')}
              </p>
            </div>
            <ChevronDown className="w-3 h-3 text-mine-muted" />
          </button>

          {/* Role selection dropdown */}
          {showRoleMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-mine-surface border border-mine-border rounded-lg shadow-2xl z-50 py-2">
              <div className="px-3 py-1.5 border-b border-mine-border mb-1">
                <p className="text-[11px] font-mono text-mine-muted uppercase">Signed in as:</p>
                <p className="text-xs font-semibold text-white truncate">{userName}</p>
                <p className="text-[10px] font-mono text-cyan-400">{userBadge}</p>
              </div>

              <p className="px-3 py-1 text-[10px] font-mono text-mine-muted uppercase tracking-wider">
                Switch Operational Role:
              </p>

              {roles.map(r => (
                <button
                  key={r.id}
                  onClick={() => {
                    setUserRole(r.id);
                    setShowRoleMenu(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 flex items-center justify-between text-xs hover:bg-mine-elevated transition-colors ${
                    userRole === r.id ? 'text-cyan-300 font-medium bg-cyan-950/40' : 'text-mine-secondary'
                  }`}
                >
                  <div>
                    <div className="font-sans text-xs">{r.title}</div>
                    <div className="text-[10px] font-mono text-mine-muted">{r.desc}</div>
                  </div>
                  {userRole === r.id && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                </button>
              ))}

              <div className="mt-1 pt-1 border-t border-mine-border px-2">
                <button
                  onClick={() => {
                    setShowRoleMenu(false);
                    onNavigate('/login');
                  }}
                  className="w-full text-left px-2 py-1.5 text-xs text-red-400 hover:bg-red-950/20 rounded transition-colors font-mono"
                >
                  Sign Out / Switch Site
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
