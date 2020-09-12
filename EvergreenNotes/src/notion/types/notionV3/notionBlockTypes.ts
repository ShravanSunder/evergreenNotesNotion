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

export type NavigatableBlocks = Page | DatabaseBlock.CollectionViewPage;

export type Block =
   | NavigatableBlocks
   | BasicBlocks.BasicBlockUnion
   | DatabaseBlock.DatabaseBlockUnion
   | EmbedBlocks.EmbedBlockUnion;

export interface Collection extends i_Collection {}
export interface CollectionView extends i_CollectionView {}
export interface Space extends i_Space {}
export interface SpaceView extends i_SpaceView {}
export interface Activity extends i_Activity {}
export type Permission = t_Permission;
export interface NotionUser extends i_NotionUser {}

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

export type Breadcrumb = BasicBlocks.Breadcrumb;
export type Equation = BasicBlocks.Equation;
export type Factory = BasicBlocks.TemplateButton;
export type TableOfContents = BasicBlocks.TableOfContents;

export type BulletedList = BasicBlocks.BulletedList;
export type Callout = BasicBlocks.Callout;
export type Column = BasicBlocks.Column;
export type ColumnList = BasicBlocks.ColumnList;
export type Divider = BasicBlocks.Divider;
export type Header = BasicBlocks.Header1;
export type NumberedList = BasicBlocks.NumberedList;
export type Page = BasicBlocks.Page;
export type Quote = BasicBlocks.Quote;
export type SubHeader = BasicBlocks.Header2;
export type SubSubHeader = BasicBlocks.Header3;
export type Text = BasicBlocks.Text;
export type ToDo = BasicBlocks.ToDo;
export type Toggle = BasicBlocks.Toggle;

export type CollectionViewInline = DatabaseBlock.CollectionViewInline;
export type CollectionViewPage = DatabaseBlock.CollectionViewPage;

//export type Codepen = EmbedBlock.Codepen;
export type Embed = EmbedBlocks.Embed;
//export type Invision = EmbedBlock.Invision;
export type PDF = EmbedBlocks.PDF;

export type Audio = BasicBlocks.Audio;
export type Bookmark = BasicBlocks.Bookmark;
export type Code = BasicBlocks.Code;
export type File = BasicBlocks.File;
export type Image = BasicBlocks.Image;
export type Video = BasicBlocks.Video;
