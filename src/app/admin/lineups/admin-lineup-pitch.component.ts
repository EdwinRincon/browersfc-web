import { ChangeDetectionStrategy, Component, inject, signal, computed, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlayerService } from '../../services/player/player.service';
import { MatchService } from '../../services/match/match.service';

import { PlayerShort, PlayerResponse } from '../../core/interfaces/player.interface';
import { MatchResponse } from '../../core/interfaces/match.interface';
import { ApiSuccessResponse, PaginatedResponse } from '../../core/interfaces';
import { FORMATION_POSITIONS, POSITION_DISPLAY_NAMES, SevenASideFormation, PlayerSlot } from './pitch-config';

@Component({
  selector: 'admin-lineup-pitch',
  standalone: true,
  templateUrl: './admin-lineup-pitch.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule]
})
export class AdminLineupPitchComponent {

  private readonly playerService = inject(PlayerService);
  private readonly matchService = inject(MatchService);
  private readonly cdr = inject(ChangeDetectorRef);

  @Output() saveLineup = new EventEmitter<{
    matchId: number;
    formation: SevenASideFormation;
    lineup: Array<{ position: string; player_id: number; match_id: number; starting: boolean }>;
  }>();

  // --- State ---
  protected readonly substitutes = signal<Array<{ playerId?: number; playerName?: string }>>(Array(7).fill({}));
  protected readonly showPlayerModal = signal<{ open: boolean; slotId: number | null }>({ open: false, slotId: null });
  protected readonly players = signal<PlayerShort[]>([]);
  protected readonly formation = signal<SevenASideFormation>('3-2-1');
  protected readonly playerSlots = signal<PlayerSlot[]>(FORMATION_POSITIONS['3-2-1']);
  protected readonly lineupState = signal<Array<{ position: string; playerName: string; playerId: number; slotId: number }>>([]);
  protected readonly matchOptions = signal<MatchResponse[]>([]);
  protected readonly selectedMatchId = signal<number | null>(null);

  // --- Computed values ---
  protected readonly availableFormations = computed(
    () => Object.keys(FORMATION_POSITIONS) as SevenASideFormation[]
  );

  protected readonly selectedPlayersCount = computed(
    () => this.playerSlots().filter(slot => !!slot.playerId).length
  );

  protected readonly canSaveLineup = computed(
    () => this.selectedPlayersCount() === 7 && !!this.selectedMatchId()
  );

  constructor() {
    this.loadPlayers();
    this.loadMatches();
  }

private loadPlayers(): void {
  this.playerService.getPlayers({ page: 0, pageSize: 30 }).subscribe({
    next: (resp) => {
      const items = (resp as any).data?.items ?? resp.items ?? [];
      const shorts = items.map((player: PlayerResponse) => ({
        id: player.id,
        nick_name: player.nick_name,
        position: player.position
      }));
      this.players.set(shorts);
      this.cdr.detectChanges();
    },
    error: () => {
      this.players.set([]);
      this.cdr.detectChanges();
    }
  });
}


  private loadMatches(): void {
    this.matchService.getMatches({ page: 0, pageSize: 20, sort: 'kickoff', order: 'desc' }).subscribe({
      next: (resp) => {
        const items = (resp as any).data?.items ?? resp.items ?? [];
        this.matchOptions.set(
          items.filter((m: MatchResponse) => ['scheduled', 'in_progress'].includes(m.status))
        );
      },
      error: () => this.matchOptions.set([])
    });
  }

  // --- TrackBy functions ---
  protected trackByFormation(_: number, form: SevenASideFormation): string {
    return form;
  }

  protected trackByMatchId(_: number, match: MatchResponse): number {
    return match.id;
  }

  // --- Slot Handlers ---
  protected setFormation(formation: SevenASideFormation): void {
    this.formation.set(formation);
    this.playerSlots.set(FORMATION_POSITIONS[formation]);
    this.lineupState.set([]);
  }

  protected onSlotClick(slotId: number): void {
    this.openPlayerModal(slotId);
  }

