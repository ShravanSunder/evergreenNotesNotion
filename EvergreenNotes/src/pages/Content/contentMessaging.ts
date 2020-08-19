export enum contentCommands {
   extensionOnClick = 'EXTENSION_ON_CLICK',
}
export interface contentCommandRequest {
   command: contentCommands;
   tabId: number;
}
