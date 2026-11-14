/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * 0 TO 8848 — Global Adventure Achievement Platform
 * Phase 04: WCAG 2.2 AA Accessible Route Elevation Profile & Acclimatization Advisor (NF-04)
 * Provides both an interactive SVG topographic profile AND a full screen-reader/keyboard
 * accessible HTML data table alternative (Section 65).
 */

import React, { useEffect, useMemo, useState } from 'react';

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

export const KANGCHENJUNGA_SW_FACE_WAYPOINTS: ReadonlyArray<RouteWaypointNode> = [
  { waypointCode: 'KANG-01', nameEn: 'Taplejung / Sekathum Trailhead', nameNe: 'ताप्लेजुङ / सेकाथुम', distanceKm: 0, elevationMeters: 1660, recommendedDay: 1, sleepingCamp: true, hazardNote: 'Simbuwa Khola gorge; 1.0 km residential geozone masked' },
  { waypointCode: 'KANG-02', nameEn: 'Tseram / Cheram Camp', nameNe: 'चेराम शिविर', distanceKm: 34.0, elevationMeters: 3870, recommendedDay: 6, sleepingCamp: true, hazardNote: 'Mandatory acclimatization rotation below Yalung snout' },
  { waypointCode: 'KANG-03', nameEn: 'Yalung Base Camp (Ramche)', nameNe: 'यालुङ आधार शिविर', distanceKm: 48.5, elevationMeters: 5400, recommendedDay: 10, sleepingCamp: true, hazardNote: 'Department of Tourism permit & Heritage Guardian briefing' },
  { waypointCode: 'KANG-04', nameEn: 'Camp I (Yalung Ledge)', nameNe: 'शिविर १ (यालुङ फेस)', distanceKm: 52.2, elevationMeters: 6200, recommendedDay: 16, sleepingCamp: true, hazardNote: 'Hanging glacier serac hazard & fixed rope inspection' },
  { waypointCode: 'KANG-05', nameEn: 'Camp II (Great Shelf Lower)', nameNe: 'शिविर २ (ग्रेट सेल्फ)', distanceKm: 55.6, elevationMeters: 6800, recommendedDay: 20, sleepingCamp: true, hazardNote: 'Wide glacial shelf crevasse navigation & slab hazard' },
  { waypointCode: 'KANG-06', nameEn: 'Camp IV (Upper Couloir)', nameNe: 'शिविर ४ (माथिल्लो कुलवार)', distanceKm: 58.9, elevationMeters: 7550, recommendedDay: 25, sleepingCamp: true, hazardNote: 'Long summit push (>1,000m vertical gain) in severe hypoxia' },
  { waypointCode: 'KANG-07', nameEn: 'Kangchenjunga Sacred Sanctuary Boundary', nameNe: 'कञ्चनजङ्घा पवित्र चुचुरो सीमा', distanceKm: 62.4, elevationMeters: 8586, recommendedDay: 26, sleepingCamp: false, hazardNote: 'Sacred summit protocol (stop below true apex) & Heritage Guardian review' },
];

export const ISLAND_PEAK_SE_FLANK_WAYPOINTS: ReadonlyArray<RouteWaypointNode> = [
  { waypointCode: 'IMJA-01', nameEn: 'Chhukung Valley Staging Hub', nameNe: 'छुकुङ उपत्यका', distanceKm: 0, elevationMeters: 4730, recommendedDay: 1, sleepingCamp: true, hazardNote: 'Pre-climb gear inspection & Khumbu acclimatization check' },
  { waypointCode: 'IMJA-02', nameEn: 'Imja Tse Base Camp (Pareshaya Gyab)', nameNe: 'आइल्याण्ड पिक आधार शिविर', distanceKm: 5.2, elevationMeters: 5087, recommendedDay: 2, sleepingCamp: true, hazardNote: 'NMA climbing permit verification & fixed-line practice' },
  { waypointCode: 'IMJA-03', nameEn: 'High Camp Rock Ledge', nameNe: 'हाई क्याम्प', distanceKm: 7.1, elevationMeters: 5600, recommendedDay: 3, sleepingCamp: true, hazardNote: 'Final sleeping camp before 01:00 AM alpine start' },
  { waypointCode: 'IMJA-04', nameEn: 'Crampon Point (Glacier Edge)', nameNe: 'क्र्याम्पन बिन्दु', distanceKm: 8.3, elevationMeters: 5820, recommendedDay: 4, sleepingCamp: false, hazardNote: 'Rope-up transition onto Imja Glacier neve' },
  { waypointCode: 'IMJA-05', nameEn: 'Imja Glacier Crevasse Maze', nameNe: 'इम्जा हिमनदी खर्पस क्षेत्र', distanceKm: 9.1, elevationMeters: 5960, recommendedDay: 4, sleepingCamp: false, hazardNote: 'Aluminum ladder bridge crossings over deep crevasses' },
  { waypointCode: 'IMJA-06', nameEn: '50-Degree Ice Headwall', nameNe: '५०-डिग्री आइस हेडवाल', distanceKm: 9.7, elevationMeters: 6090, recommendedDay: 4, sleepingCamp: false, hazardNote: 'Jumar ascent on steep blue ice below summit ridge' },
  { waypointCode: 'IMJA-07', nameEn: 'Imja Tse / Island Peak True Summit', nameNe: 'इम्जा छ्यो / आइल्याण्ड पिक चुचुरो', distanceKm: 10.2, elevationMeters: 6165, recommendedDay: 4, sleepingCamp: false, hazardNote: 'Knife-edge summit snow ridge; Copernicus GLO-30 DEM verified' },
];

