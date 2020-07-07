import * as base from '../../baseNotionTypes';

/**
 * Everything about how to layout a block.
 */
export interface BlockFormat {
   block_locked?: boolean;
   /** User ID. */
   block_locked_by?: base.UUID;
   block_color?: base.NotionColor;
   block_width?: number;
   block_height?: number;
   /** Full viewport width. */
   block_full_width?: boolean;
   /** The same width as the parent page. */
   block_page_width?: boolean;
   /** Height divided by width. */
   block_aspect_ratio?: number;
   /** Whether to force isotropic [scaling](https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/scale). */
   block_preserve_scale?: boolean;
   /** Icon URL of the bookmarked web page. */
   bookmark_icon?: base.PublicUrl;
   /** Cover URL of the bookmarked web page. */
   bookmark_cover?: base.PublicUrl;
   column_ratio?: base.Proportion;
   code_wrap?: boolean;
   display_source?: base.NotionSecureUrl | base.PublicUrl;
   page_icon?: base.Emoji | base.NotionSecureUrl | base.PublicUrl;
   page_cover?: base.NotionRelativePath | base.NotionSecureUrl | base.PublicUrl;
   page_full_width?: boolean;
   page_cover_position?: base.Proportion;
}
