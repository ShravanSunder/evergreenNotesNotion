import { AppOptions } from './optionsTypes';

export var appOptions: AppOptions | undefined = undefined;

export const getOptionsFromStorage = () => {
   chrome.storage.sync.get(['AppOptions'], function (result: any) {
      appOptions = result;
      if (appOptions == null) {
         appOptions = getDefaultOptions();
      }
   });
};

const getDefaultOptions = (): AppOptions => {
   let options: AppOptions = {
      darkmode: false,
   };

   return options;
};

export const saveOptionsToStorage = async (options: AppOptions) => {
   chrome.storage.sync.set({ AppOptions: options }, function () {
      appOptions = options;
   });
};
