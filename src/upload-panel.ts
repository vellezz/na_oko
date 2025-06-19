import { OverlayManager } from './overlay-manager';
import { OverlayState } from './types';
import { applyTheme } from './utils/theme';

export class UploadPanel {
  private container: HTMLDivElement;
  private panel!: HTMLDivElement;
  private showButton!: HTMLButtonElement;
  private fileInput!: HTMLInputElement;
  private pasteButton!: HTMLButtonElement;
  private clearButton!: HTMLButtonElement;
  // private overlayList!: HTMLUListElement;
  private hideButton!: HTMLButtonElement;
  private toggleThemeButton!: HTMLButtonElement;

  constructor(
    private onImageLoaded: (src: string) => void,
    private overlayManager: OverlayManager
  ) {
    this.container = document.createElement('div');
    this.container.className = 'pixel-perfect-panel';

    this.loadTemplate().then(() => {
      this.showButton = this.createShowButton();
      this.container.appendChild(this.showButton);
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
    //this.overlayList = this.panel.querySelector('.overlay-list')!;
    this.hideButton = this.panel.querySelector('[data-action="hide"]')!;
    this.toggleThemeButton = this.panel.querySelector('[data-action="toggle-theme"]')!;

    this.container.appendChild(this.panel);

    // this.loadIcon(this.pasteButton, 'clipboard.svg', 'Wklej obraz');
    // this.loadIcon(this.clearButton, 'upload.svg', 'Usuń wszystkie');
    // this.loadIcon(this.hideButton, 'eye-off.svg', 'Ukryj panel');
  }

  private createShowButton(): HTMLButtonElement {
    const btn = document.createElement('button');
    btn.id = 'showPanel';
    btn.classList.add('hidden');

    //this.loadIcon(btn, 'layout.svg', '');
    return btn;
  }

  private loadIcon1(button: HTMLButtonElement, iconFile: string, label: string) {
    fetch(chrome.runtime.getURL(`icons/${iconFile}`))
      .then((res) => res.text())
      .then((svg) => {
        button.innerHTML = `${svg} <span style="margin-left:6px">${label}</span>`;
      });
  }

  private bindEvents(): void {
    this.toggleThemeButton.addEventListener('click', () => this.toggleTheme());
    this.hideButton.addEventListener('click', () => this.minimizePanel());
    this.showButton.addEventListener('click', () => this.showPanel());

    this.pasteButton.addEventListener('click', () => {
      navigator.clipboard
        .read()
        .then((items) => {
          for (const item of items) {
            const type = item.types.find((t) => t.startsWith('image/'));
            if (type) {
              item
                .getType(type)
                .then((blob) => this.readFile(new File([blob], 'clipboard.png', { type })));
            }
          }
        })
        .catch(() => alert('Nie udało się wczytać obrazu ze schowka.'));
    });

    this.fileInput.addEventListener('change', () => {
      const file = this.fileInput.files?.[0];
      if (file) this.readFile(file);
    });

    this.clearButton.addEventListener('click', () => {
      this.overlayManager.clearAll();
      this.renderOverlayList();
    });

    document.addEventListener('overlay:added', () => this.renderOverlayList());
    document.addEventListener('overlay:removed', () => this.renderOverlayList());
  }

  private toggleTheme(): any {
    const currentTheme = document.body.classList.contains('theme-dark') ? 'dark' : 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
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
    this.panel.style.display = 'none';
    this.showButton.classList.remove('hidden');
  }

  private showPanel(): void {
    this.panel.style.display = 'flex';
    this.showButton.classList.add('hidden');
  }

  private renderOverlayList(): void {
    //this.overlayList.innerHTML = '';
    const overlays: OverlayState[] = this.overlayManager.getStates();

    overlays.forEach((state) => {
      const li = document.createElement('li');
      li.textContent = `Overlay #${state.id + 1}`;

      const removeBtn = document.createElement('button');
      removeBtn.textContent = 'Usuń';
      removeBtn.addEventListener('click', () => {
        this.overlayManager.removeOverlay(state.id);
        this.renderOverlayList();
      });

      li.appendChild(removeBtn);
      //  this.overlayList.appendChild(li);
    });
  }
}
