export const getCurrentTab = async (): Promise<chrome.tabs.Tab> => {
   let tabs = await chrome.tabs.query({ currentWindow: true, active: true });
   return tabs[0];
};

export const getCurrentUrl = async (): Promise<string> => {
   let t = await getCurrentTab();
   return t.url!;
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
