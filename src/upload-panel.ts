import { OverlayManager } from './overlay-manager';
import { OverlayState, OverlayEvent } from './types';
import { applyTheme } from './utils/theme';
import { Theme } from './utils/theme.type';

export class UploadPanel {
  private container: HTMLDivElement;
  private panel!: HTMLDivElement;
  private showButton!: HTMLButtonElement;
  private fileInput!: HTMLInputElement;
  private pasteButton!: HTMLButtonElement;
  private clearButton!: HTMLButtonElement;
  private hideButton!: HTMLButtonElement;
  private toggleThemeButton!: HTMLButtonElement;
  private overlayList!: HTMLUListElement;

  constructor(
    private onImageLoaded: (src: string) => void,
    private overlayManager: OverlayManager
  ) {
    this.container = document.createElement('div');
    this.container.className = 'pixel-perfect-panel';

    this.loadTemplate().then(() => {
      document.body.appendChild(this.container);
      this.bindEvents();
      this.renderOverlayList();
    });
  }

  private async loadTemplate(): Promise<void> {
    const res = await fetch(chrome.runtime.getURL('templates/upload-panel.html'));
    const html = await res.text();
    const wrapper = document.createElement('div');
    wrapper.innerHTML = html.trim();
    const template = wrapper.querySelector('template')!;
    const clone = document.importNode(template.content, true);
    this.panel = clone.querySelector('.panel-inner')!;
    this.pasteButton = this.panel.querySelector('[data-action="paste"]')!;
    this.clearButton = this.panel.querySelector('[data-action="clear"]')!;
    this.fileInput = this.panel.querySelector('input[type="file"]')!;
    this.hideButton = this.panel.querySelector('[data-action="hide"]')!;
    this.hideButton.classList.remove('hidden');
    this.showButton = this.panel.querySelector('[data-action="show"]')!;
    this.toggleThemeButton = this.panel.querySelector('[data-action="toggle-theme"]')!;
    this.overlayList = clone.querySelector('.overlay-list')!;
    this.container.appendChild(clone);
  }

  private bindEvents(): void {
    this.toggleThemeButton.addEventListener('click', () => this.toggleTheme());
    this.hideButton.addEventListener('click', () => this.minimizePanel());
    this.showButton.addEventListener('click', () => this.showPanel());

    this.pasteButton.addEventListener('click', () => {
      navigator.clipboard
        .read()
        .then((items) => this.loadImageFromCLipboard(items))
        .catch(() => alert('Nie udało się wczytać obrazu ze schowka.'));
    });

    document.addEventListener('keydown', async (e) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'v') {
        e.preventDefault();
        navigator.clipboard
          .read()
          .then((items) => this.loadImageFromCLipboard(items))
          .catch(() => alert('Nie udało się wczytać obrazu ze schowka.'));
      }
    });

    this.fileInput.addEventListener('change', () => {
      const file = this.fileInput.files?.[0];
      if (file) this.readFile(file);
    });

    this.clearButton.addEventListener('click', () => {
      this.overlayManager.clearAll();
      this.renderOverlayList();
    });

    document.addEventListener(OverlayEvent.Added, () => this.renderOverlayList());
    document.addEventListener(OverlayEvent.Removed, () => this.renderOverlayList());
  }

  loadImageFromCLipboard(items: ClipboardItems): void {
    for (const item of items) {
      const type = item.types.find((t) => t.startsWith('image/'));
      if (type) {
        item
          .getType(type)
          .then((blob) => this.readFile(new File([blob], 'clipboard.png', { type })));
      }
    }
  }

  private toggleTheme(): any {
    const currentTheme = document.body.classList.contains('theme-dark') ? Theme.Dark : Theme.Light;
    const newTheme = currentTheme === Theme.Dark ? Theme.Light : Theme.Dark;
    applyTheme(newTheme);
  }

  private readFile(file: File): void {
    const reader = new FileReader();
    reader.onload = () => {
      const imageSrc = reader.result as string;
      this.onImageLoaded(imageSrc);
    };
    reader.readAsDataURL(file);
  }

  private minimizePanel(): void {
    this.panel.classList.add('collapsed');
    this.overlayList.classList.add('hidden');
    this.hideButton.classList.add('hidden');
    this.showButton.classList.remove('hidden');
  }

  private showPanel(): void {
    this.panel.classList.remove('collapsed');
    this.overlayList.classList.remove('hidden');
    this.hideButton.classList.remove('hidden');
    this.showButton.classList.add('hidden');
  }

  private renderOverlayList(): void {
    this.overlayList.innerHTML = '';
    const overlays: OverlayState[] = this.overlayManager.getStates();
    console.log('Rendering overlay list:', overlays);
    overlays.forEach((state) => {
      const li = document.createElement('li');
      li.textContent = `Overlay #${state.id + 1}`;

      const removeBtn = document.createElement('button');
      removeBtn.title = 'Usuń';
      removeBtn.addEventListener('click', () => {
        this.overlayManager.removeOverlay(state.id);
        this.renderOverlayList();
      });
      const icon =
        '<svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-trash"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 7l16 0" /><path d="M10 11l0 6" /><path d="M14 11l0 6" /><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" /><path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" /></svg>';
      removeBtn.innerHTML = icon;
      li.appendChild(removeBtn);
      this.overlayList.appendChild(li);
    });
    if (overlays.length === 0) {
      const emptyMessage = document.createElement('li');
      emptyMessage.textContent = 'Brak nałożonych obrazów.';
      this.overlayList.appendChild(emptyMessage);
      this.overlayList.classList.add('hidden');
    } else {
      this.overlayList.classList.remove('hidden');
    }
  }
}
