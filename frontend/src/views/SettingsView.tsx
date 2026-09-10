import React, { useState } from 'react';
import { PROTOTYPE_THRESHOLDS, SYSTEM_METADATA } from '../constants';
import { Settings, Sliders, ShieldAlert, Save, RotateCcw, Compass, MoveDown, Activity, Bell, Database } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const [tiltWarn, setTiltWarn] = useState(PROTOTYPE_THRESHOLDS.tilt.warning);
  const [tiltHigh, setTiltHigh] = useState(PROTOTYPE_THRESHOLDS.tilt.high);
  const [tiltCrit, setTiltCrit] = useState(PROTOTYPE_THRESHOLDS.tilt.critical);

  const [dispWarn, setDispWarn] = useState(PROTOTYPE_THRESHOLDS.displacement.warning);
  const [dispHigh, setDispHigh] = useState(PROTOTYPE_THRESHOLDS.displacement.high);
  const [dispCrit, setDispCrit] = useState(PROTOTYPE_THRESHOLDS.displacement.critical);

  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleReset = () => {
    setTiltWarn(PROTOTYPE_THRESHOLDS.tilt.warning);
    setTiltHigh(PROTOTYPE_THRESHOLDS.tilt.high);
    setTiltCrit(PROTOTYPE_THRESHOLDS.tilt.critical);
    setDispWarn(PROTOTYPE_THRESHOLDS.displacement.warning);
    setDispHigh(PROTOTYPE_THRESHOLDS.displacement.high);
    setDispCrit(PROTOTYPE_THRESHOLDS.displacement.critical);
  };

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="bg-mine-surface border border-mine-border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
        <div>
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-cyan-400" />
            <h2 className="text-lg font-display font-bold text-white">
              SYSTEM CONFIGURATION & ALERT THRESHOLD CALIBRATION
            </h2>
          </div>
          <p className="text-xs font-mono text-mine-muted mt-0.5">
            Geomechanical trigger parameters, notification rules, and prototype sensory limits (SIH26025).
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <button
            onClick={handleReset}
            className="px-3 py-1.5 rounded bg-mine-elevated text-mine-secondary hover:text-white border border-mine-border transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaved ? 'SAVED TO FLASH' : 'SAVE THRESHOLDS'}</span>
          </button>
        </div>
      </div>

      {/* Mandatory Calibration Notice (Section 45) */}
      <div className="bg-cyan-950/30 border border-cyan-700/50 rounded-xl p-4 flex items-start gap-3 text-xs font-mono text-cyan-200">
        <ShieldAlert className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="text-white">PROTOTYPE CALIBRATION NOTICE:</strong> Prototype thresholds configured for SIH demonstration. Production underground deployment requires site-specific rock mass rating (RMR) calibration and DGMS statutory instrument certification.
        </div>
      </div>

      {/* Threshold Config Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 font-mono text-xs">
        {/* Tilt Thresholds */}
        <div className="bg-mine-surface border border-mine-border rounded-xl p-5 shadow-md space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-mine-border">
            <Compass className="w-4 h-4 text-orange-400" />
            <h3 className="font-display font-bold text-sm text-white">
              MPU6050 TILT / INCLINATION THRESHOLDS
            </h3>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-amber-400">WARNING THRESHOLD (Mild drift)</span>
                <span className="text-white font-bold">{tiltWarn}°</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="3.0"
                step="0.1"
                value={tiltWarn}
                onChange={(e) => setTiltWarn(parseFloat(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-orange-400">HIGH RISK THRESHOLD (Escalating flexure)</span>
                <span className="text-white font-bold">{tiltHigh}°</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="4.0"
                step="0.1"
                value={tiltHigh}
                onChange={(e) => setTiltHigh(parseFloat(e.target.value))}
                className="w-full accent-orange-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-red-400">CRITICAL COLLAPSE THRESHOLD (Evacuate)</span>
                <span className="text-white font-bold">{tiltCrit}°</span>
              </div>
              <input
                type="range"
                min="2.0"
                max="6.0"
                step="0.1"
                value={tiltCrit}
                onChange={(e) => setTiltCrit(parseFloat(e.target.value))}
                className="w-full accent-red-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Displacement Thresholds */}
        <div className="bg-mine-surface border border-mine-border rounded-xl p-5 shadow-md space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-mine-border">
            <MoveDown className="w-4 h-4 text-orange-400" />
            <h3 className="font-display font-bold text-sm text-white">
              ROOF CONVERGENCE DISPLACEMENT THRESHOLDS
            </h3>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-amber-400">WARNING THRESHOLD</span>
                <span className="text-white font-bold">{dispWarn} mm</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="5.0"
                step="0.5"
                value={dispWarn}
                onChange={(e) => setDispWarn(parseFloat(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-orange-400">HIGH RISK THRESHOLD</span>
                <span className="text-white font-bold">{dispHigh} mm</span>
              </div>
              <input
                type="range"
                min="3.0"
                max="8.0"
                step="0.5"
                value={dispHigh}
                onChange={(e) => setDispHigh(parseFloat(e.target.value))}
                className="w-full accent-orange-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-red-400">CRITICAL BREACH THRESHOLD</span>
                <span className="text-white font-bold">{dispCrit} mm</span>
              </div>
              <input
                type="range"
                min="5.0"
                max="15.0"
                step="0.5"
                value={dispCrit}
                onChange={(e) => setDispCrit(parseFloat(e.target.value))}
                className="w-full accent-red-500 cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Network & Local Buffering Setup */}
      <div className="bg-mine-surface border border-mine-border rounded-xl p-5 shadow-md space-y-3 font-mono text-xs">
        <div className="flex items-center gap-2 pb-2 border-b border-mine-border">
          <Database className="w-4 h-4 text-cyan-400" />
          <h3 className="font-display font-bold text-sm text-white">
            LOCAL EDGE BUFFERING & RECOVERY (OFFLINE TOLERANCE)
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-mine-elevated p-3 rounded border border-mine-border">
            <span className="text-[10px] text-mine-muted block uppercase">OFFLINE BUFFER CAPACITY</span>
            <span className="font-bold text-white text-sm mt-0.5 block">72 Hours Local Flash</span>
            <span className="text-[10px] text-emerald-400">Ring Buffer Enabled</span>
          </div>

          <div className="bg-mine-elevated p-3 rounded border border-mine-border">
            <span className="text-[10px] text-mine-muted block uppercase">AUTO-RECOVERY SYNC</span>
            <span className="font-bold text-white text-sm mt-0.5 block">Zero Packet Loss</span>
            <span className="text-[10px] text-cyan-400">Sequential Batch Resend</span>
          </div>

          <div className="bg-mine-elevated p-3 rounded border border-mine-border">
            <span className="text-[10px] text-mine-muted block uppercase">AUDIBLE SIREN INTERFACE</span>
            <span className="font-bold text-white text-sm mt-0.5 block">110 dB Subterranean</span>
            <span className="text-[10px] text-orange-400">Automatic Strobe Armed</span>
          </div>
        </div>
      </div>
    </div>
  );
};
