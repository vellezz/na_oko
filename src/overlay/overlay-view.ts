import { OverlayState } from 'types';
import { OverlayControls } from './overlay-controls';
import { OverlayDraggable } from './overlay-draggable';
import { loadTemplateFromUrl } from '../utils/load-template';

export class OverlayView {
  public element: HTMLDivElement;
  public image: HTMLImageElement;
  public readonly controls: OverlayControls;

  public onOpacityChange = (v: number) => {};
  public onScaleChange = (v: number) => {};
  public onPositionChange = (x: number, y: number) => {};
  public onReset = () => {};
  public onRemove = () => {};

  constructor(id: number, state: OverlayState) {
    this.element = document.createElement('div');
    this.image = document.createElement('img');
    this.controls = new OverlayControls(state.opacity, state.scale);

    this.loadTemplate().then(() => {
      this.setup(id, state);
    });
  }

  get container(): HTMLElement {
    return this.element;
  }

  private async loadTemplate() {
    const tpl = await loadTemplateFromUrl('templates/overlay-view.html');
    const root = tpl.content.firstElementChild!.cloneNode(true) as HTMLDivElement;
    this.element.replaceWith(root);
    this.element = root;
  }

  private setup(id: number, state: OverlayState): void {
    // this.element.classList.add('pixel-perfect-overlay');
    this.element.dataset.id = id.toString();
    this.element.style.left = `${state.x}px`;
    this.element.style.top = `${state.y}px`;

    const wrapper = this.element.querySelector('.wrapper')!;
    this.image = wrapper.querySelector('.overlay-image')!;
    this.image.src = state.image;
    this.image.draggable = false;
    this.image.style.opacity = state.opacity.toString();
    this.image.style.transform = `scale(${state.scale})`;

    wrapper.appendChild(this.controls.element);

    this.controls.onOpacityChange = (v) => {
      this.image.style.opacity = v.toString();
      this.onOpacityChange(v);
    };
    this.controls.onScaleChange = (v) => {
      this.image.style.transform = `scale(${v})`;
      this.onScaleChange(v);
    };
    this.controls.onReset = () => this.onReset();
    this.controls.onRemove = () => this.onRemove();

    new OverlayDraggable(this.element, (x, y) => this.onPositionChange(x, y));
  }

  public appendTo(parent: HTMLElement): void {
    parent.appendChild(this.element);
  }

  public update(state: OverlayState): void {
    this.element.style.left = `${state.x}px`;
    this.element.style.top = `${state.y}px`;
    this.image.style.opacity = state.opacity.toString();
    this.image.style.transform = `scale(${state.scale})`;
    this.controls.reset();
  }

  public remove(): void {
    this.element.remove();
  }
}
