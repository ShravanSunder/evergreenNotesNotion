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
   RelativeDateTime,
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
import { DateTime } from 'luxon';

export interface UiParameters {
   variant?: Variant;
   interactive?: boolean;
   style?: React.CSSProperties;
   semanticFilter?: SemanticFormatEnum[];
}

interface TextUiParameters extends UiParameters {
   block: NotionBlockModel;
}

export const TextUi = ({
   block,
   variant,
   interactive,
   style,
   semanticFilter,
}: TextUiParameters) => {
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
                  //catch errors
                  console.log('render error');
                  return (
                     <Typography
                        display="inline"
                        className={classes.typography}
                        variant={variant ?? 'body1'}>
                        {'...'}
                     </Typography>
                  );
               }
               textCount += segment[0].length;
               if (interactive === false && textCount > maxLen) {
                  //catch errors
                  return null;
               }
               return (
                  <TextSegment
                     key={i}
                     segment={segment}
                     variant={variant ?? 'body1'}
                     interactive={interactive ?? true}
                     semanticFilter={semanticFilter}
                     style={{ ...style }}></TextSegment>
               );
            })}
         </React.Fragment>
      );
   }
   return null;
};

export interface SegmentParameters extends UiParameters {
   segment: SemanticString;
}

export interface SegmentMeta {
   segmentStyle: React.CSSProperties;
   segmentDetails: string | undefined;
   segmentType: string | undefined;
   hideSegment: boolean;
}

