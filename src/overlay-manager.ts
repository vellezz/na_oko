import { Overlay } from './overlay';
import { OverlayState } from './types';
import browser from 'webextension-polyfill';

export class OverlayManager {
  private overlays = new Map<number, Overlay>();
  private currentId = 0;

  constructor() {
    this.restoreOverlays();

    document.addEventListener('overlay:removed', (e: Event) => {
      const custom = e as CustomEvent<number>;
      this.removeOverlay(custom.detail);
    });
  }

  addOverlay(imageSrc: string, savedState?: Partial<OverlayState>): void {
    const id = this.currentId++;
    const overlay = new Overlay(id, imageSrc, savedState);
    this.overlays.set(id, overlay);
    this.saveStates();

    document.dispatchEvent(new Event('overlay:added'));
  }

  removeOverlay(id: number): void {
    const overlay = this.overlays.get(id);
    if (overlay) {
      overlay.remove();
      this.overlays.delete(id);
      this.saveStates();
      document.dispatchEvent(new Event('overlay:removed'));
    }
  }

  clearAll(): void {
    this.overlays.forEach((overlay) => overlay.remove());
    this.overlays.clear();
    this.saveStates();
    document.dispatchEvent(new Event('overlay:removed'));
  }

  getStates(): OverlayState[] {
    return Array.from(this.overlays.values()).map((o) => o.getState());
  }

  private async restoreOverlays(): Promise<void> {
    const result = await browser.storage.local.get('overlays');
    const saved: OverlayState[] = Array.isArray(result.overlays) ? result.overlays : [];
    saved.forEach((state) => this.addOverlay(state.image, state));
  }

  private async saveStates(): Promise<void> {
    const states = this.getStates();
    await browser.storage.local.set({ overlays: states });
  }
}
