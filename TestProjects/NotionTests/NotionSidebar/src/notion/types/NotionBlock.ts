import { RecordMap } from './notionV3/notionRecordTypes';
import * as blockTypes from './notionV3/notionBlockTypes';
import { BlockTypes, BlockProps } from './notionV3/BlockTypes';

export interface NotionBlockModel {
   block: blockTypes.Block;
   collection?: blockTypes.Collection | undefined;
   collection_views?: blockTypes.CollectionView[] | undefined;
   recordMapData: RecordMap;
   type: BlockTypes;
   title?: string;
   blockId: string;
}

export class NotionBlock implements NotionBlockModel {
   block: blockTypes.Block;
   collection?: blockTypes.Collection | undefined;
   collection_views?: blockTypes.CollectionView[] | undefined = [];
   recordMapData: RecordMap;
   type: BlockTypes;
   title: string | undefined;
   blockId: string = '';

   constructor(data: RecordMap, blockId: string) {
      this.recordMapData = data;
      this.block = data.block[blockId].value!;
      this.type = this.block.type;
      this.blockId = blockId;

      if (this.block.type === BlockTypes.CollectionViewPage) {
         let cId = this.block.collection_id;
         this.collection = data.collection![cId].value!;
      } else if (this.block.type === BlockTypes.CollectionViewInline) {
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
            this.type === BlockTypes.CollectionViewPage ||
            this.type === BlockTypes.CollectionViewInline
         ) {
            return this.collection!.name![0][0];
         } else if (this.type === BlockTypes.Page) {
            let page = this.block as blockTypes.Page;
            return page.properties[BlockProps.Title][0][0];
         } else {
            let u = this.block as any;
            let title = u.page.properties[BlockProps.Title][0][0];
            return title;
         }
      } catch {
         console.log('Log: unkown block type: ' + this.type);
      }
      return undefined;
   };

   asType = () => {
      switch (this.type) {
         case BlockTypes.Page:
            break;

         default:
            break;
      }
   };

   toSerializable = (): NotionBlockModel => {
      this.title = this.getName();
      let model: NotionBlockModel = {
         block: this.block,
         collection: this.collection,
         collection_views: this.collection_views,
         recordMapData: this.recordMapData,
         type: this.type,
         title: this.title,
         blockId: this.blockId,
      };
      return model;
   };
}
