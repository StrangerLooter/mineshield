import React, { useState, useRef } from 'react';
import { useTelemetry } from '../../context/TelemetryContext';
import { ZoneData, SensorNode } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Layers, 
  Flame, 
  Radio, 
  MapPin, 
  Eye, 
  Filter,
  Maximize2
} from 'lucide-react';

interface MineMapProps {
  onSelectZone?: (zone: ZoneData) => void;
  onSelectSensor?: (sensor: SensorNode) => void;
  interactive?: boolean;
}

export const MineMap: React.FC<MineMapProps> = ({
  onSelectZone,
  onSelectSensor,
  interactive = true
}) => {
  const { zones, sensors, selectedZone, selectedSensor, setSelectedZone, setSelectedSensor } = useTelemetry();
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [showHeatmap, setShowHeatmap] = useState<boolean>(true);
  const [showSensorLabels, setShowSensorLabels] = useState<boolean>(true);
  const [filterRisk, setFilterRisk] = useState<string>('ALL');

  const handleZoneClick = (zone: ZoneData) => {
    setSelectedZone(zone);
    onSelectZone?.(zone);
  };

  const handleSensorClick = (sensor: SensorNode, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedSensor(sensor);
    const parentZone = zones.find(z => z.id === sensor.zoneId);
    if (parentZone) setSelectedZone(parentZone);
    onSelectSensor?.(sensor);
  };

  const resetMap = () => {
    setZoomLevel(1);
  };

  // Color mapping helper
  const getZoneStroke = (status: string) => {
    if (status === 'CRITICAL') return '#EF4444';
    if (status === 'HIGH') return '#F97316';
    if (status === 'WARNING') return '#F59E0B';
    return '#10B981';
  };

  const getZoneFill = (status: string) => {
    if (status === 'CRITICAL') return 'rgba(239, 68, 68, 0.22)';
    if (status === 'HIGH') return 'rgba(249, 115, 22, 0.16)';
    if (status === 'WARNING') return 'rgba(245, 158, 11, 0.12)';
    return 'rgba(16, 185, 129, 0.08)';
  };

  return (
    <div className="bg-mine-surface border border-mine-border rounded-xl p-4 shadow-lg flex flex-col relative overflow-hidden">
      {/* Map Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-3 border-b border-mine-border">
        <div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-cyan-400" />
            <h3 className="font-display font-semibold text-sm text-white tracking-wide">
              DIGITAL MINE SUBTERRANEAN STRATA SCHEMATIC
            </h3>
          </div>
          <p className="text-[10px] font-mono text-mine-muted mt-0.5">
            SEAM 04 • DEPTH: 280M – 350M BELOW SURFACE • MESH TELEMETRY OVERLAY
          </p>
        </div>

        {/* Map Toolbar */}
        <div className="flex items-center flex-wrap gap-2 text-xs font-mono">
          {/* Heatmap toggle */}
          <button
            onClick={() => setShowHeatmap(!showHeatmap)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded border transition-colors ${
              showHeatmap
                ? 'bg-cyan-950 text-cyan-300 border-cyan-700/70 font-semibold'
                : 'bg-mine-elevated text-mine-secondary border-mine-border hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Hazard Heatmap</span>
          </button>

          {/* Sensor labels toggle */}
          <button
            onClick={() => setShowSensorLabels(!showSensorLabels)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded border transition-colors ${
              showSensorLabels
                ? 'bg-cyan-950 text-cyan-300 border-cyan-700/70 font-semibold'
                : 'bg-mine-elevated text-mine-secondary border-mine-border hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Node IDs</span>
          </button>

          {/* Zoom controls */}
          <div className="flex items-center bg-mine-elevated rounded border border-mine-border">
            <button
              onClick={() => setZoomLevel(prev => Math.min(1.6, prev + 0.15))}
              className="p-1.5 text-mine-secondary hover:text-white transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel(prev => Math.max(0.7, prev - 0.15))}
              className="p-1.5 text-mine-secondary hover:text-white transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={resetMap}
              className="p-1.5 text-mine-secondary hover:text-white transition-colors border-l border-mine-border"
              title="Reset View"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Mine SVG Canvas */}
      <div className="relative w-full h-[380px] sm:h-[450px] bg-[#070B0D] rounded-lg border border-mine-border/80 overflow-hidden flex items-center justify-center select-none">
        {/* Subtle geological grid */}
        <div className="absolute inset-0 bg-mine-grid opacity-30" />

        <svg
          viewBox="0 0 700 440"
          className="w-full h-full cursor-crosshair transition-transform duration-200"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          {/* Underground Geological Strata & Seam boundaries */}
          <defs>
            {/* Heatmap gradients */}
            <radialGradient id="grad-critical" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#EF4444" stopOpacity="0.55" />
              <stop offset="50%" stopColor="#EF4444" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#EF4444" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="grad-high" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#F97316" stopOpacity="0.45" />
              <stop offset="60%" stopColor="#F97316" stopOpacity="0.20" />
              <stop offset="100%" stopColor="#F97316" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="grad-warning" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.35" />
              <stop offset="70%" stopColor="#F59E0B" stopOpacity="0.10" />
              <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
            </radialGradient>
            {/* Pattern for coal pillars */}
            <pattern id="coal-pattern" width="12" height="12" patternUnits="userSpaceOnUse">
              <rect width="12" height="12" fill="#0B0F12" />
              <path d="M0 12 L12 0 M6 12 L12 6 M0 6 L6 0" stroke="#161D21" strokeWidth="1" />
            </pattern>
          </defs>

          {/* Geological Fault Lines (Subterranean fractures) */}
          <path
            d="M 280 20 Q 320 180 340 420"
            stroke="#37454E"
            strokeWidth="1.5"
            strokeDasharray="6 4"
            fill="none"
          />
          <text x="345" y="410" fill="#69767B" fontSize="9" fontFamily="monospace">
            REGIONAL FAULT F-02
          </text>

          {/* Main Haulage & Intake Tunnels (Dark slate galleries) */}
          <g stroke="#273036" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" fill="none">
            {/* Main Shaft to Haulage */}
            <path d="M 60 140 L 640 140" />
            {/* Cross-cut 1 */}
            <path d="M 180 140 L 180 330" />
            {/* Cross-cut 2 */}
            <path d="M 440 140 L 440 330" />
            {/* Lower Return Airway */}
            <path d="M 100 330 L 600 330" />
          </g>

          {/* Inner gallery tunnel hollows (high contrast track line) */}
          <g stroke="#0E1418" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" fill="none">
            <path d="M 60 140 L 640 140" />
            <path d="M 180 140 L 180 330" />
            <path d="M 440 140 L 440 330" />
            <path d="M 100 330 L 600 330" />
          </g>

          {/* Rail Track Centerline */}
          <g stroke="#273036" strokeWidth="1.5" strokeDasharray="3 3" fill="none">
            <path d="M 60 140 L 640 140" />
            <path d="M 100 330 L 600 330" />
          </g>

          {/* Heatmap Layer Overlays */}
          {showHeatmap && (
            <g className="transition-opacity duration-500">
              {/* Zone B Subsidence Heatmap */}
              <circle
                cx="440"
                cy="140"
                r="130"
                fill={zones.find(z => z.id === 'ZONE_B')?.status === 'CRITICAL' ? 'url(#grad-critical)' : 'url(#grad-high)'}
              />
              {/* Zone C Mild Heatmap */}
              <circle cx="230" cy="330" r="90" fill="url(#grad-warning)" />
            </g>
          )}

          {/* Mine Zones (Interactive Rectangles) */}
          {zones.map(zone => {
            const isSelected = selectedZone?.id === zone.id;
            const strokeColor = getZoneStroke(zone.status);
            const fillColor = getZoneFill(zone.status);

            return (
              <g
                key={zone.id}
                onClick={() => handleZoneClick(zone)}
                className="cursor-pointer group"
              >
                <rect
                  x={zone.coordinates.x}
                  y={zone.coordinates.y}
                  width={zone.coordinates.width}
                  height={zone.coordinates.height}
                  rx="8"
                  fill={fillColor}
                  stroke={strokeColor}
                  strokeWidth={isSelected ? 2.5 : 1.2}
                  strokeDasharray={isSelected ? undefined : '5 3'}
                  className="transition-all duration-300 group-hover:stroke-cyan-400"
                />

                {/* Zone Label Badge */}
                <rect
                  x={zone.coordinates.x + 8}
                  y={zone.coordinates.y + 8}
                  width="78"
                  height="22"
                  rx="4"
                  fill="#11171B"
                  stroke={strokeColor}
                  strokeWidth="1"
                />
                <text
                  x={zone.coordinates.x + 14}
                  y={zone.coordinates.y + 23}
                  fill="#F1F5F5"
                  fontSize="10"
                  fontWeight="bold"
                  fontFamily="monospace"
                >
                  {zone.code} • {zone.status}
                </text>

                {/* Subtitle */}
                <text
                  x={zone.coordinates.x + 10}
                  y={zone.coordinates.y + 44}
                  fill="#9BA8AD"
                  fontSize="10"
                  fontFamily="sans-serif"
                >
                  {zone.name}
                </text>
              </g>
            );
          })}

          {/* Sensor Nodes (Beacons) */}
          {sensors.map(sensor => {
            const isSelected = selectedSensor?.id === sensor.id;
            const isFault = sensor.status === 'FAULT' || sensor.status === 'DEGRADED';
            const isZoneHigh = sensor.zoneId === 'ZONE_B';

            let beaconColor = '#10B981';
            if (isFault) beaconColor = '#F59E0B';
            else if (isZoneHigh) beaconColor = '#F97316';

            return (
              <g
                key={sensor.id}
                transform={`translate(${sensor.location.x}, ${sensor.location.y})`}
                onClick={(e) => handleSensorClick(sensor, e)}
                className="cursor-pointer group"
              >
                {/* Outer halo / pulse */}
                {(isZoneHigh || isFault) && (
                  <circle
                    r="14"
                    fill="none"
                    stroke={beaconColor}
                    strokeWidth="1"
                    className="animate-ping opacity-60"
                  />
                )}

                {/* Selection ring */}
                {isSelected && (
                  <circle
                    r="12"
                    fill="none"
                    stroke="#38BDF8"
                    strokeWidth="2.5"
                  />
                )}

                {/* Node center dot */}
                <circle
                  r="6"
                  fill={beaconColor}
                  stroke="#0B0F12"
                  strokeWidth="2"
                  className="transition-transform group-hover:scale-125"
                />

                {/* Label text */}
                {showSensorLabels && (
                  <g>
                    <rect
                      x="10"
                      y="-12"
                      width="52"
                      height="18"
                      rx="3"
                      fill="#11171B"
                      stroke="#273036"
                      strokeWidth="1"
                    />
                    <text
                      x="14"
                      y="1"
                      fill="#F1F5F5"
                      fontSize="9"
                      fontWeight="bold"
                      fontFamily="monospace"
                    >
                      {sensor.id} {sensor.type === 'TILT' ? '∠' : sensor.type === 'DISPLACEMENT' ? '↕' : '∿'}
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* Compass Rose / Subterranean Grid Bearing */}
          <g transform="translate(640, 50)" opacity="0.6">
            <circle r="18" fill="#11171B" stroke="#273036" strokeWidth="1" />
            <path d="M 0 -14 L 4 -2 L 0 14 L -4 -2 Z" fill="#EF4444" />
            <text x="-4" y="-18" fill="#EF4444" fontSize="9" fontWeight="bold" fontFamily="monospace">
              N
            </text>
          </g>

          {/* Scale Indicator */}
          <g transform="translate(40, 410)">
            <line x1="0" y1="0" x2="80" y2="0" stroke="#9BA8AD" strokeWidth="2" />
            <line x1="0" y1="-4" x2="0" y2="4" stroke="#9BA8AD" strokeWidth="2" />
            <line x1="80" y1="-4" x2="80" y2="4" stroke="#9BA8AD" strokeWidth="2" />
            <text x="18" y="-6" fill="#9BA8AD" fontSize="9" fontFamily="monospace">
              50 METERS
            </text>
          </g>
        </svg>

        {/* Legend Overlay at bottom right */}
        <div className="absolute bottom-3 right-3 bg-mine-surface/90 backdrop-blur border border-mine-border p-2.5 rounded-lg text-[10px] font-mono shadow-lg hidden sm:block">
          <span className="text-mine-muted uppercase block font-semibold mb-1.5">HAZARD INTENSITY:</span>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-emerald-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> SAFE
            </span>
            <span className="flex items-center gap-1 text-amber-400">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> WARN
            </span>
            <span className="flex items-center gap-1 text-orange-400">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span> HIGH
            </span>
            <span className="flex items-center gap-1 text-red-400">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span> CRITICAL
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
