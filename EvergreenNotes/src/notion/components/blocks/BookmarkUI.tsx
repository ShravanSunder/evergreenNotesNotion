import React from 'react';
import { Typography, Divider, Grid } from '@material-ui/core';
import { INotionBlockModel } from 'aNotion/models/NotionBlock';
import { blockStyles } from './blockStyles';
import { IBaseTextUiParams, TextUi } from './TextUi';
import { SemanticFormatEnum } from 'aNotion/types/notionV3/semanticStringTypes';
import { Bookmark } from 'aNotion/types/notionV3/notionBlockTypes';

export const BookmarkUi = ({
   block,
   semanticFilter,
   style,
   interactive,
}: IBaseTextUiParams) => {
   let bookmark = block.block as Bookmark;
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

   const handleOnclick = () => {
      if (bookmark?.properties?.link != null) {
         window.open(bookmark.properties.link[0][0]!);
      }
   };

   return (
      <>
         {bookmark?.properties?.link != null &&
            bookmark.properties.description != null && (
               <Grid
                  id="BookmarkUi"
                  container
                  onClick={handleOnclick}
                  style={{ cursor: 'pointer' }}>
                  <Grid item xs={11}>
                     {textUIComponent}
                  </Grid>
                  <Grid style={{ paddingTop: 6 }}></Grid>
                  <Grid item xs={11}>
                     <Typography variant="caption">
                        {bookmark.properties.description[0][0]}
                     </Typography>
                  </Grid>
               </Grid>
            )}
      </>
   );
};
