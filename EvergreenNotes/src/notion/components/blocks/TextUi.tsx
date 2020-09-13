import React, { useEffect } from 'react';
import { Typography, Link, Icon, SvgIcon } from '@material-ui/core';
import { NotionBlockModel } from 'aNotion/models/NotionBlock';
import { grey, red } from '@material-ui/core/colors';
import { BaseTextBlock } from 'aNotion/types/notionV3/definitions/basic_blocks';
import {
   SemanticString,
   SemanticFormat,
   SemanticFormatEnum,
   AbsoluteDateTime,
} from 'aNotion/types/notionV3/semanticStringTypes';
import { useSelector, useDispatch } from 'react-redux';
import {
   blockSelector,
   mentionSelector,
} from 'aNotion/providers/storeSelectors';
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
   color,
   bgColor,
}: {
   block: NotionBlockModel;
   variant?: Variant | undefined;
   interactive?: boolean;
   color?: string;
   bgColor?: string;
}) => {
   let classes = useBlockStyles();
   const bb = block.block as BaseTextBlock;
   const title = bb?.properties?.title as SemanticString[];

   if (title != null) {
      //using interactive as a switch to truncate text size
      let textCount = 0;
      const maxLen = 150;

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
                     interactive={interactive ?? true}
                     color={color}
                     bgColor={bgColor}></TextSegment>
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
   color,
   bgColor,
}: {
   segment: SemanticString;
   variant: Variant;
   interactive: boolean;
   color?: string;
   bgColor?: string;
}) => {
   let classes = useBlockStyles();
   let text = segment[0];
   let format = segment[1] ?? [];
   const dispatch: AppPromiseDispatch<any> = useDispatch();

   const blockData = useSelector(blockSelector);
   const mentionData = useSelector(mentionSelector);
   let { textStyle, textInfo, textType } = useSegmentData(
      format,
      color,
      bgColor
   );
   let link: string | undefined = undefined;

   useEffect(() => {
      if (textInfo != null && textType === SemanticFormatEnum.Page) {
         dispatch(blockActions.fetchBlock({ blockId: textInfo }));
      }
   }, [dispatch, textInfo, textType]);

   if (textInfo != null && textType === SemanticFormatEnum.Page) {
      text = blockData[textInfo]?.block?.simpleTitle ?? '';
      link = getPageUrl(textInfo);
   } else if (textInfo != null && textType === SemanticFormatEnum.Link) {
      link = textInfo;
   } else if (textInfo != null && textType === SemanticFormatEnum.User) {
      text =
         ' @' +
         mentionData.users[textInfo]?.user?.given_name +
         ', ' +
         mentionData.users[textInfo]?.user?.family_name +
         ' ';
   } else if (textInfo != null && textType === SemanticFormatEnum.DateTime) {
      text = '@date support added in next version';
      if ('isAbsolute' in (textInfo as AbsoluteDateTime)) {
         let d = textInfo as AbsoluteDateTime;
      } else {
         let d = textInfo as AbsoluteDateTime;
      }
   }

   if (text == null || (text.trim().length === 0 && textInfo == null)) {
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
         {link != null && textType === SemanticFormatEnum.Page && (
            <Link
               display="inline"
               className={classes.typography}
               variant={variant}
               href={interactive ? link : undefined}
               target="_blank"
               style={{ ...textStyle }}>
               {'  '}
               <SvgIcon
                  fontSize="inherit"
                  className={classes.inlineIcon}
                  viewBox="0 0 48 48">
                  <OpenInNewOutlinedIcon />
               </SvgIcon>{' '}
               {text}
            </Link>
         )}
         {link != null && textType === SemanticFormatEnum.Link && (
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
   format: SemanticFormat[],
   color?: string,
   bgColor?: string
): {
   textStyle: React.CSSProperties;
   textInfo: string | undefined;
   textType: string | undefined;
} => {
   let textStyle: React.CSSProperties = {};
   let textInfo: string | undefined = undefined;
   let textType: SemanticFormatEnum | undefined = undefined;

   if (color) {
      textStyle.color = color;
   }
   if (bgColor) {
      textStyle.backgroundColor = bgColor;
   }

   format.forEach((d) => {
      switch (d[0]) {
         case SemanticFormatEnum.Bold:
            textStyle.fontWeight = 'bold';
            break;
         case SemanticFormatEnum.Italic:
            textStyle.fontStyle = 'italic';
            break;
         case SemanticFormatEnum.Colored:
            if (d[1] != null && getColor(d[1]) != null) {
               if (d[1].includes('background')) {
                  textStyle.backgroundColor = getColor(d[1]);
               } else {
                  textStyle.color = getColor(d[1]);
               }
            }
            break;
         case SemanticFormatEnum.Strike:
            textStyle.textDecoration = 'line-through';
            break;
         case SemanticFormatEnum.User:
            if (d[1] != null) {
               textInfo = d[1];
               textType = d[0];
            }
            if (textStyle.color == null) {
               textStyle.color = grey[700];
            }
            break;
         case SemanticFormatEnum.Link:
            if (d[1] != null) {
               textInfo = d[1];
               textType = d[0];
            }
            if (textStyle.color == null) {
               textStyle.color = grey[700];
            }
            break;
         case SemanticFormatEnum.Page:
            textStyle.color = grey[800];
            textStyle.fontWeight = 'bold';
            if (d[1] != null) {
               textInfo = d[1];
               textType = d[0];
            }
            break;
         case SemanticFormatEnum.InlineCode:
            textStyle.fontFamily = 'Consolas';
            if (textStyle.backgroundColor == null) {
               textStyle.background = grey[300];
            }
            if (textStyle.color == null) {
               textStyle.color = red[700];
            }
            break;
         case SemanticFormatEnum.DateTime:
            if (d[1] != null) {
               textInfo = d[1];
               textType = d[0];
            }
            if (textStyle.color == null) {
               textStyle.color = grey[700];
            }
      }
   });

   return { textStyle: { ...textStyle }, textType, textInfo };
};
