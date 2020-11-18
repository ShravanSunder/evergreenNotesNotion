import React, { useState } from 'react';
import { Typography, Grid, IconButton } from '@material-ui/core';
import { NotionBlockModel } from 'aNotion/models/NotionBlock';
import { Toggle } from 'aNotion/types/notionV3/notionBlockTypes';
import { ArrowDropDown, ArrowRight } from '@material-ui/icons';
import { NotionContentWithParentId } from 'aNotion/components/contents/NotionContent';
import { useBlockStyles } from './useBlockStyles';
import { BaseTextUiParameters, TextUi } from './TextUi';
import { SemanticFormatEnum } from 'aNotion/types/notionV3/semanticStringTypes';
import { aggregateParentSemanticFilter } from 'aNotion/services/blockService';

export const ToggleUi = ({
   block,
   semanticFilter,
   style,
}: BaseTextUiParameters) => {
   let classes = useBlockStyles();
   let toggle = block.block as Toggle;

   const [expanded, setExpanded] = useState(false);
   const handleClick = (e: React.SyntheticEvent) => {
      e.stopPropagation();
      setExpanded(!expanded);
   };

   const aggregatedSemanticFilter: SemanticFormatEnum[] = aggregateParentSemanticFilter(
      style,
      semanticFilter
   );

   return (
      <Grid id="ToggleUI" container>
         <Grid item className={classes.blockUiGrids}>
            <div className={classes.toggle}>
               <IconButton size="small" onClick={handleClick}>
                  {expanded && <ArrowDropDown fontSize="inherit" />}
                  {!expanded && <ArrowRight fontSize="inherit" />}
               </IconButton>
            </div>
         </Grid>
         <Grid item xs className={classes.blockUiGrids}>
            <TextUi
               block={block}
               semanticFilter={semanticFilter}
               style={style}
            />
            {expanded && (
               <NotionContentWithParentId
                  parentBlockId={block.blockId}
                  semanticFilter={aggregatedSemanticFilter}
                  style={style}></NotionContentWithParentId>
            )}
         </Grid>
      </Grid>
   );
};
