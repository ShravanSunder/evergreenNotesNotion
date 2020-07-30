export enum commands {
   fetchCookies = 'FETCH_COOKIES',
   receivedCookies = 'RECEIVED_COOKIES',
}

export interface commandRequest {
   command: commands;
}

export interface payloadRequest {
   command: commands;
   payload: unknown;
}
