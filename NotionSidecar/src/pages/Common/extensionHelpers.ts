export const activeTab = async (): Promise<chrome.tabs.Tab> => {
   let tabs = await chrome.tabs.query({ currentWindow: true, active: true });
   return tabs[0];
};

export const getCurrentUrl = async (): Promise<string> => {
   let tab = await activeTab();
   if (tab.id === getCurrentTabId()) {
      return tab.url!;
   }
   return '';
};

export const getCurrentTabId = (): number => {
   let w = window as any;
   return w.contentTabId!;
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

export const copyToClipboard = (url: string): boolean => {
   try {
      var textField = document.createElement('textarea');
      textField.innerText = url;
      document.body.appendChild(textField);
      textField.select();
      document.execCommand('copy');
      textField.remove();
      return true;
   } catch {
      return false;
   }
};
