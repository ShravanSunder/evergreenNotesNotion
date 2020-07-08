import { EmptyBlock } from './empty_block';
import { BlockNames } from '../../BlockEnums';

export interface TableOfContents extends EmptyBlock {
   type: BlockNames.TableOfContents;
}

/**
 * Math Equation block.
 */
export interface Equation extends EmptyBlock {
   type: BlockNames.Equation;
   properties?: {
      /** LaTeX. */
      title?: [[string]];
   };
}

/**
 * Template button block.
 */
export interface TemplateButton extends EmptyBlock {
   type: BlockNames.TemplateButton;
   properties?: {
      /** Button name. */
      title?: [[string]];
   };
}

export interface Breadcrumb extends EmptyBlock {
   type: BlockNames.BreadCrumb;
}

export type AdvancedBlockUnion =
   | TableOfContents
   | Equation
   | TemplateButton
   | Breadcrumb;
