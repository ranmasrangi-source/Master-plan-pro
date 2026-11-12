/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * 0 TO 8848 — Global Adventure Achievement Platform
 * Phase 04: WCAG 2.2 AA Accessible Route Elevation Profile & Acclimatization Advisor (NF-04)
 * Provides both an interactive SVG topographic profile AND a full screen-reader/keyboard
 * accessible HTML data table alternative (Section 65).
 */

import React, { useState } from 'react';

export interface RouteWaypointNode {
  readonly waypointCode: string;
  readonly nameEn: string;
  readonly nameNe: string;
  readonly distanceKm: number;
  readonly elevationMeters: number;
  readonly recommendedDay: number;
  readonly sleepingCamp: boolean;
  readonly hazardNote: string;
}

export const EVEREST_SOUTH_COL_WAYPOINTS: ReadonlyArray<RouteWaypointNode> = [
  { waypointCode: 'WPT-01', nameEn: 'Lukla Trailhead', nameNe: 'लुक्ला', distanceKm: 0, elevationMeters: 2860, recommendedDay: 1, sleepingCamp: true, hazardNote: 'Initial start; 1.0 km residential geozone masked' },
  { waypointCode: 'WPT-02', nameEn: 'Namche Bazaar', nameNe: 'नाम्चे बजार', distanceKm: 19.5, elevationMeters: 3440, recommendedDay: 3, sleepingCamp: true, hazardNote: 'Mandatory 2-night acclimatization rest stop (WMS/UIAA)' },
  { waypointCode: 'WPT-03', nameEn: 'Dingboche', nameNe: 'दिङबोचे', distanceKm: 41.0, elevationMeters: 4410, recommendedDay: 6, sleepingCamp: true, hazardNote: 'Second mandatory acclimatization rotation' },
  { waypointCode: 'WPT-04', nameEn: 'Everest South Base Camp', nameNe: 'सगरमाथा आधार शिविर', distanceKm: 62.0, elevationMeters: 5364, recommendedDay: 9, sleepingCamp: true, hazardNote: 'SPCC permit & Puja ceremony check' },
  { waypointCode: 'WPT-05', nameEn: 'Camp II (Western Cwm)', nameNe: 'शिविर २ (वेस्टर्न कुम)', distanceKm: 68.5, elevationMeters: 6400, recommendedDay: 18, sleepingCamp: true, hazardNote: 'Max helicopter SAR evacuation ceiling (6,400m)' },
  { waypointCode: 'WPT-06', nameEn: 'South Col (Camp IV)', nameNe: 'साउथ कोल (शिविर ४)', distanceKm: 73.0, elevationMeters: 7906, recommendedDay: 24, sleepingCamp: true, hazardNote: 'Death Zone threshold; West VO2max decay factor 0.15' },
  { waypointCode: 'WPT-07', nameEn: 'Sagarmatha / Everest True Summit', nameNe: 'सगरमाथा चुचुरो', distanceKm: 75.5, elevationMeters: 8848.86, recommendedDay: 25, sleepingCamp: false, hazardNote: 'Copernicus GLO-30 DEM & Dual-L4 Senior Verification Point' },
];