const TextSegment = ({
   segment,
   variant,
   interactive,
   style,
   semanticFilter,
}: SegmentParameters) => {
   let classes = useBlockStyles();
   let text = segment[0];
   let format = segment[1] ?? [];
   const dispatch: AppPromiseDispatch<any> = useDispatch();

   const blockData = useSelector(blockSelector);
   const mentionData = useSelector(mentionSelector);
   let {
      segmentStyle,
      segmentDetails,
      segmentType,
      hideSegment,
   }: SegmentMeta = useSegmentData(format, style, semanticFilter);
   let link: string | undefined = undefined;

   useEffect(() => {
      if (segmentDetails != null && segmentType === SemanticFormatEnum.Page) {
         dispatch(blockActions.fetchBlock({ blockId: segmentDetails }));
      }
   }, [dispatch, segmentDetails, segmentType]);

   if (segmentDetails != null && segmentType === SemanticFormatEnum.Page) {
      text = blockData[segmentDetails]?.block?.simpleTitle ?? '';
      link = getPageUrl(segmentDetails);
   } else if (
      segmentDetails != null &&
      segmentType === SemanticFormatEnum.Link
   ) {
      link = segmentDetails;
   } else if (
      segmentDetails != null &&
      segmentType === SemanticFormatEnum.User
   ) {
      text =
         ' @' +
         mentionData.users[segmentDetails]?.user?.given_name +
         ', ' +
         mentionData.users[segmentDetails]?.user?.family_name +
         ' ';
   } else if (segmentType === SemanticFormatEnum.DateTime) {
      text = segmentDetails ?? '';
   }

   if (text == null || (text.trim().length === 0 && segmentDetails == null)) {
      return null;
   }

   if (hideSegment) {
      return (
         <div style={{ paddingTop: 3 }}>
            <Typography> {'  '} </Typography>
         </div>
      );
   }

   return (
      <React.Fragment>
         {link == null && (
            <Typography
               display="inline"
               className={classes.typography}
               variant={variant}
               style={{ ...segmentStyle }}>
               {text}
            </Typography>
         )}
         {link != null && segmentType === SemanticFormatEnum.Page && (
            <Link
               display="inline"
               className={classes.typography}
               variant={variant}
               href={interactive ? link : undefined}
               target="_blank"
               style={{ ...segmentStyle }}>
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
         {link != null && segmentType === SemanticFormatEnum.Link && (
            <>
               <Typography
                  display="inline"
                  className={classes.link}
                  variant={variant}
                  style={{ ...segmentStyle }}>
                  {' '}
               </Typography>
               <Link
                  display="inline"
                  className={classes.link}
                  variant={variant}
                  href={interactive ? link : undefined}
                  target="_blank"
                  style={{ ...segmentStyle, textDecoration: 'underline' }}>
                  {text}
               </Link>
            </>
         )}
      </React.Fragment>
   );
};
const useSegmentData = (
   format: SemanticFormat[],
   style?: React.CSSProperties,
   semanticFilter?: SemanticFormatEnum[]
): SegmentMeta => {
   let segmentStyle: React.CSSProperties = { ...style } ?? {};
   let segmentDetails: string | undefined = undefined;
   let segmentType: SemanticFormatEnum | undefined = undefined;
   let hideSegment: boolean = semanticFilter == null ? false : true;

   if (hideSegment) {
      if (
         style?.backgroundColor != null &&
         style?.backgroundColor !== '#FFFFFF' &&
         semanticFilter?.find((f) => f === SemanticFormatEnum.Colored)
      ) {
         hideSegment = false;
      }
   }

   format.forEach((d) => {
      if (hideSegment && semanticFilter?.includes(d[0])) {
         hideSegment = false;
      }

      switch (d[0]) {
         case SemanticFormatEnum.Bold:
            segmentStyle.fontWeight = 'bold';
            break;
         case SemanticFormatEnum.Italic:
            segmentStyle.fontStyle = 'italic';
            break;
         case SemanticFormatEnum.Colored:
            if (d[1] != null && getColor(d[1]) != null) {
               if (d[1].includes('background')) {
                  segmentStyle.backgroundColor = getColor(d[1]);
               } else {
                  segmentStyle.color = getColor(d[1]);
               }
            }
            break;
         case SemanticFormatEnum.Strike:
            segmentStyle.textDecoration = 'line-through';
            break;
         case SemanticFormatEnum.User:
            if (d[1] != null) {
               segmentDetails = d[1];
               segmentType = d[0];
            }
            if (segmentStyle.color == null) {
               segmentStyle.color = grey[700];
            }
            break;
         case SemanticFormatEnum.Link:
            if (d[1] != null) {
               segmentDetails = d[1];
               segmentType = d[0];
            }
            if (segmentStyle.color == null) {
               segmentStyle.color = grey[800];
            }
            break;
         case SemanticFormatEnum.Page:
            segmentStyle.color = grey[700];
            segmentStyle.fontWeight = 'bold';
            if (d[1] != null) {
               segmentDetails = d[1];
               segmentType = d[0];
            }
            break;
         case SemanticFormatEnum.InlineCode:
            segmentStyle.fontFamily = 'Consolas';
            if (segmentStyle.backgroundColor == null) {
               segmentStyle.background = grey[300];
            }
            if (segmentStyle.color == null) {
               segmentStyle.color = red[700];
            }
            break;
         case SemanticFormatEnum.DateTime:
            if (d[1] != null) {
               let dateData = d[1] as any;
               segmentDetails = parseDate(dateData);
               segmentType = d[0];
            }
            if (segmentStyle.color == null) {
               segmentStyle.color = grey[700];
            }
      }
   });

   return {
      segmentStyle: { ...segmentStyle },
      segmentType: segmentType,
      segmentDetails: segmentDetails,
      hideSegment: hideSegment,
   };
};

function parseDate(dateData: any) {
   let segmentDetails: string = '';
   try {
      if (dateData.date_format === 'relative') {
         let date = dateData as RelativeDateTime;
         segmentDetails =
            '@' +
            DateTime.fromFormat(date.start_date, 'yyyy-MM-dd').toRelative();
         if (date.end_date)
            segmentDetails =
               ' ⟶ ' +
               DateTime.fromFormat(date.end_date, 'yyyy-MM-dd').toRelative();
      } else {
         let date = dateData as AbsoluteDateTime;
         segmentDetails =
            '@' +
            DateTime.fromFormat(date.start_date, 'yyyy-MM-dd').toFormat(
               date.date_format
            );
         if (date.end_date)
            segmentDetails =
               ' ⟶ ' +
               DateTime.fromFormat(date.end_date, 'yyyy-MM-dd').toFormat(
                  date.date_format
               );
      }
   } catch {}
   return segmentDetails;
}
