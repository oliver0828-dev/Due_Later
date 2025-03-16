// background.js (Manifest V3 service worker)

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'CLOSE_CLASSROOM_TAB') {
    if (sender.tab && sender.tab.id) {
      chrome.tabs.remove(sender.tab.id);
      sendResponse({ success: true });
    } else {
      sendResponse({ success: false, error: 'No sender tab found.' });
    }
  }

  // Quit Chrome logic
  if (message.action === 'QUIT_CHROME') {
    chrome.windows.getAll({}, (windows) => {
      windows.forEach((win) => {
        chrome.windows.remove(win.id);
      });
    });
    sendResponse({ success: true });
  }
});
