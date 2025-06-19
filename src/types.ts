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
  image: string; // base64 lub data URL
}
