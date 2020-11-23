import React, { useState } from 'react';
import { Typography, Grid, IconButton } from '@material-ui/core';
import { INotionBlockModel } from 'aNotion/models/NotionBlock';
import { Toggle } from 'aNotion/types/notionV3/notionBlockTypes';
import { ArrowDropDown, ArrowRight } from '@material-ui/icons';
import { NotionContentWithParentId } from 'aNotion/components/contents/NotionContent';
import { useBlockStyles } from './useBlockStyles';
import { IBaseTextUiParams, TextUi } from './TextUi';
import { SemanticFormatEnum } from 'aNotion/types/notionV3/semanticStringTypes';
import { aggregateParentSemanticFilter } from 'aNotion/services/blockService';

interface IToggleUIParams extends IBaseTextUiParams {
   doNotRenderChildBlocks?: boolean;
}

export const ToggleUi = ({
   block,
   semanticFilter,
   style,
   interactive,
   doNotRenderChildBlocks = false,
}: IToggleUIParams) => {
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
               <IconButton
                  size="small"
                  onClick={handleClick}
                  disabled={doNotRenderChildBlocks}>
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
               interactive={interactive}
            />
            {expanded && !doNotRenderChildBlocks && (
               <NotionContentWithParentId
                  parentBlockId={block.blockId}
                  semanticFilter={aggregatedSemanticFilter}
                  interactive={interactive}
                  style={style}></NotionContentWithParentId>
            )}
         </Grid>
      </Grid>
   );
};
