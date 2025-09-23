import { Injectable, inject } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';

@Injectable({
  providedIn: 'root'
})
export class UpdateService {
  private readonly swUpdate = inject(SwUpdate, { optional: true });

  constructor() {
    if (!this.swUpdate?.isEnabled) {
      // Service worker updates are disabled (dev mode or SW not available)
      // No-op
      return;
    }

    // Listen for version update lifecycle events
    this.swUpdate.versionUpdates.subscribe((evt) => {
      // Version events include: VERSION_DETECTED, VERSION_READY, VERSION_INSTALLATION_FAILED
      // When a new version is ready, activate it and reload the page so the user runs the latest build
      if ((evt as any).type === 'VERSION_READY') {
        // Activate the update then reload to ensure the new version is used
        if (this.swUpdate) {
          this.swUpdate.activateUpdate().then(() => {
            // Force a full reload
            document.location.reload();
          }).catch(err => {
            console.error('Failed to activate update', err);
          });
        }
      }
    });

  }

  /**
   * Call this method after service instantiation to check for updates.
   */
  initialize(): void {
    this.checkForUpdate().catch(err => console.error('Update check failed', err));
  }

  async checkForUpdate(): Promise<void> {
    try {
      if (this.swUpdate?.isEnabled) {
        await this.swUpdate.checkForUpdate();
      }
    } catch (err) {
      console.error('Error while checking for updates', err);
    }
  }
}
