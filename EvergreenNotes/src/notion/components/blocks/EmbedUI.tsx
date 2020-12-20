import React from 'react';
import { Box, Grid, Link, Typography, useTheme } from '@material-ui/core';
import { blockStyles } from './blockStyles';
import { IBaseTextUiParams, TextUi } from './TextUi';
import { IBaseSourceBlock as IBaseEmbedBlock } from 'aNotion/types/notionV3/definitions/basic_blocks';
import { BlockTypeEnum, inBlockTypes } from 'aNotion/types/notionV3/BlockTypes';
import { TextSegment } from './TextSegment';
import { Segment } from 'aNotion/types/notionV3/semanticStringTypes';
import { CaptionUi } from './CaptionUI';

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
      let notionUrl = source;
      if (
         source != null &&
         block.type !== BlockTypeEnum.Embed &&
         block.type !== BlockTypeEnum.Video &&
         inBlockTypes(block.type)
      ) {
         notionUrl =
            'https://www.notion.so/signed/' +
            encodeURIComponent(source) +
            `?table=block&id=${block.blockId}`;
      }

      window.open(notionUrl);
   };

   return (
      <>
         {source != null && (
            <Box onClick={handleClick} className={classes.embed} border={1}>
               <Grid id="EmbedUi" container>
                  <Grid item xs={12}>
                     <Link variant="body1" target="_blank" href={source}>
                        {title ?? block.type}
                     </Link>
                  </Grid>
                  <Grid item>
                     <div style={{ marginTop: theme.spacing(1) }}></div>
                  </Grid>
                  {caption != null && (
                     <Grid item>
                        <CaptionUi captions={caption} />
                     </Grid>
                  )}
                  <Grid item>
                     <div style={{ marginTop: theme.spacing(2) }}></div>
                  </Grid>
               </Grid>
            </Box>
         )}
      </>
   );
};
