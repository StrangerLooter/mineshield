import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { Shield, Lock, Mail, CheckCircle2, ArrowRight, UserCheck } from 'lucide-react';
import { SYSTEM_METADATA } from '../constants';

interface LoginViewProps {
  onLoginSuccess: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const { loginDemo } = useAuth();
  const [email, setEmail] = useState('safety.lead@mineshield.gov.in');
  const [password, setPassword] = useState('••••••••••••');
  const [selectedRole, setSelectedRole] = useState<UserRole>('SAFETY_OFFICER');

  const handleDemoLogin = (role: UserRole) => {
    loginDemo(role);
    onLoginSuccess();
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginDemo(selectedRole);
    onLoginSuccess();
  };

  return (
    <div className="min-h-screen bg-mine-bg flex items-center justify-center p-4 antialiased">
      <div className="w-full max-w-md bg-mine-surface border border-mine-border rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-600 to-slate-900 border border-cyan-500/50 flex items-center justify-center mx-auto shadow-lg shadow-cyan-950/50">
            <Shield className="w-6 h-6 text-cyan-200 fill-cyan-400/20" />
          </div>
          <h1 className="text-2xl font-display font-bold text-white tracking-tight">
            MineShield Command Portal
          </h1>
          <p className="text-xs font-mono text-mine-muted">
            UNDERGROUND MINE SAFETY INTELLIGENCE • SIH26025
          </p>
        </div>

        {/* Quick Demo Bypass Banner */}
        <div className="bg-cyan-950/40 border border-cyan-700/50 rounded-xl p-3.5 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-cyan-300 font-bold">HACKATHON DEMO ENVIRONMENT</span>
            <span className="text-[10px] text-emerald-400 font-bold">READY</span>
          </div>
          <p className="text-[11px] text-mine-secondary leading-snug">
            Instant 1-click access for Technical Reviewers & SIH Judges with pre-configured telemetry:
          </p>
          <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-xs">
            <button
              onClick={() => handleDemoLogin('SAFETY_OFFICER')}
              className="bg-cyan-600/80 hover:bg-cyan-600 text-white p-2 rounded transition-colors text-[11px] font-bold"
            >
              Enter as Safety Officer
            </button>
            <button
              onClick={() => handleDemoLogin('MINE_ENGINEER')}
              className="bg-mine-elevated hover:bg-mine-highlight text-mine-text border border-mine-border p-2 rounded transition-colors text-[11px]"
            >
              Enter as Mine Engineer
            </button>
          </div>
        </div>

        {/* Standard Industrial Login Form */}
        <form onSubmit={handleFormSubmit} className="space-y-4 font-mono text-xs">
          <div>
            <label className="block text-mine-muted uppercase text-[10px] mb-1">
              Official DGMS Email:
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-mine-muted absolute left-3 top-2.5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-mine-elevated border border-mine-border rounded-lg pl-9 pr-3 py-2 text-white text-xs focus:outline-none focus:border-cyan-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-mine-muted uppercase text-[10px] mb-1">
              Secure Passkey / Token:
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-mine-muted absolute left-3 top-2.5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-mine-elevated border border-mine-border rounded-lg pl-9 pr-3 py-2 text-white text-xs focus:outline-none focus:border-cyan-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-mine-muted uppercase text-[10px] mb-1">
              Operational Role:
            </label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as UserRole)}
              className="w-full bg-mine-elevated border border-mine-border rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-cyan-500"
            >
              <option value="SAFETY_OFFICER">Mine Safety Officer (Statutory Lead)</option>
              <option value="MINE_ENGINEER">Strata Control Engineer</option>
              <option value="OPERATOR">Surface Control Room Operator</option>
              <option value="ADMIN">Mine Manager (Full Admin)</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-950/40"
          >
            <span>AUTHENTICATE & ENTER</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-2 border-t border-mine-border text-center text-[10px] font-mono text-mine-muted">
          MineShield v2.4 • Team Edge Square • Central Coal Block
        </div>
      </div>
    </div>
  );
};
