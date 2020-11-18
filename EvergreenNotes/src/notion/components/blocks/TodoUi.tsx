import React from 'react';
import { Typography, Grid } from '@material-ui/core';
import { NotionBlockModel } from 'aNotion/models/NotionBlock';
import { ToDo } from 'aNotion/types/notionV3/notionBlockTypes';
import { useBlockStyles } from './useBlockStyles';
import { TextUi } from './TextUi';

export const TodoUi = ({ block }: { block: NotionBlockModel }) => {
   let classes = useBlockStyles();
   let todo = block.block as ToDo;
   let checked = todo.properties?.checked?.[0]?.[0] === 'Yes' ?? false;

   return (
      <Grid
         id="TodoUi"
         container
         className={classes.blockUiGrids}
         justify="flex-start">
         <Grid item className={classes.blockUiGrids}>
            <div className={classes.todo}>
               {!checked && (
                  <Typography display={'inline'} variant={'body1'}>
                     <strong>{' ☐ '}</strong>
                  </Typography>
               )}
               {checked && (
                  <Typography display={'inline'} variant={'body1'}>
                     <strong>{' ☑ '}</strong>
                  </Typography>
               )}
            </div>
         </Grid>
         <Grid item xs className={classes.blockUiGrids}>
            <TextUi
               block={block}
               style={{
                  textDecoration: checked ? 'line-through' : '',
               }}></TextUi>
         </Grid>
      </Grid>
   );
};
