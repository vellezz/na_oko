import browser from 'webextension-polyfill';

export function applyTheme(theme: 'light' | 'dark') {
  document.body.classList.remove('theme-light', 'theme-dark');
  document.body.classList.add(`theme-${theme}`);
  browser.storage.local.set({ theme });
}

export async function restoreTheme(): Promise<'light' | 'dark'> {
  const result = await browser.storage.local.get('theme');
  let theme = result.theme;
  if (theme !== 'light' && theme !== 'dark') {
    theme = 'light';
  }
  applyTheme(theme as 'light' | 'dark');
  return theme as 'light' | 'dark';
}
