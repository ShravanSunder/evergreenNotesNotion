import React from 'react';
import { Typography, Grid } from '@material-ui/core';
import { INotionBlockModel } from 'aNotion/models/NotionBlock';
import { useBlockStyles } from './useBlockStyles';
import { IBaseTextUiParams, TextUi } from './TextUi';
import { SemanticFormatEnum } from 'aNotion/types/notionV3/semanticStringTypes';

export const NumberUi = ({
   block,
   semanticFilter,
   style,
}: IBaseTextUiParams) => {
   let classes = useBlockStyles();
   return (
      <Grid id="NumberUI" container>
         <Grid item className={classes.blockUiGrids}>
            <div className={classes.numbers}>
               <Typography display={'inline'} variant={'body1'}>
                  {' ♯ '}
               </Typography>
            </div>
         </Grid>
         <Grid item xs className={classes.blockUiGrids}>
            <TextUi
               block={block}
               semanticFilter={semanticFilter}
               style={style}></TextUi>
         </Grid>
      </Grid>
   );
};
