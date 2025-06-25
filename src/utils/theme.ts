import browser from 'webextension-polyfill';
import { Theme } from './theme.type';

export function applyTheme(theme: Theme) {
  const currentTheme = document.body.classList.contains('theme-dark')
    ? Theme.Dark
    : document.body.classList.contains('theme-light')
      ? Theme.Light
      : null;

  if (currentTheme === theme) return;

  document.body.classList.remove('theme-light', 'theme-dark');
  document.body.classList.add(`theme-${theme}`);
  browser.storage.local.set({ theme });
}

export async function restoreTheme(): Promise<Theme> {
  const result = await browser.storage.local.get('theme');
  let theme: Theme = result.theme === Theme.Dark ? Theme.Dark : Theme.Light;
  applyTheme(theme);
  return theme;
}
