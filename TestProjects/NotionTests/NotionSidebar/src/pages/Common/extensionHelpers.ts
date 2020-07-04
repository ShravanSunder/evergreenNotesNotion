import 'chrome-extension-async';

export const getCurrentTab = async () => {
   let tabs = await chrome.tabs.query({ currentWindow: true, active: true });
   return tabs[0];
};

export const emptyResponse = (sendResponse: (response: any) => void) => {
   sendResponse({});
   return true;
};

export const toGuid = (guid: string): string => {
   let str = guid.trim();
   return (
      str.slice(0, 8) +
      '-' +
      str.slice(8, 12) +
      '-' +
      str.slice(12, 16) +
      '-' +
      str.slice(16, 20) +
      '-' +
      str.slice(20, str.length + 1)
   );
};