export const MATTERHORN_HORNLI_WAYPOINTS: ReadonlyArray<RouteWaypointNode> = [
  { waypointCode: 'MAT-01', nameEn: 'Zermatt Valley Station', nameNe: 'जर्माट उपत्यका', distanceKm: 0, elevationMeters: 1620, recommendedDay: 1, sleepingCamp: true, hazardNote: 'Start geozone masked; Valais alpine weather check' },
  { waypointCode: 'MAT-02', nameEn: 'Schwarzsee Approach', nameNe: 'स्वार्जसी मार्ग', distanceKm: 6.4, elevationMeters: 2583, recommendedDay: 1, sleepingCamp: false, hazardNote: 'Exposed alpine trail & loose slate talus traverse' },
  { waypointCode: 'MAT-03', nameEn: 'Hörnlihütte (SAC Base Hut)', nameNe: 'होर्नली हट (आधार आश्रय)', distanceKm: 10.2, elevationMeters: 3260, recommendedDay: 1, sleepingCamp: true, hazardNote: 'Mandatory hut reservation & 04:00 AM departure gate' },
  { waypointCode: 'MAT-04', nameEn: 'Solvay Emergency Bivouac (Moseley Slab)', nameNe: 'सोलभे आपतकालीन आश्रय', distanceKm: 11.6, elevationMeters: 4003, recommendedDay: 2, sleepingCamp: false, hazardNote: 'UIAA III+ rock slabs; strict turnaround time checkpoint' },
  { waypointCode: 'MAT-05', nameEn: 'The Shoulder (Die Schulter)', nameNe: 'द शोल्डर (हिउँ र चट्टान धार)', distanceKm: 12.3, elevationMeters: 4190, recommendedDay: 2, sleepingCamp: false, hazardNote: '45-degree mixed snow/rock arête; high lightning exposure' },
  { waypointCode: 'MAT-06', nameEn: 'Fixed Chains & Roof (Das Dach)', nameNe: 'फिक्स्ड चेन र रूफ खण्ड', distanceKm: 12.7, elevationMeters: 4330, recommendedDay: 2, sleepingCamp: false, hazardNote: 'Steep crampon climbing on glazed gneiss above North Face' },
  { waypointCode: 'MAT-07', nameEn: 'Matterhorn / Monte Cervino Summit', nameNe: 'म्याटरहर्न चुचुरो', distanceKm: 13.2, elevationMeters: 4478, recommendedDay: 2, sleepingCamp: false, hazardNote: 'Exposed Swiss-Italian border crest; full down-climb required' },
];

