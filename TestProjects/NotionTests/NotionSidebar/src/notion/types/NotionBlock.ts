import { RecordMap, Record } from './notionV3/notionRecordTypes';
import * as blockTypes from './notionV3/notionBlockTypes';
import { BlockTypes, BlockProps } from './notionV3/BlockTypes';
import TreeModel from 'tree-model';
import { BaseTextBlock } from './notionV3/typings/basic_blocks';

export interface NotionBlockModel {
   block: blockTypes.Block;
   collection?: blockTypes.Collection | undefined;
   collection_views?: blockTypes.CollectionView[] | undefined;
   recordMapData: RecordMap;
   type: BlockTypes;
   title?: string;
   blockId: string;
}
export interface TreeNode {
   id: number;
}
export interface TreeType extends TreeNode {
   children: [TreeNode];
}

export class NotionBlock implements NotionBlockModel {
   block: blockTypes.Block;
   collection?: blockTypes.Collection | undefined;
   collection_views?: blockTypes.CollectionView[] | undefined = [];
   recordMapData: RecordMap;
   type: BlockTypes;
   title: string | undefined;
   blockId: string = '';
   parentNodes?: NotionBlock[] = undefined;
   children?: NotionBlock[] = undefined;

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
            if (this.collection?.name != null)
               return this.collection.name[0][0];
         } else if (this.type === BlockTypes.Page) {
            let page = this.block as blockTypes.Page;
            return page.properties[BlockProps.Title][0][0];
         } else {
            let u = this.block as BaseTextBlock;
            let title = u.properties?.title[0][0];
            return title;
         }
      } catch (err) {
         console.log('Log: unkown block type: ' + this.type);
         console.log(err);
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

   getParents = (refresh: boolean = false): any => {
      if (!refresh || this.parentNodes == null) {
         let parents: NotionBlock[] = [];
         let node = this.recordMapData.block[this.blockId];
         this.traversUp(node, parents);
         this.parentNodes = parents;
         return parents;
      }
      return this.parentNodes;
   };

   private traversUp(node: Record<blockTypes.Block>, parents: NotionBlock[]) {
      if (node.value?.parent_id != null) {
         var pBlock = new NotionBlock(this.recordMapData, node.value.parent_id);
         parents.splice(0, 0, pBlock);
         this.traversUp(this.recordMapData.block[pBlock.blockId], parents);
      }
   }

   getChildren = (refresh: boolean = false) => {
      if (!refresh || this.children == null) {
         let children: [] = [];
         let node = this.recordMapData.block[this.blockId];
         this.traverseDown(node, children);
         this.children = children;
         return children;
      }
      return this.children;
   };

   private traverseDown(
      node: Record<blockTypes.Block>,
      children: NotionBlock[]
   ) {
      for (var childId of node.value!.content ?? []) {
         if (childId != null) {
            var cBlock = new NotionBlock(this.recordMapData, childId);
            children.push(cBlock);
         }
      }
   }

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
