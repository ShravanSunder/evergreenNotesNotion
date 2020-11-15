import { RecordMap, Record } from 'aNotion/types/notionV3/notionRecordTypes';
import * as blockTypes from 'aNotion/types/notionV3/notionBlockTypes';
import { BlockTypeEnum, BlockProps } from 'aNotion/types/notionV3/BlockTypes';
import {
   BaseTextBlock,
   Page,
} from 'aNotion/types/notionV3/definitions/basic_blocks';
import * as recordService from 'aNotion/services/recordService';
import * as blockService from 'aNotion/services/blockService';
import {
   SemanticString,
   SemanticFormatEnum,
} from 'aNotion/types/notionV3/semanticStringTypes';
import {
   getPropertiesWithSemanticFormat,
   hasBackgroundColorFormat,
   hasSemanticFormatType,
} from 'aNotion/services/pageService';

export interface NotionBlockModel {
   block?: blockTypes.Block;
   collection?: blockTypes.Collection | undefined;
   collection_views?: blockTypes.CollectionView[] | undefined;
   type: BlockTypeEnum;
   simpleTitle: string;
   semanticTitle: SemanticString[];
   blockId: string;
   contentIds: string[];
}
export interface TreeNode {
   id: number;
}
export interface TreeType extends TreeNode {
   children: [TreeNode];
}

export class NotionBlockRecord implements NotionBlockModel {
   block?: blockTypes.Block;
   collection?: blockTypes.Collection | undefined;
   collection_views?: blockTypes.CollectionView[] | undefined = [];
   recordMapData: RecordMap;
   type: BlockTypeEnum = BlockTypeEnum.Unknown;
   simpleTitle: string;
   semanticTitle: SemanticString[] = [];
   blockId: string = '';
   parentNodes?: NotionBlockModel[] = undefined;
   contentNodes?: NotionBlockModel[] = undefined;
   relatedBlocks?: NotionBlockModel[] = undefined;
   contentIds: string[] = [];

   constructor(data: RecordMap, blockId: string) {
      this.recordMapData = data;
      this.setupBlockData(data, blockId);
      this.setupCollectionData(data, blockId);
      this.setupType(data, blockId);

      this.simpleTitle = this.plainTextTitle();
      this.semanticTitle = this.getTitle();
      this.contentIds = this.getContentIds();
   }

   protected setupBlockData(data: RecordMap, blockId: string) {
      this.block = data.block?.[blockId]?.value;
      this.blockId = blockId;
   }

   protected setupCollectionData(data: RecordMap, blockId: string) {
      if (this.block?.type === BlockTypeEnum.CollectionViewPage) {
         let cId = this.block.collection_id;
         this.collection = data.collection?.[cId].value;
      } else if (this.block?.type === BlockTypeEnum.CollectionViewInline) {
         let cId = this.block.collection_id;
         this.collection = data.collection?.[cId]?.value;
         if (this.collection) {
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
      } else if (this.block == null && data.collection != null) {
         this.collection = data.collection[blockId]?.value;
      }
   }

   protected setupType(data: RecordMap, blockId: string) {
      if (this.block != null) {
         this.type = this.block.type;
      } else if (this.collection != null) {
         this.type = BlockTypeEnum.CollectionViewPage;
      }
   }

   protected plainTextTitle = (): string => {
      //todo use semantic title here
      try {
         if (
            this.type === BlockTypeEnum.CollectionViewPage ||
            this.type === BlockTypeEnum.CollectionViewInline
         ) {
            if (this.collection?.name != null)
               return blockService.reduceTitle(this.collection.name);
         } else if (this.type === BlockTypeEnum.Page) {
            let page = this.block as blockTypes.Page;
            return blockService.reduceTitle(page.properties?.title);
         } else if (this.type !== BlockTypeEnum.Unknown) {
            let u = this.block as BaseTextBlock;
            return blockService.reduceTitle(u.properties?.title);
         }
      } catch (err) {
         //ignore this error, this wil be improved
         console.log(err);
      }
      return '';
   };

   protected getTitle = (): SemanticString[] => {
      try {
         if (
            this.type === BlockTypeEnum.CollectionViewPage ||
            this.type === BlockTypeEnum.CollectionViewInline
         ) {
            if (this.collection?.name != null) return this.collection.name;
         } else if (this.type === BlockTypeEnum.Page) {
            let page = this.block as blockTypes.Page;
            return page.properties?.title;
         } else if (this.type !== BlockTypeEnum.Unknown) {
            let u = this.block as BaseTextBlock;
            return u.properties?.title ?? [];
         }
      } catch (err) {
         //ignore this error, this wil be improved
         console.log(err);
      }
      return [];
   };

   getParentId() {
      if (this.block != null) {
         return this.block.parent_id;
      } else if (this.collection != null) {
         return this.collection.parent_id;
      }
      return undefined;
   }

   getContentIds() {
      if (this.block != null) {
         return this.block.content ?? [];
      }
      return [];
   }

   getParentsNodes = (refresh: boolean = false): NotionBlockModel[] => {
      if (!refresh || this.parentNodes == null) {
         let parents: NotionBlockModel[] = [];
         this.traverseUp(this.getParentId(), this.blockId, parents);
         this.parentNodes = parents;
         return parents;
      }
      return this.parentNodes;
   };

   protected traverseUp(
      parentId: string | undefined,
      id: string,
      parents: NotionBlockModel[]
   ) {
      try {
         if (parentId != null) {
            var pBlock = new NotionBlockRecord(this.recordMapData, parentId);
            if (pBlock.block == null) {
               //if the block is empty, just skip saving it to array
               //its probably a collection and repeated as we traverse
               this.traverseUp(pBlock.getParentId(), pBlock.blockId, parents);
            } else if (pBlock.type !== BlockTypeEnum.Unknown) {
               parents.splice(0, 0, pBlock);
               this.traverseUp(pBlock.getParentId(), pBlock.blockId, parents);
            }
         }
      } catch (err) {
         console.warn('Parent Not Found: ' + err);
      }
   }

   getRelationsAsBlockIds = (): string[] => {
      if (this.type !== BlockTypeEnum.Page) {
         return [];
      }
      return getPropertiesWithSemanticFormat(this, SemanticFormatEnum.Page);
   };

   hasBgColor = () => {
      return hasBackgroundColorFormat(this.semanticTitle);
   };

   hasLinks = () => {
      return (
         this.hasType(SemanticFormatEnum.Link) ||
         this.type === BlockTypeEnum.Bookmark
      );
   };

   hasCode = () => {
      return (
         this.hasType(SemanticFormatEnum.InlineCode) ||
         this.type === BlockTypeEnum.Code
      );
   };

   hasComments = () => {
      return this.hasType(SemanticFormatEnum.Commented);
   };

   hasUserMentions = () => {
      return this.hasType(SemanticFormatEnum.User);
   };

   hasPageMentions = () => {
      return this.hasType(SemanticFormatEnum.Page);
   };

   private hasType(formatType: SemanticFormatEnum) {
      return hasSemanticFormatType(this.semanticTitle, formatType);
   }

   toSerializable = (): NotionBlockModel => {
      let model: NotionBlockModel = {
         block: this.block,
         collection: this.collection,
         collection_views: this.collection_views,
         contentIds: this.contentIds,
         type: this.type,
         simpleTitle: this.simpleTitle,
         semanticTitle: this.semanticTitle,
         blockId: this.blockId,
      };
      return model;
   };
}
