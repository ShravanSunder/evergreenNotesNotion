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
      <Grid container className={classes.blockUiGrids} justify="flex-start">
         <Grid item xs={1} className={classes.blockUiGrids}>
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
         <Grid item xs={11} className={classes.blockUiGrids}>
            <TextUi
               block={block}
               style={{
                  textDecoration: checked ? 'line-through' : '',
               }}></TextUi>
         </Grid>
      </Grid>
   );
};
