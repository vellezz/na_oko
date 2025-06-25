import { UploadPanel } from './upload-panel';
import { OverlayManager } from './overlay-manager';
import '@/styles/pixel-perfect.scss';
import browser from 'webextension-polyfill';
import { Theme } from './utils/theme.type';
import { MessageType } from './types';

interface Message {
  type: MessageType;
  imageSrc?: string;
}

class ContentScript {
  private overlayManager: OverlayManager;
  private uploadPanel: UploadPanel;

  constructor() {
    this.overlayManager = new OverlayManager();
    document.body.classList.add('pixel-perfect-ext');

    this.initTheme();

    this.uploadPanel = new UploadPanel(
      (imageSrc: string) => this.overlayManager.addOverlay(imageSrc),
      this.overlayManager
    );

    this.setupMessageListener();
  }

  private async initTheme() {
    const { theme } = await browser.storage.local.get('theme');
    this.setTheme(theme === Theme.Dark || theme === Theme.Light ? theme : Theme.Dark);
  }

  private setTheme(theme: Theme) {
    document.body.classList.remove('theme-light', 'theme-dark');
    document.body.classList.add(`theme-${theme}`);
  }

  private setupMessageListener(): void {
    browser.runtime.onMessage.addListener(async (message: any, _) => {
      const msg = message as Message;

      if (typeof message !== 'object' && message === null) return;

      if (msg.type === MessageType.AddOverlay && msg.imageSrc) {
        this.overlayManager.addOverlay(msg.imageSrc);
        return { result: 'ok' };
      }

      if (msg.type === MessageType.ClearOverlays) {
        this.overlayManager.clearAll();
        return { result: 'ok' };
      }

      return { error: 'error' };
    });
  }
}

new ContentScript();
