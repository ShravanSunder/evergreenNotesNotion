import 'chrome-extension-async';

export const getCurrentTab = async () => {
   let tabs = await chrome.tabs.query({ currentWindow: true, active: true });
   return tabs[0];
};

export const emptyResponse = (sendResponse: (response: any) => void) => {
   sendResponse({});
   return true;
};
