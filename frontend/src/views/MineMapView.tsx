import React, { useState } from 'react';
import { useTelemetry } from '../context/TelemetryContext';
import { MineMap } from '../components/map/MineMap';
import { ZoneDetailDrawer } from '../components/map/ZoneDetailDrawer';
import { StatusBadge } from '../components/common/StatusBadge';
import { MapPin, Filter, Layers, Radio, Compass, ShieldAlert, ArrowRight } from 'lucide-react';

interface MineMapViewProps {
  onNavigate: (route: string) => void;
}

export const MineMapView: React.FC<MineMapViewProps> = ({ onNavigate }) => {
  const { zones, sensors, selectedZone, setSelectedZone, setSelectedSensor } = useTelemetry();
  const [filter, setFilter] = useState<string>('ALL');

  const filteredZones = filter === 'ALL' ? zones : zones.filter(z => z.status === filter);

  return (
    <div className="space-y-4">
      {/* Top filter banner */}
      <div className="bg-mine-surface border border-mine-border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
        <div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-cyan-400" />
            <h2 className="text-lg font-display font-bold text-white">
              DIGITAL MINE GEOLOGICAL STRATA MAP
            </h2>
          </div>
          <p className="text-xs font-mono text-mine-muted mt-0.5">
            Real-time geospatial visualization of underground longwall panels, shafts, and telemetry nodes.
          </p>
        </div>

        {/* Risk Filters */}
        <div className="flex items-center gap-1.5 font-mono text-xs">
          <span className="text-mine-muted text-[10px] mr-1 hidden md:inline">FILTER RISK:</span>
          {['ALL', 'CRITICAL', 'HIGH', 'WARNING', 'SAFE'].map(r => (
            <button
              key={r}
              onClick={() => setFilter(r)}
              className={`px-2.5 py-1 rounded transition-colors ${
                filter === r
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-800/80 font-bold'
                  : 'bg-mine-elevated text-mine-secondary hover:text-white border border-mine-border'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Layout: Map + Side Inspector Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <MineMap
            onSelectZone={(z) => setSelectedZone(z)}
            onSelectSensor={(s) => setSelectedSensor(s)}
          />
        </div>

        <div>
          {selectedZone ? (
            <ZoneDetailDrawer
              onClose={() => setSelectedZone(null)}
              onNavigateToSensor={(id) => onNavigate(`/sensors/${id}`)}
              onNavigateToAlert={(id) => onNavigate(`/alerts/${id}`)}
            />
          ) : (
            <div className="bg-mine-surface border border-mine-border rounded-xl p-8 text-center text-mine-muted space-y-3">
              <MapPin className="w-8 h-8 text-cyan-400 mx-auto opacity-60" />
              <h4 className="text-sm font-display font-semibold text-white">
                NO ZONE CURRENTLY SELECTED
              </h4>
              <p className="text-xs text-mine-secondary leading-relaxed">
                Click any subterranean longwall panel, haulage drift, or sensor node on the schematic to inspect live deformation vectors.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Zone Grid Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {zones.map(zone => (
          <div
            key={zone.id}
            onClick={() => setSelectedZone(zone)}
            className={`p-3.5 rounded-xl border transition-all cursor-pointer shadow-sm ${
              selectedZone?.id === zone.id
                ? 'bg-mine-elevated border-cyan-500 shadow-cyan-950/40'
                : 'bg-mine-surface border-mine-border hover:border-mine-borderLight'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-xs font-bold text-white">{zone.code}</span>
              <StatusBadge status={zone.status} size="sm" />
            </div>
            <p className="text-xs font-semibold text-mine-text truncate">{zone.name}</p>
            <p className="text-[10px] font-mono text-mine-muted mt-0.5">{zone.panel}</p>

            <div className="mt-2.5 pt-2 border-t border-mine-border/60 flex items-center justify-between text-[11px] font-mono">
              <span className="text-mine-secondary">Convergence:</span>
              <span className="text-white font-bold">{zone.primaryDrivers.displacement}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
