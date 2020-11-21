import { isGuid } from 'aCommon/extensionHelpers';

type TNavigateMessage = {
   blockId: string;
   type: 'navigate';
   message?: string;
};

const handleReceiveMessage = (event: any) => {
   const data = event.data as TNavigateMessage;
   if (
      data.type == 'navigate' &&
      data.blockId != null &&
      isGuid(data.blockId)
   ) {
      //do stuff
      const element = document.querySelector(
         `[data-block-id="${data.blockId}"]`
      );
      if (element != null) {
         element.scrollIntoView();
      }
   }
};

export const registerNavigateMessageHandler = () => {
   window.addEventListener('message', handleReceiveMessage);
};
