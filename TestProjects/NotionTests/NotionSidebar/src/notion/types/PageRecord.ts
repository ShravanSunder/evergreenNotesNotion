import { RecordMap } from './notionV3/notionRecordTypes';
import * as blockTypes from './notionV3/notionBlockTypes';
import { BlockNames, BlockProps } from './notionV3/BlockEnums';

export interface PageRecordModel {
   block: blockTypes.Block;
   collection?: blockTypes.Collection | undefined;
   collection_views?: blockTypes.CollectionView[] | undefined;
   recordMapData: RecordMap;
   type: BlockNames;
   name?: string;
   blockId: string;
}

export class PageRecord implements PageRecordModel {
   block: blockTypes.Block;
   collection?: blockTypes.Collection | undefined;
   collection_views?: blockTypes.CollectionView[] | undefined = [];
   recordMapData: RecordMap;
   type: BlockNames;
   name: string | undefined;
   blockId: string = '';

   constructor(data: RecordMap, blockId: string) {
      this.recordMapData = data;
      this.block = data.block[blockId].value!;
      this.type = this.block.type;
      this.blockId = blockId;

      if (this.block.type === BlockNames.CollectionViewPage) {
         let cId = this.block.collection_id;
         this.collection = data.collection![cId].value!;
      } else if (this.block.type === BlockNames.CollectionViewInline) {
         let cId = this.block.collection_id;
         this.collection = data.collection![cId].value!;
         let viewIds = this.block.view_ids;
         for (let vId of viewIds) {
            if (data.collection_view != null) {
               let cv = data.collection_view![vId].value;
               if (cv != null) {
                  this.collection_views?.push(cv);
               }
            }
         }
      }
   }

   getName = (): string | undefined => {
      try {
         if (
            this.type === BlockNames.CollectionViewPage ||
            this.type === BlockNames.CollectionViewInline
         ) {
            return this.collection!.name![0][0];
         } else if (this.type === BlockNames.Page) {
            let page = this.block as blockTypes.Page;
            return page.properties[BlockProps.Title][0][0];
         }
      } catch {}
      console.log('Log: unkown block type: ' + this.type);
      return undefined;
   };

   toSerializable = (): PageRecordModel => {
      this.name = this.getName();
      let model: PageRecordModel = {
         block: this.block,
         collection: this.collection,
         collection_views: this.collection_views,
         recordMapData: this.recordMapData,
         type: this.type,
         name: this.name,
         blockId: this.blockId,
      };
      return model;
   };
}
