// /**
//  * All block names.
//  */

export enum BlockTypeEnum {
   Unknown = 'unknown',
   Page = 'page',
   Text = 'text',
   ButtetedList = 'bulleted_list',
   NumberedList = 'numbered_list',
   ToDo = 'to_do',
   Toggle = 'toggle',
   Header1 = 'header',
   Header2 = 'sub_header',
   Header3 = 'sub_sub_header',
   Quote = 'quote',
   Callout = 'callout',
   ColumnList = 'column_list',
   Column = 'column',
   Date = 'date',
   Divider = 'divider',

   CollectionViewInline = 'collection_view',
   CollectionViewPage = 'collection_view_page',

   Image = 'image',
   Video = 'video',
   Audio = 'audio',
   Bookmark = 'bookmark',
   Code = 'code',
   File = 'file',
   PDF = 'pdf',

   TableOfContents = 'table_of_contents',
   Equation = 'equation',
   TemplateButton = 'factory',
   BreadCrumb = 'breadcrumb',

   Embed = 'embed',
}

export const inBlockTypes = (e: BlockTypeEnum) => {
   return Object.values(BlockTypeEnum).includes(e as BlockTypeEnum);
};

export enum BlockProps {
   Title = 'title',
}
