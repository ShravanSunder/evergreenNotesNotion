import React, { useState } from 'react';
import { Typography, Grid, IconButton } from '@material-ui/core';
import { INotionBlockModel } from 'aNotion/models/NotionBlock';
import { Toggle } from 'aNotion/types/notionV3/notionBlockTypes';
import { ArrowDropDown, ArrowRight } from '@material-ui/icons';
import { NotionContentWithParentId } from 'aNotion/components/contents/NotionContent';
import { blockStyles } from './blockStyles';
import { IBaseTextUiParams, TextUi } from './TextUi';
import { SemanticFormatEnum } from 'aNotion/types/notionV3/semanticStringTypes';
import { aggregateParentSemanticFilter } from 'aNotion/services/blockService';

interface IToggleUIParams extends IBaseTextUiParams {
   disableToggles?: boolean;
}

export const ToggleUi = ({
   block,
   semanticFilter,
   style,
   interactive,
   disableToggles = false,
}: IToggleUIParams) => {
   let classes = blockStyles();

   const [expanded, setExpanded] = useState(false);
   const [hasSegments, setHasSegments] = useState(true);
   const handleClick = (e: React.SyntheticEvent) => {
      e.stopPropagation();
      setExpanded(!expanded);
   };

   const aggregatedSemanticFilter: SemanticFormatEnum[] = aggregateParentSemanticFilter(
      style,
      semanticFilter
   );

   const textUIComponent = (
      <TextUi
         block={block}
         semanticFilter={semanticFilter}
         style={style}
         setHasSegments={setHasSegments}
         interactive={interactive}></TextUi>
   );

   const minimumTextSpace = (
      <Typography
         display="inline"
         className={classes.typography}
         variant={'body1'}>
         {' '}
      </Typography>
   );

   return (
      <Grid id="ToggleUI" container>
         <Grid item className={classes.blockUiGrids}>
            <div className={classes.toggle}>
               <IconButton
                  size="small"
                  onClick={handleClick}
                  disabled={disableToggles}>
                  {expanded && <ArrowDropDown fontSize="inherit" />}
                  {!expanded && <ArrowRight fontSize="inherit" />}
               </IconButton>
            </div>
         </Grid>
         <Grid item xs className={classes.blockUiGrids}>
            {textUIComponent}
            {/* the below is to make sure text line space is taken up*/}
            {!hasSegments && minimumTextSpace}
            {expanded && !disableToggles && (
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
