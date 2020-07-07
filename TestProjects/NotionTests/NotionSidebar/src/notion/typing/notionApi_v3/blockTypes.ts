import * as AdvancedBlock from './models/block/advanced_block';
import * as BasicBlock from './models/block/basic_block';
import * as DatabaseBlock from './models/block/database';
import * as EmbedBlock from './models/block/embed';
import * as MediaBlock from './models/block/media';

/**
 * All types of blocks.
 */
export type Block =
   | AdvancedBlock.AdvancedBlockUnion
   | BasicBlock.BasicBlockUnion
   | DatabaseBlock.DatabaseBlockUnion
   | EmbedBlock.EmbedBlockUnion
   | MediaBlock.MediaBlockUnion;

export type Breadcrumb = AdvancedBlock.Breadcrumb;
export type Equation = AdvancedBlock.Equation;
export type Factory = AdvancedBlock.Factory;
export type TableOfContents = AdvancedBlock.TableOfContents;

export type BulletedList = BasicBlock.BulletedList;
export type Callout = BasicBlock.Callout;
export type Column = BasicBlock.Column;
export type ColumnList = BasicBlock.ColumnList;
export type Divider = BasicBlock.Divider;
export type Header = BasicBlock.Header;
export type NumberedList = BasicBlock.NumberedList;
export type Page = BasicBlock.Page;
export type Quote = BasicBlock.Quote;
export type SubHeader = BasicBlock.SubHeader;
export type SubSubHeader = BasicBlock.SubSubHeader;
export type Text = BasicBlock.Text;
export type ToDo = BasicBlock.ToDo;
export type Toggle = BasicBlock.Toggle;

export type CollectionViewInline = DatabaseBlock.CollectionViewInline;
export type CollectionViewPage = DatabaseBlock.CollectionViewPage;

export type Codepen = EmbedBlock.Codepen;
export type Embed = EmbedBlock.Embed;
export type Invision = EmbedBlock.Invision;
export type PDF = EmbedBlock.PDF;

export type Audio = MediaBlock.Audio;
export type Bookmark = MediaBlock.Bookmark;
export type Code = MediaBlock.Code;
export type File = MediaBlock.File;
export type Image = MediaBlock.Image;
export type Video = MediaBlock.Video;
