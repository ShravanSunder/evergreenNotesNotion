import React from 'react';
import { Typography, Grid } from '@material-ui/core';
import { INotionBlockModel } from 'aNotion/models/NotionBlock';
import { ToDo } from 'aNotion/types/notionV3/notionBlockTypes';
import { useBlockStyles } from './useBlockStyles';
import { IBaseTextUiParams, TextUi } from './TextUi';

export const TodoUi = ({
   block,
   semanticFilter,
   style,
   interactive,
}: IBaseTextUiParams) => {
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
               interactive={interactive}
               semanticFilter={semanticFilter}
               style={{
                  textDecoration: checked ? 'line-through' : '',
               }}></TextUi>
         </Grid>
      </Grid>
   );
};
