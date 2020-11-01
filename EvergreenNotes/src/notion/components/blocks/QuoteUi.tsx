import React from 'react';
import { Typography, Divider, Grid } from '@material-ui/core';
import { NotionBlockModel } from 'aNotion/models/NotionBlock';
import { useBlockStyles } from './BlockUi';
import { TextUi } from './TextUi';
import { SemanticFormatEnum } from 'aNotion/types/notionV3/semanticStringTypes';

export const QuoteUi = ({
   block,
   semanticFilter,
}: {
   block: NotionBlockModel;
   semanticFilter?: SemanticFormatEnum[];
}) => {
   let classes = useBlockStyles();
   return (
      <Grid container>
         <Grid item style={{ paddingRight: 9 }}>
            <Divider
               orientation="vertical"
               style={{ backgroundColor: '#262626', width: 2 }}></Divider>
         </Grid>
         <Grid item xs={11}>
            <TextUi block={block} semanticFilter={semanticFilter}></TextUi>
         </Grid>
      </Grid>
   );
};
