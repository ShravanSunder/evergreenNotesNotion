import React from 'react';
import { Typography, Grid } from '@material-ui/core';
import { NotionBlockModel } from 'aNotion/models/NotionBlock';
import { useBlockStyles } from './useBlockStyles';
import { BaseTextUiParameters, TextUi } from './TextUi';
import { SemanticFormatEnum } from 'aNotion/types/notionV3/semanticStringTypes';

export const NumberUi = ({
   block,
   semanticFilter,
   style,
}: BaseTextUiParameters) => {
   let classes = useBlockStyles();
   return (
      <Grid container>
         <Grid item xs={1} className={classes.blockUiGrids}>
            <div className={classes.numbers}>
               <Typography display={'inline'} variant={'body1'}>
                  {' ♯ '}
               </Typography>
            </div>
         </Grid>
         <Grid item xs={11} className={classes.blockUiGrids}>
            <TextUi
               block={block}
               semanticFilter={semanticFilter}
               style={style}></TextUi>
         </Grid>
      </Grid>
   );
};
