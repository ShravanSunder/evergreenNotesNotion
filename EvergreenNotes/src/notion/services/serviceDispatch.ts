import { IPageChunk } from 'aNotion/types/notionV3/notionRecordTypes';
import { mentionsActions } from 'aNotion/components/mentions/mentionsSlice';
import { appDispatch } from 'aNotion/providers/appDispatch';

export const dispatchSaveMentionAction = (chunk: IPageChunk) => {
   if (chunk.recordMap.notion_user != null) {
      appDispatch(mentionsActions.saveAllUsers(chunk.recordMap.notion_user));
   }
};
