const Svg = ({ children, size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
)

export const GripIcon = () => (
  <Svg>
    <circle cx="9" cy="6" r="1" fill="currentColor" /><circle cx="15" cy="6" r="1" fill="currentColor" />
    <circle cx="9" cy="12" r="1" fill="currentColor" /><circle cx="15" cy="12" r="1" fill="currentColor" />
    <circle cx="9" cy="18" r="1" fill="currentColor" /><circle cx="15" cy="18" r="1" fill="currentColor" />
  </Svg>
)
export const PlusIcon = () => <Svg><path d="M12 5v14M5 12h14" /></Svg>
export const TrashIcon = () => (
  <Svg><path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3" /></Svg>
)
export const ShareIcon = () => (
  <Svg><path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7M16 6l-4-4-4 4M12 2v14" /></Svg>
)
export const BedIcon = () => (
  <Svg size={18}><path d="M3 18V6M3 14h18v4M21 14v-2a3 3 0 0 0-3-3h-7v5" /><circle cx="7" cy="11" r="2" /></Svg>
)
export const UndoIcon = () => <Svg size={16}><path d="M9 14 4 9l5-5" /><path d="M4 9h10a6 6 0 0 1 0 12h-3" /></Svg>
export const BagIcon = () => (
  <Svg><rect x="4" y="7" width="16" height="13" rx="2" /><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M4 12h16" /></Svg>
)
export const MapPinIcon = () => (
  <Svg><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></Svg>
)
export const CloseIcon =() => <Svg><path d="M6 6l12 12M18 6 6 18" /></Svg>
export const FoodIcon = () => (
  <Svg><path d="M4 3v7a3 3 0 0 0 3 3v8M10 3v7a3 3 0 0 1-3 3M7 3v5M17 21V3c-2 1.5-3 4-3 7v4h3" /></Svg>
)
export const ChevronIcon = () => <Svg size={16}><path d="m9 6 6 6-6 6" /></Svg>
export const BackIcon = () => <Svg size={16}><path d="m15 6-6 6 6 6" /></Svg>
