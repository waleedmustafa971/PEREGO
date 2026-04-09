export const CATEGORIES = [
  { key: 'gift', label: 'Gift', emoji: '🎁' },
  { key: 'documents', label: 'Docs', emoji: '📄' },
  { key: 'clothing', label: 'Clothes', emoji: '👕' },
  { key: 'electronics', label: 'Electronics', emoji: '📱' },
  { key: 'food', label: 'Food', emoji: '🍪' },
  { key: 'other', label: 'Other', emoji: '📦' },
] as const;

export const PLATFORM_FEE_PERCENT = 0.12;

export const PROHIBITED_ITEMS = [
  'Weapons & ammunition',
  'Illegal drugs & controlled substances',
  'Flammable & hazardous materials',
  'Live animals',
  'Alcohol (to prohibited countries)',
  'Prescription medications (without docs)',
  'Counterfeit goods',
  'Currency above local thresholds',
];

export const POPULAR_ROUTES = [
  { from: 'DXB', to: 'CAI', count: 24 },
  { from: 'DXB', to: 'KRT', count: 8 },
  { from: 'AUH', to: 'AMM', count: 12 },
  { from: 'DXB', to: 'IST', count: 18 },
];

export const STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  matched: 'Matched',
  picked_up: 'Picked Up',
  in_transit: 'In Transit',
  arrived: 'Arrived',
  delivered: 'Delivered',
  disputed: 'Disputed',
  cancelled: 'Cancelled',
};
