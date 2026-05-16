// Client-only. SVG print art per product, keyed by id. Kept separate from
// products.ts so the server can import product data without dragging JSX
// into API routes.

import React from "react";

type PrintFn = (tc: string, sc: string) => React.ReactNode;

export const PRODUCT_ART: Record<string, PrintFn> = {
  "ancestor-tee": (tc, sc) => (
    <g fontFamily="'Playfair Display', serif" textAnchor="middle">
      <path d="M175 175 Q210 168 245 175" stroke={sc} strokeWidth="1.5" fill="none" opacity="0.6" />
      <path d="M165 285 Q210 292 255 285" stroke={sc} strokeWidth="1.5" fill="none" opacity="0.6" />
      <text x="210" y="205" fontSize="22" fontWeight="900" fill={tc} letterSpacing="2">MY CULTURE</text>
      <text x="210" y="228" fontSize="11" fontFamily="monospace" fill={tc} opacity="0.75" letterSpacing="4">IS NOT</text>
      <text x="210" y="258" fontSize="20" fontWeight="700" fontStyle="italic" fill={sc}>Your Costume.</text>
      <text x="210" y="280" fontSize="8" fontFamily="monospace" fill={tc} opacity="0.5" letterSpacing="3">EST. 2025 · RECLAIM</text>
    </g>
  ),
  "sovereignty-crew": (tc, sc) => (
    <g fontFamily="'Playfair Display', serif" textAnchor="middle">
      <circle cx="210" cy="228" r="58" stroke={tc} strokeWidth="1" fill="none" opacity="0.4" />
      <text x="210" y="188" fontSize="8" fontFamily="monospace" fill={tc} opacity="0.6" letterSpacing="3">SOVEREIGNTY</text>
      <text x="210" y="232" fontSize="32" fontWeight="900" fontStyle="italic" fill={sc}>MINE.</text>
      <text x="210" y="258" fontSize="7.5" fontFamily="monospace" fill={tc} opacity="0.55" letterSpacing="1.5">MY CULTURE IS NOT</text>
      <text x="210" y="272" fontSize="7.5" fontFamily="monospace" fill={tc} opacity="0.55" letterSpacing="1.5">YOUR COSTUME.</text>
    </g>
  ),
  "reclaim-jacket": (tc, sc) => (
    <g fontFamily="'Playfair Display', serif" textAnchor="middle">
      <rect x="168" y="178" width="84" height="96" rx="2" stroke={tc} strokeWidth="1" fill="none" opacity="0.5" />
      <text x="210" y="200" fontSize="9" fontFamily="monospace" fill={tc} opacity="0.7" letterSpacing="2">THE RECLAIM</text>
      <text x="210" y="228" fontSize="22" fontWeight="900" fill={sc}>JACKET</text>
      <line x1="175" y1="238" x2="245" y2="238" stroke={tc} strokeWidth="0.75" opacity="0.4" />
      <text x="210" y="254" fontSize="8" fill={tc} opacity="0.65">MY CULTURE</text>
      <text x="210" y="266" fontSize="8" fontStyle="italic" fill={tc} opacity="0.65">is not your costume.</text>
    </g>
  ),
  "diaspora-hoodie": (tc, sc) => (
    <g fontFamily="'Playfair Display', serif" textAnchor="middle">
      <text x="210" y="192" fontSize="8" fontFamily="monospace" fill={tc} opacity="0.6" letterSpacing="3">DIASPORA</text>
      <text x="210" y="228" fontSize="26" fontWeight="900" fill={tc}>scattered.</text>
      <text x="210" y="258" fontSize="24" fontWeight="700" fontStyle="italic" fill={sc}>rooted.</text>
      <line x1="178" y1="267" x2="242" y2="267" stroke={tc} strokeWidth="0.75" opacity="0.35" />
      <text x="210" y="279" fontSize="6.5" fontFamily="monospace" fill={tc} opacity="0.45" letterSpacing="2">MY CULTURE IS NOT YOUR COSTUME</text>
    </g>
  ),
  "not-for-you-tote": (tc, sc) => (
    <g fontFamily="'Playfair Display', serif" textAnchor="middle">
      <text x="210" y="198" fontSize="10" fontFamily="monospace" fill={tc} opacity="0.7" letterSpacing="3">NOT</text>
      <text x="210" y="238" fontSize="34" fontWeight="900" fill={sc}>FOR</text>
      <text x="210" y="268" fontSize="28" fontWeight="700" fontStyle="italic" fill={tc}>you.</text>
      <line x1="182" y1="276" x2="238" y2="276" stroke={tc} strokeWidth="0.75" opacity="0.35" />
      <text x="210" y="288" fontSize="6.5" fontFamily="monospace" fill={tc} opacity="0.45" letterSpacing="1.5">MY CULTURE IS NOT YOUR COSTUME</text>
    </g>
  ),
  "bucket-hat": (tc, sc) => (
    <g fontFamily="'Playfair Display', serif" textAnchor="middle">
      <circle cx="210" cy="228" r="50" stroke={tc} strokeWidth="1" fill="none" opacity="0.35" />
      <text x="210" y="200" fontSize="8" fontFamily="monospace" fill={tc} opacity="0.6" letterSpacing="3">DIASPORA</text>
      <text x="210" y="232" fontSize="22" fontWeight="700" fontStyle="italic" fill={sc}>Rooted.</text>
      <text x="210" y="252" fontSize="7.5" fontFamily="monospace" fill={tc} opacity="0.55" letterSpacing="1.5">MY CULTURE IS NOT</text>
      <text x="210" y="265" fontSize="7.5" fontStyle="italic" fill={tc} opacity="0.55">your costume.</text>
    </g>
  ),
};
