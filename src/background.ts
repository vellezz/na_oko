chrome.runtime.onInstalled.addListener(() => {
  console.log('Na Oko zainstalowane.');
});

// Możliwość przyszłej rozbudowy:
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'ping') {
    sendResponse({ message: 'pong from background' });
  }
});
