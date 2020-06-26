chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
  if (request.__hmrReload__) {
    chrome.runtime.reload();
    sendResponse();
  }
});
