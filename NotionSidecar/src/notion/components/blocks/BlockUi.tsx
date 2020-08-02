import React, { useState } from 'react';
import { Typography, Divider, Grid } from '@material-ui/core';
import { NotionBlockModel } from 'aNotion/models/NotionBlock';
import { BlockTypes } from 'aNotion/types/notionV3/BlockTypes';
import { Variant } from '@material-ui/core/styles/createTypography';
import { grey } from '@material-ui/core/colors';
import { Callout } from 'aNotion/types/notionV3/notionBlockTypes';

export const BlockUi = ({ block }: { block: NotionBlockModel }) => {
   let variant: Variant | undefined = undefined;
   switch (block.type) {
      case BlockTypes.Text:
      case BlockTypes.Date:
      case BlockTypes.Bookmark:
      case BlockTypes.Equation:
         variant = 'body1';
         break;
      case BlockTypes.Header1:
      case BlockTypes.Page:
      case BlockTypes.CollectionViewPage:
         variant = 'h4';
         break;
      case BlockTypes.Header2:
         variant = 'h5';
         break;
      case BlockTypes.Header3:
         variant = 'h6';
         break;
      case BlockTypes.Code:
         variant = 'caption';
         break;
   }
   return (
      <div>
         {variant != null && (
            <Typography variant={variant} key={block.blockId}>
               {block.simpleTitle}
            </Typography>
         )}
         {block.type === BlockTypes.Divider && <Divider></Divider>}
         {block.type === BlockTypes.Callout && (
            <CalloutUi block={block}></CalloutUi>
         )}
         {block.type === BlockTypes.ButtetedList && (
            <Typography variant={'body1'} style={{ paddingLeft: 6 }}>
               {' •    ' + block.simpleTitle}{' '}
            </Typography>
         )}
         {block.type === BlockTypes.NumberedList && (
            <Typography variant={'body1'} style={{ paddingLeft: 6 }}>
               {' #    ' + block.simpleTitle}
            </Typography>
         )}
      </div>
   );
};

const CalloutUi = ({ block }: { block: NotionBlockModel }) => {
   var callout = block.block as Callout;
   return (
      <Grid container style={{ padding: 12 }}>
         <Grid item>
            <Typography
               variant={'body1'}
               style={{ paddingLeft: 3, paddingRight: 6 }}>
               {block.block?.format?.page_icon}
            </Typography>
         </Grid>
         <Grid item xs alignItems="flex-start">
            <Typography variant={'body1'} style={{ whiteSpace: 'pre-line' }}>
               {block.simpleTitle}
            </Typography>
         </Grid>
      </Grid>
   );
};

const useBlockColor = (block: NotionBlockModel) => {
   const [color, setColor] = useState('');

   if (block.block?.format?.block_color != null) {
   }
};
