import React, { useState } from 'react';
import { Typography, Grid, IconButton } from '@material-ui/core';
import { NotionBlockModel } from 'aNotion/models/NotionBlock';
import { Toggle } from 'aNotion/types/notionV3/notionBlockTypes';
import { ArrowDropDown, ArrowRight } from '@material-ui/icons';
import { NotionContent } from '../contents/NotionContent';
import { useBlockStyles } from './BlockUi';
export const ToggleUi = ({ block }: { block: NotionBlockModel }) => {
   let classes = useBlockStyles();
   let toggle = block.block as Toggle;

   const [expanded, setExpanded] = useState(false);
   const handleClick = (e: React.SyntheticEvent) => {
      e.stopPropagation();
      setExpanded(!expanded);
   };

   return (
      <Grid container>
         <Grid item xs={1} style={{ paddingLeft: 3 }}>
            <IconButton size="small" onClick={handleClick}>
               {expanded && <ArrowDropDown fontSize="inherit" />}
               {!expanded && <ArrowRight fontSize="inherit" />}
            </IconButton>
         </Grid>
         <Grid item xs={11}>
            <Typography
               display={'inline'}
               variant={'body1'}
               className={classes.typography}>
               {block.simpleTitle}
            </Typography>
            {expanded && (
               <NotionContent blockId={block.blockId}></NotionContent>
            )}
         </Grid>
      </Grid>
   );
};
