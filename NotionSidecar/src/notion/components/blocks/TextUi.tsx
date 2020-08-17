import React, { useEffect } from 'react';
import { Typography, Link, Icon } from '@material-ui/core';
import { NotionBlockModel } from 'aNotion/models/NotionBlock';
import { grey, red } from '@material-ui/core/colors';
import { BaseTextBlock } from 'aNotion/types/notionV3/typings/basic_blocks';
import {
   SemanticString,
   SemanticFormat,
   StringFormats,
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

export const TextUi = ({ block }: { block: NotionBlockModel }) => {
   let classes = useBlockStyles();

   let bb = block.block as BaseTextBlock;
   let title = bb.properties?.title;

   if (title != null) {
      return (
         <React.Fragment>
            {title.map((segment, i) => {
               return <TextSegment key={i} segment={segment}></TextSegment>;
            })}
         </React.Fragment>
      );
   }
   return null;
};
const TextSegment = ({ segment }: { segment: SemanticString }) => {
   let classes = useBlockStyles();
   let text = segment[0];
   let format = segment[1] ?? [];
   const dispatch: AppPromiseDispatch<any> = useDispatch();

   const blockData = useSelector(blockSelector);
   let { textStyle, textDetails, textType } = useSegmentData(format);
   let link: string | undefined = undefined;

   useEffect(() => {
      if (textDetails != null && textType === StringFormats.Page) {
         dispatch(blockActions.fetchBlock({ blockId: textDetails }));
      }
   }, [dispatch, textDetails, textType]);

   if (textDetails != null && textType === StringFormats.Page) {
      text = blockData[textDetails]?.block?.simpleTitle ?? '';
      link = getPageUrl(textDetails);
   } else if (textDetails != null && textType === StringFormats.Link) {
      link = textDetails;
   } else if (textDetails != null && textType === StringFormats.User) {
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
               variant={'body1'}
               style={textStyle}>
               {text}
            </Typography>
         )}
         {link != null && textType === StringFormats.Page && (
            <Link
               display="inline"
               className={classes.typography}
               variant={'body1'}
               href={link}
               target="_blank"
               style={{ ...textStyle }}>
               <Icon fontSize="small" className={classes.inlineIcon}>
                  <OpenInNewOutlinedIcon />
               </Icon>
               {text}
            </Link>
         )}
         {link != null && textType === StringFormats.Link && (
            <Link
               display="inline"
               className={classes.link}
               variant={'body1'}
               href={link}
               target="_blank"
               style={{ ...textStyle, textDecoration: 'underline' }}>
               <Icon fontSize="small" className={classes.inlineIcon}>
                  <LinkOutlined />
               </Icon>
               {text}
            </Link>
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
   let textType: StringFormats | undefined = undefined;

   format.forEach((d) => {
      switch (d[0]) {
         case StringFormats.Bold:
            textStyle.fontWeight = 'bold';
            break;
         case StringFormats.Italic:
            textStyle.fontStyle = 'italic';
            break;
         case StringFormats.Colored:
            if (d[1] != null && getColor(d[1]) != null) {
               if (d[1].includes('background')) {
                  textStyle.backgroundColor = getColor(d[1]);
               } else {
                  textStyle.color = getColor(d[1]);
               }
            }
            break;
         case StringFormats.Strike:
            textStyle.textDecoration = 'line-through';
            break;
         case StringFormats.User:
            if (d[1] != null) {
               textDetails = d[1];
               textType = d[0];
            }
            break;
         case StringFormats.Link:
            if (d[1] != null) {
               textDetails = d[1];
               textType = d[0];
            }
            break;
         case StringFormats.Page:
            textStyle.color = grey[800];
            textStyle.fontWeight = 'bold';
            if (d[1] != null) {
               textDetails = d[1];
               textType = d[0];
            }
            break;
         case StringFormats.InlineCode:
            textStyle.fontFamily = 'Consolas';
            textStyle.background = grey[300];
            textStyle.color = red[700];
            break;
      }
   });

   return { textStyle: { ...textStyle }, textType, textDetails };
};
