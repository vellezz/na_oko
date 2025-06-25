export {};

declare global {
  interface Window {
    __pixelPerfectUpdateList?: (items: OverlayState[]) => void;
  }
}

export interface OverlayState {
  id: number;
  x: number;
  y: number;
  scale: number;
  opacity: number;
  image: string;
  isNegative: boolean;
}

export enum OverlayEvent {
  Added = 'overlay:added',
  Removed = 'overlay:removed',
}

export enum MessageType {
  AddOverlay = 'add-overlay',
  ClearOverlays = 'clear-overlays',
}
