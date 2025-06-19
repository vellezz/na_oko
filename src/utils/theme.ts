export function applyTheme(theme: 'light' | 'dark') {
  const currentTheme = document.body.classList.contains('theme-dark') ? 'dark' : 'light';
  const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.body.classList.remove(`theme-${currentTheme}`);
  document.body.classList.add(`theme-${nextTheme}`);
  chrome.storage.local.set({ theme });
}

export async function restoreTheme(): Promise<'light' | 'dark'> {
  const result = await chrome.storage.local.get('theme');
  const theme = result.theme ?? 'light';
  applyTheme(theme);
  return theme;
}
