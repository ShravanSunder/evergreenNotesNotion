import React, { Suspense } from 'react';
import { Grid, Box } from '@material-ui/core';
import { NotionBlockModel } from 'aNotion/models/NotionBlock';
import { Image } from 'aNotion/types/notionV3/notionBlockTypes';
import { useBlockStyles } from './BlockUi';
import { ErrorBoundary, ErrorFallback } from 'aCommon/Components/ErrorFallback';
import { LoadingImage } from '../common/Loading';

export const ImageUi = ({ block }: { block: NotionBlockModel }) => {
   let classes = useBlockStyles();
   let image = block.block as Image;

   let src = image.properties?.source?.[0]?.[0] ?? '';
   let txt = image.properties?.caption?.[0]?.[0] ?? '';

   let notionUrl =
      'https://www.notion.so/image/' +
      encodeURIComponent(src) +
      `?table=block&id=${block.blockId}&width=${520}`;

   return (
      <ErrorBoundary FallbackComponent={ErrorFallback}>
         <Suspense fallback={<LoadingImage />}>
            <Grid container style={{ padding: 6 }}>
               <Grid xs={12} item style={{ paddingLeft: 9, paddingRight: 9 }}>
                  <Box width={1}>
                     <img
                        src={notionUrl}
                        alt={txt}
                        style={{ maxWidth: '100%' }}></img>
                  </Box>
               </Grid>
            </Grid>
         </Suspense>
      </ErrorBoundary>
   );
};