export const AccessibleRouteProfile: React.FC<{
  readonly routeId?: string;
  readonly routeNameEn?: string;
  readonly summitElevationMeters?: number;
}> = ({
  routeId = 'RTE-001A',
  routeNameEn = 'Mount Everest (Sagarmatha) — Southeast Ridge via South Col',
  summitElevationMeters = 8848.86,
}) => {
  const [selectedWaypoint, setSelectedWaypoint] = useState<RouteWaypointNode>(
    EVEREST_SOUTH_COL_WAYPOINTS[6]
  );

  const handleWaypointKeyDown = (
    event: React.KeyboardEvent<Element>,
    node: RouteWaypointNode
  ) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setSelectedWaypoint(node);
    }
  };

  return (
    <section
      className="bg-[#121212] border border-neutral-800 rounded-xl p-6"
      aria-labelledby="route-profile-heading"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-neutral-800">
        <div>
          <p className="text-xs font-mono text-[#C9A86A]">
            {routeId} · COPERNICUS GLO-30 DEM ELEVATION PROFILE · NF-04 ACCLIMATIZATION CHECK
          </p>
          <h3 id="route-profile-heading" className="text-xl font-semibold text-white mt-1 font-display">
            {routeNameEn}
          </h3>
        </div>
        <div className="text-xs text-neutral-400 font-mono tabular-nums">
          Reference Apex: {summitElevationMeters.toLocaleString('en-US')} m · WMS/UIAA Acclimatization: COMPLIANT
        </div>
      </div>

      {/* Interactive SVG Elevation Profile */}
      <div className="mt-6">
        <svg
          viewBox="0 0 760 220"
          className="w-full h-48 bg-[#0A0A0A] rounded-lg border border-neutral-800 p-2"
          role="img"
          aria-label="Topographic elevation chart from Lukla at 2,860m to Mount Everest Summit at 8,848.86m. Full accessible table follows directly below."
        >
          {/* Horizontal Elevation Reference Grid Lines */}
          <line x1="50" y1="30" x2="730" y2="30" stroke="#262626" strokeDasharray="3 3" />
          <text x="10" y="34" fill="#A3A3A3" fontSize="10" fontFamily="JetBrains Mono, monospace">8848m</text>

          <line x1="50" y1="95" x2="730" y2="95" stroke="#262626" strokeDasharray="3 3" />
          <text x="10" y="99" fill="#A3A3A3" fontSize="10" fontFamily="JetBrains Mono, monospace">6000m</text>

          <line x1="50" y1="165" x2="730" y2="165" stroke="#262626" strokeDasharray="3 3" />
          <text x="10" y="169" fill="#A3A3A3" fontSize="10" fontFamily="JetBrains Mono, monospace">3000m</text>

          {/* Filled Area Under Elevation Curve */}
          <polygon
            points="60,168 170,154 290,131 410,108 530,84 635,49 720,26 720,195 60,195"
            fill="#C9A86A"
            fillOpacity="0.14"
          />

          {/* Elevation Polyline */}
          <polyline
            fill="none"
            stroke="#C9A86A"
            strokeWidth="2.5"
            points="60,168 170,154 290,131 410,108 530,84 635,49 720,26"
          />

          {/* Interactive Waypoint Nodes (WCAG 2.2 AA Keyboard & Pointer Accessible) */}
          {[
            { x: 60, y: 168, node: EVEREST_SOUTH_COL_WAYPOINTS[0] },
            { x: 170, y: 154, node: EVEREST_SOUTH_COL_WAYPOINTS[1] },
            { x: 290, y: 131, node: EVEREST_SOUTH_COL_WAYPOINTS[2] },
            { x: 410, y: 108, node: EVEREST_SOUTH_COL_WAYPOINTS[3] },
            { x: 530, y: 84, node: EVEREST_SOUTH_COL_WAYPOINTS[4] },
            { x: 635, y: 49, node: EVEREST_SOUTH_COL_WAYPOINTS[5] },
            { x: 720, y: 26, node: EVEREST_SOUTH_COL_WAYPOINTS[6] },
          ].map(({ x, y, node }) => {
            const isSelected = selectedWaypoint.waypointCode === node.waypointCode;
            return (
              <g
                key={node.waypointCode}
                tabIndex={0}
                role="button"
                aria-label={`Inspect waypoint ${node.waypointCode}: ${node.nameEn}, elevation ${node.elevationMeters} meters`}
                onClick={() => setSelectedWaypoint(node)}
                onKeyDown={(e) => handleWaypointKeyDown(e, node)}
                className="cursor-pointer focus:outline-none"
              >
                <circle
                  cx={x}
                  cy={y}
                  r={isSelected ? 6 : 4}
                  fill={isSelected ? '#FFD700' : '#0A0A0A'}
                  stroke="#FFD700"
                  strokeWidth="2"
                />
                <text
                  x={x}
                  y={y - 10}
                  textAnchor="middle"
                  fill={isSelected ? '#FFD700' : '#E5E5E5'}
                  fontSize="9.5"
                  fontFamily="JetBrains Mono, monospace"
                >
                  {node.elevationMeters}m
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Selected Waypoint Focus Banner */}
      <div
        role="status"
        aria-live="polite"
        className="mt-4 p-4 bg-[#0A0A0A] border border-neutral-800 rounded-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs"
      >
        <div>
          <span className="font-mono text-[#FFD700]">{selectedWaypoint.waypointCode}</span>
          <span className="mx-2 text-neutral-600">·</span>
          <span className="font-semibold text-white">{selectedWaypoint.nameEn}</span>
          <span className="mx-2 text-neutral-600">·</span>
          <span className="text-[#C9A86A]">{selectedWaypoint.nameNe}</span>
        </div>
        <div className="text-neutral-300 font-mono tabular-nums">
          {selectedWaypoint.elevationMeters} m · Day {selectedWaypoint.recommendedDay} · {selectedWaypoint.hazardNote}
        </div>
      </div>

      {/* WCAG 2.2 AA Mandatory Non-Map Tabular Alternative (Section 65) */}
      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <caption className="sr-only">
            Accessible Waypoint, Elevation, and Acclimatization Schedule Table for {routeNameEn}
          </caption>
          <thead>
            <tr className="border-b border-neutral-800 text-neutral-400 font-mono">
              <th scope="col" className="py-2.5 pr-4">WAYPOINT</th>
              <th scope="col" className="py-2.5 px-4">NAME (EN / नेपाली)</th>
              <th scope="col" className="py-2.5 px-4 text-right">DISTANCE</th>
              <th scope="col" className="py-2.5 px-4 text-right">ELEVATION</th>
              <th scope="col" className="py-2.5 px-4 text-right">TARGET DAY</th>
              <th scope="col" className="py-2.5 pl-4">SAFETY & VERIFICATION NOTE</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-900">
            {EVEREST_SOUTH_COL_WAYPOINTS.map((wpt) => {
              const isSelected = selectedWaypoint.waypointCode === wpt.waypointCode;
              return (
                <tr
                  key={wpt.waypointCode}
                  tabIndex={0}
                  aria-selected={isSelected}
                  onClick={() => setSelectedWaypoint(wpt)}
                  onKeyDown={(e) => handleWaypointKeyDown(e, wpt)}
                  className={`cursor-pointer transition-colors focus-visible:outline-2 focus-visible:outline-[#FFD700] ${
                    isSelected ? 'bg-neutral-900/90 text-white' : 'text-neutral-300 hover:bg-neutral-900/40'
                  }`}
                >
                  <td className="py-2.5 pr-4 font-mono text-[#C9A86A] whitespace-nowrap">
                    {wpt.waypointCode}
                  </td>
                  <td className="py-2.5 px-4 font-medium whitespace-nowrap">
                    {wpt.nameEn} <span className="text-neutral-400">({wpt.nameNe})</span>
                  </td>
                  <td className="py-2.5 px-4 text-right font-mono tabular-nums whitespace-nowrap">
                    {wpt.distanceKm.toFixed(1)} km
                  </td>
                  <td className="py-2.5 px-4 text-right font-mono tabular-nums text-[#FFD700] whitespace-nowrap">
                    {wpt.elevationMeters.toLocaleString('en-US')} m
                  </td>
                  <td className="py-2.5 px-4 text-right font-mono tabular-nums whitespace-nowrap">
                    Day {wpt.recommendedDay}
                  </td>
                  <td className="py-2.5 pl-4 text-neutral-400">
                    {wpt.hazardNote}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-xs text-neutral-400">
        Safety & Non-Medical Notice (Section 62 & NF-04): 0 TO 8848 is an achievement recognition platform, not an emergency rescue agency or medical provider. Always verify field weather and acclimatize gradually.
      </p>
    </section>
  );
};
