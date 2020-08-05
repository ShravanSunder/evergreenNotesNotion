//make a way to get the page title and data
// doesn't matter if its a page or collection or whatever
// get title, properties etc.  using blocks as reference

import { PageChunk } from 'aNotion/types/notionV3/notionRecordTypes';
import {
   NotionBlockFactory,
   NotionBlockModel,
} from 'aNotion/models/NotionBlock';
import { BlockTypes } from 'aNotion/types/notionV3/BlockTypes';
import { SemanticString } from 'aNotion/types/notionV3/semanticStringTypes';
import { appDispatch } from 'aNotion/providers/reduxStore';
import { notionSiteActions } from 'aNotion/components/notionSiteSlice';
import * as blockApi from 'aNotion/api/v3/blockApi';
import * as LoadPageChunk from 'aNotion/types/notionv3/notionRecordTypes';

export const fetchPageData = async (
   pageId: string,
   signal: AbortSignal
): Promise<NotionBlockModel | undefined> => {
   let chunk: LoadPageChunk.PageChunk;
   let block: NotionBlockModel | undefined = undefined;

   let sycRecordPromise = blockApi.syncRecordValues([pageId], signal);
   let loadChunkPromise = blockApi.loadPageChunk(pageId, 1, signal);

   try {
      // this method is much faster, but doesn't work for collection pages
      chunk = (await sycRecordPromise) as LoadPageChunk.PageChunk;

      if (chunk != null && !signal.aborted) {
         block = getBlockFromPageChunk(chunk, pageId);
         if (block.type === BlockTypes.CollectionViewPage) {
            block = undefined;
         }
      }
   } catch {
      // try again with full page data
   }

   if (block == null && !signal.aborted) {
      chunk = (await loadChunkPromise) as LoadPageChunk.PageChunk;

      if (chunk != null && !signal.aborted) {
         block = getBlockFromPageChunk(chunk, pageId);
      }
   }

   return (block as NotionBlockFactory).toSerializable();
};

export const getBlockFromPageChunk = (
   page: PageChunk,
   pageId: string
): NotionBlockFactory => {
   try {
      let m = new NotionBlockFactory(page.recordMap, pageId);
      return m;
   } catch (err) {
      console.log(err);
      throw err;
   }
};

export const isNavigable = (block: NotionBlockModel): boolean => {
   return (
      block.type === BlockTypes.Page ||
      block.type === BlockTypes.CollectionViewPage
   );
};

export const reduceTitle = (title?: SemanticString[]) => {
   if (title != null) {
      return title
         .map((segment) => {
            return segment[0];
         })
         .reduce((acuumulator, value) => {
            return acuumulator + ' ' + value;
         });
   }
   return '';
};
