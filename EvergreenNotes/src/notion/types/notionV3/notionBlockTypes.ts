import { i_Collection } from './definitions/collection';
import { i_CollectionView } from './definitions/collection_view';
import { i_Space } from './definitions/space';
import { i_SpaceView } from './definitions/space';
import { i_Activity } from './definitions/activity';
// import { Follow } from "./follow"
// import { SlackIntegration } from "./slack_integration"
import { t_Permission } from './definitions/permission';
import { i_NotionUser } from './definitions/notion_user';
// import { UserRoot } from "./user_root"
// import { UserSettings } from "./user_settings"

////////////////////////////////////////////////
// All types of blocks.
import * as BasicBlocks from './definitions/basic_blocks';
import * as DatabaseBlock from './definitions/database';
import * as EmbedBlocks from './definitions/embed_blocks';

export type NavigatableBlocks = Page | DatabaseBlock.ICollectionViewPage;

export type Block =
   | NavigatableBlocks
   | BasicBlocks.TBasicBlockUnion
   | DatabaseBlock.TDatabaseBlockUnion
   | EmbedBlocks.EmbedBlockUnion;

export interface ICollection extends i_Collection {}
export interface ICollectionView extends i_CollectionView {}
export interface ISpace extends i_Space {}
export interface ISpaceView extends i_SpaceView {}
export interface IActivity extends i_Activity {}
export type IPermission = t_Permission;
export interface INotionUser extends i_NotionUser {}

// export {
//    //Collection,
//    CollectionView,
//    Space,
//    SpaceView,
//    //Activity,
//    // Follow,
//    // SlackIntegration,
//    Permission,
//    NotionUser,
//    // UserRoot,
//    // UserSettings,
// };

export type Breadcrumb = BasicBlocks.IBreadcrumb;
export type Equation = BasicBlocks.IEquation;
export type Factory = BasicBlocks.ITemplateButton;
export type TableOfContents = BasicBlocks.ITableOfContents;

export type BulletedList = BasicBlocks.IBulletedList;
export type Callout = BasicBlocks.ICallout;
export type Column = BasicBlocks.IColumn;
export type ColumnList = BasicBlocks.IColumnList;
export type Divider = BasicBlocks.IDivider;
export type Header = BasicBlocks.IHeader1;
export type NumberedList = BasicBlocks.INumberedList;
export type Page = BasicBlocks.IPage;
export type Quote = BasicBlocks.IQuote;
export type SubHeader = BasicBlocks.IHeader2;
export type SubSubHeader = BasicBlocks.IHeader3;
export type Text = BasicBlocks.IText;
export type ToDo = BasicBlocks.IToDo;
export type Toggle = BasicBlocks.IToggle;

export type CollectionViewInline = DatabaseBlock.ICollectionViewInline;
export type CollectionViewPage = DatabaseBlock.ICollectionViewPage;

//export type Codepen = EmbedBlock.Codepen;
export type Embed = EmbedBlocks.Embed;
//export type Invision = EmbedBlock.Invision;
export type PDF = EmbedBlocks.PDF;

export type Audio = BasicBlocks.IAudio;
export type Bookmark = BasicBlocks.IBookmark;
export type Code = BasicBlocks.ICode;
export type File = BasicBlocks.IFile;
export type Image = BasicBlocks.IImage;
export type Video = BasicBlocks.IVideo;
