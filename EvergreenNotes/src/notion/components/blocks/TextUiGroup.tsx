import React from 'react';
import { Typography, Grid } from '@material-ui/core';
import { useBlockStyles } from './BlockUi';
import { TextUi, TextUiParameters } from './TextUi';
import {
   getBackgroundColor,
   getForegroundColor,
   aggregateParentSemanticFilter,
   inheritAndCombineStyles,
} from 'aNotion/services/blockService';
import { SemanticFormatEnum } from 'aNotion/types/notionV3/semanticStringTypes';
import { NotionContent } from '../contents/NotionContent';

export const TextUiGroup = ({
   block,
   variant,
   semanticFilter,
   style,
}: TextUiParameters) => {
   let classes = useBlockStyles();
   let backgroundColor = getBackgroundColor(block);
   let color = getForegroundColor(block);
   const hasChildren = block.contentIds.length > 0;

   const blockStyle: React.CSSProperties = inheritAndCombineStyles(
      style,
      backgroundColor,
      color
   );

   const aggregatedSemanticFilter: SemanticFormatEnum[] = aggregateParentSemanticFilter(
      blockStyle,
      semanticFilter
   );

   return (
      <Grid container alignItems="flex-start" style={style}>
         <Grid item xs={12} className={classes.indentColumnBlock}>
            {
               <TextUi
                  variant={variant}
                  block={block}
                  semanticFilter={semanticFilter}
                  style={style}></TextUi>
            }
         </Grid>
         {hasChildren && (
            <>
               <Grid item xs={1}></Grid>
               <Grid item xs={11}>
                  <NotionContent
                     blockId={block.blockId}
                     semanticFilter={aggregatedSemanticFilter}
                     style={style}></NotionContent>
               </Grid>
            </>
         )}
      </Grid>
   );
};
