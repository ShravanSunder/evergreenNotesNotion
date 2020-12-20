import React from 'react';
import { Box, Grid, Link, Typography, useTheme } from '@material-ui/core';
import { blockStyles } from './blockStyles';
import { IBaseTextUiParams, TextUi } from './TextUi';
import { IBaseSourceBlock as IBaseEmbedBlock } from 'aNotion/types/notionV3/definitions/basic_blocks';
import { BlockTypeEnum } from 'aNotion/types/notionV3/BlockTypes';
import { TextSegment } from './TextSegment';
import { Segment } from 'aNotion/types/notionV3/semanticStringTypes';

export const EmbedUi = ({
   block,
   semanticFilter,
   style,
   interactive,
}: IBaseTextUiParams) => {
   let embed = block.block as IBaseEmbedBlock;
   let classes = blockStyles();

   const theme = useTheme();

   const source = embed?.properties?.source?.[0]?.[0] ?? undefined;
   const title =
      embed?.properties?.title?.[0]?.[0] ??
      block.type + ': ' + source?.substring(0, 20) + '...';
   const caption: Segment[] | undefined =
      embed?.properties?.caption ?? undefined;

   const handleClick = () => {
      window.open(source);
   };

   return (
      <>
         {source != null && (
            <Box onClick={handleClick} className={classes.embed}>
               <Grid id="EmbedUi" container>
                  <Grid item xs={12}>
                     <Link variant="body1" target="_blank" href={source}>
                        {title ?? block.type}
                     </Link>
                  </Grid>
                  <Grid style={{ paddingTop: theme.spacing(2) }}></Grid>
                  <Grid>
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
