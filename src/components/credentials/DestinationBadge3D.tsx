/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * 0 TO 8848 — Global Adventure Achievement Platform
 * Phase 04: 3D Metallic Mountain Shield Badge Component (Section 31)
 * Brand Palette: Obsidian Black (#0A0A0A), Metallic Gold (#C9A86A), Highlight Gold (#FFD700), Summit White (#FFFFFF)
 * Supports Low-Bandwidth Expedition Mode (<2 KB wireframe vector fallback).
 */

import React from 'react';

export interface DestinationBadge3DProps {
  readonly badgeId: string;
  readonly destinationId: string;
  readonly destinationNameEn: string;
  readonly destinationNameNe: string;
  readonly elevationMeters: number;
  readonly categoryCode: string;
  readonly credentialStatus: 'VALID' | 'PROPOSED_PREVIEW';
  readonly lowBandwidthMode?: boolean;
}

export const DestinationBadge3D: React.FC<DestinationBadge3DProps> = ({
  badgeId,
  destinationId,
  destinationNameEn,
  destinationNameNe,
  elevationMeters,
  categoryCode,
  credentialStatus,
  lowBandwidthMode = false,
}) => {
  return (
    <div
      className="flex flex-col items-center p-6 bg-[#121212] border border-[#C9A86A]/30 rounded-xl"
      role="region"
      aria-label={`Official 0 TO 8848 3D Mountain Shield Badge for ${destinationNameEn}, elevation ${elevationMeters} meters`}
    >
      <div className="relative w-52 h-60 flex items-center justify-center">
        <svg
          viewBox="0 0 220 260"
          className="w-full h-full"
          role="img"
          aria-labelledby={`badge-title-${badgeId}`}
        >
          <title id={`badge-title-${badgeId}`}>
            {destinationNameEn} ({elevationMeters}m) — 0 TO 8848 Official Mountain Shield Badge
          </title>

          {!lowBandwidthMode && (
            <defs>
              <linearGradient id={`gold-bevel-${badgeId}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFD700" />
                <stop offset="35%" stopColor="#C9A86A" />
                <stop offset="70%" stopColor="#8A6D3B" />
                <stop offset="100%" stopColor="#FFD700" />
              </linearGradient>
              <linearGradient id={`obsidian-core-${badgeId}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#1C1C1C" />
                <stop offset="55%" stopColor="#0A0A0A" />
                <stop offset="100%" stopColor="#050505" />
              </linearGradient>
              <linearGradient id={`peak-snow-${badgeId}`} x1="0%" y1="0%" x2="50%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="65%" stopColor="#E5E5E5" />
                <stop offset="100%" stopColor="#C9A86A" />
              </linearGradient>
            </defs>
          )}

          {/* Outer 3D Metallic Gold Heraldic Mountain Shield */}
          <path
            d="M110 8 L204 42 L204 134 C204 192 162 232 110 252 C58 232 16 192 16 134 L16 42 Z"
            fill={lowBandwidthMode ? '#0A0A0A' : `url(#gold-bevel-${badgeId})`}
            stroke="#C9A86A"
            strokeWidth={lowBandwidthMode ? '2.5' : '1.5'}
          />

          {/* Inner Recessed Obsidian Black Shield Plate */}
          <path
            d="M110 18 L194 49 L194 132 C194 184 155 221 110 240 C65 221 26 184 26 132 L26 49 Z"
            fill={lowBandwidthMode ? '#0A0A0A' : `url(#obsidian-core-${badgeId})`}
            stroke="#FFD700"
            strokeWidth="0.9"
            strokeOpacity="0.65"
          />

          {/* Top Institutional Header Arc Text */}
          <text
            x="110"
            y="44"
            textAnchor="middle"
            fill="#C9A86A"
            fontSize="10"
            fontWeight="700"
            letterSpacing="3"
            fontFamily="Cinzel, serif"
          >
            0 TO 8848
          </text>

          {/* 3D Sculpted Himalayan / Alpine Peak Relief */}
          <polygon
            points="110,64 166,144 54,144"
            fill={lowBandwidthMode ? 'none' : `url(#peak-snow-${badgeId})`}
            stroke="#FFFFFF"
            strokeWidth="1.5"
          />
          {/* Shadow Facet for 3D Relief */}
          {!lowBandwidthMode && (
            <polygon
              points="110,64 166,144 118,144"
              fill="#0A0A0A"
              fillOpacity="0.42"
            />
          )}
          {/* Secondary Flanking Ridge */}
          <polygon
            points="74,92 112,144 38,144"
            fill={lowBandwidthMode ? 'none' : '#C9A86A'}
            fillOpacity={lowBandwidthMode ? '0' : '0.35'}
            stroke="#C9A86A"
            strokeWidth="1"
          />

          {/* Horizon Rule */}
          <line x1="38" y1="145" x2="182" y2="145" stroke="#FFD700" strokeWidth="1.2" />

          {/* Elevation Readout (Tabular Monospace) */}
          <text
            x="110"
            y="166"
            textAnchor="middle"
            fill="#FFD700"
            fontSize="14"
            fontWeight="700"
            fontFamily="JetBrains Mono, monospace"
          >
            {elevationMeters.toLocaleString('en-US')} m
          </text>

          {/* Destination Official Name */}
          <text
            x="110"
            y="186"
            textAnchor="middle"
            fill="#FFFFFF"
            fontSize="10.5"
            fontWeight="600"
            fontFamily="Cinzel, serif"
          >
            {destinationNameEn.length > 22
              ? `${destinationNameEn.slice(0, 20)}…`
              : destinationNameEn}
          </text>

          {/* Nepali Devanagari Inscription */}
          <text
            x="110"
            y="204"
            textAnchor="middle"
            fill="#C9A86A"
            fontSize="10"
            fontFamily="Noto Sans Devanagari, sans-serif"
          >
            {destinationNameNe}
          </text>

          {/* Non-Transferable Free Standard Footer Mark */}
          <text
            x="110"
            y="224"
            textAnchor="middle"
            fill="#A3A3A3"
            fontSize="7.5"
            letterSpacing="1.2"
            fontFamily="JetBrains Mono, monospace"
          >
            {destinationId} · {categoryCode}
          </text>
        </svg>
      </div>

      {/* Unboxed Metadata Line (Zero-Pill Discipline) */}
      <div className="mt-3 text-center">
        <p className="text-xs text-[#C9A86A] font-mono tabular-nums">
          {badgeId} · {credentialStatus === 'VALID' ? 'VERIFIED CREDENTIAL' : 'DESIGN SPEC PREVIEW'}
        </p>
        <p className="text-xs text-neutral-400 mt-1">
          Standard Digital Badge: $0.00 Free · Non-Transferable
        </p>
      </div>
    </div>
  );
};
