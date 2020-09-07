import React, { useEffect } from 'react';
import { Typography, Link, Icon, SvgIcon } from '@material-ui/core';
import { NotionBlockModel } from 'aNotion/models/NotionBlock';
import { grey, red } from '@material-ui/core/colors';
import { BaseTextBlock } from 'aNotion/types/notionV3/typings/basic_blocks';
import {
   SemanticString,
   SemanticFormat,
   StringFormatting,
} from 'aNotion/types/notionV3/semanticStringTypes';
import { useSelector, useDispatch } from 'react-redux';
import { blockSelector } from 'aNotion/providers/storeSelectors';
import { getColor } from 'aNotion/services/blockService';
import { AppPromiseDispatch } from 'aNotion/providers/appDispatch';
import { blockActions } from './blockSlice';
import { getPageUrl } from 'aNotion/services/notionSiteService';
import OpenInNewOutlinedIcon from '@material-ui/icons/OpenInNewOutlined';
import { useBlockStyles } from './BlockUi';
import { LinkOutlined } from '@material-ui/icons';
import { Variant } from '@material-ui/core/styles/createTypography';

export const TextUi = ({
   block,
   variant,
   interactive,
}: {
   block: NotionBlockModel;
   variant?: Variant | undefined;
   interactive?: boolean;
}) => {
   const bb = block.block as BaseTextBlock;
   const title = bb.properties?.title as SemanticString[];

   //using interactive as a switch to truncate text size
   let textCount = 0;
   const maxLen = 150;

   let classes = useBlockStyles();

   if (title != null) {
      return (
         <React.Fragment>
            {title.map((segment, i) => {
               if (
                  interactive === false &&
                  textCount < maxLen &&
                  textCount + segment[0].length > maxLen
               ) {
                  return (
                     <Typography
                        display="inline"
                        className={classes.typography}
                        variant={variant}>
                        {'...'}
                     </Typography>
                  );
               }
               textCount += segment[0].length;
               if (interactive === false && textCount > maxLen) {
                  return null;
               }
               return (
                  <TextSegment
                     key={i}
                     segment={segment}
                     variant={variant ?? 'body1'}
                     interactive={interactive ?? true}></TextSegment>
               );
            })}
         </React.Fragment>
      );
   }
   return null;
};
const TextSegment = ({
   segment,
   variant,
   interactive,
}: {
   segment: SemanticString;
   variant: Variant;
   interactive: boolean;
}) => {
   let classes = useBlockStyles();
   let text = segment[0];
   let format = segment[1] ?? [];
   const dispatch: AppPromiseDispatch<any> = useDispatch();

   const blockData = useSelector(blockSelector);
   let { textStyle, textDetails, textType } = useSegmentData(format);
   let link: string | undefined = undefined;

   useEffect(() => {
      if (textDetails != null && textType === StringFormatting.Page) {
         dispatch(blockActions.fetchBlock({ blockId: textDetails }));
      }
   }, [dispatch, textDetails, textType]);

   if (textDetails != null && textType === StringFormatting.Page) {
      text = blockData[textDetails]?.block?.simpleTitle ?? '';
      link = getPageUrl(textDetails);
   } else if (textDetails != null && textType === StringFormatting.Link) {
      link = textDetails;
   } else if (textDetails != null && textType === StringFormatting.User) {
      text = '';
   }

   if (text == null || (text.trim().length === 0 && textDetails == null)) {
      return null;
   }

   return (
      <React.Fragment>
         {link == null && (
            <Typography
               display="inline"
               className={classes.typography}
               variant={variant}
               style={{ ...textStyle }}>
               {text}
            </Typography>
         )}
         {link != null && textType === StringFormatting.Page && (
            <Link
               display="inline"
               className={classes.typography}
               variant={variant}
               href={interactive ? link : undefined}
               target="_blank"
               style={{ ...textStyle }}>
               {' '}
               <SvgIcon
                  fontSize="inherit"
                  className={classes.inlineIcon}
                  viewBox="0 0 48 48">
                  <OpenInNewOutlinedIcon />
               </SvgIcon>
               {text}
            </Link>
         )}
         {link != null && textType === StringFormatting.Link && (
            <>
               <Typography
                  display="inline"
                  className={classes.link}
                  variant={variant}
                  style={{ ...textStyle }}>
                  {' '}
               </Typography>
               <Link
                  display="inline"
                  className={classes.link}
                  variant={variant}
                  href={interactive ? link : undefined}
                  target="_blank"
                  style={{ ...textStyle, textDecoration: 'underline' }}>
                  {text}
               </Link>
            </>
         )}
      </React.Fragment>
   );
};
const useSegmentData = (
   format: SemanticFormat[]
): {
   textStyle: React.CSSProperties;
   textDetails: string | undefined;
   textType: string | undefined;
} => {
   let textStyle: React.CSSProperties = {};
   let textDetails: string | undefined = undefined;
   let textType: StringFormatting | undefined = undefined;

   format.forEach((d) => {
      switch (d[0]) {
         case StringFormatting.Bold:
            textStyle.fontWeight = 'bold';
            break;
         case StringFormatting.Italic:
            textStyle.fontStyle = 'italic';
            break;
         case StringFormatting.Colored:
            if (d[1] != null && getColor(d[1]) != null) {
               if (d[1].includes('background')) {
                  textStyle.backgroundColor = getColor(d[1]);
               } else {
                  textStyle.color = getColor(d[1]);
               }
            }
            break;
         case StringFormatting.Strike:
            textStyle.textDecoration = 'line-through';
            break;
         case StringFormatting.User:
            if (d[1] != null) {
               textDetails = d[1];
               textType = d[0];
            }
            break;
         case StringFormatting.Link:
            if (d[1] != null) {
               textDetails = d[1];
               textType = d[0];
            }
            break;
         case StringFormatting.Page:
            textStyle.color = grey[800];
            textStyle.fontWeight = 'bold';
            if (d[1] != null) {
               textDetails = d[1];
               textType = d[0];
            }
            break;
         case StringFormatting.InlineCode:
            textStyle.fontFamily = 'Consolas';
            textStyle.background = grey[300];
            textStyle.color = red[700];
            break;
      }
   });

   return { textStyle: { ...textStyle }, textType, textDetails };
};
