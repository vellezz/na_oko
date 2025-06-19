import { OverlayState } from 'types';

export class OverlayPanel {
  private container: HTMLDivElement;
  private list: HTMLUListElement;

  constructor() {
    this.container = document.createElement('div');
    this.container.className = 'overlay-list-container';

    this.list = document.createElement('ul');
    this.list.className = 'overlay-list';
    this.container.appendChild(this.list);

    document.body.appendChild(this.container);
    window.__pixelPerfectUpdateList = (items: OverlayState[]) => this.update(items);
  }

  private update(items: OverlayState[]) {
    this.list.innerHTML = '';
    items.forEach((item) => {
      const li = document.createElement('li');
      li.textContent = `Overlay #${item.id + 1}`;
      li.title = 'Kliknij, by przenieść na wierzch';
      li.addEventListener('click', () => {
        document.querySelectorAll('.pixel-perfect-overlay').forEach((o) => {
          (o as HTMLElement).style.zIndex = '999999';
        });
        const target = document.querySelector(
          `.pixel-perfect-overlay[data-id='${item.id}']`
        ) as HTMLElement;
        if (target) target.style.zIndex = '100001';
      });
      //this.list.appendChild(li);
    });
  }
}