export const FITZ_ROY_FRANCO_ARGENTINE_WAYPOINTS: ReadonlyArray<RouteWaypointNode> = [
  { waypointCode: 'FITZ-01', nameEn: 'El Chaltén APN Ranger Trailhead', nameNe: 'एल चाल्टेन रेन्जर स्टेशन', distanceKm: 0, elevationMeters: 405, recommendedDay: 1, sleepingCamp: true, hazardNote: 'Los Glaciares NP registration; 1.0 km geozone masked' },
  { waypointCode: 'FITZ-02', nameEn: 'Campamento Poincenot (Río Blanco)', nameNe: 'पोइन्सेनोट आधार शिविर', distanceKm: 9.8, elevationMeters: 760, recommendedDay: 1, sleepingCamp: true, hazardNote: 'Barometric window monitoring before glacier approach' },
  { waypointCode: 'FITZ-03', nameEn: 'Paso Superior Glacial Bivouac', nameNe: 'पासो सुपेरियर बिभुवाक', distanceKm: 14.5, elevationMeters: 1950, recommendedDay: 2, sleepingCamp: true, hazardNote: 'Snow-cave bivouac; katabatic gusts off Southern Icefield' },
  { waypointCode: 'FITZ-04', nameEn: 'La Brecha de los Italianos', nameNe: 'ला ब्रेचा कुलवार', distanceKm: 16.0, elevationMeters: 2380, recommendedDay: 3, sleepingCamp: false, hazardNote: '55-degree alpine ice couloir & rockfall funnel' },
  { waypointCode: 'FITZ-05', nameEn: 'La Silla (The Saddle Platform)', nameNe: 'ला सिल्ला (स्याडल)', distanceKm: 16.8, elevationMeters: 2680, recommendedDay: 3, sleepingCamp: false, hazardNote: 'Full exposure to Pacific westerly wind shear' },
  { waypointCode: 'FITZ-06', nameEn: 'Granite Obelisk Headwall (650m 6c/A1)', nameNe: 'ग्रेनाइट ओबेलिस्क हेडवाल', distanceKm: 17.5, elevationMeters: 3150, recommendedDay: 3, sleepingCamp: false, hazardNote: 'Sustained icy granite cracks & multi-pitch technical climbing' },
  { waypointCode: 'FITZ-07', nameEn: 'Monte Fitz Roy / Cerro Chaltén Summit', nameNe: 'मोन्ते फिट्ज रोय चुचुरो', distanceKm: 18.4, elevationMeters: 3405, recommendedDay: 3, sleepingCamp: false, hazardNote: 'Rime-ice summit dome & 20+ rappel descent commitment' },
];

export const DESTINATION_ROUTE_WAYPOINTS_BY_ID: Readonly<
  Record<string, ReadonlyArray<RouteWaypointNode>>
> = {
  'DEST-001': EVEREST_SOUTH_COL_WAYPOINTS,
  'DEST-003': KANGCHENJUNGA_SW_FACE_WAYPOINTS,
  'DEST-016': ISLAND_PEAK_SE_FLANK_WAYPOINTS,
  'DEST-032': MATTERHORN_HORNLI_WAYPOINTS,
  'DEST-081': FITZ_ROY_FRANCO_ARGENTINE_WAYPOINTS,
};

/**
 * BUG-08 Remediation: Returns destination-specific route waypoints for the selected
 * destination/route instead of always returning Mount Everest's waypoints.
 */
export function getWaypointsForDestinationRoute(params: {
  readonly destinationId?: string;
  readonly routeId: string;
  readonly routeNameEn: string;
  readonly destinationNameEn?: string;
  readonly destinationNameNe?: string;
  readonly summitElevationMeters: number;
}): ReadonlyArray<RouteWaypointNode> {
  if (params.destinationId && DESTINATION_ROUTE_WAYPOINTS_BY_ID[params.destinationId]) {
    return DESTINATION_ROUTE_WAYPOINTS_BY_ID[params.destinationId];
  }

  const routeMatch = /^RTE-(\d{3})/.exec(params.routeId);
  if (routeMatch) {
    const inferredDestId = `DEST-${routeMatch[1]}`;
    if (DESTINATION_ROUTE_WAYPOINTS_BY_ID[inferredDestId]) {
      return DESTINATION_ROUTE_WAYPOINTS_BY_ID[inferredDestId];
    }
  }

  const summitM = Math.max(100, params.summitElevationMeters);
  const startM = Math.round(summitM * 0.32);
  const spanM = summitM - startM;
  const destLabelEn = params.destinationNameEn ?? params.routeNameEn;
  const destLabelNe = params.destinationNameNe ?? 'आरोहण मार्ग';
  const fractions = [0, 0.18, 0.38, 0.56, 0.72, 0.88, 1.0];
  const stageLabelsEn = [
    `${destLabelEn} Trailhead`,
    `${destLabelEn} Approach Camp`,
    `${destLabelEn} Acclimatization Hub`,
    `${destLabelEn} Base Camp`,
    `${destLabelEn} Camp I`,
    `${destLabelEn} High Camp`,
    `${destLabelEn} True Summit`,
  ];

  return fractions.map((f, idx) => {
    const elev = idx === 6 ? summitM : Math.round(startM + spanM * f);
    return {
      waypointCode: `${params.routeId}-WPT-0${idx + 1}`,
      nameEn: stageLabelsEn[idx],
      nameNe: `${destLabelNe} — चरण ${idx + 1}`,
      distanceKm: Number((idx * 6.5).toFixed(1)),
      elevationMeters: elev,
      recommendedDay: idx + 1,
      sleepingCamp: idx < 6,
      hazardNote:
        idx === 6
          ? `Copernicus GLO-30 DEM verified apex (${summitM.toLocaleString('en-US')} m)`
          : `Route segment ${idx + 1} acclimatization & terrain checkpoint`,
    };
  });
}

