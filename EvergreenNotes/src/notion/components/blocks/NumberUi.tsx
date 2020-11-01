import React from 'react';
import { Typography, Grid } from '@material-ui/core';
import { NotionBlockModel } from 'aNotion/models/NotionBlock';
import { useBlockStyles } from './BlockUi';
import { TextUi } from './TextUi';
import { SemanticFormatEnum } from 'aNotion/types/notionV3/semanticStringTypes';
export const NumberUi = ({
   block,
   semanticFilter,
}: {
   block: NotionBlockModel;
   semanticFilter?: SemanticFormatEnum[];
}) => {
   let classes = useBlockStyles();
   return (
      <Grid container>
         <Grid item xs={1} className={classes.indentColumnBlock}>
            <Typography display={'inline'} variant={'body1'}>
               {' # '}
            </Typography>
         </Grid>
         <Grid item xs={11}>
            <TextUi block={block} semanticFilter={semanticFilter}></TextUi>
         </Grid>
      </Grid>
   );
};
