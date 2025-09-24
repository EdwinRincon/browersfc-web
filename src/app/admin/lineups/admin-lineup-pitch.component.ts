import { ChangeDetectionStrategy, Component, signal, computed } from '@angular/core';

export type SevenASideFormation = '3-2-1' | '2-3-1';

export interface PitchPosition {
  x: number; // Percentage from left
  y: number; // Percentage from top
}

export interface PlayerSlot {
  id: number;
  position: PitchPosition;
  playerName?: string;
  positionType: string;
}

// Position display names for accessibility
const POSITION_DISPLAY_NAMES: Record<string, string> = {
  'por': 'Portero',
  'ceni': 'Defensa Central Izquierdo',
  'cend': 'Defensa Central Derecho', 
  'med': 'Medio Centro',
  'lati': 'Lateral Izquierdo',
  'latd': 'Lateral Derecho',
  'del': 'Delantero',
};

// Percentage-based positions for true responsiveness
const FORMATION_POSITIONS: Record<SevenASideFormation, PlayerSlot[]> = {
  '3-2-1': [
    { id: 1, position: { x: 50, y: 85 }, positionType: 'por' },
    { id: 2, position: { x: 25, y: 65 }, positionType: 'ceni' },
    { id: 3, position: { x: 50, y: 65 }, positionType: 'med' },
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
  ],
};

@Component({
  selector: 'admin-lineup-pitch',
  standalone: true,
  templateUrl: './admin-lineup-pitch.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminLineupPitchComponent {
  protected readonly formation = signal<SevenASideFormation>('3-2-1');
  protected readonly playerSlots = signal<PlayerSlot[]>(FORMATION_POSITIONS['3-2-1']);

  // Computed values
  protected readonly availableFormations = computed(() => 
    Object.keys(FORMATION_POSITIONS) as SevenASideFormation[]
  );

  protected readonly selectedPlayersCount = computed(() => 
    this.playerSlots().filter(slot => slot.playerName).length
  );

  setFormation(formation: SevenASideFormation) {
    this.formation.set(formation);
    this.playerSlots.set(FORMATION_POSITIONS[formation]);
  }

  onSlotClick(slotId: number) {
    console.log('Slot clicked:', slotId);
    
    // Temporary: Add placeholder player name
    const updatedSlots = this.playerSlots().map(slot => 
      slot.id === slotId && !slot.playerName 
        ? { ...slot, playerName: `Player ${slot.id}` }
        : slot
    );
    this.playerSlots.set(updatedSlots);
  }

  protected getSlotAriaLabel(slot: PlayerSlot, index: number): string {
    const positionName = POSITION_DISPLAY_NAMES[slot.positionType] || slot.positionType;
    
    if (slot.playerName) {
      return `Change ${positionName} position ${index + 1}: ${slot.playerName}`;
    }
    return `Select player for ${positionName} position ${index + 1}`;
  }

  protected getPlayerInitials(playerName: string): string {
    return playerName.split(' ').map(word => word[0]).join('').toUpperCase();
  }
}