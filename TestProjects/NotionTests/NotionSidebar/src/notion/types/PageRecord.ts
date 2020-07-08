import { RecordMap, Record, BlockRecord } from './notionV3/notionRecordTypes';
import { Map } from './notionV3/Map';
import * as blockTypes from './notionV3/notionBlockTypes';
import { BlockNames, BlockProps } from './notionV3/BlockEnums';

export interface PageRecordModel {
   block: blockTypes.Block;
   collection?: blockTypes.Collection | undefined;
   collection_views?: blockTypes.CollectionView[] | undefined;
   recordMapData: RecordMap;
   type: BlockNames;
   name: string;
}

export class PageRecord implements PageRecordModel {
   block: blockTypes.Block;
   collection?: blockTypes.Collection | undefined;
   collection_views?: blockTypes.CollectionView[] | undefined = [];
   recordMapData: RecordMap;
   type: BlockNames;
   name: string = '';

   constructor(data: RecordMap, blockId: string) {
      this.recordMapData = data;
      this.block = data.block[blockId].value!;
      this.type = this.block.type;

      if (this.block.type === BlockNames.CollectionViewPage) {
         let cId = this.block.collection_id;
         this.collection = data.collection![cId].value!;
      } else if (this.block.type === BlockNames.CollectionViewInline) {
         let cId = this.block.collection_id;
         this.collection = data.collection![cId].value!;
         let viewIds = this.block.view_ids;
         for (let vId in viewIds) {
            let cv = data.collection_view![vId].value;
            if (cv !== undefined) {
               this.collection_views?.push(cv);
            }
         }
      }
   }

   getName = (): string | undefined => {
      if (
         this.type === BlockNames.CollectionViewPage ||
         this.type === BlockNames.CollectionViewInline
      ) {
         return this.collection!.name![0][0];
      } else if (this.type === BlockNames.Page) {
         let page = this.block as blockTypes.Page;
         return page.properties[BlockProps.Title][0];
      }
      console.log('Log: unkown block type: ' + this.type);
      return undefined;
   };

   toModel = (): PageRecordModel => {
      this.name = this.getName() ?? '';
      return this as PageRecordModel;
   };
}
