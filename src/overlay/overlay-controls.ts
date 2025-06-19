import { loadTemplateFromUrl } from '../utils/load-template';

export class OverlayControls {
  public readonly element: HTMLElement;

  public onOpacityChange: (value: number) => void = () => {};
  public onScaleChange: (value: number) => void = () => {};
  public onReset: () => void = () => {};
  public onRemove: () => void = () => {};

  private opacityInput!: HTMLInputElement;
  private scaleInput!: HTMLInputElement;
  private resetButton!: HTMLButtonElement;
  private removeButton!: HTMLButtonElement;

  constructor(initialOpacity: number, initialScale: number) {
    this.element = document.createElement('div');
    this.element.className = 'overlay-controls';

    this.loadTemplate().then(() => {
      this.bindElements();
      this.setInitialValues(initialOpacity, initialScale);
      this.attachEventListeners();
    });
  }

  private async loadTemplate(): Promise<void> {
    const template = await loadTemplateFromUrl('templates/overlay-controls-template.html');
    const content = template.content.cloneNode(true) as DocumentFragment;
    this.element.appendChild(content);
  }

  private bindElements(): void {
    this.opacityInput = this.element.querySelector<HTMLInputElement>('input[name="opacity"]')!;
    this.scaleInput = this.element.querySelector<HTMLInputElement>('input[name="scale"]')!;
    this.resetButton = this.element.querySelector<HTMLButtonElement>(
      'button[data-action="reset"]'
    )!;
    this.removeButton = this.element.querySelector<HTMLButtonElement>(
      'button[data-action="remove"]'
    )!;
  }

  private setInitialValues(opacity: number, scale: number): void {
    if (this.opacityInput) this.opacityInput.value = opacity.toString();
    if (this.scaleInput) this.scaleInput.value = scale.toString();
  }

  private attachEventListeners(): void {
    this.opacityInput.addEventListener('input', () => {
      const value = parseFloat(this.opacityInput.value);
      this.onOpacityChange(value);
    });

    this.scaleInput.addEventListener('input', () => {
      const value = parseFloat(this.scaleInput.value);
      this.onScaleChange(value);
    });

    this.resetButton.addEventListener('click', () => {
      this.onReset();
    });

    this.removeButton.addEventListener('click', () => {
      this.onRemove();
    });
  }

  public reset(): void {
    this.opacityInput.dispatchEvent(new Event('input'));
    this.scaleInput.dispatchEvent(new Event('input'));
  }
}
