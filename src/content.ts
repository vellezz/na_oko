import { UploadPanel } from './upload-panel';
import { OverlayManager } from './overlay-manager';
import '@/styles/pixel-perfect.scss';
import browser from 'webextension-polyfill';

class ContentScript {
  private overlayManager: OverlayManager;
  private uploadPanel: UploadPanel;

  constructor() {
    this.overlayManager = new OverlayManager();
    document.body.classList.add('pixel-perfect-ext');

    const theme = localStorage.getItem('naoko-theme') || 'dark';

    document.body.classList.add(`theme-${theme}`);
    //this.loadCss();
    this.uploadPanel = new UploadPanel(
      (imageSrc: string) => this.overlayManager.addOverlay(imageSrc),
      this.overlayManager
    );

    this.setupMessageListener();
  }

  private setupMessageListener(): void {
    browser.runtime.onMessage.addListener(async (message: any, _) => {
      if (message.type === 'add-overlay' && message.imageSrc) {
        this.overlayManager.addOverlay(message.imageSrc);
        return { result: 'ok' };
      }

      if (message.type === 'clear-overlays') {
        this.overlayManager.clearAll();
        return { result: 'ok' };
      }

      return { error: 'error' };
    });
  }
}

new ContentScript();
