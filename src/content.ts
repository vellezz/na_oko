import { UploadPanel } from './upload-panel';
import { OverlayManager } from './overlay-manager';
import '@/styles/pixel-perfect.scss';

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
    chrome.runtime.onMessage.addListener((message, _, sendResponse) => {
      if (message.type === 'add-overlay' && message.imageSrc) {
        this.overlayManager.addOverlay(message.imageSrc);
        sendResponse?.({ success: true });
      }

      if (message.type === 'clear-overlays') {
        this.overlayManager.clearAll();
        sendResponse?.({ success: true });
      }

      return true;
    });
  }
}

new ContentScript();
