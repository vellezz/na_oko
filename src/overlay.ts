import { OverlayView } from './overlay/overlay-view';
import { OverlayState } from './types';

export class Overlay {
  public readonly id: number;
  private state: OverlayState;
  private view: OverlayView;

  constructor(id: number, imageSrc: string, savedState: Partial<OverlayState> = {}) {
    this.id = id;
    this.state = {
      id,
      x: savedState.x ?? 100,
      y: savedState.y ?? 100,
      scale: savedState.scale ?? 1,
      opacity: savedState.opacity ?? 0.5,
      image: imageSrc,
      isNegative: savedState.isNegative ?? false,
    };

    this.view = new OverlayView(this.id, this.state);
    this.bindEvents();
    this.view.appendTo(document.body);

    this.observePosition();
  }

  private bindEvents(): void {
    this.view.onOpacityChange = (value) => {
      this.state.opacity = value;
    };

    this.view.onScaleChange = (value) => {
      this.state.scale = value;
    };

    this.view.onPositionChange = (x, y) => {
      this.state.x = x;
      this.state.y = y;
      this.updateControlPosition();
    };

    this.view.onReset = () => {
      this.reset();
    };

    this.view.onRemove = () => {
      this.remove();
      document.dispatchEvent(new CustomEvent('overlay:removed', { detail: this.id }));
    };

    this.view.onNegative = () => {
      this.state.isNegative = !this.state.isNegative;
      this.view.negative(this.state.isNegative);
    };
  }

  private reset(): void {
    this.state = { ...this.state, x: 100, y: 100, opacity: 0.5, scale: 1 };
    this.view.update(this.state);
    this.updateControlPosition();
  }

  private updateControlPosition(): void {
    const el = this.view.container;
    const rect = el.getBoundingClientRect();
    const viewportWidth = window.innerWidth;

    if (rect.right > viewportWidth - 160) {
      el.classList.add('controls-left');
    } else {
      el.classList.remove('controls-left');
    }
  }

  observePosition() {
    const reposition = () => this.updateControlPosition();
    const observer = new ResizeObserver(reposition);

    if (!(this.view.container instanceof HTMLElement)) {
      throw new Error('view.container is not an HTMLElement!');
    }

    observer.observe(this.view.container);
    window.addEventListener('resize', reposition);
    window.addEventListener('scroll', reposition);
  }

  public getState(): OverlayState {
    return this.state;
  }

  public remove(): void {
    this.view.remove();
  }
}
