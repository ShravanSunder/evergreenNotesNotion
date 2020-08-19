import React from 'react';
import { Typography, Grid } from '@material-ui/core';
import { NotionBlockModel } from 'aNotion/models/NotionBlock';
import { ToDo } from 'aNotion/types/notionV3/notionBlockTypes';
import { useBlockStyles } from './BlockUi';
export const TodoUi = ({ block }: { block: NotionBlockModel }) => {
   let classes = useBlockStyles();
   let todo = block.block as ToDo;
   let checked = todo.properties?.checked?.[0]?.[0] === 'Yes' ?? false;
   return (
      <Grid container>
         <Grid item xs={1} style={{ paddingLeft: 3, paddingRight: 6 }}>
            {!checked && (
               <Typography display={'inline'} variant={'body1'}>
                  {' ☐ '}
               </Typography>
            )}
            {checked && (
               <Typography display={'inline'} variant={'body1'}>
                  {' ☑ '}
               </Typography>
            )}
         </Grid>
         <Grid item xs={11}>
            <Typography
               display={'inline'}
               variant={'body1'}
               style={{ textDecoration: checked ? 'line-through' : '' }}
               className={classes.typography}>
               {block.simpleTitle}
            </Typography>
         </Grid>
      </Grid>
   );
};
