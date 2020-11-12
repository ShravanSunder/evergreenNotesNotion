export enum updateStatus {
   waiting = 'waiting',
   shouldUpdate = 'shouldUpdate',
   updating = 'updating',
   updateSuccessful = 'updateSuccessful',
   updateFailed = 'updateFailed', //can retry
   updateAborted = 'updateAborted',
}
