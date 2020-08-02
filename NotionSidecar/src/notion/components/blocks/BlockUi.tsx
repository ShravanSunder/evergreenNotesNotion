import React, { useState } from 'react';
import {
   Typography,
   Divider,
   Grid,
   makeStyles,
   createStyles,
   Theme,
} from '@material-ui/core';
import { NotionBlockModel } from 'aNotion/models/NotionBlock';
import { BlockTypes } from 'aNotion/types/notionV3/BlockTypes';
import { Variant } from '@material-ui/core/styles/createTypography';
import {
   grey,
   brown,
   purple,
   deepOrange,
   yellow,
   teal,
   blue,
   pink,
   red,
} from '@material-ui/core/colors';
import { Callout } from 'aNotion/types/notionV3/notionBlockTypes';

const useStyles = makeStyles((theme: Theme) =>
   createStyles({
      block: {
         margin: 6,
         padding: 3,
      },
      typography: {
         overflowWrap: 'break-word',
      },
   })
);

export const BlockUi = ({
   block,
   index,
}: {
   block: NotionBlockModel;
   index: number;
}) => {
   let classes = useStyles();
   let variant = useVariant(block);
   let backgroundColor = useBackgroundColor(block);

   return (
      <div
         className={classes.block}
         style={{ backgroundColor: backgroundColor }}>
         {variant != null && (
            <Typography className={classes.typography} variant={variant}>
               {block.simpleTitle}
            </Typography>
         )}
         {block.type === BlockTypes.Divider && <Divider></Divider>}
         {block.type === BlockTypes.Callout && (
            <CalloutUi block={block}></CalloutUi>
         )}
         {block.type === BlockTypes.Quote && <QuoteUi block={block} />}
         {block.type === BlockTypes.ButtetedList && <BulletUi block={block} />}
         {block.type === BlockTypes.NumberedList && <NumberUi block={block} />}
      </div>
   );
};

const BulletUi = ({ block }: { block: NotionBlockModel }) => {
   let classes = useStyles();
   return (
      <Grid container>
         <Grid item style={{ paddingLeft: 9, paddingRight: 9 }}>
            <Typography display={'inline'} variant={'body1'}>
               {' •  '}
            </Typography>
         </Grid>
         <Grid item xs={11} alignItems="flex-start">
            <Typography
               display={'inline'}
               variant={'body1'}
               className={classes.typography}>
               {block.simpleTitle}
            </Typography>
         </Grid>
      </Grid>
   );
};

const NumberUi = ({ block }: { block: NotionBlockModel }) => {
   let classes = useStyles();
   return (
      <Grid container>
         <Grid item style={{ paddingLeft: 9, paddingRight: 9 }}>
            <Typography display={'inline'} variant={'body1'}>
               {' #  '}
            </Typography>
         </Grid>
         <Grid item xs={11} alignItems="flex-start">
            <div>
               <Typography
                  display={'inline'}
                  variant={'body1'}
                  className={classes.typography}>
                  {block.simpleTitle}
               </Typography>
            </div>
         </Grid>
      </Grid>
   );
};

const QuoteUi = ({ block }: { block: NotionBlockModel }) => {
   let classes = useStyles();
   return (
      <Grid container>
         <Grid item style={{ paddingRight: 9 }}>
            <Divider
               orientation="vertical"
               style={{ backgroundColor: '#262626', width: 2 }}></Divider>
         </Grid>
         <Grid item xs={11} alignItems="flex-start">
            <div>
               <Typography
                  display={'inline'}
                  variant={'body1'}
                  className={classes.typography}>
                  {block.simpleTitle}
               </Typography>
            </div>
         </Grid>
      </Grid>
   );
};

const CalloutUi = ({ block }: { block: NotionBlockModel }) => {
   let classes = useStyles();
   var callout = block.block as Callout;
   return (
      <Grid container style={{ padding: 6 }}>
         <Grid item style={{ paddingLeft: 9, paddingRight: 9 }}>
            <Typography variant={'body1'}>
               {block.block?.format?.page_icon}
            </Typography>
         </Grid>
         <Grid item xs={10} alignItems="flex-start">
            <Typography variant={'body1'} className={classes.typography}>
               {block.simpleTitle}
            </Typography>
         </Grid>
      </Grid>
   );
};

const useBackgroundColor = (block: NotionBlockModel) => {
   if (block.block?.format?.block_color != null) {
      switch (block.block?.format?.block_color) {
         case 'gray_background':
            return grey[200];
         case 'brown_background':
            return brown[100];
         case 'orange_background':
            return deepOrange[50];
         case 'yellow_background':
            return yellow[50];
         case 'teal_background':
            return teal[50];
         case 'blue_background':
            return blue[50];
         case 'purple_background':
            return purple[50];
         case 'pink_background':
            return pink[50];
         case 'red_background':
            return red[50];
      }
   }

   //transparent
   return '#FFFFFF';
};
function useVariant(block: NotionBlockModel) {
   let variant: Variant | undefined;
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
   return variant;
}
