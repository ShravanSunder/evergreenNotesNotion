import { isGuid } from 'aCommon/extensionHelpers';

export enum EvergreenMessagingEnum {
   updateSidebarData = 'updateEvergreenSidebarData',
   frameStatusChanged = 'updateEvergreenFrame',
   navigateToBlock = 'navigateToBlock',
   darkModeChanged = 'updateSideDarkmode',
   copyToClipboard = 'copyToClipboard',
}

/**
 * this is the data passed by the window.postMessage for the window <--> iFrame communication.
 */
export type TEvergreenMessage<T> = {
   type: EvergreenMessagingEnum;
   payload?: T;
};

export const postMessageToSidebar = <T>(message: TEvergreenMessage<T>) => {
   let iframe = (document.getElementById(
      'evergreenNotesForNotion'
   ) as HTMLIFrameElement)?.contentWindow;
   if (iframe != null) {
      iframe?.postMessage(message, '*');
   }
};

const handleReceiveMessage = (event: any) => {
   const data = event.data as TEvergreenMessage<string>;
   if (
      data != null &&
      data.type == EvergreenMessagingEnum.navigateToBlock &&
      data.payload != null &&
      isGuid(data.payload)
   ) {
      //do stuff
      const element = document.querySelector(
         `[data-block-id="${data.payload}"]`
      );
      if (element != null) {
         try {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
         } catch {
            /* do nothing*/
         }
      }
   } else if (
      data != null &&
      data.type == EvergreenMessagingEnum.copyToClipboard &&
      data.payload != null
   ) {
      navigator.clipboard.writeText(data.payload);
      console.log('Copied to clipboard' + data.payload);
   }
};

export const registerNavigateMessageHandler = () => {
   window.addEventListener('message', handleReceiveMessage);
};
