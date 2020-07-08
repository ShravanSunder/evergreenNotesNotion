import { SemanticString } from '../notionModels';
import * as base from '../notionBaseTypes';
import { CollectionView } from './collection_view';

export interface Collection {
   id: base.UUID;
   /** `name[0][0]` is the collection's name. */
   name?: [[string]];
   icon?: base.Emoji | base.NotionSecureUrl | base.PublicUrl;
   cover?: base.NotionRelativePath | base.NotionSecureUrl | base.PublicUrl;
   description?: SemanticString[];
   format?: Collection.Format;
   parent_id: base.UUID;
   parent_table: base.Table;
   schema: Collection.Schema;
   version: number;
   alive: boolean;
}

export namespace Collection {
   /**
    * Also used in {@link CollectionView.TableProperty},
    * {@link CollectionView.GalleryProperty},
    * {@link Aggregate}, {@link Filter}, {@link Query}, and {@link Sort}.
    *
    * `title` when {@link ColumnPropertyType} is `title`.
    *
    * Otherwise, a 4-ASCII-character string. e.g. `%7_Z`.
    */
   export type ColumnID = string;

   export type ColumnPropertyType =
      | 'title'
      | 'text'
      | 'number'
      | 'select'
      | 'multi_select'
      | 'date'
      | 'person'
      | 'file'
      | 'checkbox'
      | 'url'
      | 'email'
      | 'phone_number'
      | 'formula'
      | 'relation'
      | 'created_time'
      | 'created_by'
      | 'last_edited_time'
      | 'last_edited_by';

   export type ColumnPropertyOptionColor =
      | 'default'
      | 'gray'
      | 'brown'
      | 'orange'
      | 'yellow'
      | 'green'
      | 'blue'
      | 'purple'
      | 'pink'
      | 'red';

   export interface ColumnPropertyOption {
      id: base.UUID;
      color: ColumnPropertyOptionColor;
      value: string;
   }

   export interface ColumnProperty {
      name: string;
      options?: ColumnPropertyOption[];
      type: ColumnPropertyType;
      /** Related collection. Defined if `type` = `relation`. */
      collection_id?: base.UUID;
      /** Related column in the collection. Defined if `type` = `relation`. */
      property?: ColumnID;
   }

   export interface Format {
      collection_cover_position?: number;
      /**
       * TODO: Not sure if {@link CollectionView.TableProperty}
       * is also possible.
       */
      collection_page_properties?: CollectionView.GalleryProperty[];
   }

   export type Schema = {
      [key in ColumnID]: ColumnProperty;
   };
}
