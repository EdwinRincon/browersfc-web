// pitch-config.ts

// Formation types
export type SevenASideFormation = '3-2-1' | '2-3-1';

// Pitch position used for % coordinates
export interface PitchPosition {
  x: number; // Percentage from left
  y: number; // Percentage from top
}

// Data structure for each slot/position on the pitch
export interface PlayerSlot {
  id: number;
  position: PitchPosition;
  playerId?: number;
  playerName?: string;
  positionType: string;
}

// Accessibility/language-friendly display names
export const POSITION_DISPLAY_NAMES: Record<string, string> = {
  por: 'Portero',
  ceni: 'Defensa Central Izquierdo',
  cenm: 'Defensa Central Medio',
  cend: 'Defensa Central Derecho',
  med: 'Medio Centro',
  lati: 'Lateral Izquierdo',
  latd: 'Lateral Derecho',
  del: 'Delantero',
};

// Predefined 7-a-side formations with responsive % coordinates
export const FORMATION_POSITIONS: Record<SevenASideFormation, PlayerSlot[]> = {
  '3-2-1': [
    { id: 1, position: { x: 50, y: 85 }, positionType: 'por' },
    { id: 2, position: { x: 25, y: 65 }, positionType: 'ceni' },
    { id: 3, position: { x: 50, y: 65 }, positionType: 'cenm' },
    { id: 4, position: { x: 75, y: 65 }, positionType: 'cend' },
    { id: 5, position: { x: 35, y: 45 }, positionType: 'lati' },
    { id: 6, position: { x: 65, y: 45 }, positionType: 'latd' },
    { id: 7, position: { x: 50, y: 25 }, positionType: 'del' }
  ],
  '2-3-1': [
    { id: 1, position: { x: 50, y: 85 }, positionType: 'por' },
    { id: 2, position: { x: 30, y: 65 }, positionType: 'ceni' },
    { id: 3, position: { x: 70, y: 65 }, positionType: 'cend' },
    { id: 4, position: { x: 20, y: 45 }, positionType: 'lati' },
    { id: 5, position: { x: 50, y: 45 }, positionType: 'med' },
    { id: 6, position: { x: 80, y: 45 }, positionType: 'latd' },
    { id: 7, position: { x: 50, y: 25 }, positionType: 'del' }
  ]
};