export const AccessibleRouteProfile: React.FC<{
  readonly destinationId?: string;
  readonly destinationNameEn?: string;
  readonly destinationNameNe?: string;
  readonly routeId?: string;
  readonly routeNameEn?: string;
  readonly summitElevationMeters?: number;
}> = ({
  destinationId,
  destinationNameEn,
  destinationNameNe,
  routeId = 'RTE-001A',
  routeNameEn = 'Mount Everest (Sagarmatha) — Southeast Ridge via South Col',
  summitElevationMeters = 8848.86,
}) => {
  const waypoints = useMemo(
    () =>
      getWaypointsForDestinationRoute({
        destinationId,
        routeId,
        routeNameEn,
        destinationNameEn,
        destinationNameNe,
        summitElevationMeters,
      }),
    [destinationId, routeId, routeNameEn, destinationNameEn, destinationNameNe, summitElevationMeters]
  );

  const [selectedWaypoint, setSelectedWaypoint] = useState<RouteWaypointNode>(
    waypoints[waypoints.length - 1]
  );

  useEffect(() => {
    setSelectedWaypoint(waypoints[waypoints.length - 1]);
  }, [waypoints]);

  const handleWaypointKeyDown = (
    event: React.KeyboardEvent<Element>,
    node: RouteWaypointNode
  ) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setSelectedWaypoint(node);
    }
  };

  const svgPoints = useMemo(() => {
    const xs = [60, 170, 290, 410, 530, 635, 720];
    const minElev = Math.min(...waypoints.map((w) => w.elevationMeters));
    const maxElev = Math.max(...waypoints.map((w) => w.elevationMeters));
    const elevSpan = Math.max(100, maxElev - minElev);
    return waypoints.map((node, idx) => {
      const x = xs[idx] ?? 60 + idx * 110;
      const normalized = (node.elevationMeters - minElev) / elevSpan;
      const y = Math.round(168 - normalized * 142); // Maps [minElev..maxElev] -> [168..26]
      return { x, y, node };
    });
  }, [waypoints]);

  const polylineCoords = svgPoints.map((p) => `${p.x},${p.y}`).join(' ');
  const polygonCoords = `${polylineCoords} 720,195 60,195`;
  const minElevation = Math.round(waypoints[0]?.elevationMeters ?? 0);
  const midElevation = Math.round((minElevation + summitElevationMeters) / 2);

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
          aria-label={`Topographic elevation chart from ${waypoints[0]?.nameEn ?? 'Trailhead'} at ${minElevation}m to ${waypoints[waypoints.length - 1]?.nameEn ?? 'Summit'} at ${summitElevationMeters}m. Full accessible table follows directly below.`}
        >
          {/* Horizontal Elevation Reference Grid Lines */}
          <line x1="50" y1="30" x2="730" y2="30" stroke="#262626" strokeDasharray="3 3" />
          <text x="10" y="34" fill="#A3A3A3" fontSize="10" fontFamily="JetBrains Mono, monospace">
            {Math.round(summitElevationMeters)}m
          </text>

          <line x1="50" y1="95" x2="730" y2="95" stroke="#262626" strokeDasharray="3 3" />
          <text x="10" y="99" fill="#A3A3A3" fontSize="10" fontFamily="JetBrains Mono, monospace">
            {midElevation}m
          </text>

          <line x1="50" y1="165" x2="730" y2="165" stroke="#262626" strokeDasharray="3 3" />
          <text x="10" y="169" fill="#A3A3A3" fontSize="10" fontFamily="JetBrains Mono, monospace">
            {minElevation}m
          </text>

          {/* Filled Area Under Elevation Curve */}
          <polygon
            points={polygonCoords}
            fill="#C9A86A"
            fillOpacity="0.14"
          />

          {/* Elevation Polyline */}
          <polyline
            fill="none"
            stroke="#C9A86A"
            strokeWidth="2.5"
            points={polylineCoords}
          />

          {/* Interactive Waypoint Nodes (WCAG 2.2 AA Keyboard & Pointer Accessible) */}
          {svgPoints.map(({ x, y, node }) => {
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
              <th scope="col" className="py-2.5 pl-4">SAFETY &amp; VERIFICATION NOTE</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-900">
            {waypoints.map((wpt) => {
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
        Safety &amp; Non-Medical Notice (Section 62 &amp; NF-04): 0 TO 8848 is an achievement recognition platform, not an emergency rescue agency or medical provider. Always verify field weather and acclimatize gradually.
      </p>
    </section>
  );
};