  protected removePitchPlayer(slotId: number): void {
    this.playerSlots.set(
      this.playerSlots().map(slot =>
        slot.id === slotId ? { ...slot, playerId: undefined, playerName: undefined } : slot
      )
    );
    this.lineupState.set(this.lineupState().filter(s => s.slotId !== slotId));
  }

  private updateSlot(slotId: number, player: PlayerShort): void {
    const updatedSlots = this.playerSlots().map(slot =>
      slot.id === slotId ? { ...slot, playerId: player.id, playerName: player.nick_name } : slot
    );
    this.playerSlots.set(updatedSlots);
    this.updateLineupState(updatedSlots, slotId);
  }

  protected onMatchChange(matchId: string): void {
  this.selectedMatchId.set(Number(matchId));
}

  protected onSubSlotClick(subIdx: number): void {
    this.openPlayerModal(-(subIdx + 1));
  }

  protected removeSubPlayer(subIdx: number): void {
    const updatedSubs = [...this.substitutes()];
    updatedSubs[subIdx] = {};
    this.substitutes.set(updatedSubs);
  }

  // --- Player selection ---
  protected onPlayerSelected(player: PlayerShort): void {
    const slotId = this.showPlayerModal().slotId;
    if (!slotId || this.isPlayerAlreadySelectedAnywhere(player.id)) return;

    if (slotId < 0) {
      this.assignSubPlayer(-slotId - 1, player);
    } else {
      this.updateSlot(slotId, player);
    }
    this.closePlayerModal();
  }

  private assignSubPlayer(subIdx: number, player: PlayerShort): void {
    const updatedSubs = [...this.substitutes()];
    updatedSubs[subIdx] = { playerId: player.id, playerName: player.nick_name };
    this.substitutes.set(updatedSubs);
  }

  private updateLineupState(slots: PlayerSlot[], slotId: number): void {
    const slot = slots.find(s => s.id === slotId);
    if (!slot?.playerId || !slot.playerName) return;

    this.lineupState.set([
      ...this.lineupState().filter(s => s.slotId !== slotId),
      { position: slot.positionType, playerName: slot.playerName, playerId: slot.playerId, slotId }
    ]);
  }

  // --- Save ---
  protected onSaveLineup(): void {
    if (!this.canSaveLineup()) return;

    const matchId = this.selectedMatchId()!;

    // Starters: from lineupState, map to backend DTO
    const starters = this.lineupState().map(s => ({
      position: s.position,
      player_id: s.playerId,
      match_id: matchId,
      starting: true
    }));

    // Subs: from substitutes, map to backend DTO
    const subs = this.substitutes()
      .map((sub) => {
        if (!sub.playerId) return null;
        const player = this.players().find(p => p.id === sub.playerId);
        return player ? {
          position: player.position,
          player_id: sub.playerId,
          match_id: matchId,
          starting: false
        } : null;
      })
      .filter(Boolean) as Array<{ position: string; player_id: number; match_id: number; starting: boolean }>;

    this.saveLineup.emit({
      matchId,
      formation: this.formation(),
      lineup: [...starters, ...subs]
    });
  }

  // --- Modal helpers ---
  protected openPlayerModal(slotId: number): void {
    this.showPlayerModal.set({ open: true, slotId });
  }

  protected closePlayerModal(): void {
    this.showPlayerModal.set({ open: false, slotId: null });
  }

  // --- Utilities ---
  protected isPlayerAlreadySelectedAnywhere(playerId: number): boolean {
    return this.playerSlots().some(slot => slot.playerId === playerId) ||
           this.substitutes().some(sub => sub.playerId === playerId);
  }

  protected getSlotAriaLabel(slot: PlayerSlot, index: number): string {
    const positionName = POSITION_DISPLAY_NAMES[slot.positionType] ?? slot.positionType;
    return slot.playerName
      ? `Change ${positionName} position ${index + 1}: ${slot.playerName}`
      : `Select player for ${positionName} position ${index + 1}`;
  }

  protected getPlayerInitials(playerName: string): string {
    return playerName.split(' ').map(word => word[0]).join('').toUpperCase();
  }
}
