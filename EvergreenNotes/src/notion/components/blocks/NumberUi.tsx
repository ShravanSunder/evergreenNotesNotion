import React, { useState } from 'react';
import { Typography, Grid } from '@material-ui/core';
import { INotionBlockModel } from 'aNotion/models/NotionBlock';
import { blockStyles } from './blockStyles';
import { IBaseTextUiParams, TextUi } from './TextUi';
import { SemanticFormatEnum } from 'aNotion/types/notionV3/semanticStringTypes';

export const NumberUi = ({
   block,
   semanticFilter,
   style,
   interactive,
}: IBaseTextUiParams) => {
   let classes = blockStyles();
   const [hasSegments, setHasSegments] = useState(true);

   const textUIComponent = (
      <TextUi
         block={block}
         semanticFilter={semanticFilter}
         style={style}
         setHasSegments={setHasSegments}
         interactive={interactive}></TextUi>
   );

   if (!hasSegments) {
      return textUIComponent;
   }

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
            {textUIComponent}
         </Grid>
      </Grid>
   );
};
