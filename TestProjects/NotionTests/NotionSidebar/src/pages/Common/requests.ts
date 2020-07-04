import { commands } from './commands';

export interface commandRequest {
   command: commands;
}

export interface payloadRequest {
   command: commands;
   payload: unknown;
}
