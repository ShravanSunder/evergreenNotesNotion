import React from 'react';
import { Typography, Divider, Grid } from '@material-ui/core';
import { INotionBlockModel } from 'aNotion/models/NotionBlock';
import { blockStyles } from './blockStyles';
import { IBaseTextUiParams, TextUi } from './TextUi';
import { SemanticFormatEnum } from 'aNotion/types/notionV3/semanticStringTypes';

export const QuoteUi = ({
   block,
   semanticFilter,
   style,
   interactive,
}: IBaseTextUiParams) => {
   let classes = blockStyles();

   const textUIComponent = (
      <TextUi
         block={block}
         semanticFilter={semanticFilter}
         style={style}
         interactive={interactive}></TextUi>
   );

   if (textUIComponent == null) {
      return null;
   }

   return (
      <Grid id="QuoteUI" container>
         <Grid item style={{ paddingRight: 9 }}>
            <Divider
               orientation="vertical"
               style={{ backgroundColor: '#262626', width: 2 }}></Divider>
         </Grid>
         <Grid item xs={11}>
            {textUIComponent}
         </Grid>
      </Grid>
   );
};
