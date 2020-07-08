import { Collection } from './typings/collection';
import { CollectionView } from './typings/collection_view';
import { Space } from './typings/space';
import { SpaceView } from './typings/space_view';
import { Activity } from './typings/activity';
// import { Follow } from "./follow"
// import { SlackIntegration } from "./slack_integration"
import { Permission } from './typings/permission';
// import { NotionUser } from "./notion_user"
// import { UserRoot } from "./user_root"
// import { UserSettings } from "./user_settings"

////////////////////////////////////////////////
// All types of blocks.
import * as AdvancedBlock from './typings/block/advanced_block';
import * as BasicBlock from './typings/block/basic_block';
import * as DatabaseBlock from './typings/block/database';
import * as EmbedBlock from './typings/block/embed';
import * as MediaBlock from './typings/block/media';

export type Block =
   | AdvancedBlock.AdvancedBlockUnion
   | BasicBlock.BasicBlockUnion
   | DatabaseBlock.DatabaseBlockUnion
   | EmbedBlock.EmbedBlockUnion
   | MediaBlock.MediaBlockUnion;

export {
   Collection,
   CollectionView,
   Space,
   SpaceView,
   Activity,
   // Follow,
   // SlackIntegration,
   Permission,
   // NotionUser,
   // UserRoot,
   // UserSettings,
};

export type Breadcrumb = AdvancedBlock.Breadcrumb;
export type Equation = AdvancedBlock.Equation;
export type Factory = AdvancedBlock.TemplateButton;
export type TableOfContents = AdvancedBlock.TableOfContents;

export type BulletedList = BasicBlock.BulletedList;
export type Callout = BasicBlock.Callout;
export type Column = BasicBlock.Column;
export type ColumnList = BasicBlock.ColumnList;
export type Divider = BasicBlock.Divider;
export type Header = BasicBlock.Header1;
export type NumberedList = BasicBlock.NumberedList;
export type Page = BasicBlock.Page;
export type Quote = BasicBlock.Quote;
export type SubHeader = BasicBlock.Header2;
export type SubSubHeader = BasicBlock.Header3;
export type Text = BasicBlock.Text;
export type ToDo = BasicBlock.ToDo;
export type Toggle = BasicBlock.Toggle;

export type CollectionViewInline = DatabaseBlock.CollectionViewInline;
export type CollectionViewPage = DatabaseBlock.CollectionViewPage;

//export type Codepen = EmbedBlock.Codepen;
export type Embed = EmbedBlock.Embed;
//export type Invision = EmbedBlock.Invision;
export type PDF = EmbedBlock.PDF;

export type Audio = MediaBlock.Audio;
export type Bookmark = MediaBlock.Bookmark;
export type Code = MediaBlock.Code;
export type File = MediaBlock.File;
export type Image = MediaBlock.Image;
export type Video = MediaBlock.Video;

export * from './typings/semantic_string';
