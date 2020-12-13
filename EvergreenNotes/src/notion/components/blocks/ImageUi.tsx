import React, { Suspense } from 'react';
import { Grid, Box } from '@material-ui/core';
import { INotionBlockModel } from 'aNotion/models/NotionBlock';
import { Image } from 'aNotion/types/notionV3/notionBlockTypes';
import { blockStyles } from './blockStyles';
import { ErrorBoundary, ErrorFallback } from 'aCommon/Components/ErrorFallback';
import { LoadingImage } from '../common/Loading';

export const ImageUi = ({ block }: { block: INotionBlockModel }) => {
   let classes = blockStyles();
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
            <div id="ImageUI" style={{ padding: 3 }}>
               <Box width={1}>
                  <img
                     src={notionUrl}
                     alt={txt}
                     style={{ maxWidth: '100%' }}></img>
               </Box>
            </div>
         </Suspense>
      </ErrorBoundary>
   );
};
