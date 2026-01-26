// Fallback SVG placeholders for images
export const IMAGE_FALLBACKS = {
  // City fallbacks
  city: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
    <defs>
      <linearGradient id="cityGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#f97316;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#fb923c;stop-opacity:1" />
      </linearGradient>
    </defs>
    <rect width="800" height="600" fill="url(#cityGradient)"/>
    <g opacity="0.2">
      <rect x="50" y="250" width="80" height="200" fill="white"/>
      <polygon points="130,250 170,150 210,250" fill="white"/>
      <rect x="250" y="200" width="100" height="250" fill="white"/>
      <polygon points="350,200 400,80 450,200" fill="white"/>
      <rect x="500" y="280" width="70" height="170" fill="white"/>
      <polygon points="570,280 600,180 630,280" fill="white"/>
    </g>
    <text x="400" y="350" font-size="48" font-weight="bold" text-anchor="middle" fill="white" opacity="0.8">City</text>
  </svg>`,

  // Neighbourhood fallbacks
  neighbourhood: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
    <defs>
      <linearGradient id="neighbourhoodGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#06b6d4;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#0ea5e9;stop-opacity:1" />
      </linearGradient>
    </defs>
    <rect width="800" height="600" fill="url(#neighbourhoodGradient)"/>
    <g opacity="0.3" fill="white">
      <rect x="100" y="200" width="120" height="150" rx="10"/>
      <rect x="280" y="150" width="120" height="200" rx="10"/>
      <rect x="460" y="220" width="120" height="130" rx="10"/>
      <circle cx="590" cy="300" r="50"/>
    </g>
    <text x="400" y="400" font-size="48" font-weight="bold" text-anchor="middle" fill="white" opacity="0.8">Neighbourhood</text>
  </svg>`,

  // Generic fallback
  generic: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
    <defs>
      <linearGradient id="genericGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#8b5cf6;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#d946ef;stop-opacity:1" />
      </linearGradient>
    </defs>
    <rect width="800" height="600" fill="url(#genericGradient)"/>
    <circle cx="400" cy="300" r="80" fill="white" opacity="0.2"/>
    <text x="400" y="330" font-size="36" font-weight="bold" text-anchor="middle" fill="white" opacity="0.8">Image</text>
  </svg>`,
};

export function getSvgDataUrl(svg: string): string {
  const encoded = encodeURIComponent(svg);
  return `data:image/svg+xml,${encoded}`;
}

export const FALLBACK_URLS = {
  city: getSvgDataUrl(IMAGE_FALLBACKS.city),
  neighbourhood: getSvgDataUrl(IMAGE_FALLBACKS.neighbourhood),
  generic: getSvgDataUrl(IMAGE_FALLBACKS.generic),
};
