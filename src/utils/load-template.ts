export async function loadTemplateFromUrl(url: string): Promise<HTMLTemplateElement> {
  const res = await fetch(chrome.runtime.getURL(url));
  const html = await res.text();
  const container = document.createElement('div');
  container.innerHTML = html.trim();

  const template = container.querySelector('template');
  if (!template) {
    throw new Error(`Brak <template> w pliku: ${url}`);
  }

  return template;
}
