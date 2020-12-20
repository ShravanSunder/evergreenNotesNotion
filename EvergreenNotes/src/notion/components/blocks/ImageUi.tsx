import React, { Suspense } from 'react';
import { Grid, Box, useTheme } from '@material-ui/core';
import { INotionBlockModel } from 'aNotion/models/NotionBlock';
import { Image } from 'aNotion/types/notionV3/notionBlockTypes';
import { blockStyles } from './blockStyles';
import { ErrorBoundary, ErrorFallback } from 'aCommon/Components/ErrorFallback';
import { LoadingImage } from '../common/Loading';
import { Segment } from 'aNotion/types/notionV3/semanticStringTypes';
import { TextSegment } from './TextSegment';

export const ImageUi = ({ block }: { block: INotionBlockModel }) => {
   const classes = blockStyles();
   const image = block.block as Image;
   const theme = useTheme();

   const src = image.properties?.source?.[0]?.[0] ?? '';
   const txt = image.properties?.caption?.[0]?.[0] ?? '';
   const caption: Segment[] | undefined =
      image?.properties?.caption ?? undefined;

   const notionUrl =
      'https://www.notion.so/image/' +
      encodeURIComponent(src) +
      `?table=block&id=${block.blockId}&width=${520}`;

   return (
      <ErrorBoundary FallbackComponent={ErrorFallback}>
         <Suspense fallback={<LoadingImage />}>
            <Grid id="EmbedUi" container>
               <Grid item xs={12}>
                  <div id="ImageUI" style={{ padding: 3 }}>
                     <Box width={1}>
                        <img
                           src={notionUrl}
                           alt={txt}
                           style={{ maxWidth: '100%' }}></img>
                     </Box>
                  </div>
               </Grid>
               <Grid item>
                  <div style={{ marginTop: theme.spacing(1) }}></div>
               </Grid>
               <Grid item>
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
               <Grid item>
                  <div style={{ marginTop: theme.spacing(2) }}></div>
               </Grid>
            </Grid>
         </Suspense>
      </ErrorBoundary>
   );
};
