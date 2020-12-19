import React, { useEffect, useState } from 'react';
import {
   Typography,
   Link,
   Icon,
   SvgIcon,
   useTheme,
   Theme,
} from '@material-ui/core';
import { INotionBlockModel } from 'aNotion/models/NotionBlock';
import { IBaseTextBlock } from 'aNotion/types/notionV3/definitions/basic_blocks';
import {
   Segment,
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
import { getColor, parseDate } from 'aNotion/services/blockService';
import { TAppDispatchWithPromise } from 'aNotion/providers/appDispatch';
import { blockActions } from 'aNotion/components/blocks/blockSlice';
import { getPageUrl, getSiteUrl } from 'aNotion/services/notionSiteService';
import OpenInNewOutlinedIcon from '@material-ui/icons/OpenInNewOutlined';
import { blockStyles } from './blockStyles';
import { Variant } from '@material-ui/core/styles/createTypography';
import { MentionsState } from '../mentions/mentionsState';
import { RecordState } from './blockState';
import { CantDisplayThisType } from '../common/Loading';
import { BlockTypeEnum } from 'aNotion/types/notionV3/BlockTypes';

export interface IBaseTextUiParams {
   block: INotionBlockModel;
   style?: React.CSSProperties;
   semanticFilter?: SemanticFormatEnum[];
   interactive?: boolean;
   setHasSegments?: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface ITextUiParams extends IBaseTextUiParams {
   variant?: Variant;
}

export const TextUi = ({
   block,
   variant,
   interactive,
   style,
   semanticFilter,
   setHasSegments,
}: ITextUiParams) => {
   let classes = blockStyles();

   let title: Segment[] | undefined = (block.block as IBaseTextBlock)
      ?.properties?.title as Segment[];
   if (title == null) {
      title = block?.collection?.name;
   }

   if (
      block.type === BlockTypeEnum.TemplateButton ||
      block.type === BlockTypeEnum.TableOfContents ||
      block.type === BlockTypeEnum.Equation ||
      block.type === BlockTypeEnum.File ||
      block.type === BlockTypeEnum.PDF ||
      block.type === BlockTypeEnum.Unknown ||
      block.type === BlockTypeEnum.Video ||
      block.type === BlockTypeEnum.Audio
   ) {
      return <CantDisplayThisType />;
   }

   let segmentTally = { count: 0 };
   const incrementSegmentCount = () => {
      segmentTally.count = segmentTally.count + 1;
   };

   let textUi: (JSX.Element | null)[] | null = null;

   if (title != null) {
      //if not interactive also truncate the max segment size
      let textCount = 0;
      const maxLen = 150;

      textUi = title.map((segment, i) => {
         if (
            interactive === false &&
            textCount < maxLen &&
            textCount + segment[0].length > maxLen
         ) {
            //catch errors
            console.log('render error');
            incrementSegmentCount();
            return (
               <Typography
                  key={i}
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
               incrementSegmentCount={incrementSegmentCount}
               style={{ ...style }}></TextSegment>
         );
      });
   }

   useEffect(() => {
      if (setHasSegments != null) {
         setHasSegments(segmentTally.count > 0);
      }
   });

   return <>{textUi}</>;
};

interface ISegmentParams {
   segment: Segment;
   style?: React.CSSProperties;
   semanticFilter: SemanticFormatEnum[] | undefined;
   variant: Variant | undefined;
   interactive: boolean;
   incrementSegmentCount: () => void;
}

export interface ISegmentMeta {
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
   incrementSegmentCount,
}: ISegmentParams) => {
   let classes = blockStyles();
   let text = segment[0];
   let format = segment[1] ?? [];
   const dispatch: TAppDispatchWithPromise<any> = useDispatch();

   const blockData = useSelector(blockSelector);
   const mentionData = useSelector(mentionSelector);
   let {
      segmentStyle,
      segmentDetails,
      segmentType,
      hideSegment,
   }: ISegmentMeta = useSegmentData(format, style, semanticFilter);

   useEffect(() => {
      if (segmentDetails != null && segmentType === SemanticFormatEnum.Page) {
         dispatch(blockActions.fetchBlock({ blockId: segmentDetails }));
      }
   }, [dispatch, segmentDetails, segmentType]);

   let link: string | undefined;
   ({ link, text } = formatSegment(
      segmentDetails,
      segmentType,
      text,
      blockData,
      mentionData
   ));

   //nothing to render
   if (text == null || (text.trim().length === 0 && segmentDetails == null)) {
      return null;
   } else if (hideSegment) {
      return null;
   }

   incrementSegmentCount();

   return (
      <React.Fragment>
         {link == null && (
            <Typography
               id="TextUI"
               display="inline"
               className={classes.typography}
               variant={variant}
               style={{ ...segmentStyle }}>
               {text}
            </Typography>
         )}
         {link != null && segmentType === SemanticFormatEnum.Page && (
            <Link
               id="TextUI"
               display="inline"
               className={classes.typography}
               variant={variant}
               href={interactive ? link : undefined}
               target="_blank"
               style={{ ...segmentStyle }}>
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
               <Link
                  id="TextUI"
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
): ISegmentMeta => {
   let segmentStyle: React.CSSProperties = { ...style } ?? {};
   let segmentDetails: string | undefined = undefined;
   let segmentType: SemanticFormatEnum | undefined = undefined;
   const theme = useTheme();

   let hideSegment: boolean = shouldSegmentBeHidden(semanticFilter, style);

   format.forEach((d) => {
      if (hideSegment && semanticFilter?.includes(d[0])) {
         hideSegment = false;
      }

      ({ segmentDetails, segmentType } = parseSegment(
         d,
         segmentStyle,
         segmentDetails,
         segmentType,
         theme
      ));
   });

   return {
      segmentStyle: { ...segmentStyle },
      segmentType: segmentType,
      segmentDetails: segmentDetails,
      hideSegment: hideSegment,
   };
};

const formatSegment = (
   segmentDetails: string | undefined,
   segmentType: string | undefined,
   text: string,
   blockData: RecordState,
   mentionData: MentionsState
) => {
   let link: string | undefined = undefined;
   if (segmentDetails != null && segmentType === SemanticFormatEnum.Page) {
      text = blockData[segmentDetails]?.block?.simpleTitle ?? '';
      if (text.length === 0) {
         text == 'Untitled';
      }
      link = getPageUrl(segmentDetails);
   } else if (
      segmentDetails != null &&
      segmentType === SemanticFormatEnum.Link
   ) {
      link = getSiteUrl() + segmentDetails.replace(/-/g, '').replace('/', '');
   } else if (
      segmentDetails != null &&
      segmentType === SemanticFormatEnum.User &&
      mentionData.users[segmentDetails] != null
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
   return { link, text };
};

const shouldSegmentBeHidden = (
   semanticFilter: SemanticFormatEnum[] | undefined,
   style: React.CSSProperties | undefined
) => {
   let hideSegment: boolean =
      semanticFilter?.length === 0 || semanticFilter == null ? false : true;

   if (hideSegment) {
      if (
         style?.backgroundColor != null &&
         style?.backgroundColor !== '#FFFFFF' &&
         semanticFilter?.find((f) => f === SemanticFormatEnum.Colored)
      ) {
         hideSegment = false;
      }
   }
   return hideSegment;
};

const parseSegment = (
   d: SemanticFormat,
   segmentStyle: React.CSSProperties,
   segmentDetails: string | undefined,
   segmentType: SemanticFormatEnum | undefined,
   theme: Theme
) => {
   switch (d[0]) {
      case SemanticFormatEnum.Bold:
         segmentStyle.fontWeight = 'bold';
         break;
      case SemanticFormatEnum.Italic:
         segmentStyle.fontStyle = 'italic';
         break;
      case SemanticFormatEnum.Colored:
         if (
            d[1] != null &&
            getColor(d[1], theme.palette.type === 'dark') != null
         ) {
            if (d[1].includes('background')) {
               segmentStyle.backgroundColor = getColor(
                  d[1],
                  theme.palette.type === 'dark'
               );
            } else {
               segmentStyle.color = getColor(
                  d[1],
                  theme.palette.type === 'dark'
               );
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
            segmentStyle.color = theme.palette.notionColors.mentions;
         }
         break;
      case SemanticFormatEnum.Link:
         if (d[1] != null) {
            segmentDetails = d[1];
            segmentType = d[0];
         }
         if (segmentStyle.color == null) {
            segmentStyle.color = theme.palette.referenceAccent.main;
         }
         break;
      case SemanticFormatEnum.Page:
         segmentStyle.color = theme.palette.referenceAccent.main;
         segmentStyle.fontWeight = 'bold';
         if (d[1] != null) {
            segmentDetails = d[1];
            segmentType = d[0];
         }
         break;
      case SemanticFormatEnum.InlineCode:
         segmentStyle.fontFamily = 'Consolas';
         if (segmentStyle.backgroundColor == null) {
            segmentStyle.background = theme.palette.referenceBackground.light;
         }
         if (segmentStyle.color == null) {
            segmentStyle.color = theme.palette.notionColors.inlineCode;
         }
         break;
      case SemanticFormatEnum.DateTime:
         if (d[1] != null) {
            let dateData = d[1] as any;
            segmentDetails = parseDate(dateData) + ' ';
            segmentType = d[0];
         }
         if (segmentStyle.color == null) {
            segmentStyle.color = theme.palette.notionColors.mentions;
         }
   }
   return { segmentDetails, segmentType };
};
