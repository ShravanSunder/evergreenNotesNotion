import React from 'react';
import { Typography, Divider, Grid, useTheme, Box } from '@material-ui/core';
import { INotionBlockModel } from 'aNotion/models/NotionBlock';
import { blockStyles } from './blockStyles';
import { IBaseTextUiParams, TextUi } from './TextUi';
import {
   Segment,
   SemanticFormatEnum,
} from 'aNotion/types/notionV3/semanticStringTypes';
import { Bookmark } from 'aNotion/types/notionV3/notionBlockTypes';
import { TextSegment } from './TextSegment';
import { CaptionUi } from './CaptionUI';

export const BookmarkUi = ({
   block,
   semanticFilter,
   style,
   interactive,
}: IBaseTextUiParams) => {
   let bookmark = block.block as Bookmark;
   let classes = blockStyles();

   const theme = useTheme();

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

   const caption: Segment[] | undefined =
      bookmark?.properties?.caption ?? undefined;

   const handleClick = () => {
      if (bookmark?.properties?.link != null) {
         window.open(bookmark.properties.link[0][0]!);
      }
   };

   return (
      <>
         {bookmark?.properties?.link != null &&
            bookmark.properties.description != null && (
               <Box onClick={handleClick} className={classes.embed} border={1}>
                  <Grid
                     id="BookmarkUi"
                     container
                     onClick={handleClick}
                     style={{ cursor: 'pointer' }}>
                     <Grid item xs={11}>
                        {textUIComponent}
                     </Grid>
                     <Grid item>
                        <div style={{ marginTop: theme.spacing(1) }}></div>
                     </Grid>
                     <Grid item xs={11}>
                        <Typography variant="body2">
                           {bookmark.properties.description[0][0]}
                        </Typography>
                     </Grid>
                     <Grid item>
                        <div style={{ marginTop: theme.spacing(2) }}></div>
                     </Grid>
                     {caption != null && (
                        <Grid item>
                           <CaptionUi captions={caption} />
                        </Grid>
                     )}
                  </Grid>
               </Box>
            )}
      </>
   );
};
