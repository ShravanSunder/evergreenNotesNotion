import React from 'react';
import { Typography, Divider, Grid, Box } from '@material-ui/core';
import { INotionBlockModel } from 'aNotion/models/NotionBlock';
import { blockStyles } from './blockStyles';
import { IBaseTextUiParams, TextUi } from './TextUi';
import {
   Segment,
   SemanticFormatEnum,
} from 'aNotion/types/notionV3/semanticStringTypes';
import { Bookmark } from 'aNotion/types/notionV3/notionBlockTypes';
import { TextSegment } from './TextSegment';

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
               <Box onClick={handleClick} className={classes.embed}>
                  <Grid
                     id="BookmarkUi"
                     container
                     onClick={handleClick}
                     style={{ cursor: 'pointer' }}>
                     <Grid item xs={11}>
                        {textUIComponent}
                     </Grid>
                     <Grid style={{ paddingTop: 12 }}></Grid>
                     <Grid item xs={11}>
                        <Typography variant="body2">
                           {bookmark.properties.description[0][0]}
                        </Typography>
                     </Grid>
                     <Grid style={{ paddingTop: 12 }}></Grid>
                     <Grid item xs={11}>
                        {caption != null &&
                           caption.length > 0 &&
                           caption.map((s, i) => (
                              <TextSegment
                                 key={i}
                                 segment={s}
                                 variant="caption"
                                 incrementSegmentCount={() => {}}
                                 interactive={false}></TextSegment>
                           ))}
                     </Grid>
                  </Grid>
               </Box>
            )}
      </>
   );
};
