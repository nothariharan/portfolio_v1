"use client";

// tiny svg marks for the data file rows
// grad brief cloud and the rest

export function SvgIcon({ name, color = "#5d6b7a" }: { name: string; color?: string }) {
  switch (name) {
    case "grad":
      return (
        <svg viewBox="0 0 24 24" className="w-[20px] h-[20px]" fill={color}>
          <path d="M12 4 1 9l11 5 11-5z" />
          <path d="M5 12.2V16c0 1.4 3.1 2.8 7 2.8s7-1.4 7-2.8v-3.8l-7 3.1z" />
        </svg>
      );
    case "brief":
      return (
        <svg viewBox="0 0 24 24" className="w-[20px] h-[20px]" fill={color}>
          <path d="M9 5h6v2h4a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h4zm2 0v2h2V5z" />
          <rect x="3" y="11.5" width="18" height="2" fill="#fff" opacity="0.55" />
        </svg>
      );
    case "cloud":
      return (
        <svg viewBox="0 0 24 24" className="w-[20px] h-[20px]" fill={color}>
          <path d="M7 18a4.5 4.5 0 0 1-.4-8.98 6 6 0 0 1 11.6 1.1A4 4 0 0 1 17.5 18z" />
        </svg>
      );
    case "code":
      return (
        <svg viewBox="0 0 24 24" className="w-[20px] h-[20px]" fill="none" stroke={color} strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 8 5 12 9 16" />
          <polyline points="15 8 19 12 15 16" />
        </svg>
      );
    case "star":
      return (
        <svg viewBox="0 0 24 24" className="w-[20px] h-[20px]" fill="#e0a52c">
          <polygon points="12,2 15,9 22,9 16.5,14 18.5,21 12,17 5.5,21 7.5,14 2,9 9,9" />
        </svg>
      );
    case "trophy":
      return (
        <svg viewBox="0 0 24 24" className="w-[20px] h-[20px]" fill="#e0a52c">
          <path d="M6 3h12v3a6 6 0 0 1-12 0z" />
          <path d="M4 4h2v2a2.5 2.5 0 0 1-2-2zM20 4h-2v2a2.5 2.5 0 0 0 2-2z" />
          <rect x="10.5" y="10" width="3" height="6" />
          <rect x="8" y="18" width="8" height="3" rx="1" />
        </svg>
      );
    case "bolt":
      return (
        <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="#e0a52c">
          <path d="M13 2 4 14h7l-1 8 10-14h-7z" />
        </svg>
      );
    case "rocket":
      return (
        <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="#e8913a">
          <path d="M12 2c2.8 2.2 4.5 5.4 4.8 9.2l2.2 1.4-2.4 2.4-1.4-1.1C14.4 17.3 12.8 19 11 20.2l-1.6-2.6C7.2 16.4 5.4 14 4.6 11.2L7 9.8C7.5 6 9.2 3.5 12 2z" />
          <circle cx="13.2" cy="9.2" r="1.4" fill="#fff" />
          <path d="M7.2 14.8 4 20l5.2-1.6z" fill="#c23a33" />
        </svg>
      );
    case "lock":
      return (
        <svg viewBox="0 0 24 24" className="w-[16px] h-[16px]" fill="#9aa0a8">
          <rect x="5" y="11" width="14" height="10" rx="2" />
          <path d="M8 11V8a4 4 0 0 1 8 0v3" fill="none" stroke="#9aa0a8" strokeWidth="2.2" />
          <circle cx="12" cy="16" r="1.6" fill="#fff" />
        </svg>
      );
    case "question":
      return (
        <svg viewBox="0 0 24 24" className="w-[20px] h-[20px]" fill="#9aa0a8">
          <path d="M10 16h4v4h-4zm.4-11.5c2.8-.9 5.6.4 6.1 3 .4 2.1-.6 3.3-1.8 4.2-.9.7-1.5 1.2-1.5 2.3h-3.2c0-2 .9-2.8 2-3.6 1-.8 1.4-1.2 1.2-2.1-.2-.8-1-1.3-1.9-1.1-.7.2-1.1.7-1.2 1.4H7.2c.2-2.4 2-3.7 3.2-4.1z" />
        </svg>
      );
    case "play":
      return (
        <svg viewBox="0 0 24 24" className="w-[10px] h-[10px]" fill="currentColor">
          <path d="M8 5v14l12-7z" />
        </svg>
      );
    case "medal":
      return (
        <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="#9b6cc4">
          <circle cx="12" cy="10" r="6" />
          <circle cx="12" cy="10" r="3" fill="#fff" opacity="0.45" />
          <path d="M8 15.5 6 22l6-3 6 3-2-6.5" fill="#c9a0e8" />
        </svg>
      );
    case "diamond":
      return (
        <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="#4a76c9">
          <path d="M12 2 3 9l9 13 9-13z" />
          <path d="M3 9h18" stroke="#fff" strokeWidth="1.4" opacity="0.5" />
          <path d="M12 2 8 9h8z" fill="#7aa0e0" />
        </svg>
      );
    case "calendar":
      return (
        <svg viewBox="0 0 24 24" className="w-[14px] h-[14px]" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M3 10h18M8 3v4M16 3v4" />
        </svg>
      );
    case "people":
      return (
        <svg viewBox="0 0 24 24" className="w-[14px] h-[14px]" fill="currentColor">
          <circle cx="9" cy="8" r="3" />
          <circle cx="16" cy="9" r="2.4" />
          <path d="M2 19c0-3 3-5 7-5s7 2 7 5M13 19c.4-2 2.2-3.4 4.8-3.4 2 0 3.7.9 4.2 2.4" />
        </svg>
      );
    case "gift":
      return (
        <svg viewBox="0 0 24 24" className="w-[14px] h-[14px]" fill="currentColor">
          <rect x="3" y="10" width="18" height="11" rx="1" />
          <rect x="2" y="7" width="20" height="4" rx="1" />
          <path d="M12 7V21M12 7c-2-3-5-3-5 0M12 7c2-3 5-3 5 0" fill="none" stroke="#fff" strokeWidth="1.4" />
        </svg>
      );
    case "credit":
      return (
        <svg viewBox="0 0 24 24" className="w-[14px] h-[14px]" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="5" width="20" height="14" rx="2" />
          <path d="M2 10h20" />
          <path d="M6 15h4" />
        </svg>
      );
    case "track":
      return (
        <svg viewBox="0 0 24 24" className="w-[14px] h-[14px]" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
          <path d="M4 18V8M10 18V5M16 18v-7M20 18V9" />
        </svg>
      );
    case "build":
      return (
        <svg viewBox="0 0 24 24" className="w-[14px] h-[14px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18v3h3l6.3-6.3a4 4 0 0 0 5.4-5.4z" />
        </svg>
      );
    case "check":
      return (
        <svg viewBox="0 0 24 24" className="w-[14px] h-[14px]" fill="none" stroke="#3f9b46" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="4 12 10 18 20 6" />
        </svg>
      );
    case "linkedin":
      return (
        <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="#0a66c2">
          <rect x="2" y="2" width="20" height="20" rx="3" />
          <g fill="#fff">
            <rect x="5" y="9.5" width="3" height="8.5" />
            <circle cx="6.5" cy="6.3" r="1.7" />
            <path d="M11 9.5h2.9v1.3c.5-.9 1.6-1.6 3-1.6 2.1 0 3.1 1.3 3.1 3.8V18h-3v-4.4c0-1.1-.4-1.8-1.4-1.8-.8 0-1.3.5-1.5 1.1V18h-3z" />
          </g>
        </svg>
      );
    case "globe":
      return (
        <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="none" stroke="#2f78bf" strokeWidth="1.9">
          <circle cx="12" cy="12" r="9" />
          <ellipse cx="12" cy="12" rx="3.6" ry="9" />
          <line x1="3" y1="12" x2="21" y2="12" />
        </svg>
      );
    case "github":
      return <img src="/logos/github.svg" alt="GitHub" className="w-[18px] h-[18px]" />;
    default:
      return null;
  }
}

