import { RecordMap, Record } from 'aNotion/types/notionV3/notionRecordTypes';
import * as blockTypes from 'aNotion/types/notionV3/notionBlockTypes';
import { BlockTypes, BlockProps } from 'aNotion/types/notionV3/BlockTypes';
import TreeModel from 'tree-model';
import { BaseTextBlock } from 'aNotion/types/notionV3/typings/basic_blocks';
import * as recordService from 'aNotion/services/recordService';

export interface NotionBlockModel {
   block?: blockTypes.Block;
   collection?: blockTypes.Collection | undefined;
   collection_views?: blockTypes.CollectionView[] | undefined;
   //recordMapData: RecordMap;
   type: BlockTypes;
   title: string;
   blockId: string;
}
export interface TreeNode {
   id: number;
}
export interface TreeType extends TreeNode {
   children: [TreeNode];
}

export class NotionBlock implements NotionBlockModel {
   block?: blockTypes.Block;
   collection?: blockTypes.Collection | undefined;
   collection_views?: blockTypes.CollectionView[] | undefined = [];
   recordMapData: RecordMap;
   type: BlockTypes = BlockTypes.Unknown;
   title: string;
   blockId: string = '';
   parentNodes?: NotionBlockModel[] = undefined;
   children?: NotionBlockModel[] = undefined;

   constructor(data: RecordMap, blockId: string) {
      this.recordMapData = data;
      this.setupBlockData(data, blockId);
      this.setupCollectionData(data, blockId);
      this.setupType(data, blockId);

      this.title = this.fetchTitle();
   }

   setupBlockData(data: RecordMap, blockId: string) {
      this.block = data.block?.[blockId]?.value;
      this.blockId = blockId;
   }

   setupCollectionData(data: RecordMap, blockId: string) {
      if (this.block?.type === BlockTypes.CollectionViewPage) {
         let cId = this.block.collection_id;
         this.collection = data.collection![cId].value!;
      } else if (this.block?.type === BlockTypes.CollectionViewInline) {
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
      } else if (this.block == null && data.collection != null) {
         this.collection = data.collection[blockId]?.value;
      }
   }

   setupType(data: RecordMap, blockId: string) {
      if (this.block != null) {
         this.type = this.block.type;
      } else if (this.collection != null) {
         this.type = BlockTypes.CollectionViewPage;
      }
   }

   fetchTitle = (): string => {
      try {
         if (
            this.type === BlockTypes.CollectionViewPage ||
            this.type === BlockTypes.CollectionViewInline
         ) {
            if (this.collection?.name != null)
               return this.collection.name[0][0];
         } else if (this.type === BlockTypes.Page) {
            let page = this.block as blockTypes.Page;
            return page.properties[BlockProps.Title][0][0];
         } else if (this.type !== BlockTypes.Unknown) {
            let u = this.block as BaseTextBlock;
            let title = u.properties?.title[0][0];
            return title ?? '';
         }
      } catch (err) {
         console.log('Log: unkown block type: ' + this.type);
         console.log(err);
      }
      return '';
   };

   asType = () => {
      //not finished
      switch (this.type) {
         case BlockTypes.Page:
            break;

         default:
            break;
      }
   };

   getParentId() {
      if (this.block != null) {
         return this.block.parent_id;
      } else if (this.collection != null) {
         return this.collection.parent_id;
      }
      return undefined;
   }

   getParents = (refresh: boolean = false): NotionBlockModel[] => {
      if (!refresh || this.parentNodes == null) {
         let parents: NotionBlockModel[] = [];
         this.traversUp(this.getParentId(), this.blockId, parents);
         this.parentNodes = parents;
         return parents;
      }
      return this.parentNodes;
   };

   private traversUp(
      parentId: string | undefined,
      id: string,
      parents: NotionBlockModel[]
   ) {
      try {
         if (parentId != null) {
            var pBlock = new NotionBlock(this.recordMapData, parentId);
            if (pBlock.block == null) {
               //if the block is empty, just skip saving it to array
               //its probably a collection and repeated as we traverse
               this.traversUp(pBlock.getParentId(), pBlock.blockId, parents);
            } else if (pBlock.type !== BlockTypes.Unknown) {
               parents.splice(0, 0, pBlock);
               this.traversUp(pBlock.getParentId(), pBlock.blockId, parents);
            }
         }
      } catch (err) {
         console.warn('Parent Not Found: ' + err);
      }
   }

   getChildren = (refresh: boolean = false) => {
      if (!refresh || this.children == null) {
         let children: [] = [];
         this.children = this.traverseDown(this.blockId, children);
         return this.children;
      }
      return this.children;
   };

   private traverseDown(
      id: string,
      children: NotionBlockModel[]
   ): NotionBlockModel[] {
      //maybe later we might need a way to traverse down the tree?
      return children.concat(recordService.getContent(this.recordMapData, id));
   }

   toSerializable = (): NotionBlockModel => {
      let model: NotionBlockModel = {
         block: this.block,
         collection: this.collection,
         collection_views: this.collection_views,
         //recordMapData: this.recordMapData,
         type: this.type,
         title: this.title,
         blockId: this.blockId,
      };
      return model;
   };
}